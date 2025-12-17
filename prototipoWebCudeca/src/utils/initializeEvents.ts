import { supabase } from './supabaseClient';
import { mockEvents } from './mockData';

export const initializeEvents = async () => {
  const results = [];

  for (const event of mockEvents) {
    try {
      // Obtener el último ID
      const { data: lastEvent } = await supabase
        .from('Evento')
        .select('id')
        .order('id', { ascending: false })
        .limit(1)
        .single();

      const nextId = (lastEvent?.id || 0) + 1;

      // Combinar fecha y hora
      const dateTime = `${event.date}T${event.time || '00:00'}:00`;

      // Crear evento
      const { error } = await supabase
        .from('Evento')
        .insert({
          id: nextId,
          nombre: event.title,
          fecha: dateTime,
          ubicacion: event.location,
          aforo: event.capacity || 100,
          recaudacionactual: 0,
          objetivorecaudacion: event.fundraisingGoal || 0,
          tipoevento: event.type || 'concierto',
          estadoevento: 'active',
          entradas: event.capacity || 100,
        });

      if (error) {
        results.push({ success: false, title: event.title, error: error.message });
      } else {
        results.push({ success: true, title: event.title });
      }
    } catch (error: any) {
      results.push({ success: false, title: event.title, error: error.message || 'Error de conexión' });
    }
  }

  return results;
};