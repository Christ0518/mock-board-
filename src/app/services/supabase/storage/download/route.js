// app/api/storage/download/route.js or pages/api/...
import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase_server";

export async function POST(req) {
  const { filePath, name } = await req.json();

  if (!filePath || !name) return NextResponse.json({ success: false, error: "filePath or name not found" }, { status: 409 });
  try {
        const { data, error } = await supabaseServer.storage
        .from("excel_file")
        .download(filePath);

    if (error) {
        console.error("Supabase Query Error: ", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }

    // Convert to ArrayBuffer
    const arrayBuffer = await data.arrayBuffer();

    // Return as a file response
    return new Response(arrayBuffer, {
        status: 200,
        headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${name}"`,
        },
    });
  } catch(err) {
        console.error("BackEnd Error: ", err);

        return NextResponse.json({ success: false, error: "Server is Down" }, {status: 500});
  }
  
}
