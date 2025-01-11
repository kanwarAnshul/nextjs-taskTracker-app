import Task from '@/models/userTaskModel';
import { NextRequest, NextResponse } from 'next/server';

// Named export for the POST method
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { taskId, title, description, deadline, priority } = reqBody;

    // Attempt to find and update the task in the database
    const task = await Task.findOneAndUpdate(
      { taskId }, // Make sure to use a valid query
      { title, description, deadline, priority },
      { new: true } // Return the updated document
    ).lean(); // Converts the result to a plain object

    if (!task) {
      return NextResponse.json(
        {
          message: 'Task not found or update failed',
          success: false,
        },
        { status: 404 } // Not Found
      );
    }

    // Successfully updated task
    return NextResponse.json(
      {
        message: 'Task updated successfully',
        success: true,
        task, // Optionally return the updated task data
      },
      { status: 200 } // OK
    );
  } catch (error: unknown) {
    console.error('Error updating task:', error);

    // Handle different error cases
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: 'Internal Server Error',
          success: false,
          error: error.message,
        },
        { status: 500 } // Internal Server Error
      );
    } else {
      return NextResponse.json(
        {
          message: 'Unknown error occurred',
          success: false,
        },
        { status: 500 } // Internal Server Error
      );
    }
  }
}
