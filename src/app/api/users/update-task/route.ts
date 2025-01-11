import Task from '@/models/userTaskModel'
import { NextRequest, NextResponse } from 'next/server'

// Named export for the POST method
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json()
    const { taskId, title, description, deadline, priority } = reqBody


    const task = await Task.findOneAndUpdate(
      {taskId}, // make sure to use a valid query
      { title, description, deadline, priority },
      { new: true }, // Return the updated document
    ).lean() // This converts the result to a plain object

    if (!task) {
      return NextResponse.json(
        {
          message: 'Task not found or update failed',
          success: false,
        },
        { status: 404 }, // Not Found
      )
    }

    return NextResponse.json(
      {
        message: 'Task updated successfully',
        success: true,
        task, // Optional: return the updated task data
      },
      { status: 200 }, // OK
    )
  } catch (error) {
    console.error('Error updating task:', error)

    return NextResponse.json(
      {
        message: 'Internal Server Error',
        success: false,
        error: error.message,
      },
      { status: 500 }, // Internal Server Error
    )
  }
}
