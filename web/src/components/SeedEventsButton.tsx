import { useState } from 'react';
import { useEvents } from '../contexts/EventsContext';
import { Event } from '../types';

export const SeedEventsButton = () => {
  const { addEvent, events } = useEvents();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const sampleEvents: Omit<Event, 'id'>[] = [
    {
      title: 'Concierto Benéfico Navideño',
      date: new Date('2025-12-20T20:00:00').toISOString(),
      time: '20:00',
      location: 'Auditorio Príncipe de Asturias, Torremolinos',
      price: 25,
      image: '',
      description: 'Gran concierto benéfico con artistas locales para apoyar los cuidados paliativos de CUDECA',
      type: 'concierto',
      capacity: 500,
      sold: 0,
      availableTickets: 500,
      currentFundraising: 0,
      fundraisingGoal: 12500,
      status: 'active',
    },
    {
      title: 'Cena Solidaria de Gala',
      date: new Date('2025-12-15T21:00:00').toISOString(),
      time: '21:00',
      location: 'Hotel Meliá Costa del Sol, Torremolinos',
      price: 75,
      image: '',
      description: 'Cena de gala benéfica con menú diseñado por chefs de la Costa del Sol',
      type: 'cena',
      capacity: 200,
      sold: 0,
      availableTickets: 200,
      currentFundraising: 0,
      fundraisingGoal: 15000,
      status: 'active',
    },
    {
      title: 'Marcha por la Vida',
      date: new Date('2025-12-22T10:00:00').toISOString(),
      time: '10:00',
      location: 'Paseo Marítimo de Benalmádena',
      price: 5,
      image: '',
      description: 'Marcha solidaria de 5km por el paseo marítimo para concienciar sobre cuidados paliativos',
      type: 'concierto',
      capacity: 1000,
      sold: 0,
      availableTickets: 1000,
      currentFundraising: 0,
      fundraisingGoal: 5000,
      status: 'active',
    },
    {
      title: 'Rifa Solidaria de Navidad',
      date: new Date('2025-12-24T12:00:00').toISOString(),
      time: '12:00',
      location: 'Online - Sorteo en directo',
      price: 5,
      image: '',
      description: 'Rifa solidaria con fantásticos premios: 1er premio coche, 2º premio viaje, 3er premio electrónica',
      type: 'rifa',
      capacity: 10000,
      sold: 0,
      availableTickets: 10000,
      currentFundraising: 0,
      fundraisingGoal: 50000,
      status: 'active',
    },
    {
      title: 'Gran Sorteo Primavera 2026',
      date: new Date('2026-03-21T18:00:00').toISOString(),
      time: '18:00',
      location: 'Hospice CUDECA, Benalmádena',
      price: 10,
      image: '',
      description: 'Gran sorteo trimestral con premios valorados en más de 20.000€',
      type: 'sorteo',
      capacity: 5000,
      sold: 0,
      availableTickets: 5000,
      currentFundraising: 0,
      fundraisingGoal: 50000,
      status: 'active',
    },
    {
      title: 'Recital de Piano Clásico',
      date: new Date('2026-01-10T19:30:00').toISOString(),
      time: '19:30',
      location: 'Teatro Cervantes, Málaga',
      price: 20,
      image: '',
      description: 'Recital de piano con obras de Mozart, Beethoven y Chopin',
      type: 'concierto',
      capacity: 300,
      sold: 0,
      availableTickets: 300,
      currentFundraising: 0,
      fundraisingGoal: 6000,
      status: 'active',
    },
    {
      title: 'Cena de San Valentín',
      date: new Date('2026-02-14T21:30:00').toISOString(),
      time: '21:30',
      location: 'Restaurante El Lago, Marbella',
      price: 85,
      image: '',
      description: 'Cena romántica de San Valentín con menú degustación y música en vivo',
      type: 'cena',
      capacity: 100,
      sold: 0,
      availableTickets: 100,
      currentFundraising: 0,
      fundraisingGoal: 8500,
      status: 'active',
    },
    {
      title: 'Rifa de Verano',
      date: new Date('2026-06-21T20:00:00').toISOString(),
      time: '20:00',
      location: 'Online - Sorteo en directo',
      price: 3,
      image: '',
      description: 'Rifa de verano con premios veraniegos: tablas de paddle surf, experiencias náuticas',
      type: 'rifa',
      capacity: 15000,
      sold: 0,
      availableTickets: 15000,
      currentFundraising: 0,
      fundraisingGoal: 45000,
      status: 'active',
    },
  ];

  const handleSeedEvents = async () => {
    if (events.length > 0) {
      setMessage('Ya existen eventos en la base de datos. Elimínalos primero si quieres generar nuevos.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      for (const event of sampleEvents) {
        await addEvent(event as Event);
        await new Promise(resolve => setTimeout(resolve, 300)); // Pequeña pausa entre inserciones
      }
      setMessage(`✓ ${sampleEvents.length} eventos de ejemplo creados correctamente`);
    } catch (error) {
      console.error('Error al generar eventos:', error);
      setMessage(`✗ Error al generar eventos: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm">
        <h3 className="mb-2">Generar Eventos de Ejemplo</h3>
        <p className="text-gray-600 mb-4">
          Esto creará {sampleEvents.length} eventos de ejemplo para CUDECA
        </p>
        <button
          onClick={handleSeedEvents}
          disabled={loading || events.length > 0}
          className="w-full bg-[#00A859] text-white px-6 py-3 rounded-full hover:bg-[#008f4c] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? 'Generando...' : events.length > 0 ? 'Ya hay eventos' : 'Generar Eventos'}
        </button>
        {message && (
          <p className={`mt-3 ${message.startsWith('✓') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};
