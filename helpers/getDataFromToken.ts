import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export const getDataFromToken = async (request: NextRequest) => {
  try {
    const token = (await request.cookies.get('token')?.value) || ''
    const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET)

    // Return decodedToken.id directly, no need to return an object
    return decodedToken.id
  } catch (error) {
    throw new Error(error.message)
  }
}
