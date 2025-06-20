import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import { format } from 'date-fns'
import { Metadata } from 'next'
import { IframeTransformer } from '@/components/blog/iframe-transformer'

type Category = {
  id: string
  name: string
}

type PostCategory = {
  category: Category
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const post = await prisma.post.findUnique({
    where: { slug: resolvedParams.slug, published: true },
    include: { author: { select: { name: true } } }
  })

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | The Sharp Executive`,
    description: post.excerpt || 'Read this post on The Sharp Executive blog',
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      authors: [post.author?.name || 'The Sharp Executive'],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params
  const post = await prisma.post.findUnique({
    where: { slug: resolvedParams.slug, published: true },
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

  if (!post) {
    notFound()
  }

  return (
    <article className="pb-16 pt-8 sm:pb-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-x-4 text-sm mb-6">
            <time dateTime={post.createdAt.toISOString()} className="text-gray-500">
              {format(new Date(post.createdAt), 'MMMM d, yyyy')}
            </time>
            {post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.categories.map(({ category }: PostCategory) => (
                  <a
                    key={category.id}
                    href={`/blog/category/${category.id}`}
                    className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                  >
                    {category.name}
                  </a>
                ))}
              </div>
            )}
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-600">
            {post.excerpt}
          </p>
          <div className="mt-6 flex items-center">
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mr-3">
              <span className="text-lg">{post.author?.name?.[0]?.toUpperCase() || 'U'}</span>
            </div>
            <div className="text-sm leading-6">
              <p className="font-semibold text-gray-900">
                {post.author?.name || 'Unknown Author'}
              </p>
            </div>
          </div>
        </div>

        {post.featuredImage && (
          <div className="mt-12 relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-[3/1.5] lg:rounded-2xl overflow-hidden bg-gray-100">
            <Image
              src={post.featuredImage}
              alt=""
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="mx-auto max-w-2xl mt-12">
          <IframeTransformer content={post.content} />
          
          <div className="mt-16 border-t border-gray-200 pt-8">
            <h3 className="text-sm font-semibold leading-6 text-gray-900">
              Written by
            </h3>
            <div className="mt-4 flex items-center">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mr-4">
                <span className="text-xl">{post.author?.name?.[0]?.toUpperCase() || 'U'}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {post.author?.name || 'Unknown Author'}
                </p>
                <p className="text-sm text-gray-500">
                  The Sharp Executive Team
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <a
              href="/blog"
              className="text-sm font-semibold leading-6 text-blue-600 hover:text-blue-500"
            >
              &larr; Back to blog
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}
