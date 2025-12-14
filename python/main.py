import os
import sys
import threading
import time
import pandas as pd
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
from supabase import create_client, Client

# -----------------------------------------
# Load .env.local from project root
# -----------------------------------------
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ENV_PATH = os.path.join(ROOT_DIR, ".env.local")
load_dotenv(ENV_PATH)

# -----------------------------------------
# Init Flask
# -----------------------------------------
app = Flask(__name__)
CORS(app)  # allow Next.js to access the Flask server

# -----------------------------------------
# Environment variables
# -----------------------------------------
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL:
    raise ValueError("SUPABASE_URL not found")

if not SUPABASE_SERVICE_ROLE_KEY:
    raise ValueError("SUPABASE_SERVICE_ROLE_KEY not found")

# -----------------------------------------
# Supabase Client
# -----------------------------------------
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# -----------------------------------------
# Helper: Delete file after delay
# -----------------------------------------
def delete_file_after_delay(file_path, delay=300):
    """Delete a file after specified delay (default 5 minutes = 300 seconds)"""
    def delete_task():
        time.sleep(delay)
        try:
            if os.path.exists(file_path):
                os.remove(file_path)
                print(f"🗑️  Deleted temporary file: {file_path}", file=sys.stderr)
        except Exception as e:
            print(f"⚠️  Failed to delete {file_path}: {e}", file=sys.stderr)
    
    thread = threading.Thread(target=delete_task, daemon=True)
    thread.start()

# -----------------------------------------
# ROUTE: Generate Markdown
# -----------------------------------------

@app.route("/generate-questionare", methods=["POST"])
def generate_md():
    try:
        data = request.json or {}
        file_id = data.get("id")

        # Validate token
        if not file_id:
            return jsonify({"success": False, "error": "file_id is required"}), 400

        # --- Get file name from Supabase ---
        row = supabase.table("storage").select("file_dir").eq("id", file_id).single().execute()
        if not row.data:
            return jsonify({"success": False, "error": "PDF not found"}), 404

        file_dir = row.data["file_dir"]
        tmp_path = f"tmp/{file_dir}"

        # --- Check if file exists in tmp/ directory ---
        if not os.path.exists(tmp_path):
            return jsonify({"success": False, "error": f"File not found in tmp/. Please download it first using /download-file"}), 404

        # --- Read Excel file and convert to JSON ---
        df = pd.read_excel(tmp_path)
        
        # Convert DataFrame to list of dictionaries (JSON format)
        json_data = df.to_dict(orient='records')

        return jsonify({"success": True, "data": json_data, "total_rows": len(json_data)})

    except Exception as e:
        print("🔥 Gemini Error:", e, file=sys.stderr)
        return jsonify({"success": False, "error": str(e)}), 500

 

@app.route("/download-file", methods=["POST"])
def download_file():
    try:
        data = request.json or {}
        file_id = data.get("id")  # get file id dynamically from request

        if not file_id:
            return jsonify({"success": False, "error": "Missing file id"}), 400

        # ---- Get file metadata from Supabase row ----
        row = supabase.table("storage").select("file_dir").eq("id", file_id).single().execute()
        if not row.data:
            return jsonify({"success": False, "error": "File not found"}), 404

        # ---- Get the path relative to the bucket ----
        file_url = row.data["file_dir"] # could be full public URL

        # Extract path inside bucket
        if "/excel_file/" in file_url:
            file_path = file_url.split("/excel_file")[1]  # results in uploads/xxx.pdf
        else:
            file_path = file_url  # assume already relative path

        # ---- Download content using service role key ----
        file_bytes = supabase.storage.from_("excel_file").download(file_path)
        if not file_bytes:
            return jsonify({"success": False, "error": "Failed to download file"}), 500

        # ---- Save to tmp ----
        tmp_path = f"tmp/{file_url}"
        
        # Create directory structure if it doesn't exist
        os.makedirs(os.path.dirname(tmp_path), exist_ok=True)
        
        with open(tmp_path, "wb") as f:
            f.write(file_bytes)

        # Schedule deletion after 5 minutes
        delete_file_after_delay(tmp_path, delay=300)

        return jsonify({
            "success": True,
            "tmp_path": tmp_path,
            "file_name": file_url
        })

    except Exception as e:
        print("🔥 Download error:", e, file=sys.stderr)
        return jsonify({"success": False, "error": str(e)}), 500



# -----------------------------------------
# Run Server
# -----------------------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port, debug=True)
