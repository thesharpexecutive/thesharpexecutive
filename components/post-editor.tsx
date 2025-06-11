'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Upload } from 'lucide-react'

interface PostEditorProps {
  post?: {
    id?: string
    title: string
    slug: string
    excerpt: string
    content: string
    published: boolean
    featuredImage?: string | null
  }
  onSave: (data: {
    title: string
    slug: string
    excerpt: string
    content: string
    published: boolean
    featuredImage?: string | null
  }) => Promise<void>
  isSubmitting: boolean
}

export function PostEditor({ 
  post, 
  onSave, 
  isSubmitting 
}: PostEditorProps) {
  const router = useRouter()
  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(post?.slug || '')
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [published, setPublished] = useState(post?.published || false)
  const [featuredImage, setFeaturedImage] = useState(post?.featuredImage || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: 'font-bold',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-5',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-5',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-gray-300 pl-4 py-1 my-2',
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
        inline: true,
      }),
      Typography,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Write something amazing...',
      }),
    ],
    content: post?.content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none p-4 min-h-[300px] max-w-none [&_h1]:text-4xl [&_h1]:font-bold [&_h2]:text-3xl [&_h2]:font-bold [&_h3]:text-2xl [&_h3]:font-bold [&_h4]:text-xl [&_h4]:font-bold [&_p]:my-2',
      },
      handleDOMEvents: {
        keydown: (view, event) => {
          // Prevent default behavior for Enter key when in a heading
          if (event.key === 'Enter' && !event.shiftKey) {
            const { state } = view
            const { selection } = state
            const { $from, empty } = selection

            if (!empty) return false

            const currentLineText = $from.nodeBefore?.textContent || ''
            
            // If the line is empty and we're in a heading, insert a new paragraph
            if (currentLineText === '' && $from.parent.type.name === 'heading') {
              const tr = state.tr
                .replaceSelectionWith(
                  state.schema.nodes.paragraph.create(
                    null,
                    state.schema.text('')
                  )
                )
                .scrollIntoView()
              view.dispatch(tr)
              return true
            }
          }
          return false
        },
      },
    },
    onUpdate: () => {
      // Content is saved when the form is submitted
    },
    autofocus: true,
    injectCSS: true,
  })

  const handleImageUpload = async (file: File, isFeaturedImage = false) => {
    if (!file) return null
    
    try {
      // Check if the file is an image
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return null
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return null
      }
      
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Upload failed')
      }
      
      const { url } = await response.json()
      
      if (isFeaturedImage) {
        return url
      } else {
        // Insert the image at the current cursor position
        editor?.chain().focus().setImage({ src: url }).run()
        return url
      }
      
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Failed to upload image. Please try again.')
      return null
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, isFeaturedImage = false) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    try {
      const url = await handleImageUpload(file, isFeaturedImage)
      
      if (url && isFeaturedImage) {
        setFeaturedImage(url)
      }
      
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      console.error('Error handling file upload:', error)
      toast.error('Failed to process image. Please try again.')
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const addImage = useCallback((isFeaturedImage = false) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*'
      fileInputRef.current.onchange = (e) => handleFileChange(e as any, isFeaturedImage)
      fileInputRef.current.click()
    }
  }, [])

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    // update link
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editor || !title.trim() || !slug.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      await onSave({
        title,
        slug,
        excerpt,
        content: editor.getHTML(),
        published,
        featuredImage: featuredImage || null
      })
      
      toast.success(`Post ${post?.id ? 'updated' : 'created'} successfully`)
      router.push('/admin/posts')
    } catch (error) {
      console.error('Error saving post:', error)
      toast.error('Failed to save post. Please try again.')
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // remove non-word characters
      .replace(/\s+/g, '-') // replace spaces with -
      .replace(/--+/g, '-') // replace multiple - with single -
      .trim()
  }

  useEffect(() => {
    if (!post?.id && title) {
      setSlug(generateSlug(title))
    }
  }, [title, post?.id])

  if (!editor) {
    return null
  }

  // Add the file input element (hidden)
  const fileInput = (
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleFileChange}
      accept="image/*"
      className="hidden"
    />
  )

  // Toolbar button component
  const ToolbarButton = ({
    onClick,
    active,
    title,
    children,
    className = ''
  }: {
    onClick: () => void
    active?: boolean
    title: string
    children: React.ReactNode
    className?: string
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-gray-100 ${active ? 'bg-gray-200' : ''} ${className}`}
    >
      {children}
    </button>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {fileInput}
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title"
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="post-slug"
                className="mt-1 font-mono"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                The URL-friendly version of the title.
              </p>
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Input
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A brief description of the post"
                className="mt-1"
              />
              <p className="mt-1 text-sm text-gray-500">
                A short excerpt that summarizes the post (used in post previews).
              </p>
            </div>

            <div>
              <Label htmlFor="featuredImage">Featured Image</Label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <Input
                  id="featuredImage"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="https://example.com/image.jpg or click upload"
                  className="flex-1 rounded-r-none"
                />
                <button
                  type="button"
                  onClick={() => addImage(true)}
                  className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Upload
                </button>
              </div>
              {featuredImage && (
                <div className="mt-2">
                  <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={featuredImage}
                      alt="Featured preview"
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        // If image fails to load, clear it
                        setFeaturedImage('')
                        toast.error('Failed to load image. Please check the URL or upload a new image.')
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setFeaturedImage('')}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>



            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={published}
                onCheckedChange={setPublished}
              />
              <Label htmlFor="published">
                {published ? 'Published' : 'Draft'}
              </Label>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-medium mb-4">Publish</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className="text-sm font-medium">
                    {published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <Button
                    type="submit"
                    className="w-full justify-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-3 py-2 flex flex-wrap items-center gap-1">
          {/* Text Formatting */}
          <div className="flex items-center border-r border-gray-200 pr-2 mr-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive('bold')}
              title="Bold (Ctrl+B)"
            >
              <span className="font-bold">B</span>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive('italic')}
              title="Italic (Ctrl+I)"
            >
              <span className="italic">I</span>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              active={editor.isActive('underline')}
              title="Underline (Ctrl+U)"
            >
              <span className="underline">U</span>
            </ToolbarButton>
            <ToolbarButton
              onClick={setLink}
              active={editor.isActive('link')}
              title="Add Link (Ctrl+K)"
            >
              <span>🔗</span>
            </ToolbarButton>
          </div>

          {/* Headings */}
          <div className="flex items-center border-r border-gray-200 pr-2 mr-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              active={editor.isActive('heading', { level: 1 })}
              title="Heading 1"
            >
              <span className="font-bold text-sm">H1</span>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              active={editor.isActive('heading', { level: 2 })}
              title="Heading 2"
            >
              <span className="font-bold text-sm">H2</span>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              active={editor.isActive('heading', { level: 3 })}
              title="Heading 3"
            >
              <span className="font-bold text-sm">H3</span>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setParagraph().run()}
              active={editor.isActive('paragraph')}
              title="Paragraph"
              className="ml-1"
            >
              <span className="text-sm">P</span>
            </ToolbarButton>
          </div>

          {/* Text Alignment */}
          <div className="flex items-center border-r border-gray-200 pr-2 mr-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              active={editor.isActive({ textAlign: 'left' })}
              title="Align Left"
            >
              <span>≡</span>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              active={editor.isActive({ textAlign: 'center' })}
              title="Align Center"
            >
              <span>≡</span>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              active={editor.isActive({ textAlign: 'right' })}
              title="Align Right"
            >
              <span>≡</span>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              active={editor.isActive({ textAlign: 'justify' })}
              title="Justify"
            >
              <span>≡</span>
            </ToolbarButton>
          </div>

          {/* Lists */}
          <div className="flex items-center border-r border-gray-200 pr-2 mr-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive('bulletList')}
              title="Bullet List"
            >
              <span>•</span>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive('orderedList')}
              title="Numbered List"
            >
              <span>1.</span>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              active={editor.isActive('blockquote')}
              title="Blockquote"
            >
              <span>❝</span>
            </ToolbarButton>
          </div>

          {/* Insert */}
          <div className="flex items-center">
            <ToolbarButton
              onClick={addImage}
              title="Insert Image"
            >
              <Upload className="h-4 w-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title="Insert Horizontal Line"
            >
              <span>―</span>
            </ToolbarButton>
          </div>
        </div>
        <EditorContent editor={editor} className="min-h-[400px]" />
        
        {editor && (
          <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
            <div className="flex space-x-1 bg-white p-1 rounded shadow-lg border border-gray-200">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-1 rounded ${
                  editor.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
              >
                B
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-1 rounded ${
                  editor.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
              >
                I
              </button>
              <button
                onClick={setLink}
                className={`p-1 rounded ${
                  editor.isActive('link') ? 'bg-gray-200' : 'hover:bg-gray-100'
                }`}
              >
                Link
              </button>
            </div>
          </BubbleMenu>
        )}
      </div>
    </form>
  )
}
