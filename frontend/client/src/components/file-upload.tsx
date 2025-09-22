import { useState, useRef } from 'react'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  isLoading?: boolean
  className?: string
}

export default function FileUpload({ onFileSelect, isLoading = false, className }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (!file) return
    
    // File validation
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt']
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    
    if (file.size > maxSize) {
      alert('File is too large. Maximum size is 10MB.')
      return
    }
    
    if (!allowedTypes.includes(fileExtension)) {
      alert('Invalid file type. Please upload PDF, DOC, DOCX, or TXT files.')
      return
    }
    
    onFileSelect(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  if (isLoading) {
    return (
      <div className={cn(
        "max-w-3xl mx-auto p-8 border-2 border-dashed rounded-2xl",
        "bg-muted/50 flex flex-col items-center justify-center space-y-4",
        className
      )}>
        <div className="animate-spin h-12 w-12 border-4 border-chart-1 border-t-transparent rounded-full" />
        <p className="text-lg font-semibold">Analyzing Your Resume...</p>
        <p className="text-muted-foreground">This may take a moment. We're working our AI magic!</p>
      </div>
    )
  }

  return (
    <div className={cn("max-w-3xl mx-auto", className)}>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileInputChange}
        data-testid="input-file"
      />
      <div
        className={cn(
          "p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all hover-elevate",
          "flex flex-col items-center justify-center space-y-4",
          isDragOver 
            ? "border-chart-1 bg-chart-1/5" 
            : "border-border hover:border-chart-1"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        data-testid="dropzone-upload"
      >
        <Upload className="w-16 h-16 text-muted-foreground" />
        <p className="text-lg font-semibold">Drag & Drop Your Resume Here</p>
        <p className="text-muted-foreground">
          or <span className="text-chart-1 font-semibold">click to browse</span>
        </p>
        <p className="text-xs text-muted-foreground">PDF, DOCX, or TXT (Max 10MB)</p>
      </div>
    </div>
  )
}