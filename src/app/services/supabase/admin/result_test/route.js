import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase_server";

export async function POST(req) {

    const { email } = await req.json();

    if (!email) return NextResponse.json({ success: false, error: "Email not found" }, { status: 409 });
    
    const { data, error } = await supabaseServer
    .from("test_result")
    .select("*")
    .eq("assign_by", email);

    if (error) {
        console.error("Supabase Query Error: ", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: data }, { status: 200 });

}
