import { connect } from "../../../../db_config/db";
import { NextResponse } from "next/server";

connect();

export async function GET() {
  try {
    const response = NextResponse.json({
      message: "Logout Successfull.",
      success: true,
    });

    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return response;
  } catch (error: unknown) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
