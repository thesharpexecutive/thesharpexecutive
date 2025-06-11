'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PostEditor } from '@/components/post-editor'
import { toast } from 'sonner'

export default function NewPostPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      // Prepare the post data
      const postData = {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        published: data.published,
        featuredImage: data.featuredImage || null
      }

      console.log('Sending post data:', postData) // Debug log
      
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })

      if (!response.ok) {
        throw new Error('Failed to create post')
      }

      const result = await response.json()
      toast.success('Post created successfully')
      router.push('/admin/posts')
      return result
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error('Failed to create post. Please try again.')
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }



  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">New Post</h1>
          <p className="mt-2 text-sm text-gray-700">
            Create a new blog post.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <PostEditor 
          post={{
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            published: false,
            featuredImage: null
          }}
          onSave={handleSave}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  )
}
