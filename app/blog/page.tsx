import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'

type Category = {
  id: string
  name: string
}

type PostCategory = {
  category: Category
}

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  featuredImage: string | null
  published: boolean
  createdAt: Date
  author?: {
    name: string | null
  } | null
  categories: PostCategory[]
}

export default async function BlogPage() {
  // Get all published posts with author and categories
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: { name: true }
      },
      categories: {
        include: {
          category: true
        }
      }
    }
  })

  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">The Sharp Executive Blog</h1>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Insights, tips, and strategies for modern executives and professionals
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post: Post) => (
            <article key={post.id} className="flex flex-col items-start justify-between">
              <div className="relative w-full">
                {post.featuredImage ? (
                  <Image
                    src={post.featuredImage}
                    alt=""
                    width={500}
                    height={300}
                    className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                  />
                ) : (
                  <div className="aspect-[16/9] w-full rounded-2xl bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">No image</span>
                  </div>
                )}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
              </div>
              <div className="max-w-xl">
                <div className="mt-8 flex items-center gap-x-4 text-xs">
                  <time dateTime={post.createdAt.toISOString()} className="text-gray-500">
                    {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                  </time>
                  {post.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.categories.map(({ category }: PostCategory) => (
                        <Link
                          key={category.id}
                          href={`/blog/category/${category.id}`}
                          className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                    <Link href={`/blog/${post.slug}`}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                    {post.excerpt || 'Read more...'}
                  </p>
                </div>
                <div className="relative mt-8 flex items-center gap-x-4">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <span className="text-lg">{post.author?.name?.[0]?.toUpperCase() || 'U'}</span>
                  </div>
                  <div className="text-sm leading-6">
                    <p className="font-semibold text-gray-900">
                      <span className="absolute inset-0" />
                      {post.author?.name || 'Unknown Author'}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        {posts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No posts yet</h3>
            <p className="mt-1 text-sm text-gray-500">Check back later for new content.</p>
          </div>
        )}
      </div>
    </div>
  )
}
