import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "../../../lib/supabase_server";

export async function POST(req) {
    const { email } = await req.json();

    if (!email) return NextResponse.json({ success: false, error: "Email Not Found" }, { status: 404 });

    const { data, error } = await supabaseServer
    .from("auth")
    .select("id, name, email")
    .eq("email", email)
    .limit(1);

    if (error) {
        console.error("Supabase Query Error: ", error);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }

    const token = jwt.sign(
        { data },
        process.env.JWT_SECRET || "",
        { expiresIn: "1h" }
    );

    const cookieStore = await cookies();
    cookieStore.set({
        name: "token",
        value: token,
        httpOnly: true,
        secure: true,
        path: "/",
        maxAge: 3600,
    });

    console.log(" ==> User is Successfully Log In");

    return NextResponse.json({ success: true }, { status: 200 });
}