import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase_server";

export async function POST(req) {
    
    const { id, email } = await req.json();

    if(!id || !email) return NextResponse.json({ success: false, error: "Some requirements is conflicted" }, { status: 409 });

    const { error } = await supabaseServer
    .from("auth")
    .update({ assign_by: email })
    .eq("id", id);

    if (error) {
        console.error("Supabase Query Error: ", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });

}