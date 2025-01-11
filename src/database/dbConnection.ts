import mongoose from 'mongoose'
import { NextResponse } from 'next/server'

const dbConnect = async () => {
  try {
    if (!process.env.MONG_URI) {
      return NextResponse.json({
        message: 'Database URI is not defined',
        success: false,
      })
    }

    await mongoose.connect(process.env.MONG_URI, {})

    return NextResponse.json({
      message: 'Successfully connected to the database',
      success: true,
    })
  } catch (error) {
    console.error('Error during database connection:', error)

    return NextResponse.json({
      message: 'Error connecting to the database',
      success: false,
      error: error.message,
    })
  }
}

export default dbConnect
