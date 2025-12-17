import { VenueMap as VenueMapType } from '../types';

interface VenueMapProps {
  venueMap?: VenueMapType;
  simplifiedMode?: boolean;
  language: 'es' | 'en';
}

export function VenueMap({ venueMap, simplifiedMode, language }: VenueMapProps) {
  if (!venueMap || !venueMap.zones || venueMap.zones.length === 0) {
    return null;
  }

  const translations = {
    es: {
      venueMapTitle: 'Mapa del Recinto',
      legend: 'Leyenda',
    },
    en: {
      venueMapTitle: 'Venue Map',
      legend: 'Legend',
    }
  };

  const t = translations[language];

  return (
    <div className="mb-8">
      <h3 className={`mb-4 ${simplifiedMode ? 'text-xl' : ''}`}>{t.venueMapTitle}</h3>
      
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
        {/* SVG Map */}
        <div className="w-full aspect-[16/10] mb-6">
          <svg 
            viewBox="0 0 800 500" 
            className="w-full h-full"
            style={{ maxHeight: '400px' }}
          >
            {/* Background */}
            <rect x="0" y="0" width="800" height="500" fill="#f9fafb" />
            
            {/* Escenario (Stage) */}
            <rect x="250" y="20" width="300" height="80" fill="#1f2937" />
            <text x="400" y="65" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">
              ESCENARIO
            </text>
            
            {/* Zonas de entradas */}
            {venueMap.zones.map((zone) => {
              // Generar posiciones basadas en el ID de la zona para que sea predecible
              let path = '';
              
              if (zone.id.includes('frontstage') || zone.name.toLowerCase().includes('frontstage')) {
                // Zona frontstage - cerca del escenario
                path = 'M 250 120 L 550 120 L 550 220 L 250 220 Z';
              } else if (zone.id.includes('inferior') || zone.name.toLowerCase().includes('inferior')) {
                // Grada inferior - medio
                path = 'M 200 240 L 600 240 L 620 350 L 180 350 Z';
              } else if (zone.id.includes('media') || zone.name.toLowerCase().includes('media')) {
                // Grada media
                path = 'M 180 360 L 620 360 L 650 450 L 150 450 Z';
              } else if (zone.id.includes('superior') || zone.name.toLowerCase().includes('superior')) {
                // Grada superior - atrás
                path = 'M 100 460 L 700 460 L 720 480 L 80 480 Z';
              } else if (zone.id.includes('vip')) {
                // Zona VIP - lateral
                path = 'M 50 120 L 200 120 L 200 350 L 50 350 Z';
              } else if (zone.id.includes('lateral')) {
                // Lateral derecho
                path = 'M 600 120 L 750 120 L 750 350 L 600 350 Z';
              } else {
                // Zona genérica por defecto
                const index = venueMap.zones.indexOf(zone);
                const y = 120 + (index * 100);
                path = `M 200 ${y} L 600 ${y} L 600 ${y + 80} L 200 ${y + 80} Z`;
              }
              
              return (
                <g key={zone.id}>
                  <path
                    d={path}
                    fill={zone.color}
                    opacity="0.7"
                    stroke={zone.color}
                    strokeWidth="2"
                  />
                  <text
                    x={zone.id.includes('vip') ? 125 : zone.id.includes('lateral') ? 675 : 400}
                    y={
                      zone.id.includes('frontstage') ? 170 :
                      zone.id.includes('inferior') ? 295 :
                      zone.id.includes('media') ? 405 :
                      zone.id.includes('superior') ? 470 :
                      zone.id.includes('vip') ? 235 :
                      zone.id.includes('lateral') ? 235 :
                      170 + (venueMap.zones.indexOf(zone) * 100)
                    }
                    textAnchor="middle"
                    fill="#1f2937"
                    fontSize={simplifiedMode ? "16" : "14"}
                    fontWeight="600"
                  >
                    {zone.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Leyenda */}
        <div className="border-t pt-4">
          <p className={`mb-3 text-gray-600 ${simplifiedMode ? 'text-lg' : 'text-sm'}`}>
            {t.legend}:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {venueMap.zones.map((zone) => (
              <div key={zone.id} className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded border-2"
                  style={{ backgroundColor: zone.color, borderColor: zone.color }}
                />
                <span className={`text-gray-700 ${simplifiedMode ? 'text-lg' : 'text-sm'}`}>
                  {zone.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
