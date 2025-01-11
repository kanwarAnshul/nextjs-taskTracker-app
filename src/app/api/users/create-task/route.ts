import Task from '@/models/userTaskModel'
import { NextResponse, NextRequest } from 'next/server'
import dbConnect from '@/database/dbConnection'
import userModel from '@/models/userModel'

// Named export for the POST method
export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await dbConnect()

    // Parse the request body
    const reqBody = await request.json()
    const { taskId, title, description, priority, deadline, userId } = reqBody

    // Validate required fields
    if (!title || !description || !userId) {
      return NextResponse.json({ error: 'Title, description, and userId are required.' }, { status: 400 })
    }

    // Check if user exists
    const userExists = await userModel.findById(userId)
    if (!userExists) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 })
    }

    // Create a new task
    const newTask = new Task({
      taskId,
      title,
      description,
      priority: priority || 'medium',
      deadline: deadline || undefined,
      user: userId,
    })

    // Instead of just adding the task ID, push the whole task object into the user's tasks array
    userExists.tasks.push(newTask)

    // Save the updated user object with the new task
    await userExists.save()

    // Save the task to the database
    const savedTask = await newTask.save()

    // Respond with the created task
    return NextResponse.json(savedTask, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: `Internal Server Error ${error.message}` }, { status: 500 })
  }
}
