import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Event, TicketType } from "../types";
import { supabase } from "../utils/supabaseClient";

interface EventsContextType {
  events: Event[];
  addEvent: (event: Event) => Promise<void>;
  removeEvent: (eventId: string) => Promise<void>;
  updateEvent: (
    eventId: string,
    updates: Partial<Event>,
  ) => Promise<void>;
  loadEvents: () => Promise<void>;
  refreshEvents: () => Promise<void>; // Nueva función para forzar recarga
  loading: boolean;
}

const EventsContext = createContext<
  EventsContextType | undefined
>(undefined);

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error(
      "useEvents must be used within an EventsProvider",
    );
  }
  return context;
};

interface EventsProviderProps {
  children: ReactNode;
}

export const EventsProvider = ({
  children,
}: EventsProviderProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setEvents([]);

      const { data: eventos, error } = await supabase
        .from("evento")
        .select("*")
        .order("fecha", { ascending: true });

      if (error) {
        console.error("Error al cargar eventos:", error);
        return;
      }

      if (eventos && eventos.length > 0) {
        // Cargar todos los tipos de entradas en una sola consulta
        const eventIds = eventos.map((e) => e.id);
        const { data: allTicketTypes } = await supabase
          .from("event_ticket_types")
          .select("*")
          .in("event_id", eventIds);

        const mappedEvents = eventos.map((evento) => {
          const eventDate = new Date(evento.fecha);
          const timeString = eventDate.toLocaleTimeString(
            "es-ES",
            {
              hour: "2-digit",
              minute: "2-digit",
            },
          );

          let basePrice = 10;
          let description = "";

          if (evento.tipoevento === "cena") {
            basePrice = 50;
            description =
              "Disfruta de una cena solidaria en apoyo a los cuidados paliativos de CUDECA.";
          } else if (evento.tipoevento === "concierto") {
            basePrice = 20;
            description =
              "Concierto benéfico para apoyar la labor de CUDECA.";
          } else if (evento.tipoevento === "marcha") {
            basePrice = 5;
            description =
              "Participa en nuestra marcha solidaria.";
          } else if (evento.tipoevento === "rifa") {
            basePrice = 5;
            description =
              "Participa en nuestra rifa solidaria.";
          } else if (evento.tipoevento === "sorteo") {
            basePrice = 10;
            description = "Gran sorteo solidario.";
          } else {
            description =
              "Evento solidario en apoyo a la Fundación CUDECA.";
          }

          let ticketTypes: TicketType[] = [];

          // Filtrar tipos de entradas para el evento actual
          const eventTicketTypes = allTicketTypes.filter(
            (t) => t.event_id === evento.id,
          );

          if (eventTicketTypes && eventTicketTypes.length > 0) {
            ticketTypes = eventTicketTypes.map((tipo: any) => ({
              id: tipo.id,
              name: tipo.nombre || "Entrada",
              price: parseFloat(tipo.precio) || 0,
              color: tipo.color || "#00A859",
              available: parseInt(tipo.disponibles) || 0,
            }));
          } else if (evento.tipoevento !== "rifa") {
            // Si no hay tipos de entradas definidos, crear uno por defecto
            ticketTypes = [
              {
                id: 1,
                name: "Entrada General",
                price:
                  parseFloat(
                    String(evento.precioentrada || basePrice),
                  ) || basePrice,
                color: "#00A859",
                available:
                  evento.entradas || evento.aforo || 100,
              },
            ];
          }

          return {
            id: evento.id.toString(),
            title: evento.nombre,
            date: evento.fecha,
            time: timeString,
            location: evento.ubicacion || "Por determinar",
            price:
              parseFloat(
                String(evento.precioentrada || basePrice),
              ) || basePrice,
            image: evento.imageurl || "",
            description: evento.descripcion || description,
            type: evento.tipoevento,
            status: evento.estadoevento || "active",
            capacity: evento.aforo,
            sold: evento.aforo - evento.entradas,
            availableTickets: evento.entradas,
            currentFundraising: evento.recaudacionactual || 0,
            fundraisingGoal: evento.objetivorecaudacion || 0,
            ticketTypes: ticketTypes,
            rafflenumbers: evento.rafflenumbers || [],
            venueMap: { zones: [], imageUrl: evento.imageurl },
          };
        });

        setEvents(mappedEvents);
      }
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const addEvent = async (event: Event) => {
    try {
      const { data: maxIdData } = await supabase
        .from("evento")
        .select("id")
        .order("id", { ascending: false })
        .limit(1);

      const nextId =
        maxIdData && maxIdData.length > 0
          ? maxIdData[0].id + 1
          : 1;
      const precioEntrada =
        parseFloat(String(event.price || 0)) || 0;
      const rafflenumbers =
        event.type === "rifa" || event.type === "sorteo"
          ? Array.from(
              { length: event.capacity || 100 },
              (_, i) => ({
                number: i + 1,
                available: true,
              }),
            )
          : null;

      const { error } = await supabase.from("evento").insert({
        id: nextId,
        nombre: event.title,
        fecha: event.date,
        ubicacion: event.location,
        aforo: event.capacity || 100,
        recaudacionactual: 0,
        objetivorecaudacion: event.fundraisingGoal || 0,
        tipoevento: event.type || "evento",
        estadoevento: "active",
        entradas:
          event.availableTickets || event.capacity || 100,
        precioentrada: precioEntrada,
        imageurl: event.image || null,
        descripcion: event.description || null,
        rafflenumbers: rafflenumbers,
      });

      if (error) throw new Error(error.message);
      await loadEvents();
    } catch (error) {
      console.error("Error adding event:", error);
      throw error;
    }
  };

  const removeEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from("evento")
        .delete()
        .eq("id", eventId);
      if (error) throw new Error(error.message);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch (error) {
      console.error("Error removing event:", error);
      throw error;
    }
  };

  const updateEvent = async (
    eventId: string,
    updates: Partial<Event>,
  ) => {
    try {
      const updateData: any = {};
      if (updates.title) updateData.nombre = updates.title;
      if (updates.date) updateData.fecha = updates.date;
      if (updates.location)
        updateData.ubicacion = updates.location;
      if (updates.capacity) updateData.aforo = updates.capacity;
      if (updates.fundraisingGoal !== undefined)
        updateData.objetivorecaudacion =
          updates.fundraisingGoal;
      if (updates.type) updateData.tipoevento = updates.type;
      if (updates.status)
        updateData.estadoevento = updates.status;
      if (updates.availableTickets !== undefined)
        updateData.entradas = updates.availableTickets;
      if (updates.price !== undefined)
        updateData.precioentrada =
          parseFloat(String(updates.price || 0)) || 0;
      if (updates.image !== undefined)
        updateData.imageurl = updates.image;
      if (updates.description !== undefined)
        updateData.descripcion = updates.description;
      if (updates.rafflenumbers !== undefined)
        updateData.rafflenumbers = updates.rafflenumbers;

      const { error } = await supabase
        .from("evento")
        .update(updateData)
        .eq("id", eventId);
      if (error) throw new Error(error.message);
      await loadEvents();
    } catch (error) {
      console.error("Error updating event:", error);
      throw error;
    }
  };

  return (
    <EventsContext.Provider
      value={{
        events,
        addEvent,
        removeEvent,
        updateEvent,
        loadEvents,
        refreshEvents: loadEvents, // Asignar la función loadEvents a refreshEvents
        loading,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};