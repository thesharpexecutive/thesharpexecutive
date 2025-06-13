import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Attempt to count posts to verify DB connection
    const postCount = await prisma.post.count()
    
    // Get the most recent post (without exposing sensitive content)
    const latestPost = await prisma.post.findFirst({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    return NextResponse.json({
      status: 'connected',
      postCount,
      latestPublishedPost: latestPost ? {
        id: latestPost.id,
        title: latestPost.title,
        slug: latestPost.slug,
        published: latestPost.published,
        createdAt: latestPost.createdAt,
        updatedAt: latestPost.updatedAt
      } : null
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Failed to connect to database',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
