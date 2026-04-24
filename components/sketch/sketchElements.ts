// SVG path definitions for sketch elements
// All paths are designed to be centered at (0,0) and scaled appropriately

export interface SketchElementType {
    id: string
    name: string
    emoji: string
    color: string
    fontSize: number  // Size of the emoji on canvas
    isText?: boolean
}

// Vehicle and element definitions - using emojis for visual representation
// Smaller sizes to fit better in street intersections
export const SKETCH_ELEMENTS: SketchElementType[] = [
    {
        id: 'car-insured',
        name: 'Auto Asegurado',
        emoji: '🚗',
        color: '#22c55e', // green
        fontSize: 32
    },
    {
        id: 'car-third',
        name: 'Auto Tercero',
        emoji: '🚙',
        color: '#ef4444', // red
        fontSize: 32
    },
    {
        id: 'motorcycle',
        name: 'Moto',
        emoji: '🏍️',
        color: '#f59e0b', // amber
        fontSize: 28
    },
    {
        id: 'truck',
        name: 'Camión',
        emoji: '🚛',
        color: '#6366f1', // indigo
        fontSize: 36
    },
    {
        id: 'person',
        name: 'Persona',
        emoji: '🚶',
        color: '#8b5cf6', // violet
        fontSize: 28
    },
    {
        id: 'impact',
        name: 'Impacto',
        emoji: '💥',
        color: '#dc2626', // red-600
        fontSize: 30
    },
    {
        id: 'arrow',
        name: 'Dirección',
        emoji: '➡️',
        color: '#0ea5e9', // sky-500
        fontSize: 32
    },
    {
        id: 'text',
        name: 'Texto',
        emoji: '📝',
        color: '#1f2937', // gray-800
        fontSize: 16,
        isText: true
    }
]

// Element placed on canvas
export interface CanvasElement {
    id: string
    type: string
    x: number
    y: number
    rotation: number
    scaleX?: number  // Horizontal scale/flip
    scaleY?: number  // Vertical scale
    text?: string
    emoji: string
    fontSize: number
    label?: string  // Label like "A" for asegurado, "T" for tercero
}
