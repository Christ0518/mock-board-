import { NextResponse } from "next/server";
import { Fetch_to } from "../../../utilities";
import api_link from "../../../config/api_links/links.json";

export async function POST(req) {
    
    const { id } = await req.json();

    if (!id) return NextResponse.json({ success: false, error: "Id not found" }, { status: 409 });

    const api_links = process.env.RENDER || api_link.python_response;

    console.log(`[Python API] Downloading file from: ${api_links}download-file with id: ${id}`);

    const downloadResponse = await Fetch_to(`${api_links}download-file`, { id: id });

    console.log("[Python API] Download response:", downloadResponse);

    if (downloadResponse.success) {

        console.log(`[Python API] Generating questions from: ${api_links}generate-questionare`);

        const questionResponse = await Fetch_to(`${api_links}generate-questionare`, { id: id });

        console.log("[Python API] Question generation response:", questionResponse);

        if (!questionResponse.success) {
            const errorMsg = questionResponse.message || questionResponse.data?.error || "Failed to generate questions";
            console.error("[Python API] Question generation failed:", errorMsg);
            return NextResponse.json({ success: false, error: errorMsg }, { status: 409 });
        }

        return NextResponse.json({ success: true, message: questionResponse }, { status: 200 });
        
    } else {

        const errorMsg = downloadResponse.message || downloadResponse.data?.error || "Python server not responding. Please start the Python server at http://127.0.0.1:10000";
        console.error("[Python API] File download failed:", errorMsg);
        return NextResponse.json({ success: false, error: errorMsg }, { status: 409 });

    }
    
}