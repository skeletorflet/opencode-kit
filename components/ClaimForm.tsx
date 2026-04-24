'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useForm, Controller, SubmitHandler, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import JSZip from 'jszip'
import { generateEmailHtml } from '@/lib/email-template'
import { generateClaimReference } from '@/lib/generate-claim-reference'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Car,
  AlertTriangle,
  FileText,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  MapPin,
  User,
  Users,
  Shield,
  Camera,
  Upload,
  Loader2,
  Sparkles
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import dynamic from 'next/dynamic'
import { FileUploadModern } from '@/components/forms/FileUploadModern'
import { useClaimFormStore } from '@/store/claimForm'
import { toast } from 'sonner'

// Dynamic import to avoid SSR issues with Leaflet
const AdvancedMapPicker = dynamic(
  () => import('@/components/maps/AdvancedMapPicker').then((mod) => mod.AdvancedMapPicker),
  { ssr: false }
)

const formSchema = z.object({
  // Step 1: Driver & Owner
  driverName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  driverPhone: z.string().regex(/^(\+54|0)?[1-9]\d{9,10}$/, 'Teléfono inválido'),
  isDriverOwner: z.boolean().default(true),
  ownerName: z.string().optional(),
  ownerPhone: z.string().optional(),

  // Vehicle
  insuredVehicle: z.string().min(3, 'El vehículo es obligatorio'),
  insuredPlate: z.string().min(2, 'La patente es obligatoria').transform(val => val.toUpperCase()),

  // Location & Date
  date: z.string().min(1, 'La fecha es obligatoria'),
  time: z.string().min(1, 'La hora es obligatoria'),
  location: z.object({ lat: z.number(), lng: z.number() }).nullable(),
  parsedAddress: z.object({
    fullAddress: z.string(),
    street: z.string(),
    streetNumber: z.string(),
    city: z.string(),
    province: z.string(),
  }).optional(),
  description: z.string().min(10, 'El relato debe tener al menos 10 caracteres'),

  // Step 2: Third Parties
  hasThirdParty: z.boolean().default(false),
  thirdPartyName: z.string().optional(),
  thirdPartyPhone: z.string().optional(),
  thirdPartyVehicleType: z.string().optional(),
  thirdPartyBrandModel: z.string().optional(),
  thirdPartyPlate: z.string().optional(),
  thirdPartyInsurance: z.string().optional(),
  thirdPartyPolicy: z.string().optional(),

  // Injuries
  hasInjuries: z.boolean().default(false),
  injuriesDescription: z.string().optional(),

  // Files
  files: z.array(z.any()).default([]),
}).superRefine((data, ctx) => {
  // If driver is not the owner, validate owner fields
  if (!data.isDriverOwner) {
    // ownerName is required
    if (!data.ownerName || data.ownerName.trim().length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El nombre del titular es obligatorio (mínimo 3 caracteres)',
        path: ['ownerName'],
      })
    }
    // ownerName must be different from driverName
    if (data.ownerName && data.driverName &&
      data.ownerName.trim().toLowerCase() === data.driverName.trim().toLowerCase()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El titular debe ser diferente al conductor',
        path: ['ownerName'],
      })
    }
    // ownerPhone is required
    if (!data.ownerPhone || data.ownerPhone.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'El teléfono del titular es obligatorio',
        path: ['ownerPhone'],
      })
    }
  }
})

type FormValues = z.infer<typeof formSchema>

const steps = [
  {
    id: 1,
    title: 'Datos del Siniestro',
    description: 'Información básica del accidente',
    icon: Car,
    color: 'blue'
  },
  {
    id: 2,
    title: 'Terceros y Lesiones',
    description: 'Otros involucrados en el siniestro',
    icon: AlertTriangle,
    color: 'orange'
  },
  {
    id: 3,
    title: 'Documentación',
    description: 'Fotos y pruebas del incidente',
    icon: FileText,
    color: 'green'
  },
]

export function ClaimForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [referenceNumber, setReferenceNumber] = useState('')

  const [lastSubmittedData, setLastSubmittedData] = useState<FormValues | null>(null)

  const { saveDraft, loadDraft, clearDraft } = useClaimFormStore()

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isDirty, isValid },
    trigger,
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    mode: 'onChange', // Real-time validation - errors clear when field becomes valid
    defaultValues: {
      hasThirdParty: false,
      hasInjuries: false,
      isDriverOwner: true,
      files: [],
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      location: null,
    },
  })

  // Load draft on mount
  useEffect(() => {
    const draft = loadDraft()
    if (draft) {
      Object.keys(draft).forEach((key) => {
        // Skip files as they cannot be persisted easily in local storage
        if (key !== 'files') {
          setValue(key as any, draft[key], { shouldValidate: true, shouldDirty: false })
        }
      })
      // Restore location specifically if it exists
      if (draft.location) {
        setValue('location', draft.location, { shouldValidate: true, shouldDirty: false })
      }
      toast.info('Borrador restaurado', { duration: 2000 })
    }
  }, [loadDraft, setValue])

  // Optimize watched values to avoid re-rendering entire form on every keystroke
  const isDriverOwner = useWatch({ control, name: 'isDriverOwner' })
  const driverName = useWatch({ control, name: 'driverName' })
  const driverPhone = useWatch({ control, name: 'driverPhone' })
  const hasThirdParty = useWatch({ control, name: 'hasThirdParty' })
  const hasInjuries = useWatch({ control, name: 'hasInjuries' })
  const location = useWatch({ control, name: 'location' })
  const files = useWatch({ control, name: 'files' })

  // Auto-save draft with debouncing and selective watching
  useEffect(() => {
    if (isDirty) {
      const timer = setTimeout(() => {
        // We use watch() here only inside the effect to get the full object for saving
        // without causing a re-render on every change since it's inside a timeout/effect
        saveDraft(control._formValues)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isDirty, saveDraft, control._formValues])

  // Auto-fill owner when driver is owner
  useEffect(() => {
    if (isDriverOwner) {
      setValue('ownerName', driverName)
      setValue('ownerPhone', driverPhone)
    }
  }, [isDriverOwner, driverName, driverPhone, setValue])

  const handleLocationSelect = useCallback((lat: number, lng: number, address?: any) => {
    setValue('location', { lat, lng })
    if (address) {
      setValue('parsedAddress', address)
    }
  }, [setValue])

  const handleFilesChange = useCallback((newFiles: any[]) => {
    setValue('files', newFiles)
  }, [setValue])

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormValues)[] = []

    if (currentStep === 1) {
      fieldsToValidate = ['driverName', 'insuredVehicle', 'insuredPlate', 'date', 'time', 'description']
      if (!isDriverOwner) {
        fieldsToValidate.push('ownerName')
      }
      if (!location) {
        toast.error('Por favor seleccione la ubicación en el mapa')
        return
      }
    } else if (currentStep === 2) {
      if (hasThirdParty) {
        fieldsToValidate = ['thirdPartyName', 'thirdPartyVehicleType', 'thirdPartyPlate', 'thirdPartyInsurance']
      }
      if (hasInjuries) {
        fieldsToValidate.push('injuriesDescription')
      }
    }

    const isValid = await trigger(fieldsToValidate)
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length))
      // Scroll to top when advancing step
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      // Focus on first invalid field and scroll to it
      const firstErrorField = fieldsToValidate.find(field => errors[field])

      if (firstErrorField) {
        const fieldElement = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement
        if (fieldElement) {
          fieldElement.focus()
          fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
    // Scroll to top when going back
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (data.files.length === 0) {
      toast.error('Debe adjuntar al menos un archivo')
      return
    }

    setIsSubmitting(true)

    try {
      // Generate reference number
      // Generate unique reference number with date and crypto-random components
      const refNum = generateClaimReference()
      setReferenceNumber(refNum)

      // Filter out broken files (0 bytes) before processing
      const validFiles = data.files.filter((file: File) => file.size > 0)
      const brokenFilesCount = data.files.length - validFiles.length

      if (brokenFilesCount > 0) {
        toast.warning(`Se ignoraron ${brokenFilesCount} archivo(s) roto(s) (0 bytes)`)
      }

      if (validFiles.length === 0) {
        toast.error('No hay archivos válidos para enviar')
        setIsSubmitting(false)
        return
      }

      // Optimize images
      const optimizedFiles = await Promise.all(
        validFiles.map(async (file) => {
          if (file.type.startsWith('image/')) {
            return await optimizeImage(file)
          }
          return file
        })
      )

      // --- ZIP CREATION ---
      const zip = new JSZip()
      optimizedFiles.forEach((file) => {
        zip.file(file.name, file)
      })

      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 }
      })

      const zipFileName = `DOCUMENTACION_${refNum}.zip`

      // Convert ZIP to Base64
      const zipBase64Full = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.readAsDataURL(zipBlob)
      })
      const zipBase64 = zipBase64Full.split(',')[1]

      // Check for Google Script URL in env
      const googleScriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL

      if (googleScriptUrl) {
        // --- GOOGLE SCRIPT STRATEGY ---
        const formData = new FormData()

        // Subject
        formData.append('subject', `SINIESTRO - ${(data.ownerName || '').toUpperCase()} - ${(data.insuredPlate || '').toUpperCase()}`)


        // Construct HTML Message
        const emailBody = generateEmailHtml(data, refNum);
        formData.append('message', emailBody)


        // Send Single ZIP
        formData.append('fileName_1', zipFileName)
        formData.append('fileMime_1', 'application/zip')
        formData.append('fileData_1', zipBase64)

        await fetch(googleScriptUrl, {
          method: 'POST',
          body: formData,
          mode: 'no-cors'
        })

        // With no-cors we can't check response.ok. Assume success.
        clearDraft()
        setLastSubmittedData(data)
        setIsSuccess(true)
        reset()
        toast.success('Denuncia enviada exitosamente')

      } else {
        // --- NEXT.JS API STRATEGY (NODEMAILER) ---
        const response = await fetch('/api/claim-submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            files: [{
              name: zipFileName,
              type: 'application/zip',
              content: zipBase64,
              size: zipBlob.size
            }],
            referenceNumber: refNum,
          }),
        })

        if (!response.ok) throw new Error('Error al enviar el formulario')

        clearDraft()
        setLastSubmittedData(data)
        setIsSuccess(true)
        reset()
        toast.success('Denuncia enviada exitosamente')
      }

    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Hubo un error al enviar la denuncia. Intente nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Image optimization function
  const optimizeImage = async (file: File): Promise<File> => {
    // Skip SVG files - they should be preserved as-is
    if (file.type === 'image/svg+xml') {
      return file
    }

    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        const MAX_SIZE = 1920
        let width = img.width
        let height = img.height

        if (width > MAX_SIZE || height > MAX_SIZE) {
          if (width > height) {
            height *= MAX_SIZE / width
            width = MAX_SIZE
          } else {
            width *= MAX_SIZE / height
            height = MAX_SIZE
          }
        }

        canvas.width = width
        canvas.height = height

        if (ctx) {
          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(0, 0, width, height)
          ctx.drawImage(img, 0, 0, width, height)

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), { type: 'image/jpeg' }))
              } else {
                resolve(file)
              }
            },
            'image/jpeg',
            0.8
          )
        } else {
          resolve(file)
        }
      }

      img.src = URL.createObjectURL(file)
    })
  }

  if (isSuccess) {
    return (
      <motion.div
        className="min-h-[60vh] flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="text-center max-w-2xl w-full mx-auto overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-500/10" />
          <CardContent className="relative z-10 p-12">
            <motion.div
              className="flex justify-center mb-8"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <div className="relative">
                <div className="h-28 w-28 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                  <CheckCircle className="h-14 w-14 text-white" />
                </div>
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <Sparkles className="h-8 w-8 text-yellow-400" />
                </motion.div>
              </div>
            </motion.div>

            <motion.h2
              className="text-4xl font-bold gradient-text-gold mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              ¡Denuncia Enviada con Éxito!
            </motion.h2>

            <motion.p
              className="text-lg text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Hemos recibido correctamente tu denuncia. El sistema ha procesado toda la información
              y la hemos enviado a nuestro equipo de siniestros para su atención inmediata.
            </motion.p>

            <motion.div
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-center mb-3">
                <Shield className="h-6 w-6 text-blue-500 mr-2" />
                <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">
                  Número de Referencia
                </p>
              </div>
              <p className="text-3xl font-mono font-bold text-blue-600 tracking-wider">
                {referenceNumber}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Guarda este número para hacer seguimiento de tu caso
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              {/* WhatsApp Notification Button */}
              <Button
                onClick={() => {
                  const driverName = lastSubmittedData?.driverName || 'Asegurado'
                  const vehicle = lastSubmittedData?.insuredVehicle || 'Vehículo'
                  const plate = lastSubmittedData?.insuredPlate || 'Patente'
                  const message = `Hola, hice la carga de la denuncia ${referenceNumber}. Muchas gracias. ${driverName}, ${vehicle}, ${plate}`
                  window.open(`https://wa.me/542994516661?text=${encodeURIComponent(message)}`, '_blank')
                }}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                size="lg"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Notificar a Toval Seguros
              </Button>

              <Button
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                size="lg"
              >
                Realizar Otra Denuncia
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.print()}
              >
                Imprimir Comprobante
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Combined Header + Step Indicator */}
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-lg border-b border-indigo-100/50"
      >
        <div className="container mx-auto px-3 md:px-4">
          <div className="flex items-center justify-between h-14 md:h-16 gap-2">
            {/* Logo */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="relative">
                <Shield className="h-7 w-7 md:h-9 md:w-9 text-indigo-600" />
                <motion.div
                  className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-emerald-500 rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              {/* Mobile: Compact text */}
              <div className="sm:hidden">
                <p className="text-[11px] font-bold text-indigo-600 leading-none">Toval
                  <br />
                  Seguros</p>
                <p className="text-[9px] text-indigo-500/80 leading-none">Denuncia
                </p>
              </div>
              {/* Desktop: Full text */}
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                  Toval Seguros
                </h1>
                <p className="text-[10px] md:text-xs text-indigo-600/70 font-medium -mt-0.5">
                  Denuncia de Siniestros
                </p>
              </div>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center gap-1 md:gap-1.5 bg-gray-50/80 rounded-full px-1.5 py-1 md:px-2 md:py-1.5 border border-gray-200/50">
              {steps.map((step, index) => {
                const isCompleted = index < currentStep - 1
                const isCurrent = index === currentStep - 1
                const isFuture = index > currentStep - 1
                const StepIcon = step.icon

                const handleStepClick = () => {
                  // Only allow navigation to completed steps (going back) or current step
                  if (isFuture) {
                    toast.error('Complete los campos obligatorios del paso actual antes de continuar')
                    return
                  }
                  setCurrentStep(step.id)
                }

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={handleStepClick}
                    disabled={isFuture}
                    className={`relative flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-full transition-all duration-300 ${isCurrent
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-300/40'
                      : isCompleted
                        ? 'text-indigo-600 hover:bg-indigo-50 cursor-pointer'
                        : 'text-gray-300 cursor-not-allowed opacity-60'
                      }`}
                  >
                    {/* Icon */}
                    <div className={`flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full transition-all ${isCurrent
                      ? 'bg-white/20'
                      : isCompleted
                        ? 'bg-indigo-100'
                        : 'bg-gray-100'
                      }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-3 w-3 md:h-3.5 md:w-3.5" />
                      ) : (
                        <StepIcon className="h-3 w-3 md:h-3.5 md:w-3.5" />
                      )}
                    </div>

                    {/* Title - only on desktop or current step on mobile */}
                    <span className={`text-xs md:text-sm font-medium whitespace-nowrap ${isCurrent ? 'block' : 'hidden lg:block'
                      }`}>
                      {step.title}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-14 md:h-16" />

      <form onSubmit={handleSubmit(onSubmit as any)}>
        <Card className="border-0 overflow-hidden relative shadow-xl bg-white/80 backdrop-blur-[2px] rounded-2xl md:rounded-3xl border border-blue-100 will-change-transform transform-gpu">
          <AnimatePresence mode="wait" initial={false}>
            {/* Step 1: Datos del Siniestro */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-4 md:p-6 space-y-4 md:space-y-6"
              >
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="flex items-center space-x-4">
                    <div className="p-4 bg-blue-100 rounded-2xl text-blue-600 shadow-sm border border-blue-200">
                      <Car className="h-8 w-8" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">Datos del Siniestro</h2>
                      <p className="text-gray-500 font-medium mt-1">Información básica del accidente</p>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6 px-0">
                  {/* Driver Section */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold flex items-center">
                      <User className="h-5 w-5 mr-2 text-blue-500" />
                      Conductor del Vehículo
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Input
                          {...register('driverName')}
                          placeholder="Nombre completo del conductor"
                          className={`bg-white border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 h-12 rounded-xl text-gray-700 font-medium placeholder:text-gray-400 ${errors.driverName ? 'border-red-300 bg-red-50' : ''}`}
                        />
                        {errors.driverName && (
                          <p className="text-red-500 text-sm mt-1">{errors.driverName.message}</p>
                        )}
                      </div>
                      <div>
                        <Input
                          {...register('driverPhone')}
                          placeholder="Teléfono de contacto"
                          type="tel"
                          className={`bg-white border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 h-12 rounded-xl text-gray-700 font-medium placeholder:text-gray-400 ${errors.driverPhone ? 'border-red-300 bg-red-50' : ''}`}
                        />
                        {errors.driverPhone && (
                          <p className="text-red-500 text-sm mt-1">{errors.driverPhone.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Owner Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-semibold flex items-center">
                        <Users className="h-5 w-5 mr-2 text-amber-500" />
                        ¿El conductor es el titular del vehículo?
                      </Label>
                      <Controller
                        name="isDriverOwner"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                    </div>

                    <AnimatePresence>
                      {!isDriverOwner && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-amber-50/50 p-6 rounded-xl border border-amber-200"
                        >
                          <Input
                            {...register('ownerName')}
                            placeholder="Nombre del titular"
                            className={`bg-white border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 h-12 rounded-xl text-gray-700 font-medium placeholder:text-gray-400 ${errors.ownerName ? 'border-red-300 bg-red-50' : ''}`}
                          />
                          {errors.ownerName && (
                            <p className="text-red-500 text-sm mt-1">{errors.ownerName.message}</p>
                          )}
                          <Input
                            {...register('ownerPhone')}
                            placeholder="Teléfono del titular"
                            type="tel"
                            className="bg-white border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 h-12 rounded-xl text-gray-700 font-medium placeholder:text-gray-400"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Vehicle Section */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold flex items-center">
                      <Car className="h-5 w-5 mr-2 text-green-500" />
                      Vehículo Asegurado
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Input
                          {...register('insuredVehicle')}
                          placeholder="Marca y modelo (Ej: Toyota Hilux 2020)"
                          className={`bg-white border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 h-12 rounded-xl text-gray-700 font-medium placeholder:text-gray-400 ${errors.insuredVehicle ? 'border-red-300 bg-red-50' : ''}`}
                        />
                        {errors.insuredVehicle && (
                          <p className="text-red-500 text-sm mt-1">{errors.insuredVehicle.message}</p>
                        )}
                      </div>
                      <div>
                        <Input
                          {...register('insuredPlate')}
                          placeholder="Patente (Ej: AA123BB)"
                          className={`bg-white border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 h-12 rounded-xl text-gray-700 font-medium placeholder:text-gray-400 uppercase ${errors.insuredPlate ? 'border-red-300 bg-red-50' : ''}`}
                        />
                        {errors.insuredPlate && (
                          <p className="text-red-500 text-sm mt-1">{errors.insuredPlate.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Location Section */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-red-500" />
                      Ubicación y Fecha del Siniestro
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Input
                          {...register('date')}
                          type="date"
                          className={`bg-white border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 h-12 rounded-xl text-gray-700 font-medium ${errors.date ? 'border-red-300 bg-red-50' : ''}`}
                        />
                        {errors.date && (
                          <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                        )}
                      </div>
                      <div>
                        <Input
                          {...register('time')}
                          type="time"
                          className={`bg-white border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 h-12 rounded-xl text-gray-700 font-medium ${errors.time ? 'border-red-300 bg-red-50' : ''}`}
                        />
                        {errors.time && (
                          <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
                        )}
                      </div>
                    </div>

                    <Controller
                      name="location"
                      control={control}
                      render={({ field }) => (
                        <AdvancedMapPicker
                          location={field.value}
                          onLocationSelect={handleLocationSelect}
                        />
                      )}
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">Relato del Hecho</Label>
                    <Textarea
                      {...register('description')}
                      placeholder="Describe detalladamente cómo ocurrió el siniestro..."
                      rows={4}
                      className={`bg-white border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 rounded-xl text-gray-700 font-medium placeholder:text-gray-400 resize-none ${errors.description ? 'border-red-300 bg-red-50' : ''}`}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                    )}
                  </div>
                </CardContent>
              </motion.div>
            )}

            {/* Step 2: Terceros y Lesiones */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-4 md:p-6 space-y-4 md:space-y-6"
              >
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="flex items-center space-x-4">
                    <div className="p-4 bg-orange-100 rounded-2xl text-orange-600 shadow-sm border border-orange-200">
                      <AlertTriangle className="h-8 w-8" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">Terceros y Lesiones</h2>
                      <p className="text-gray-500 font-medium mt-1">Información sobre otros involucrados</p>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6 px-0">
                  {/* Third Party Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-semibold">¿Hubo Terceros Involucrados?</Label>
                      <Controller
                        name="hasThirdParty"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                    </div>

                    <AnimatePresence>
                      {hasThirdParty && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4 bg-blue-50/50 p-6 rounded-xl border border-blue-200"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <Input
                                {...register('thirdPartyName')}
                                placeholder="Nombre y apellido del tercero"
                                className={`bg-white border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-300 h-12 rounded-xl text-gray-700 font-medium placeholder:text-gray-400 ${errors.thirdPartyName ? 'border-red-300 bg-red-50' : ''}`}
                              />
                              {errors.thirdPartyName && (
                                <p className="text-red-500 text-sm mt-1">{errors.thirdPartyName.message}</p>
                              )}
                            </div>
                            <div>
                              <Input
                                {...register('thirdPartyPhone')}
                                placeholder="Teléfono del tercero"
                                type="tel"
                                className="bg-white border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-300 h-12 rounded-xl text-gray-700 font-medium placeholder:text-gray-400"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <Controller
                                name="thirdPartyVehicleType"
                                control={control}
                                render={({ field }) => (
                                  <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className={`bg-white border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-300 h-12 rounded-xl text-gray-700 font-medium ${errors.thirdPartyVehicleType ? 'border-red-300 bg-red-50' : ''}`}>
                                      <SelectValue placeholder="Tipo de vehículo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Auto">Automóvil</SelectItem>
                                      <SelectItem value="Moto">Motocicleta</SelectItem>
                                      <SelectItem value="Camioneta">Camioneta / Pick-Up</SelectItem>
                                      <SelectItem value="Camion">Camión</SelectItem>
                                      <SelectItem value="Bicicleta">Bicicleta</SelectItem>
                                      <SelectItem value="Peatón">Peatón</SelectItem>
                                      <SelectItem value="Otro">Otro</SelectItem>
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                              {errors.thirdPartyVehicleType && (
                                <p className="text-red-500 text-sm mt-1">{errors.thirdPartyVehicleType.message}</p>
                              )}
                            </div>
                            <Input
                              {...register('thirdPartyBrandModel')}
                              placeholder="Marca y modelo"
                              className="bg-white border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-300 h-12 rounded-xl text-gray-700 font-medium placeholder:text-gray-400"
                            />
                            <div>
                              <Input
                                {...register('thirdPartyPlate')}
                                placeholder="Patente"
                                className={`bg-white border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-300 h-12 rounded-xl text-gray-700 font-medium placeholder:text-gray-400 uppercase ${errors.thirdPartyPlate ? 'border-red-300 bg-red-50' : ''}`}
                              />
                              {errors.thirdPartyPlate && (
                                <p className="text-red-500 text-sm mt-1">{errors.thirdPartyPlate.message}</p>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <Input
                                {...register('thirdPartyInsurance')}
                                placeholder="Aseguradora del tercero"
                                className={`bg-white border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-300 h-12 rounded-xl text-gray-700 font-medium placeholder:text-gray-400 ${errors.thirdPartyInsurance ? 'border-red-300 bg-red-50' : ''}`}
                              />
                              {errors.thirdPartyInsurance && (
                                <p className="text-red-500 text-sm mt-1">{errors.thirdPartyInsurance.message}</p>
                              )}
                            </div>
                            <Input
                              {...register('thirdPartyPolicy')}
                              placeholder="Número de póliza (opcional)"
                              className="bg-white border-gray-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all duration-300 h-12 rounded-xl text-gray-700 font-medium placeholder:text-gray-400"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Injuries Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-lg font-semibold">¿Hubo Personas Lesionadas?</Label>
                      <Controller
                        name="hasInjuries"
                        control={control}
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        )}
                      />
                    </div>

                    <AnimatePresence>
                      {hasInjuries && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4 bg-red-50/50 p-6 rounded-xl border border-red-200"
                        >
                          <Textarea
                            {...register('injuriesDescription')}
                            placeholder="Describe las lesiones y cantidad de personas afectadas..."
                            rows={3}
                            className={`bg-white border-gray-200 focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all duration-300 rounded-xl text-gray-700 font-medium placeholder:text-gray-400 resize-none ${errors.injuriesDescription ? 'border-red-300 bg-red-50' : ''}`}
                          />
                          {errors.injuriesDescription && (
                            <p className="text-red-500 text-sm mt-1">{errors.injuriesDescription.message}</p>
                          )}
                          <div className="bg-red-100 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm text-red-800 font-semibold">Importante</p>
                              <p className="text-sm text-red-700">
                                Si hubo lesionados, recuerda que es obligatoria la intervención policial
                                y la denuncia correspondiente.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </motion.div>
            )}

            {/* Step 3: Documentación */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-4 md:p-6 space-y-4 md:space-y-6"
              >
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="flex items-center space-x-4">
                    <div className="p-4 bg-green-100 rounded-2xl text-green-600 shadow-sm border border-green-200">
                      <FileText className="h-8 w-8" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">Documentación</h2>
                      <p className="text-gray-500 font-medium mt-1">Adjunta las pruebas del siniestro</p>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6 px-0">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                    <h3 className="font-semibold text-blue-800 mb-4 flex items-center">
                      <Camera className="h-5 w-5 mr-2" />
                      Documentos Requeridos
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-700">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Fotos de los daños (todos los ángulos)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Fotos del vehículo tercero y patente</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Carnet de conducir del conductor</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Cédula verde/azul del vehículo</span>
                      </div>
                    </div>
                  </div>

                  <Controller
                    name="files"
                    control={control}
                    render={({ field }) => (
                      <FileUploadModern
                        files={field.value}
                        onFilesChange={handleFilesChange}
                        location={location}
                      />
                    )}
                  />
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="border-t border-gray-100 p-6 flex justify-between items-center bg-gray-50/50">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                leftIcon={<ChevronLeft className="h-4 w-4" />}
              >
                Anterior
              </Button>
            ) : (
              <div></div>
            )}

            {currentStep < steps.length ? (
              <Button
                type="button"
                onClick={nextStep}
                rightIcon={<ChevronRight className="h-4 w-4" />}
                className="bg-gradient-to-r from-blue-500 to-blue-600"
              >
                Siguiente
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => {
                  const filesList = files || []
                  if (filesList.length === 0) {
                    toast.error('Debe adjuntar al menos un archivo')
                    return
                  }
                  // Trigger form submission
                  handleSubmit(onSubmit as SubmitHandler<FormValues>)()
                }}
                disabled={isSubmitting}
                isLoading={isSubmitting}
                className={`bg-gradient-to-r ${(files?.length || 0) === 0 ? 'from-gray-400 to-gray-500 cursor-not-allowed opacity-70' : 'from-green-500 to-emerald-600'}`}
                leftIcon={isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              >
                {isSubmitting ? 'Enviando...' : 'Finalizar Denuncia'}
              </Button>
            )}
          </div>
        </Card>
      </form>
    </div >
  )
}