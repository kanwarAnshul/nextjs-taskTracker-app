import dbConnect from '@/database/dbConnection'
import { NextRequest, NextResponse } from 'next/server'
import { getDataFromToken } from '../../../../../helpers/getDataFromToken'
import User from '@/models/userModel'

dbConnect()

// This function should respond to GET requests.
export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request)
    const user = await User.findOne({ _id: userId })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'User found',
      data: user,
    })
  } catch (error: unknown) {
    // Handle error by checking if it is an instance of Error
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    } else {
      // Handle unexpected errors
      return NextResponse.json({ error: 'Unknown error occurred' }, { status: 500 })
    }
  }
}
