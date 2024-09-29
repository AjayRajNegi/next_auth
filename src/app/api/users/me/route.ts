import User from "@/src/models/userModel";
import { connect } from "@/src/db_config/db";
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/src/helpers/getDataFromToken";

connect();

export async function GET(request: NextRequest) {
  const userId: any = await getDataFromToken(request);
  const user = await User.findOne({ _id: userId }).select("-password");

  return NextResponse.json(
    { message: "USer found.", data: user, success: true },
    { status: 200 }
  );
}
