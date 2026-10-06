import { MapPin } from 'lucide-react'

export function coordinatesFor(report) {
  const rawLatitude = report.latitude ?? report.lat
  const rawLongitude = report.longitude ?? report.lon ?? report.lng
  const latitude = Number(rawLatitude)
  const longitude = Number(rawLongitude)
  if (rawLatitude === null || rawLatitude === undefined || rawLatitude === '' || rawLongitude === null || rawLongitude === undefined || rawLongitude === '') return legacyCoordinates(report)
  if (Number.isFinite(latitude) && Number.isFinite(longitude)) return { latitude, longitude }
  return legacyCoordinates(report)
}

function legacyCoordinates(report) {
  const legacy = String(report.adresse || '').match(/latitude\s*(-?\d+(?:\.\d+)?)[,\s]+longitude\s*(-?\d+(?:\.\d+)?)/i)
  return legacy ? { latitude: Number(legacy[1]), longitude: Number(legacy[2]) } : null
}

export function humanAddress(report) {
  const address = String(report.adresse || '').trim()
  if (!address || /^latitude\s*-?\d/i.test(address)) return 'Adresse non renseignée'
  return address
}

export default function ReportLocation({ report, className = '' }) {
  const coordinates = coordinatesFor(report)
  return (
    <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 ${className}`}>
      <MapPin className="h-4 w-4 shrink-0 text-[#2B4C9B]" aria-hidden="true" />
      <span className="min-w-0">{humanAddress(report)}</span>
      {coordinates && <a className="inline-flex items-center gap-1 text-xs font-semibold text-[#2B4C9B] underline-offset-2 hover:underline dark:text-blue-300" href={`https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`} target="_blank" rel="noreferrer"><MapPin className="h-4 w-4" aria-hidden="true" />Voir sur la carte</a>}
    </div>
  )
}
