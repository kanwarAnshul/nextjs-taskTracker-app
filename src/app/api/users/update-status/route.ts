import { NextRequest, NextResponse } from 'next/server';
import Task from '@/models/userTaskModel'; // Ensure this path is correct

export async function POST(req: NextRequest) {
  try {
    const { taskId, currentStatus } = await req.json();

    // Validate inputs
    if (!taskId || !currentStatus) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const task = await Task.findOne({ taskId });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const updateFields: any = {
      currentStatus,
    };

    const statusField = `status.${currentStatus}`;
    const updateOperation = { $addToSet: { [statusField]: task._id } }; 

    // Update the task
    await Task.findOneAndUpdate({ taskId }, updateFields, { new: true });
    await Task.updateOne({ taskId }, updateOperation);

    // Respond with success
    return NextResponse.json({ message: 'Task updated successfully', task });
  } catch (error) {
    console.error('Error updating task status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
