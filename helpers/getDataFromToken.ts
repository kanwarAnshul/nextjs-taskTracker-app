import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export const getDataFromToken = async (request: NextRequest) => {
  try {
    const token = (await request.cookies.get('token')?.value) || ''

    // Ensure that JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not defined')
    }

    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET)

    // Return decodedToken.id directly, no need to return an object
    return decodedToken.id
  } catch (error) {
    // Assert that the error is an instance of Error before accessing its message
    if (error instanceof Error) {
      throw new Error(error.message)
    } else {
      throw new Error('An unknown error occurred')
    }
  }
}
