import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase_server";

export async function POST(req) {
    
    const { email } = await req.json();

    if (!email) return NextResponse.json({ success: false, message: "Email not found" }, { status: 409 });

    const { error } = await supabaseServer
    .from("auth")
    .update({ assign_by: null })
    .eq("email", email);

    if (error) {
        console.error("Supabase Query Error: ", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });

}