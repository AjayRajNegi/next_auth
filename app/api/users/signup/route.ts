import { connect } from "@/db_config/db";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { sendMail } from "@/helpers/mailer";
import { NextResponse, NextRequest } from "next/server";

connect();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    //Validation
    console.log(body);

    const user = await User.findOne({ email });

    if (user) {
      return NextResponse.json(
        {
          message: "User already exists in the database.",
        },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    console.log(savedUser);

    //Verification

    await sendMail({ email, emailType: "VERIFY", userId: savedUser._id });

    return NextResponse.json({
      message: "User registered successfully.",
      success: true,
      savedUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error in POST request." + error },
      { status: 500 }
    );
  }
}
