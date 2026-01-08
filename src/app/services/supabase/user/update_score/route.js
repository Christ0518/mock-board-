import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase_server";

export async function POST(req) {
    
    const { examinee_name, email, score, assign_by, passing_score, status, exam_title, parts, category } = await req.json();

    if (!email) return NextResponse.json({ success: false, error: "Email not found" }, { status: 409 });

    const { error } = await supabaseServer
    .from("exam_record")
    .insert([{ examinee_name: examinee_name, email: email, score: score, assign_by: assign_by, passing_score: passing_score, status: status, parts: parts, exam_title: exam_title, category: category }]);

    if (error) {
        console.error("Supabase Query Error: ", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });

}