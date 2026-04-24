'use client'

import { useCallback, useState, memo } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  Video,
  File,
  Camera,
  Loader2,
  CheckCircle,
  AlertCircle,
  ZoomIn,
  Download,
  Trash2,
  Pencil
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'

// Dynamic import for SketchModal to avoid SSR issues with Konva
const SketchModal = dynamic(
  () => import('@/components/sketch/SketchModal').then(mod => mod.SketchModal),
  { ssr: false }
)

interface FileUploadModernProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  location?: { lat: number; lng: number } | null
  maxFiles?: number
  maxSize?: number
  acceptedTypes?: string[]
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const DEFAULT_MAX_FILES = 20
const ACCEPTED_TYPES = {
  'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'video/*': ['.mp4', '.mov', '.avi']
}

export const FileUploadModern = memo(function FileUploadModern({
  files,
  onFilesChange,
  location,
  maxFiles = DEFAULT_MAX_FILES,
  maxSize = MAX_FILE_SIZE,
  acceptedTypes = Object.keys(ACCEPTED_TYPES)
}: FileUploadModernProps) {
  const [dragActive, setDragActive] = useState(false)
  const [previews, setPreviews] = useState<{ [key: string]: string }>({})
  const [optimizationProgress, setOptimizationProgress] = useState<{ [key: string]: number }>({})
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSketchModalOpen, setIsSketchModalOpen] = useState(false)

  const handleCroquisSave = (croquisFile: File) => {
    // Remove any existing CROQUIS file
    const filteredFiles = files.filter(f => !f.name.startsWith('CROQUIS'))
    onFilesChange([...filteredFiles, croquisFile])

    // Generate preview for the croquis
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviews(prev => ({
        ...prev,
        [croquisFile.name]: e.target?.result as string
      }))
    }
    reader.readAsDataURL(croquisFile)
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const validFiles: File[] = []
    const rejectedFiles: string[] = []
    const brokenFiles: string[] = []

    for (const file of acceptedFiles) {
      // Check for broken files (0 bytes)
      if (file.size === 0) {
        brokenFiles.push(file.name)
        continue
      }

      if (file.size > maxSize) {
        rejectedFiles.push(`${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`)
      } else if (files.length + validFiles.length >= maxFiles) {
        rejectedFiles.push(`${file.name} (límite de archivos excedido)`)
      } else {
        validFiles.push(file)
        // Generate preview for images
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = (e) => {
            setPreviews(prev => ({
              ...prev,
              [file.name]: e.target?.result as string
            }))
          }
          reader.readAsDataURL(file)
        }
      }
    }

    // Show warning for broken files
    if (brokenFiles.length > 0) {
      toast.warning(
        `⚠️ Archivos rotos detectados (0 bytes, ignorados):\n${brokenFiles.join('\n')}`,
        { duration: 5000 }
      )
    }

    if (rejectedFiles.length > 0) {
      toast.error(`Archivos no agregados:\n${rejectedFiles.join('\n')}`)
    }

    if (validFiles.length > 0) {
      onFilesChange([...files, ...validFiles])
      toast.success(`${validFiles.length} archivo(s) agregado(s)`)

      // Simulate optimization for images
      validFiles.forEach(file => {
        if (file.type.startsWith('image/')) {
          setOptimizationProgress(prev => ({ ...prev, [file.name]: 0 }))
          let progress = 0
          const interval = setInterval(() => {
            progress += 10
            setOptimizationProgress(prev => ({ ...prev, [file.name]: progress }))
            if (progress >= 100) {
              clearInterval(interval)
            }
          }, 100)
        }
      })
    }
  }, [files, maxFiles, maxSize, onFilesChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = ACCEPTED_TYPES[type as keyof typeof ACCEPTED_TYPES] || []
      return acc
    }, {} as Record<string, string[]>),
    maxFiles: maxFiles - files.length,
    multiple: true
  })

  const removeFile = (index: number) => {
    const newFiles = [...files]
    const removedFile = newFiles[index]
    newFiles.splice(index, 1)
    onFilesChange(newFiles)

    // Clean up preview
    setPreviews(prev => {
      const newPreviews = { ...prev }
      delete newPreviews[removedFile.name]
      return newPreviews
    })

    toast.success('Archivo eliminado')
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return ImageIcon
    if (file.type.startsWith('video/')) return Video
    if (file.type.includes('pdf')) return FileText
    return File
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className="relative cursor-pointer group"
      >
        <motion.div
          className={`relative transition-all duration-200 ${dragActive
            ? 'scale-[1.02] border-blue-500 bg-blue-50/50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <input {...getInputProps()} />
          <Card className={`overflow-hidden ${dragActive ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}>
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <motion.div
                  className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${dragActive ? 'bg-blue-500' : 'bg-gray-100'
                    }`}
                  animate={dragActive ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Upload className={`h-8 w-8 ${dragActive ? 'text-white' : 'text-gray-400'}`} />
                </motion.div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {isDragActive ? 'Suelta los archivos aquí' : 'Arrastra archivos o haz clic para subir'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Máximo {maxFiles} archivos, hasta {formatFileSize(maxSize)} cada uno
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
                    <span className="px-2 py-1 bg-gray-100 rounded">Imágenes</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">PDF</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">Word</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">Videos</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Crear Croquis Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center"
      >
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => setIsSketchModalOpen(true)}
          className="border-2 border-dashed border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50 text-indigo-600 font-semibold px-8 py-6 h-auto"
        >
          <Pencil className="h-5 w-5 mr-3" />
          <div className="text-left">
            <span className="block">Crear Croquis del Siniestro</span>
            <span className="text-xs font-normal text-gray-500">Dibuja un diagrama del accidente</span>
          </div>
        </Button>
      </motion.div>

      {/* Sketch Modal */}
      <SketchModal
        isOpen={isSketchModalOpen}
        onClose={() => setIsSketchModalOpen(false)}
        onSave={handleCroquisSave}
        location={location || null}
      />

      {/* Files Grid */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">
                Archivos seleccionados ({files.length}/{maxFiles})
              </h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onFilesChange([])
                  setPreviews({})
                  toast.success('Todos los archivos eliminados')
                }}
                disabled={files.length === 0}
              >
                Limpiar todo
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file, index) => {
                const Icon = getFileIcon(file)
                const hasPreview = previews[file.name]
                const isOptimizing = optimizationProgress[file.name] !== undefined && optimizationProgress[file.name] < 100

                return (
                  <motion.div
                    key={`${file.name}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.1 }}
                    layout
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group">
                      <div className="relative">
                        {hasPreview ? (
                          <div className="h-32 bg-gray-100 relative overflow-hidden">
                            <img
                              src={previews[file.name]}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                              <Button
                                type="button"
                                size="icon"
                                variant="secondary"
                                onClick={() => setSelectedFile(file)}
                              >
                                <ZoomIn className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="h-32 bg-gray-100 flex items-center justify-center">
                            <Icon className="h-12 w-12 text-gray-400" />
                          </div>
                        )}

                        {/* Optimization Progress */}
                        <AnimatePresence>
                          {isOptimizing && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center"
                            >
                              <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-2" />
                              <span className="text-xs text-gray-600">Optimizando...</span>
                              <Progress
                                value={optimizationProgress[file.name]}
                                className="w-20 h-1 mt-2"
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Status Badge */}
                        {!isOptimizing && (
                          <div className="absolute top-2 right-2">
                            <div className="bg-green-500 text-white rounded-full p-1">
                              <CheckCircle className="h-3 w-3" />
                            </div>
                          </div>
                        )}
                      </div>

                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => removeFile(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Preview Modal */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedFile(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="overflow-hidden">
                <div className="relative">
                  {selectedFile.type.startsWith('image/') && previews[selectedFile.name] ? (
                    <img
                      src={previews[selectedFile.name]}
                      alt={selectedFile.name}
                      className="w-full h-auto max-h-[70vh] object-contain"
                    />
                  ) : (
                    <div className="h-64 bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">{selectedFile.name}</p>
                      </div>
                    </div>
                  )}

                  <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="absolute top-2 right-2"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="p-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedFile.name}</h3>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(selectedFile.size)} • {selectedFile.type}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const url = URL.createObjectURL(selectedFile)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = selectedFile.name
                          a.click()
                          URL.revokeObjectURL(url)
                          toast.success('Descarga iniciada')
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Descargar
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})