import { NextResponse } from "next/server";
import { Fetch_to } from "../../../utilities";
import api_link from "../../../config/api_links/links.json";

export async function POST(req) {
    
    const { id } = await req.json();

    if (!id) return NextResponse.json({ success: false, error: "Id not found" }, { status: 409 });

    const api_links = process.env.RENDER || api_link.python_response

    const response = await Fetch_to(`${api_links}download-file`, { id: id });

    console.log(response)

    if (response.success) {

        const response = await Fetch_to(`${api_links}generate-questionare`, { id: id });

        if (!response.success) return NextResponse.json({ success: false, error: "API Response error" }, { status: 409 })

        return NextResponse.json({ success: true, message: response }, { status: 200 });
        
    } else {

        return NextResponse.json({ success: false, error: "API Response error" }, { status: 409 })

    }
    
}