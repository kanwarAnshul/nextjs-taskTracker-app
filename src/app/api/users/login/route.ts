import User from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/database/dbConnection';

dbConnect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({
        message: 'User does not exist. Please register.',
        success: false,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new NextResponse(
        JSON.stringify({
          message: 'Invalid email or password.',
          success: false,
        }),
        { status: 401 }
      );
    }

    // Ensure JWT_SECRET is defined
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json({
        message: 'JWT secret not defined in environment variables.',
        success: false,
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      jwtSecret,
      { expiresIn: '24hr' }
    );

    const response = NextResponse.json({
      message: 'Login successful',
      success: true,
    });
    response.cookies.set('token', token, {
      httpOnly: true,
    });
    return response;
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({
      message: 'Error during login.',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
