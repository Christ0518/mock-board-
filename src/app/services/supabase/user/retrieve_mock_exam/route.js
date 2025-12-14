import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase_server";

export async function POST(req) {
    
    const { email } = await req.json();

    if (!email) return NextResponse.json({ success: false, error: "Email not found" }, { status: 409 });

    const { data, error } = await supabaseServer
    .from("auth")
    .select("*")
    .eq("email", email);

    if (error) {
        console.error("Supabase Query Error: ", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }

    const { data: result_log , error: Error } = await supabaseServer
    .from("exam_record")
    .select("*")
    .eq("email", email);

    if (Error) {
        console.error("Supabase Query Error: ", Error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }

    const filterAssign_by = data?.filter((user) => user.assign_by !== null);

    if (filterAssign_by && filterAssign_by.length > 0) {

    
        const { data, error } = await supabaseServer
        .from("storage")
        .select("*")
        .eq("email", filterAssign_by[0].assign_by);

        if (error) {
            console.error("Supabase Query Error: ", error);
            return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
        }   

        return NextResponse.json({ success: true, message: data, message2: result_log }, { status: 200 });

    } else {
        return NextResponse.json({ success: false, error: "Null Value" }, { status: 409 });
    }

}