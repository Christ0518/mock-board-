import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase_server.js";
import bcrypt from "bcrypt";

export async function POST(req) {

    try {

        const { name, email, password, c_password, role } = await req.json();

        if (password !== c_password) return NextResponse.json({ succes: false, error: "Password is not match" }, { status: 409 });

        if (password.length < 8) return NextResponse.json({ success: false, error: "Must be more than 8 characters" }, { status: 409 });

        if (!email || !password) return NextResponse.json({ success: false, error: "You Rejected Invalid Info" }, { status: 404 });
        
        const cleanEmail = email.trim().toLowerCase();

        const cleanName = name
        .trim()
        .replace(/\s+/g, " ")
        .replace(/[^A-Za-z\s]/g, "")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());

        const hashed = await bcrypt.hash(password, 10);

        const { data, error } = await supabaseServer
        .from("auth")
        .insert([{ email: cleanEmail, password: String(hashed), name: cleanName, role: role }]);

        if (error) {
            console.error("Supabase Query Error: ", error);
            return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
        }


        console.log(" ==> User Successfully Created an Account ", data);

        return NextResponse.json({ success: true }, { status: 200 });

    } catch (err) {

        console.error("BackEnd Error: ", err);

        return NextResponse.json({ success: false, error: "Server is Down" }, {status: 500});

    }

}