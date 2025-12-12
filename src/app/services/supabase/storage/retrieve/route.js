import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase_server";

export async function POST(req) {
    
    const { email } = await req.json();

    if (!email) return NextResponse.json({ success: false, error: "Email not found" }, { status: 404 });

    const cleanEmail = email.trim().toLowerCase();

    const { data, error } = await supabaseServer
    .from("storage")
    .select("id, file_dir, exam_title, items, duration, created_at")
    .eq("email", cleanEmail);

    if (error) {
        console.error("Supabase Query Error: ", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }

    if (data.length <= 0) return NextResponse.json({ success: true, error: [{ id: 0, file_name: "No File Found" }] }, { status: 400 });

    return NextResponse.json({ success: true, message: data }, { status: 200 });

}