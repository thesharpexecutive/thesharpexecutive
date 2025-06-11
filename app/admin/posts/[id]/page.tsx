'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { PostEditor } from '@/components/post-editor'
import { toast } from 'sonner'

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string
  
  const [post, setPost] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch post data
        const postResponse = await fetch(`/api/admin/posts/${postId}`)
        if (!postResponse.ok) {
          throw new Error('Failed to fetch post')
        }
        const postData = await postResponse.json()
        
        setPost(postData)
      } catch (error) {
        console.error('Error fetching post:', error)
        toast.error('Failed to load post data')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [postId])

  const handleSave = async (data: {
    title: string
    slug: string
    excerpt: string
    content: string
    published: boolean
    featuredImage?: string | null
  }) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to update post')
      }

      const result = await response.json()
      toast.success('Post updated successfully')
      router.push('/admin/posts')
      return result
    } catch (error) {
      console.error('Error updating post:', error)
      toast.error('Failed to update post. Please try again.')
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-semibold text-gray-900">Post not found</h1>
        <p className="mt-4 text-gray-600">The requested post could not be found.</p>
      </div>
    )
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete post')
      }

      toast.success('Post deleted successfully')
      router.push('/admin/posts')
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Failed to delete post. Please try again.')
    }
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Post</h1>
          <p className="mt-2 text-sm text-gray-700">
            Update the post details below.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete Post
          </button>
        </div>
      </div>

      <div className="mt-8">
        <PostEditor 
          post={{
            id: post.id,
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt || '',
            content: post.content,
            published: post.published,
            featuredImage: post.featuredImage
          }}
          onSave={handleSave}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  )
}
