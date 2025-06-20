'use client'

import { useEffect, useState } from 'react'

interface IframeTransformerProps {
  content: string
}

/**
 * Component that transforms special iframe placeholders into actual iframe elements
 * Placeholders should be in the format:
 * [iframe src="/path/to/file.html" width="100%" height="800px" frameborder="0" scrolling="auto"]
 */
export function IframeTransformer({ content }: IframeTransformerProps) {
  const [transformedContent, setTransformedContent] = useState(content)
  
  useEffect(() => {
    // Only run on client-side to avoid hydration issues
    if (typeof window !== 'undefined') {
      // Transform iframe placeholders to actual iframes
      const processedContent = transformIframePlaceholders(content)
      setTransformedContent(processedContent)
    }
  }, [content])
  
  return (
    <div 
      className="prose prose-lg prose-blue prose-headings:font-semibold prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-xl max-w-none
                [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mt-12 [&_h1]:mb-6
                [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4
                [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mt-8 [&_h3]:mb-3
                [&_p]:my-4 [&_ul]:my-4 [&_ol]:my-4"
      dangerouslySetInnerHTML={{ __html: transformedContent }}
    />
  )
}

/**
 * Transforms iframe placeholder syntax into actual iframe HTML
 * Example: [iframe src="/assessments/test.html" width="100%" height="800px"]
 * Becomes: <iframe src="/assessments/test.html" width="100%" height="800px"></iframe>
 */
function transformIframePlaceholders(content: string): string {
  // Regular expression to match iframe placeholders
  // Matches [iframe attr1="value1" attr2="value2" ...]
  const iframeRegex = /\[iframe([^\]]*)\]/g
  
  return content.replace(iframeRegex, (match, attributes) => {
    // Convert the placeholder to an actual iframe element
    return `<iframe${attributes}></iframe>`
  })
}
