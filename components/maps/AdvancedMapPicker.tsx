'use client'

import React, { useState, useEffect, memo } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { MapPin, Search, Loader2, Navigation, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default icon issue
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png'
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png'
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

interface AddressData {
  fullAddress: string
  street: string
  streetNumber: string
  city: string
  province: string
  postalCode?: string
  country: string
}

interface AdvancedMapPickerProps {
  location: { lat: number; lng: number } | null
  onLocationSelect: (lat: number, lng: number, address?: AddressData) => void
}

interface LocationMarkerProps {
  location: { lat: number; lng: number } | null
  onLocationSelect: (lat: number, lng: number) => void
  onAddressFound: (address: AddressData) => void
}

const LocationMarker = memo(function LocationMarker({ location, onLocationSelect, onAddressFound }: LocationMarkerProps) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng
      onLocationSelect(lat, lng)
      fetchAddress(lat, lng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
        { headers: { 'Accept-Language': 'es' } }
      )
      const data = await response.json()

      const address: AddressData = {
        fullAddress: data.display_name,
        street: data.address.road || '',
        streetNumber: data.address.house_number || '',
        city: data.address.city || data.address.town || data.address.village || '',
        province: data.address.state || '',
        country: data.address.country || '',
        postalCode: data.address.postcode
      }

      onAddressFound(address)
    } catch (error) {
      console.error('Error fetching address:', error)
      toast.error('No se pudo obtener la dirección')
    }
  }

  useEffect(() => {
    if (location) {
      map.flyTo(location, map.getZoom())
    }
  }, [location, map])

  return location ? <Marker position={location} /> : null
})

export const AdvancedMapPicker = memo(function AdvancedMapPicker({ location, onLocationSelect }: AdvancedMapPickerProps) {
  const defaultCenter = { lat: -38.9516, lng: -68.0591 } // Neuquén Capital
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<AddressData | null>(null)

  const handleSearch = async () => {
    if (!searchQuery) return

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&addressdetails=1&countrycodes=ar&limit=5`,
        { headers: { 'Accept-Language': 'es' } }
      )
      const data = await response.json()
      setSearchResults(data)
    } catch (error) {
      console.error('Error searching:', error)
      toast.error('Error en la búsqueda')
    } finally {
      setIsSearching(false)
    }
  }

  const selectSearchResult = (result: any) => {
    const lat = parseFloat(result.lat)
    const lng = parseFloat(result.lon)

    const address: AddressData = {
      fullAddress: result.display_name,
      street: result.address.road || '',
      streetNumber: result.address.house_number || '',
      city: result.address.city || result.address.town || result.address.village || '',
      province: result.address.state || '',
      country: result.address.country || '',
      postalCode: result.address.postcode
    }

    setSelectedAddress(address)
    onLocationSelect(lat, lng, address)
    setSearchResults([])
    setSearchQuery(result.display_name)
  }

  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocalización no soportada en este navegador')
      return
    }

    setIsGettingLocation(true)
    const toastId = toast.loading('Solicitando permisos de ubicación...')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        onLocationSelect(latitude, longitude)

        toast.loading('Obteniendo dirección...', { id: toastId })

        // Fetch address for current location
        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
          { headers: { 'Accept-Language': 'es' } }
        )
          .then(res => res.json())
          .then(data => {
            const address: AddressData = {
              fullAddress: data.display_name,
              street: data.address.road || '',
              streetNumber: data.address.house_number || '',
              city: data.address.city || data.address.town || data.address.village || '',
              province: data.address.state || '',
              country: data.address.country || '',
              postalCode: data.address.postcode
            }
            setSelectedAddress(address)
            onLocationSelect(latitude, longitude, address)
            toast.success('Ubicación actualizada', { id: toastId })
            setIsGettingLocation(false)
          })
          .catch(() => {
            toast.error('Ubicación obtenida, pero no pudimos encontrar la dirección exacta', { id: toastId })
            setIsGettingLocation(false)
          })
      },
      (error) => {
        setIsGettingLocation(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Permiso de ubicación denegado. Por favor, habilítalo en la configuración de tu navegador o dispositivo.', { id: toastId })
            break
          case error.POSITION_UNAVAILABLE:
            toast.error('La información de ubicación no está disponible en este momento.', { id: toastId })
            break
          case error.TIMEOUT:
            toast.error('Se agotó el tiempo de espera para obtener la ubicación.', { id: toastId })
            break
          default:
            toast.error('Ocurrió un error inesperado al obtener la ubicación.', { id: toastId })
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    )
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative z-10">
        <div className="relative flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Buscar dirección (ej: Avenida Argentina 300, Neuquén)"
              className="pl-10 pr-10 h-10 rounded-xl border-gray-300 focus:border-blue-500 bg-white shadow-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setSearchResults([])
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <Button
            type="button"
            onClick={handleSearch}
            disabled={isSearching}
            size="sm"
          >
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Buscar'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={getUserLocation}
            title="Mi Ubicación"
            disabled={isGettingLocation}
          >
            {isGettingLocation ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Navigation className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-h-60 overflow-y-auto">
            {searchResults.map((result) => (
              <button
                type="button"
                key={result.place_id}
                onClick={() => selectSearchResult(result)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 transition-colors border-b last:border-0 text-sm"
              >
                <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
                <span className="text-gray-700 truncate">{result.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div className="h-[400px] w-full rounded-xl overflow-hidden border-2 border-gray-200 shadow-md relative z-0">
        <MapContainer
          center={location || defaultCenter}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker
            location={location}
            onLocationSelect={(lat, lng) => onLocationSelect(lat, lng)}
            onAddressFound={setSelectedAddress}
          />
        </MapContainer>
      </div>

      {/* Selected Address Card */}
      {selectedAddress && (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-500 text-white p-2 rounded-lg shadow-sm">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 mb-1">Dirección Seleccionada</p>
              <p className="text-sm text-gray-700">
                {selectedAddress.street} {selectedAddress.streetNumber}
                {selectedAddress.city && `, ${selectedAddress.city}`}
                {selectedAddress.province && `, ${selectedAddress.province}`}
                {selectedAddress.country && `, ${selectedAddress.country}`}
              </p>
              {location && (
                <div className="mt-2 flex space-x-2 text-xs text-gray-500">
                  <span>Lat: {location.lat.toFixed(6)}</span>
                  <span>Lng: {location.lng.toFixed(6)}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
})