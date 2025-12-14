import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase_server";

export async function POST(req) {
    
    const form = await req.formData();
    const file = form.get("file");
    const name = form.get("name");
    const email = form.get("email");
    const items = form.get("items");
    const parts = form.get("parts");
    const duration = form.get("duration");

    const cleanEmail = email.trim().toLowerCase();

    if (!file) return NextResponse.json({ success: false, error: "PDF Not Detected" }, { status: 404 });

    if (!cleanEmail) return NextResponse.json({ success: false, error: "Email not found" }, { status: 404 });

    const bucketName = "excel_file";
    const filePath = `uploads/${Date.now()}_${file.name}`;

    const { data, error } = await supabaseServer
    .from("storage")
    .select("id")
    .eq("email", cleanEmail)
    .eq("exam_title", name);

    if (data && data.length > 0) return NextResponse.json({ success: false, error: "Pdf file Already exist" }, { status: 409 });

    if (error) {
        console.error("Supabase Query Error: ", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }

    if (data) {

        const { data, error } = await supabaseServer.storage
        .from(bucketName)
        .upload(filePath, file, {
            contentType: "application/json"
        });

        if (error) {
            console.error("Supabase Query Error: ", error);
            return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
        }

        if (data) {
            
            const { data, error } = await supabaseServer
            .from("storage")
            .insert([{ file_dir: filePath, email: cleanEmail, exam_title: name, items: items, duration: duration, parts: parts }]);

            if (error) {
                console.error("Supabase Query Error: ", error);
                return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
            }

            console.log("Status: ", data);

            return NextResponse.json({ success: true, message: "File upload successfully" }, { status: 200 });

        }
    }

}