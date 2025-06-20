'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface IframeHelperProps {
  onInsert: (iframeCode: string) => void
}

export function IframeHelper({ onInsert }: IframeHelperProps) {
  const [src, setSrc] = useState('/assessments/decision-fatigue-simple.html')
  const [width, setWidth] = useState('100%')
  const [height, setHeight] = useState('800px')
  const [frameborder, setFrameborder] = useState('0')
  const [scrolling, setScrolling] = useState('auto')
  const [open, setOpen] = useState(false)

  const handleInsert = () => {
    // Create the iframe placeholder syntax
    const iframeCode = `[iframe src="${src}" width="${width}" height="${height}" frameborder="${frameborder}" scrolling="${scrolling}"]`
    onInsert(iframeCode)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="mr-2"
        >
          Insert Iframe
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Insert Iframe</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="src" className="text-right">
              Source URL
            </Label>
            <Input
              id="src"
              value={src}
              onChange={(e) => setSrc(e.target.value)}
              className="col-span-3"
              placeholder="/assessments/your-file.html"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="width" className="text-right">
              Width
            </Label>
            <Input
              id="width"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="col-span-3"
              placeholder="100%"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="height" className="text-right">
              Height
            </Label>
            <Input
              id="height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="col-span-3"
              placeholder="800px"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="frameborder" className="text-right">
              Frame Border
            </Label>
            <Input
              id="frameborder"
              value={frameborder}
              onChange={(e) => setFrameborder(e.target.value)}
              className="col-span-3"
              placeholder="0"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="scrolling" className="text-right">
              Scrolling
            </Label>
            <Input
              id="scrolling"
              value={scrolling}
              onChange={(e) => setScrolling(e.target.value)}
              className="col-span-3"
              placeholder="auto"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="button" onClick={handleInsert}>
            Insert
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
