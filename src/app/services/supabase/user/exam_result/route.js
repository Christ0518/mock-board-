import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase_server";

export async function POST(req) {

    const { email } = await req.json();

    if (!email) return NextResponse.json({ success: false, error: "Email not found" }, { status: 409 });
    
    const { data, error } = await supabaseServer
    .from("exam_record")
    .select("*")
    .eq("email", email);

    if (error) {
        console.error("Supabase Query Error: ", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }

    console.log(data)

    const reviewerRows = data.filter((r) => r.category === "reviewer");

    return NextResponse.json({ success: true, message: reviewerRows }, { status: 200 });

}