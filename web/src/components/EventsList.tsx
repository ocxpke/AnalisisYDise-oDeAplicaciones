import { useState, useEffect } from 'react';
import { Ticket, Gift, Utensils, Music } from 'lucide-react';
import { EventCard } from './EventCard';
import { useEvents } from '../contexts/EventsContext';
import { EventType } from '../types';

interface EventsListProps {
  language: 'es' | 'en';
  simplifiedMode: boolean;
}

export function EventsList({ language, simplifiedMode }: EventsListProps) {
  const { events, refreshEvents } = useEvents();

  // Refrescar eventos cada vez que se muestra el componente
  useEffect(() => {
    refreshEvents();
  }, []);

  const translations = {
    es: {
      upcomingEvents: 'Próximos Eventos',
      noEvents: 'No hay eventos disponibles.',
    },
    en: {
      upcomingEvents: 'Upcoming Events',
      noEvents: 'No events available.',
    }
  };

  const t = translations[language];

  return (
    <div className={`max-w-7xl mx-auto ${simplifiedMode ? 'px-6 py-8' : 'px-4 py-12'}`}>
      {/* Events Grid */}
      <div className="mb-6">
        <h2 className={simplifiedMode ? 'text-2xl' : ''}>{t.upcomingEvents}</h2>
      </div>
      
      {events.length > 0 ? (
        <div className={`grid ${simplifiedMode ? 'grid-cols-1 gap-6' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
          {events.map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              language={language}
              simplifiedMode={simplifiedMode}
            />
          ))}
        </div>
      ) : (
        <div className={`text-center text-gray-500 py-12 ${simplifiedMode ? 'text-xl' : ''}`}>
          {t.noEvents}
        </div>
      )}
    </div>
  );
}