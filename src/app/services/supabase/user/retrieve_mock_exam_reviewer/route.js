import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase_server";

export async function POST(req) {
    
    const { email } = await req.json();

    if (!email) return NextResponse.json({ success: false, error: "Email not found" }, { status: 409 });

    const { data: authData, error: authError } = await supabaseServer
    .from("auth")
    .select("*")
    .eq("email", email);

    if (authError) {
        console.error("Supabase Query Error (auth): ", authError);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }

    const { data: result_log , error: examRecordError } = await supabaseServer
    .from("exam_record")
    .select("*")
    .eq("email", email);

    if (examRecordError) {
        console.error("Supabase Query Error (exam_record): ", examRecordError);
        return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
    }

    const filterAssign_by = authData?.filter((user) => user.assign_by !== null);

    if (filterAssign_by && filterAssign_by.length > 0) {
    
        const assignedEmail = filterAssign_by[0].assign_by;

        const { data: storageData, error: storageError } = await supabaseServer
        .from("storage")
        .select("*")
        .eq("email", assignedEmail);

        if (storageError) {
            console.error("Supabase Query Error (storage): ", storageError);
            return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
        }

        if (!storageData || storageData.length === 0) {
            return NextResponse.json({ success: false, error: "Storage record not found" }, { status: 404 });
        }

        // There may be multiple storage rows — find those with category 'reviewer'
        const reviewerRows = storageData.filter((r) => r.category === "reviewer");

        if (reviewerRows.length > 0) {
            return NextResponse.json({ success: true, message: reviewerRows, message2: result_log }, { status: 200 });
        }

        return NextResponse.json({ success: false, error: "Assigned user is not a reviewer" }, { status: 403 });

    } else {
        return NextResponse.json({ success: false, error: "Null Value" }, { status: 409 });
    }

}