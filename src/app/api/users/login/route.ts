import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../../../models/userModel";
import { connect } from "../../../../db_config/db";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "User does not exist." },
        { status: 400 }
      );
    }

    console.log("User Exists.");

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json(
        { message: "Your password in incorrect." },
        { status: 400 }
      );
    }

    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      message: "Logged in Success.",
      success: true,
    });

    response.cookies.set("token", token, { httpOnly: true });

    return response;
  } catch (error: unknown) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
