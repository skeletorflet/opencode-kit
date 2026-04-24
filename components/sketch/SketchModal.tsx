'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Stage, Layer, Rect, Arrow, Text, Group, Image as KonvaImage, Transformer, Line, Path, TextPath, Circle } from 'react-konva'
import Konva from 'konva'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X,
    RotateCw,
    Trash2,
    Undo2,
    Redo2,
    Eraser,
    Save,
    ZoomIn,
    ZoomOut,
    Plus,
    FlipHorizontal,
    RotateCcw,
    Pencil
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { SKETCH_ELEMENTS, CanvasElement, SketchElementType } from './sketchElements'

interface SketchModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (file: File) => void
    location: { lat: number; lng: number } | null
}

// ... existing code ...



// Canvas dimensions
const CANVAS_WIDTH = 1200
const CANVAS_HEIGHT = 1200

export function SketchModal({ isOpen, onClose, onSave, location }: SketchModalProps) {
    const [elements, setElements] = useState<CanvasElement[]>([])
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [history, setHistory] = useState<CanvasElement[][]>([[]])
    const [historyIndex, setHistoryIndex] = useState(0)
    const [mapImage, setMapImage] = useState<HTMLImageElement | null>(null)
    const [isLoadingMap, setIsLoadingMap] = useState(false)
    const [textInput, setTextInput] = useState('')
    const [isAddingText, setIsAddingText] = useState(false)

    // Zoom and pan state
    const [stageScale, setStageScale] = useState(0.5)
    const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 })

    // Mobile toolbar state
    const [isToolbarOpen, setIsToolbarOpen] = useState(false)
    const [containerSize, setContainerSize] = useState({ width: 800, height: 600 })
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 800)

    // Debug state for centering issues (can be enabled for troubleshooting)
    const [debugMode, setDebugMode] = useState(false)

    // Track if we're dragging an element (to prevent stage panning) - using state for re-render
    const [isDraggingElement, setIsDraggingElement] = useState(false)
    const isDraggingElementRef = useRef(false)

    const stageRef = useRef<Konva.Stage>(null)
    const transformerRef = useRef<Konva.Transformer>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Enhanced updateSize function with safe area handling
    const updateSize = useCallback(() => {
        // Update window width for mobile detection
        setWindowWidth(window.innerWidth)

        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect()
            setContainerSize({ width: rect.width, height: rect.height })

            // Get computed safe area values
            const computedStyle = getComputedStyle(containerRef.current)
            const safeAreaTop = parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)') || '0')
            const safeAreaBottom = parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)') || '0')

            // Get the modal container to account for header height
            const modalContainer = containerRef.current.closest('.fixed.inset-0')
            let headerHeight = 0

            if (modalContainer) {
                const headerElement = modalContainer.querySelector('.bg-gradient-to-r') as HTMLElement
                if (headerElement) {
                    headerHeight = headerElement.offsetHeight
                }
            }

            // Adjust available dimensions for safe areas and header
            const availableWidth = rect.width
            const availableHeight = rect.height - Math.max(safeAreaTop, headerHeight) - safeAreaBottom

            // Fit the canvas to the available space
            const scaleToFit = Math.min(availableWidth / CANVAS_WIDTH, availableHeight / CANVAS_HEIGHT) * 0.95
            setStageScale(scaleToFit)

            // Center the canvas with proper offset for header/safe areas
            const yOffset = Math.max(safeAreaTop, headerHeight) + (availableHeight - CANVAS_HEIGHT * scaleToFit) / 2
            setStagePosition({
                x: (availableWidth - CANVAS_WIDTH * scaleToFit) / 2,
                y: yOffset
            })
        }
    }, [])

    // Update container size and fit canvas on resize/open
    useEffect(() => {
        if (isOpen) {
            // Use requestAnimationFrame for better timing on iOS
            const timer = requestAnimationFrame(() => {
                requestAnimationFrame(updateSize) // Double RAF for iOS Safari
            })

            window.addEventListener('resize', updateSize)

            // Also listen for orientation changes
            const handleOrientationChange = () => {
                setTimeout(updateSize, 100) // Small delay after orientation change
            }
            window.addEventListener('orientationchange', handleOrientationChange)

            return () => {
                cancelAnimationFrame(timer)
                window.removeEventListener('resize', updateSize)
                window.removeEventListener('orientationchange', handleOrientationChange)
            }
        }
    }, [isOpen, updateSize])

    // Load map background when location changes
    useEffect(() => {
        if (location && isOpen) {
            loadMapBackground(location.lat, location.lng)
        }
    }, [location, isOpen])

    // Update transformer when selection changes
    useEffect(() => {
        if (transformerRef.current && stageRef.current) {
            const stage = stageRef.current
            const selectedNode = stage.findOne(`#${selectedId}`)

            if (selectedNode) {
                transformerRef.current.nodes([selectedNode])
                transformerRef.current.getLayer()?.batchDraw()
            } else {
                transformerRef.current.nodes([])
            }
        }
    }, [selectedId])

    // State for Vector Map (SVG-like paths)
    const [mapPaths, setMapPaths] = useState<any[]>([])


    // Helper to project lat/lon to pixel coordinates relative to center
    const project = (lat: number, lon: number, centerLat: number, centerLng: number, zoom: number) => {
        const n = Math.pow(2, zoom)
        const tileSize = 256

        const x = ((lon + 180) / 360) * n * tileSize
        const y = ((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2) * n * tileSize

        const centerX = ((centerLng + 180) / 360) * n * tileSize
        const centerY = ((1 - Math.log(Math.tan(centerLat * Math.PI / 180) + 1 / Math.cos(centerLat * Math.PI / 180)) / Math.PI) / 2) * n * tileSize

        return {
            x: x - centerX + CANVAS_WIDTH / 2,
            y: y - centerY + CANVAS_HEIGHT / 2
        }
    }

    const OVERPASS_SERVERS = [
        'https://overpass-api.de/api/interpreter',
        'https://interpreter.overpass-api.de/api/interpreter',
        'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
        'https://overpass.kumi.systems/api/interpreter'
    ]

    const fetchOverpass = async (query: string): Promise<any> => {
        for (const server of OVERPASS_SERVERS) {
            try {
                const controller = new AbortController()
                const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

                const response = await fetch(server, {
                    method: 'POST',
                    body: query,
                    signal: controller.signal
                })
                clearTimeout(timeoutId)

                if (response.ok) {
                    return await response.json()
                }
            } catch (e) {
                console.warn(`Overpass server ${server} failed, trying next...`)
            }
        }
        throw new Error('All Overpass servers failed')
    }

    const loadMapBackground = async (lat: number, lng: number) => {
        setIsLoadingMap(true)
        setMapPaths([]) // Clear previous

        try {
            // High-Res Vector Map (SVG style)
            // Fetch a square roughly 2-3 blocks radius (~400m)
            const delta = 0.002
            const bbox = `${lat - delta},${lng - delta},${lat + delta},${lng + delta}`

            // Query for:
            // 1. Roads (way[highway])
            // 2. Buildings (way[building])
            // 3. Landuse/Natural (parks, water, etc)
            // 4. Street Names & Amenities
            const query = `
                [out:json][timeout:25];
                (
                  way["highway"](${bbox});
                  way["building"](${bbox});
                  way["leisure"](${bbox});
                  way["landuse"](${bbox});
                  way["natural"](${bbox});
                  node["addr:housenumber"](${bbox});
                  node["amenity"](${bbox});
                  node["shop"](${bbox});
                );
                out geom;
            `

            const data = await fetchOverpass(query)
            const zoom = 19 // High resolution reference zoom

            const paths: any[] = []

            // Helper to convert points [x,y,x,y] to SVG path "M x y L x y"
            const toSVGPath = (points: number[]) => {
                if (points.length < 4) return ''
                let d = `M ${points[0]} ${points[1]}`
                for (let i = 2; i < points.length; i += 2) {
                    d += ` L ${points[i]} ${points[i + 1]}`
                }
                return d
            }

            // Process elements
            for (const element of data.elements) {
                // NODES (POIs / Addresses)
                if (element.type === 'node') {
                    const { x, y } = project(element.lat, element.lon, lat, lng, zoom)

                    if (element.tags['addr:housenumber']) {
                        paths.push({
                            type: 'label',
                            text: element.tags['addr:housenumber'],
                            x, y,
                            fontSize: 10,
                            fill: '#6b7280',
                            zIndex: 100
                        })
                    } else if (element.tags.amenity || element.tags.shop) {
                        const name = element.tags.name
                        if (name) {
                            paths.push({
                                type: 'poi',
                                text: name,
                                x, y,
                                amenity: element.tags.amenity || element.tags.shop,
                                zIndex: 101
                            })
                        }
                    }
                    continue
                }

                // WAYS
                if (element.type === 'way' && element.geometry) {
                    const points: number[] = []
                    element.geometry.forEach((p: any) => {
                        const { x, y } = project(p.lat, p.lon, lat, lng, zoom)
                        points.push(x, y)
                    })

                    // Default style
                    let color = '#d1d5db'
                    let width = 1
                    let fill = undefined
                    let zIndex = 0
                    let isRoad = false

                    if (element.tags.highway) {
                        isRoad = true
                        zIndex = 10
                        if (['motorway', 'trunk', 'primary'].includes(element.tags.highway)) {
                            color = '#fbbf24' // Orange/Yellow
                            width = 22
                            zIndex = 20
                        } else if (['secondary'].includes(element.tags.highway)) {
                            color = '#fde68a'
                            width = 16
                            zIndex = 15
                        } else if (['tertiary', 'residential', 'unclassified'].includes(element.tags.highway)) {
                            color = '#ffffff'
                            width = 12
                        } else {
                            color = '#ffffff'
                            width = 8
                        }
                    } else if (element.tags.building) {
                        color = '#d4d4d8'
                        fill = '#e4e4e7'
                        width = 1
                        zIndex = 30
                    } else if (element.tags.leisure || element.tags.landuse === 'grass' || element.tags.natural === 'wood') {
                        fill = '#dcfce7' // Light green
                        width = 0
                        zIndex = 0
                    } else if (element.tags.natural === 'water') {
                        fill = '#bfdbfe' // Light blue
                        width = 0
                        zIndex = 0
                    }

                    // Base shape
                    paths.push({
                        type: 'shape',
                        id: element.id,
                        points,
                        stroke: color,
                        strokeWidth: width,
                        fill: fill,
                        closed: !!(fill || element.tags.building),
                        zIndex
                    })

                    // Street Name (TextPath)
                    if (isRoad && element.tags.name) {
                        paths.push({
                            type: 'text-path',
                            id: `name-${element.id}`,
                            data: toSVGPath(points),
                            text: element.tags.name,
                            zIndex: 40 // On top of roads
                        })
                    }
                }
            }

            // Sort by zIndex ensures layers
            paths.sort((a, b) => a.zIndex - b.zIndex)

            setMapPaths(paths)
            setIsLoadingMap(false)

        } catch (error) {
            console.error('Vector map failed completely', error)
            // If vectors fail, we just show a grid or basic background, user requested "real svg", fallback to raster might be unwanted if they hate pixelation.
            // But better to have *something*. Let's keep a minimal fallback or just blank canvas with grid?
            // User said: "el mapa en si se ve pixelado... haz algo mas inteligente"
            // Let's try to just leave it blank/grid if vector fails to avoid "pixelated" complaint? 
            // Or better: Let's assume one server will work. If not, maybe just show the compass and a message "Map data unavailable".
            // Actually, I'll allow fallback but maybe mute it? 
            // No, the user specifically complained about pixelation. I will NOT fallback to raster.
            setIsLoadingMap(false)
            toast.error('No se pudo cargar el mapa vectorial. Intenta de nuevo.')
        }
    }

    // Zoom handlers
    const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault()

        const scaleBy = 1.05
        const stage = stageRef.current
        if (!stage) return

        const oldScale = stage.scaleX()
        const pointer = stage.getPointerPosition()
        if (!pointer) return

        const mousePointTo = {
            x: pointer.x / oldScale - stage.x() / oldScale,
            y: pointer.y / oldScale - stage.y() / oldScale,
        }

        const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy

        // Limit zoom out - prevent "tiny map"
        // Min scale 0.5 ensures map always covers a good chunk
        const clampedScale = Math.max(0.5, Math.min(newScale, 5))

        setStageScale(clampedScale)

        const newPos = {
            x: -(mousePointTo.x - pointer.x / clampedScale) * clampedScale,
            y: -(mousePointTo.y - pointer.y / clampedScale) * clampedScale,
        }

        setStagePosition(newPos)
    }

    const zoomIn = () => {
        const newScale = Math.min(stageScale * 1.4, 4)
        const centerX = containerSize.width / 2
        const centerY = containerSize.height / 2
        const mousePointTo = {
            x: (centerX - stagePosition.x) / stageScale,
            y: (centerY - stagePosition.y) / stageScale,
        }
        setStageScale(newScale)
        setStagePosition({
            x: centerX - mousePointTo.x * newScale,
            y: centerY - mousePointTo.y * newScale,
        })
    }

    const zoomOut = () => {
        const newScale = Math.max(stageScale / 1.4, 0.15)
        const centerX = containerSize.width / 2
        const centerY = containerSize.height / 2
        const mousePointTo = {
            x: (centerX - stagePosition.x) / stageScale,
            y: (centerY - stagePosition.y) / stageScale,
        }
        setStageScale(newScale)
        setStagePosition({
            x: centerX - mousePointTo.x * newScale,
            y: centerY - mousePointTo.y * newScale,
        })
    }

    const resetZoom = () => {
        // Use the same enhanced updateSize logic for consistency
        updateSize()
    }


    // Touch and Mouse handlers for manual Pan and Zoom
    const lastCenter = useRef<{ x: number; y: number } | null>(null)
    const lastDist = useRef<number>(0)
    const lastPointer = useRef<{ x: number; y: number } | null>(null)

    const getDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
    }

    const getCenter = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
        return {
            x: (p1.x + p2.x) / 2,
            y: (p1.y + p2.y) / 2,
        }
    }

    // --- MOUSE HANDLERS ---
    const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (isDraggingElementRef.current) return

        // Check if we clicked on a draggable element (traverse up)
        let node: any = e.target
        let isDraggable = false
        while (node) {
            if (node.draggable()) {
                isDraggable = true
                break
            }
            if (node === stageRef.current) break
            node = node.getParent()
        }
        if (isDraggable) return

        lastPointer.current = { x: e.evt.clientX, y: e.evt.clientY }
    }

    const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (!lastPointer.current) return

        e.evt.preventDefault() // prevent scrolling if needed

        const dx = e.evt.clientX - lastPointer.current.x
        const dy = e.evt.clientY - lastPointer.current.y

        setStagePosition(pos => ({
            x: pos.x + dx,
            y: pos.y + dy
        }))

        lastPointer.current = { x: e.evt.clientX, y: e.evt.clientY }
    }

    const handleMouseUp = () => {
        lastPointer.current = null
    }

    // --- TOUCH HANDLERS ---
    const handleTouchStart = (e: Konva.KonvaEventObject<TouchEvent>) => {
        const touches = e.evt.touches

        if (touches.length === 1) {
            if (isDraggingElementRef.current) return

            // Check if hitting draggable element
            let node: any = e.target
            let isDraggable = false
            while (node) {
                if (node.draggable()) {
                    isDraggable = true
                    break
                }
                if (node === stageRef.current) break
                node = node.getParent()
            }
            if (isDraggable) return

            // Start Manual Pan
            const t = touches[0]
            lastPointer.current = { x: t.clientX, y: t.clientY }
        } else if (touches.length === 2) {
            // Start Zooming - clear pan
            lastPointer.current = null

            const p1 = { x: touches[0].clientX, y: touches[0].clientY }
            const p2 = { x: touches[1].clientX, y: touches[1].clientY }

            lastCenter.current = getCenter(p1, p2)
            lastDist.current = getDistance(p1, p2)
        }
    }

    // Updated Manual Zoom logic in handleTouchMove
    const handleTouchMove = (e: Konva.KonvaEventObject<TouchEvent>) => {
        const touches = e.evt.touches
        e.evt.preventDefault()

        if (isDraggingElementRef.current) return

        if (touches.length === 1 && lastPointer.current) {
            // Manual Pan
            const t = touches[0]
            const dx = t.clientX - lastPointer.current.x
            const dy = t.clientY - lastPointer.current.y

            setStagePosition(pos => ({
                x: pos.x + dx,
                y: pos.y + dy
            }))

            lastPointer.current = { x: t.clientX, y: t.clientY }

        } else if (touches.length === 2) {
            // Manual Zoom
            const p1 = { x: touches[0].clientX, y: touches[0].clientY }
            const p2 = { x: touches[1].clientX, y: touches[1].clientY }

            const newDist = getDistance(p1, p2)
            const newCenter = getCenter(p1, p2)

            if (newDist === 0) return

            if (!lastCenter.current || lastDist.current === 0) {
                lastCenter.current = newCenter
                lastDist.current = newDist
                return
            }

            const pointTo = {
                x: (lastCenter.current.x - stagePosition.x) / stageScale,
                y: (lastCenter.current.y - stagePosition.y) / stageScale,
            }

            const scale = stageScale * (newDist / lastDist.current)
            // Limit zoom out - prevent "tiny map"
            const clampedScale = Math.max(0.5, Math.min(5, scale))

            const newPos = {
                x: newCenter.x - pointTo.x * clampedScale,
                y: newCenter.y - pointTo.y * clampedScale,
            }

            setStageScale(clampedScale)
            setStagePosition(newPos)

            lastDist.current = newDist
            lastCenter.current = newCenter
        }
    }

    const downloadURI = (uri: string, name: string) => {
        const link = document.createElement('a')
        link.download = name
        link.href = uri
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    // Function to download SVG string
    const downloadSVG = (svgString: string, name: string) => {
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        downloadURI(url, name)
    }

    const handleSave = async () => {
        if (!stageRef.current) return

        // Deselect any active item to remove Transformer
        setSelectedId(null)

        // Wait a tick for transformer to disappear
        setTimeout(async () => {
            const stage = stageRef.current
            if (!stage) return

            try {
                // Export at high resolution (2000x2000)
                // We reset the stage transform temporarily for clean export
                const oldScale = stage.scaleX()
                const oldPos = stage.position()

                // Reset to origin for export
                stage.scale({ x: 1, y: 1 })
                stage.position({ x: 0, y: 0 })

                // Calculate pixel ratio to achieve ~2000px output
                const targetSize = 2000
                const pixelRatio = targetSize / Math.max(CANVAS_WIDTH, CANVAS_HEIGHT)

                const exportConfig = {
                    pixelRatio: Math.max(pixelRatio, 2), // At least 2x
                    mimeType: 'image/jpeg',
                    quality: 0.92,
                    x: 0,
                    y: 0,
                    width: CANVAS_WIDTH,
                    height: CANVAS_HEIGHT
                }

                // 1. Generate high-res JPG
                const dataUrl = stage.toDataURL(exportConfig)

                // Restore stage transform
                stage.scale({ x: oldScale, y: oldScale })
                stage.position(oldPos)

                // Create JPG File
                const res = await fetch(dataUrl)
                const blob = await res.blob()
                const jpgFile = new File([blob], 'CROQUIS.jpg', { type: 'image/jpeg' })

                // Save to app state
                onSave(jpgFile)

                toast.success('Croquis guardado')
                onClose()

            } catch (err) {
                console.error('Error saving croquis:', err)
                toast.error('Error al guardar la imagen')
            }
        }, 100)
    }

    const handleTouchEnd = (e: Konva.KonvaEventObject<TouchEvent>) => {
        // Reset pointers if fingers lifted
        const touches = e.evt.touches
        if (touches.length === 0) {
            lastPointer.current = null
            lastCenter.current = null
            lastDist.current = 0
        } else if (touches.length === 1) {
            // Transition to pan if one finger remains? 
            // Or safer to just reset to avoid jump
            const t = touches[0]
            lastPointer.current = { x: t.clientX, y: t.clientY }
            lastCenter.current = null
            lastDist.current = 0
        }
    }

    const addToHistory = (newElements: CanvasElement[]) => {
        const newHistory = history.slice(0, historyIndex + 1)
        newHistory.push([...newElements])
        setHistory(newHistory)
        setHistoryIndex(newHistory.length - 1)
    }

    const undo = () => {
        if (historyIndex > 0) {
            setHistoryIndex(historyIndex - 1)
            setElements([...history[historyIndex - 1]])
            setSelectedId(null)
        }
    }

    const redo = () => {
        if (historyIndex < history.length - 1) {
            setHistoryIndex(historyIndex + 1)
            setElements([...history[historyIndex + 1]])
            setSelectedId(null)
        }
    }

    const addElement = (elementType: SketchElementType) => {
        if (elementType.isText) {
            setIsAddingText(true)
            return
        }

        let label: string | undefined
        if (elementType.id === 'car-insured') label = 'A'
        else if (elementType.id === 'car-third') label = 'T'

        // Calculate center of the current viewport in canvas coordinates
        const x = (containerSize.width / 2 - stagePosition.x) / stageScale
        const y = (containerSize.height / 2 - stagePosition.y) / stageScale

        const newElement: CanvasElement = {
            id: `${elementType.id}-${Date.now()}`,
            type: elementType.id,
            x,
            y,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            emoji: elementType.emoji,
            fontSize: elementType.fontSize,
            label
        }

        const newElements = [...elements, newElement]
        setElements(newElements)
        addToHistory(newElements)
        setSelectedId(newElement.id)
        setIsToolbarOpen(false)
    }

    const addTextElement = () => {
        if (!textInput.trim()) return

        const textEl = SKETCH_ELEMENTS.find(e => e.id === 'text')!

        // Calculate center of the current viewport in canvas coordinates
        const x = (containerSize.width / 2 - stagePosition.x) / stageScale
        const y = (containerSize.height / 2 - stagePosition.y) / stageScale

        const newElement: CanvasElement = {
            id: `text-${Date.now()}`,
            type: 'text',
            x,
            y,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            text: textInput,
            emoji: textEl.emoji,
            fontSize: textEl.fontSize
        }

        const newElements = [...elements, newElement]
        setElements(newElements)
        addToHistory(newElements)
        setSelectedId(newElement.id)
        setTextInput('')
        setIsAddingText(false)
        setIsToolbarOpen(false)
    }

    const deleteSelected = () => {
        if (!selectedId) return
        const newElements = elements.filter(e => e.id !== selectedId)
        setElements(newElements)
        addToHistory(newElements)
        setSelectedId(null)
    }

    const rotateSelected = () => {
        if (!selectedId) return
        const newElements = elements.map(e =>
            e.id === selectedId ? { ...e, rotation: (e.rotation + 45) % 360 } : e
        )
        setElements(newElements)
        addToHistory(newElements)
    }

    const rotateSelectedCounterClockwise = () => {
        if (!selectedId) return
        const newElements = elements.map(e =>
            e.id === selectedId ? { ...e, rotation: (e.rotation - 45 + 360) % 360 } : e
        )
        setElements(newElements)
        addToHistory(newElements)
    }

    const flipSelectedHorizontal = () => {
        if (!selectedId) return
        const newElements = elements.map(e => {
            if (e.id === selectedId) {
                const currentScaleX = e.scaleX || 1
                return { ...e, scaleX: currentScaleX * -1 }
            }
            return e
        })
        setElements(newElements)
        addToHistory(newElements)
    }

    const clearAll = () => {
        setElements([])
        addToHistory([])
        setSelectedId(null)
    }

    const handleDragStart = () => {
        isDraggingElementRef.current = true
        setIsDraggingElement(true)
    }

    const handleDragEnd = (id: string, x: number, y: number) => {
        isDraggingElementRef.current = false
        setIsDraggingElement(false)
        const newElements = elements.map(e =>
            e.id === id ? { ...e, x, y } : e
        )
        setElements(newElements)
        addToHistory(newElements)
    }

    const handleTransformEnd = (id: string, rotation: number, scaleX: number, scaleY: number) => {
        const newElements = elements.map(e =>
            e.id === id ? { ...e, rotation, scaleX, scaleY } : e
        )
        setElements(newElements)
        addToHistory(newElements)
    }



    const renderElement = (element: CanvasElement) => {
        const isSelected = selectedId === element.id

        if (element.type === 'text') {
            return (
                <Text
                    key={element.id}
                    id={element.id}
                    x={element.x}
                    y={element.y}
                    text={element.text || ''}
                    fontSize={element.fontSize}
                    fontStyle="bold"
                    fill="#1f2937"
                    rotation={element.rotation}
                    scaleX={element.scaleX || 1}
                    scaleY={element.scaleY || 1}
                    draggable
                    onClick={() => setSelectedId(element.id)}
                    onTap={() => setSelectedId(element.id)}
                    onDragStart={handleDragStart}
                    onDragEnd={(e) => handleDragEnd(element.id, e.target.x(), e.target.y())}
                    padding={10}
                    align="center"
                    hitStrokeWidth={20}
                />
            )
        }

        if (element.type === 'arrow') {
            return (
                <Arrow
                    key={element.id}
                    id={element.id}
                    x={element.x}
                    y={element.y}
                    points={[0, 0, 60, 0]}
                    rotation={element.rotation}
                    scaleX={element.scaleX || 1}
                    pointerLength={15}
                    pointerWidth={15}
                    fill="#0ea5e9"
                    stroke="#0ea5e9"
                    strokeWidth={6}
                    draggable
                    onClick={() => setSelectedId(element.id)}
                    onTap={() => setSelectedId(element.id)}
                    onDragStart={handleDragStart}
                    onDragEnd={(e) => handleDragEnd(element.id, e.target.x(), e.target.y())}
                    onTransformEnd={(e) => {
                        const node = e.target
                        handleTransformEnd(element.id, node.rotation(), node.scaleX(), node.scaleY())
                    }}
                    hitStrokeWidth={20}
                />
            )
        }

        return (
            <Group
                key={element.id}
                id={element.id}
                x={element.x}
                y={element.y}
                rotation={element.rotation}
                scaleX={element.scaleX || 1}
                scaleY={element.scaleY || 1}
                draggable
                onClick={() => setSelectedId(element.id)}
                onTap={() => setSelectedId(element.id)}
                onDragStart={handleDragStart}
                onDragEnd={(e) => handleDragEnd(element.id, e.target.x(), e.target.y())}
                onTransformEnd={(e) => {
                    const node = e.target
                    handleTransformEnd(element.id, node.rotation(), node.scaleX(), node.scaleY())
                }}
            >
                {/* Invisible hit area for easier touch targeting */}
                <Rect
                    x={-element.fontSize / 2 - 20}
                    y={-element.fontSize / 2 - 20}
                    width={element.fontSize + 40}
                    height={element.fontSize + 40}
                    fill="transparent"
                />

                {isSelected && (
                    <Rect
                        x={-element.fontSize / 2 - 10}
                        y={-element.fontSize / 2 - 10}
                        width={element.fontSize + 20}
                        height={element.fontSize + 20}
                        stroke="#3b82f6"
                        strokeWidth={4}
                        cornerRadius={8}
                        dash={[8, 4]}
                    />
                )}

                <Text
                    text={element.emoji}
                    fontSize={element.fontSize}
                    offsetX={element.fontSize / 2}
                    offsetY={element.fontSize / 2}
                />

                {element.label && (
                    <>
                        <Rect
                            x={element.fontSize / 2 - 8}
                            y={-element.fontSize / 2 - 8}
                            width={24}
                            height={24}
                            fill={element.type === 'car-insured' ? '#22c55e' : '#ef4444'}
                            cornerRadius={12}
                            stroke="white"
                            strokeWidth={3}
                        />
                        <Text
                            text={element.label}
                            x={element.fontSize / 2}
                            y={-element.fontSize / 2 - 2}
                            fontSize={16}
                            fontStyle="bold"
                            fill="white"
                            align="center"
                            verticalAlign="middle"
                        />
                    </>
                )}
            </Group>
        )
    }

    // Use portal to break out of parent stacking contexts
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    if (!isOpen || !mounted) return null

    // Use window width for mobile detection, not container size
    const isMobile = windowWidth < 768

    // Portal content
    const modalContent = (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-[99999] flex flex-col bg-slate-950 overflow-hidden w-screen h-screen"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: '100vw',
                    height: '100dvh',
                    margin: 0,
                    padding: 0
                }}
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                }}
            >
                {/* Header - Minimal and clean */}
                <div className="flex items-center justify-between px-4 h-14 bg-white/95 backdrop-blur-xl border-b border-slate-200 text-slate-900 shrink-0 z-50 pt-safe font-sans">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                            <Pencil className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-base font-extrabold tracking-tight text-slate-800">Editor de Croquis</h2>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <Button type="button" variant="ghost" size="icon" onClick={undo} disabled={historyIndex <= 0} className="h-9 w-9 hover:bg-slate-100 rounded-full">
                            <Undo2 className="h-4 w-4" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" onClick={redo} disabled={historyIndex >= history.length - 1} className="h-9 w-9 hover:bg-slate-100 rounded-full">
                            <Redo2 className="h-4 w-4" />
                        </Button>
                        <div className="w-px h-5 bg-slate-200 mx-1.5" />
                        <Button type="button" variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-slate-900 h-9 w-9 hover:bg-slate-100 rounded-full">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Main content area - fills all available space */}
                <div className="flex-1 flex overflow-hidden relative w-full h-full">
                    {/* Unified Actions Toolbar (Desktop) */}
                    {!isMobile && (
                        <div className="absolute left-4 top-4 flex flex-col gap-2 z-20">
                            <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-2 flex flex-col gap-1">
                                <Button type="button" variant="outline" size="sm" onClick={undo} disabled={historyIndex <= 0} className="h-9 px-3" title="Deshacer">
                                    <Undo2 className="h-4 w-4 mr-1.5" /> <span className="text-xs">Deshacer</span>
                                </Button>
                                <Button type="button" variant="outline" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1} className="h-9 px-3" title="Rehacer">
                                    <Redo2 className="h-4 w-4 mr-1.5" /> <span className="text-xs">Rehacer</span>
                                </Button>
                                <div className="h-px bg-gray-200 my-1 mx-2" />
                                <Button type="button" variant="outline" size="sm" onClick={clearAll} className="h-9 px-3 text-red-600 hover:text-red-700 hover:bg-red-50" title="Limpiar todo">
                                    <Eraser className="h-4 w-4 mr-1.5" /> <span className="text-xs">Limpiar</span>
                                </Button>
                            </div>

                            {selectedId && (
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-gray-200 p-2 flex flex-col gap-1"
                                >
                                    <Button type="button" variant="ghost" size="sm" onClick={rotateSelectedCounterClockwise} className="h-9 px-3 justify-start">
                                        <RotateCcw className="h-4 w-4 mr-1.5" /> <span className="text-xs">Rotar -45°</span>
                                    </Button>
                                    <Button type="button" variant="ghost" size="sm" onClick={rotateSelected} className="h-9 px-3 justify-start">
                                        <RotateCw className="h-4 w-4 mr-1.5" /> <span className="text-xs">Rotar +45°</span>
                                    </Button>
                                    <Button type="button" variant="ghost" size="sm" onClick={flipSelectedHorizontal} className="h-9 px-3 justify-start">
                                        <FlipHorizontal className="h-4 w-4 mr-1.5" /> <span className="text-xs">Voltear</span>
                                    </Button>
                                    <Button type="button" variant="ghost" size="sm" onClick={deleteSelected} className="h-9 px-3 justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                                        <Trash2 className="h-4 w-4 mr-1.5" /> <span className="text-xs">Eliminar</span>
                                    </Button>
                                </motion.div>
                            )}
                        </div>
                    )}

                    {/* Canvas Area - fills remaining space */}
                    <div
                        ref={containerRef}
                        className={`absolute inset-0 w-full h-full bg-gray-800 touch-none select-none ${debugMode ? 'border-2 border-red-500' : ''}`}
                        style={{
                            minHeight: 0,
                            touchAction: 'none',
                            WebkitTouchCallout: 'none',
                            WebkitUserSelect: 'none' // Prevent default touch behaviors
                        }}
                    >
                        {isLoadingMap ? (
                            <div className="flex flex-col items-center justify-center h-full text-white">
                                <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mb-3"></div>
                                <p className="text-sm">Cargando mapa...</p>
                            </div>
                        ) : (
                            <Stage
                                ref={stageRef}
                                width={containerSize.width}
                                height={containerSize.height}
                                scaleX={stageScale}
                                scaleY={stageScale}
                                x={stagePosition.x}
                                y={stagePosition.y}
                                draggable={false}
                                onWheel={handleWheel}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                                onClick={(e) => {
                                    if (e.target === stageRef.current) {
                                        setSelectedId(null)
                                    }
                                }}
                                onTap={(e) => {
                                    if (e.target === stageRef.current) {
                                        setSelectedId(null)
                                    }
                                }}
                            >
                                <Layer>
                                    {/* VECTOR MAP BACKGROUND */}
                                    {mapPaths.length > 0 ? (
                                        <Group>
                                            {/* Background Rect */}
                                            <Rect x={-5000} y={-5000} width={10000} height={10000} fill="#e5e7eb" />

                                            {mapPaths.map((path, i) => {
                                                if (path.type === 'shape' || !path.type) {
                                                    return (
                                                        <Line
                                                            key={i}
                                                            points={path.points}
                                                            stroke={path.stroke}
                                                            strokeWidth={path.strokeWidth}
                                                            fill={path.fill}
                                                            closed={path.closed}
                                                            lineCap="round"
                                                            lineJoin="round"
                                                        />
                                                    )
                                                } else if (path.type === 'text-path') {
                                                    return (
                                                        <TextPath
                                                            key={i}
                                                            data={path.data}
                                                            fill="#4b5563"
                                                            text={path.text}
                                                            fontSize={10}
                                                            fontFamily="Arial"
                                                            fontStyle="bold"
                                                            align="center"
                                                            baseline="middle"
                                                            listening={false}
                                                        />
                                                    )
                                                } else if (path.type === 'label') {
                                                    // House number - only show if zoomed in enough?
                                                    // For now show all, maybe scale is enough control
                                                    if (stageScale < 0.8) return null
                                                    return (
                                                        <Text
                                                            key={i}
                                                            x={path.x}
                                                            y={path.y}
                                                            text={path.text}
                                                            fontSize={path.fontSize}
                                                            fill={path.fill}
                                                            align="center"
                                                            listening={false}
                                                        />
                                                    )
                                                } else if (path.type === 'poi') {
                                                    if (stageScale < 0.6) return null
                                                    return (
                                                        <Group key={i} x={path.x} y={path.y} listening={false}>
                                                            <Circle radius={3} fill="#60a5fa" />
                                                            <Text
                                                                y={4}
                                                                text={path.text}
                                                                fontSize={9}
                                                                fill="#1e3a8a"
                                                                align="center"
                                                                offsetX={path.text.length * 2} // approximate center
                                                            />
                                                        </Group>
                                                    )
                                                }
                                                return null
                                            })}
                                        </Group>
                                    ) : (
                                        mapImage && (
                                            <KonvaImage
                                                image={mapImage}
                                                width={CANVAS_WIDTH}
                                                height={CANVAS_HEIGHT}
                                            />
                                        )
                                    )}

                                    {/* SKETCH ELEMENTS */}
                                    {elements.map((element, i) => renderElement(element))}

                                    <Transformer
                                        ref={transformerRef}
                                        boundBoxFunc={(oldBox, newBox) => {
                                            if (newBox.width < 5 || newBox.height < 5) {
                                                return oldBox
                                            }
                                            return newBox
                                        }}
                                    />
                                </Layer>
                            </Stage>
                        )}
                    </div>
                </div>

                {/* Debug Information Overlay */}
                {debugMode && (
                    <div className="absolute top-4 left-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-20">
                        <div>Container: {containerSize.width}x{containerSize.height}</div>
                        <div>Window: {windowWidth}px</div>
                        <div>Scale: {stageScale.toFixed(3)}</div>
                        <div>Position: ({stagePosition.x.toFixed(1)}, {stagePosition.y.toFixed(1)})</div>
                        <div>Canvas: {CANVAS_WIDTH}x{CANVAS_HEIGHT}</div>
                        <div>Mobile: {windowWidth < 768 ? 'Yes' : 'No'}</div>
                        {selectedId && (
                            <div className="mt-2 pt-2 border-t border-white/30">
                                <div>Selected: {selectedId}</div>
                                {elements.find(e => e.id === selectedId) && (
                                    <>
                                        <div>Rotation: {elements.find(e => e.id === selectedId)?.rotation}°</div>
                                        <div>ScaleX: {elements.find(e => e.id === selectedId)?.scaleX || 1}</div>
                                        <div>Flipped: {(elements.find(e => e.id === selectedId)?.scaleX || 1) < 0 ? 'Yes' : 'No'}</div>
                                    </>
                                )}
                            </div>
                        )}
                        <button
                            onClick={() => setDebugMode(false)}
                            className="mt-2 px-2 py-1 bg-red-600 rounded text-xs"
                        >
                            Close Debug
                        </button>
                    </div>
                )}

                {/* Debug Toggle Button */}
                <button
                    onClick={() => setDebugMode(!debugMode)}
                    className="absolute top-4 right-4 bg-black/60 text-white px-2 py-1 rounded text-xs z-20"
                >
                    {debugMode ? 'Debug ON' : 'Debug OFF'}
                </button>

                {/* Zoom Controls - Fixed position */}
                <div className="absolute right-4 bottom-[calc(8rem+env(safe-area-inset-bottom))] md:bottom-8 flex flex-col gap-3 z-10">
                    <Button type="button" size="icon" onClick={zoomIn} className="bg-white/95 hover:bg-white shadow-2xl h-12 w-12 rounded-2xl border border-slate-200 active:scale-95 transition-transform">
                        <ZoomIn className="h-6 w-6 text-slate-700" />
                    </Button>
                    <Button type="button" size="icon" onClick={zoomOut} className="bg-white/95 hover:bg-white shadow-2xl h-12 w-12 rounded-2xl border border-slate-200 active:scale-95 transition-transform">
                        <ZoomOut className="h-6 w-6 text-slate-700" />
                    </Button>
                    <Button type="button" variant="secondary" size="sm" onClick={resetZoom} className="bg-white/95 hover:bg-white shadow-2xl text-[10px] font-black uppercase tracking-tighter text-slate-700 h-10 rounded-2xl px-2 active:scale-95 transition-transform border border-slate-200">
                        Ajustar
                    </Button>
                </div>

                {/* Selection Controls - Floating buttons when element is selected (mobile only) */}
                {isMobile && selectedId && !isToolbarOpen && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0, x: -20 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        exit={{ scale: 0, opacity: 0, x: -20 }}
                        className="absolute left-4 bottom-[calc(8rem+env(safe-area-inset-bottom))] flex flex-col gap-3 z-10"
                    >
                        <Button
                            type="button"
                            size="icon"
                            onClick={rotateSelectedCounterClockwise}
                            className="bg-purple-600 hover:bg-purple-500 text-white shadow-2xl h-14 w-14 rounded-2xl border-2 border-white/20 active:scale-95 transition-transform"
                            title="Rotar -45°"
                        >
                            <RotateCcw className="h-7 w-7" />
                        </Button>
                        <Button
                            type="button"
                            size="icon"
                            onClick={rotateSelected}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xl h-14 w-14 rounded-2xl border-2 border-white/20 active:scale-95 transition-transform"
                            title="Rotar +45°"
                        >
                            <RotateCw className="h-7 w-7" />
                        </Button>
                        <Button
                            type="button"
                            size="icon"
                            onClick={flipSelectedHorizontal}
                            className="bg-amber-600 hover:bg-amber-500 text-white shadow-2xl h-14 w-14 rounded-2xl border-2 border-white/20 active:scale-95 transition-transform"
                            title="Voltear horizontalmente"
                        >
                            <FlipHorizontal className="h-7 w-7" />
                        </Button>
                        <Button
                            type="button"
                            size="icon"
                            onClick={deleteSelected}
                            className="bg-rose-600 hover:bg-rose-500 text-white shadow-2xl h-14 w-14 rounded-2xl border-2 border-white/20 active:scale-95 transition-transform"
                            title="Eliminar elemento"
                        >
                            <Trash2 className="h-7 w-7" />
                        </Button>
                    </motion.div>
                )}
                {/* Unified Bottom Floating Controls */}
                {!isToolbarOpen && (
                    <div className="absolute bottom-[2rem] md:bottom-10 left-0 right-0 flex justify-center px-2 sm:px-4 pointer-events-none z-[110] pb-safe">
                        <div className="flex items-center gap-1 sm:gap-2 bg-slate-900/90 backdrop-blur-2xl p-1.5 sm:p-2 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white/10 pointer-events-auto ring-1 ring-white/5">
                            <Button
                                type="button"
                                onClick={() => setIsToolbarOpen(true)}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full h-9 sm:h-12 px-2.5 sm:px-5 flex items-center gap-1 sm:gap-2 shadow-xl shadow-indigo-600/20 transition-all active:scale-95 font-bold uppercase tracking-tight sm:tracking-wide text-[10px] sm:text-xs"
                            >
                                <Plus className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                                <span>Agregar</span>
                            </Button>

                            <Button
                                type="button"
                                onClick={handleSave}
                                disabled={elements.length === 0}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full h-9 sm:h-12 px-2.5 sm:px-5 flex items-center gap-1 sm:gap-2 shadow-xl shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale font-bold uppercase tracking-tight sm:tracking-wide text-[10px] sm:text-xs"
                            >
                                <Save className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                                <span>Guardar</span>
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                onClick={onClose}
                                className="hover:bg-white/10 text-white/70 hover:text-white rounded-full h-9 sm:h-12 px-2.5 sm:px-5 flex items-center gap-1 sm:gap-2 transition-all active:scale-95 font-bold uppercase tracking-tight sm:tracking-wide text-[10px] sm:text-xs"
                            >
                                <X className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
                                <span>Cerrar</span>
                            </Button>
                        </div>
                    </div>
                )}

                {/* Mobile Element Selection Drawer */}
                <AnimatePresence>
                    {isToolbarOpen && (
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 max-h-[80vh] overflow-y-auto pb-safe-bottom"
                        >
                            {/* Handle bar */}
                            <div className="sticky top-0 bg-white rounded-t-3xl pt-2 pb-1 z-10">
                                <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-3" />
                                <div className="border-b flex justify-between items-center px-4 py-2">
                                    <span className="font-bold text-gray-800 text-lg">Seleccionar Elemento</span>
                                    <Button type="button" variant="ghost" size="icon" onClick={() => setIsToolbarOpen(false)} className="h-10 w-10">
                                        <X className="h-6 w-6" />
                                    </Button>
                                </div>
                            </div>

                            <div className="p-4 space-y-6">
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                    {SKETCH_ELEMENTS.map((element) => (
                                        <motion.button
                                            type="button"
                                            key={element.id}
                                            onClick={() => addElement(element)}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex flex-col items-center p-3 md:p-4 rounded-2xl border-2 border-gray-100 active:border-blue-500 active:bg-blue-50 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                                        >
                                            <span className="text-3xl md:text-4xl">{element.emoji}</span>
                                            <span className="text-[10px] md:text-xs text-gray-600 mt-2 text-center leading-tight font-medium">{element.name}</span>
                                        </motion.button>
                                    ))}
                                </div>

                                {isAddingText && (
                                    <div className="p-4 bg-blue-50 rounded-2xl space-y-3 border border-blue-100 shadow-inner">
                                        <Input
                                            value={textInput}
                                            onChange={(e) => setTextInput(e.target.value)}
                                            placeholder="Escribe el texto aquí..."
                                            autoFocus
                                            className="text-base h-12 bg-white border-blue-200"
                                        />
                                        <div className="flex gap-2">
                                            <Button type="button" onClick={addTextElement} className="flex-1 h-12 text-base bg-blue-600 hover:bg-blue-700">Agregar Texto</Button>
                                            <Button type="button" variant="outline" onClick={() => setIsAddingText(false)} className="h-12 px-6 border-blue-200">Cancelar</Button>
                                        </div>
                                    </div>
                                )}

                                <div className="h-2" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Desktop footer with legend */}
                {!isMobile && (

                    <div className="flex items-center justify-center gap-6 px-4 py-2 bg-slate-900 border-t border-slate-800 text-xs text-slate-400 select-none z-50">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span>Asegurado</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            <span>Tercero</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px]">Scroll</span>
                            <span>Zoom</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[10px]">Arrastrar elemento</span>
                            <span>Mover</span>
                        </div>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    )

    // Render portal
    // @ts-ignore - createPortal is available in client components but TS might complain about document
    return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null
}
