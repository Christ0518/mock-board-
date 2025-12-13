import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase_server";

export async function POST() {
    
    const { data, error } = await supabaseServer
    .from("auth")
    .select("*");

    if (error) {
        console.error("Supabase Query Error: ", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }

    const admin = data?.filter((user) => user.role !== "admin" );

    const assign_by = admin?.filter((user) => user.assign_by === null);

    return NextResponse.json({ success: true, message: assign_by }, { status: 200 });

}