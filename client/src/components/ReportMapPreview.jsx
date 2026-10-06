import { coordinatesFor, humanAddress } from './ReportLocation.jsx'

export default function ReportMapPreview({ report }) {
  const coordinates = coordinatesFor(report)
  const place = coordinates
    ? `${coordinates.latitude},${coordinates.longitude}`
    : humanAddress(report)

  if (!place || place === 'Adresse non renseignée') return null

  const query = encodeURIComponent(place)
  const embedUrl = `https://maps.google.com/maps?q=${query}&z=16&output=embed`
  const mapsUrl = `https://www.google.com/maps?q=${query}`

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-[#1B1F3B]" aria-label="Aperçu de la localisation">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-300">Aperçu Google Maps</h2>
        <a className="shrink-0 text-xs font-semibold text-[#2B4C9B] underline-offset-2 hover:underline dark:text-blue-300" href={mapsUrl} target="_blank" rel="noreferrer">Ouvrir dans Maps</a>
      </div>
      <iframe
        title="Aperçu Google Maps du lieu du signalement"
        src={embedUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block aspect-[16/9] w-full border-0"
      />
    </section>
  )
}
