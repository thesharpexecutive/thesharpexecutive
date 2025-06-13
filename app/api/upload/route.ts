import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomBytes } from 'crypto'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/auth'

// Generate a random string for filenames
function generateRandomString(length: number = 16): string {
  return randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
}

export async function POST(request: Request) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      )
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Generate a unique filename
    const fileExtension = file.name.split('.').pop()
    const fileName = `${generateRandomString()}.${fileExtension}`
    
    // In a production environment, you would upload to a cloud storage service like S3
    // For development, we'll save to the public/uploads directory
    const uploadDir = join(process.cwd(), 'public/uploads')
    
    // Create the uploads directory if it doesn't exist
    await mkdir(uploadDir, { recursive: true })
    
    const filePath = join(uploadDir, fileName)
    
    // Convert the file to a buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Write the file to disk
    await writeFile(filePath, buffer)

    // Return the URL to access the file
    // Use a relative URL instead of an absolute URL to avoid environment-specific issues
    const fileUrl = `/uploads/${fileName}`

    return NextResponse.json({ url: fileUrl })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

// Add this to ensure the route is not cached
export const dynamic = 'force-dynamic'
