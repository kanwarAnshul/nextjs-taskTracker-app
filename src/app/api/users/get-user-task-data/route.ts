import userModel from '@/models/userModel';
import { NextRequest, NextResponse } from 'next/server';
import { getDataFromToken } from '../../../../../helpers/getDataFromToken';

export async function GET(req: NextRequest) {
  try {
    // Get user ID from token
    const userId = await getDataFromToken(req);

    // Fetch the user and populate tasks
    const user = await userModel.findById(userId).populate('tasks');

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Return user data with tasks
    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            tasks: user.tasks,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}