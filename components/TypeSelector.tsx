'use client'

import { motion } from 'framer-motion'
import { 
  Shield, 
  Flame, 
  Zap, 
  Car, 
  Hand,
  AlarmClock,
  Target,
  FileWarning
} from 'lucide-react'
import { Card } from '@/components/ui/card'

export type ClaimType = 'ROBO' | 'INCENDIO' | 'CRISTALES' | 'ACCIDENTE'

interface TypeSelectorProps {
  onSelect: (type: ClaimType) => void
  selectedType?: ClaimType
}

const claimTypes = [
  {
    type: 'ROBO' as ClaimType,
    title: 'ROBO',
    description: 'Robo de objetos o accesorios',
    icon: Hand,
    color: 'red',
    bgGradient: 'from-red-50 to-red-100',
    borderColor: 'border-red-200',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    hoverGradient: 'hover:from-red-100 hover:to-red-200',
  },
  {
    type: 'INCENDIO' as ClaimType,
    title: 'INCENDIO',
    description: 'Incendio del vehículo',
    icon: Flame,
    color: 'orange',
    bgGradient: 'from-orange-50 to-orange-100',
    borderColor: 'border-orange-200',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    hoverGradient: 'hover:from-orange-100 hover:to-orange-200',
  },
  {
    type: 'CRISTALES' as ClaimType,
    title: 'CRISTALES',
    description: 'Rotura de cristales',
    icon: Zap,
    color: 'blue',
    bgGradient: 'from-blue-50 to-blue-100',
    borderColor: 'border-blue-200',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    hoverGradient: 'hover:from-blue-100 hover:to-blue-200',
  },
  {
    type: 'ACCIDENTE' as ClaimType,
    title: 'ACCIDENTE',
    description: 'Accidente de tránsito',
    icon: Car,
    color: 'green',
    bgGradient: 'from-green-50 to-green-100',
    borderColor: 'border-green-200',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    hoverGradient: 'hover:from-green-100 hover:to-green-200',
  },
]

export function TypeSelector({ onSelect, selectedType }: TypeSelectorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Seleccione el Tipo de Siniestro
        </h2>
        <p className="text-gray-500 text-sm md:text-base">
          Elija la opción que mejor describa su situación
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {claimTypes.map((item, index) => {
          const Icon = item.icon
          const isSelected = selectedType === item.type

          return (
            <motion.button
              key={item.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => onSelect(item.type)}
              className={`
                relative p-6 rounded-2xl text-left transition-all duration-300
                border-2 ${isSelected 
                  ? `border-${item.color}-500 bg-gradient-to-br ${item.bgGradient} shadow-lg shadow-${item.color}-200` 
                  : `border-transparent bg-white hover:bg-gradient-to-br ${item.hoverGradient} shadow-md hover:shadow-lg`
                }
                ${isSelected ? '' : 'border-gray-100'}
              `}
            >
              {/* Selection indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`absolute top-3 right-3 w-6 h-6 bg-${item.color}-500 rounded-full flex items-center justify-center`}
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}

              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`
                  flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center
                  ${isSelected ? item.iconBg : 'bg-gray-100'}
                `}>
                  <Icon className={`w-7 h-7 ${isSelected ? item.iconColor : 'text-gray-500'}`} />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className={`
                    text-lg font-bold mb-1
                    ${isSelected ? `text-${item.color}-700` : 'text-gray-800'}
                  `}>
                    {item.title}
                  </h3>
                  <p className={`text-sm ${isSelected ? 'text-gray-600' : 'text-gray-500'}`}>
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Arrow for desktop */}
              <div className={`
                hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 
                ${isSelected ? `text-${item.color}-400` : 'text-gray-300'}
              `}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Helper text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center"
      >
        <p className="text-sm text-gray-400">
          <AlarmClock className="w-4 h-4 inline mr-1" />
          La denuncia toma menos de 5 minutos
        </p>
      </motion.div>
    </div>
  )
}