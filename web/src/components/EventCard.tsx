import { Calendar, MapPin } from 'lucide-react';
import { Event } from '../types';
import { Link } from './Link';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface EventCardProps {
  event: Event;
  language: 'es' | 'en';
  simplifiedMode: boolean;
}

export function EventCard({ event, language, simplifiedMode }: EventCardProps) {
  const formatDate = (date: string, time: string) => {
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    };
    const formattedDate = d.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', options);
    return `${formattedDate}, ${time}`;
  };

  const translations = {
    es: {
      from: 'A partir de',
    },
    en: {
      from: 'From',
    }
  };

  const t = translations[language];

  return (
    <Link href={`/event/${event.id}`}>
      <div className={`bg-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
        simplifiedMode ? 'p-4' : ''
      }`}>
        <div className="aspect-video w-full overflow-hidden bg-gray-200">
          {event.image ? (
            <img 
              src={event.image} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#00A859] flex items-center justify-center text-white text-opacity-50">
              <Calendar className="w-16 h-16" />
            </div>
          )}
        </div>
        <div className={simplifiedMode ? 'p-4' : 'p-6'}>
          <h3 className={simplifiedMode ? 'text-xl mb-2' : 'mb-2'}>{event.title}</h3>
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className={simplifiedMode ? 'text-lg' : 'text-sm'}>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-[#00A859] mb-3">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span className={simplifiedMode ? 'text-lg' : 'text-sm'}>{formatDate(event.date, event.time)}</span>
          </div>
          <p className={`text-gray-800 ${simplifiedMode ? 'text-xl' : 'text-base'}`}>
            <span className="text-gray-600">{t.from}</span>{' '}
            <span>{event.price}€</span>
          </p>
        </div>
      </div>
    </Link>
  );
}