import Task from '@/models/userTaskModel';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
  try {
    const reqBody = await request.json(); // Get data from the request body
    const { taskId } = reqBody;

    // Try to delete the task from the database
    const deletedTask = await Task.findOneAndDelete({ taskId });

    if (!deletedTask) {
      return NextResponse.json(
        {
          message: 'Task does not exist',
          success: false,
        },
        { status: 404 }
      );
    }

    // Successfully deleted task
    return NextResponse.json(
      {
        message: 'Task deleted successfully',
        success: true,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    // Check if error is an instance of Error
    if (error instanceof Error) {
      return NextResponse.json(
        {
          message: 'Error deleting task',
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    } else {
      // Handle unexpected errors
      return NextResponse.json(
        {
          message: 'Unknown error occurred',
          success: false,
        },
        { status: 500 }
      );
    }
  }
}
