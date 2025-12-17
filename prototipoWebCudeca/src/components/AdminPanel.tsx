import { useState } from 'react';
import { Plus, Users, Download, Trash2, Calendar, MapPin, X } from 'lucide-react';
import { Link } from './Link';
import { toast } from 'sonner';
import { useEvents } from '../contexts/EventsContext';
import { useAuth } from '../contexts/AuthContext';
import { TicketType } from '../types';
import { projectId } from '../utils/supabase/info';

interface AdminPanelProps {
  language: 'es' | 'en';
}

type EventType = 'concierto' | 'cena' | 'rifa' | 'sorteo';

interface NewEventForm {
  title: string;
  type: EventType;
  location: string;
  date: string;
  time: string;
  price: string;
  capacity: string;
  description: string;
  ticketTypes: TicketType[];
}

export function AdminPanel({ language }: AdminPanelProps) {
  const { isAdmin } = useAuth();
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [useCategories, setUseCategories] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const { events, addEvent, removeEvent } = useEvents();

  // Verificación de seguridad adicional
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="mb-4">
            {language === 'es' ? 'Acceso Denegado' : 'Access Denied'}
          </h2>
          <p className="text-gray-700 mb-6">
            {language === 'es' 
              ? 'No tienes permisos para acceder al panel de administrador.' 
              : 'You do not have permission to access the admin panel.'}
          </p>
          <Link 
            href="/" 
            className="inline-block bg-[#00A859] text-white px-6 py-3 rounded-lg hover:bg-[#008A47] transition-colors"
          >
            {language === 'es' ? 'Volver al Inicio' : 'Back to Home'}
          </Link>
        </div>
      </div>
    );
  }
  
  const [newEvent, setNewEvent] = useState<NewEventForm>({
    title: '',
    type: 'concierto',
    location: '',
    date: '',
    time: '',
    price: '',
    capacity: '',
    description: '',
    ticketTypes: [],
  });

  const predefinedColors = [
    '#9333EA', // purple
    '#3B82F6', // blue
    '#06B6D4', // cyan
    '#10B981', // green
    '#EF4444', // red
    '#F59E0B', // orange
  ];

  const addTicketCategory = () => {
    const newCategory: TicketType = {
      id: `category-${Date.now()}`,
      name: '',
      price: 0,
      color: predefinedColors[newEvent.ticketTypes.length % predefinedColors.length],
      available: 0,
    };
    setNewEvent({ ...newEvent, ticketTypes: [...newEvent.ticketTypes, newCategory] });
  };

  const updateTicketCategory = (index: number, field: keyof TicketType, value: string | number) => {
    const updatedCategories = [...newEvent.ticketTypes];
    updatedCategories[index] = { ...updatedCategories[index], [field]: value };
    setNewEvent({ ...newEvent, ticketTypes: updatedCategories });
  };

  const removeTicketCategory = (index: number) => {
    const updatedCategories = newEvent.ticketTypes.filter((_, i) => i !== index);
    setNewEvent({ ...newEvent, ticketTypes: updatedCategories });
  };

  const translations = {
    es: {
      adminPanel: 'Panel de Administración',
      backToEvents: 'Volver a eventos',
      createEvent: 'Crear Evento Nuevo',
      myEvents: 'Mis Eventos',
      attendees: 'Asistentes',
      tickets: 'Entradas',
      revenue: 'Recaudación',
      viewAttendees: 'Ver asistentes',
      exportCSV: 'Exportar CSV',
      cancelEvent: 'Cancelar evento',
      eventName: 'Nombre del evento',
      eventType: 'Tipo de evento',
      location: 'Ubicación',
      date: 'Fecha',
      time: 'Hora',
      price: 'Precio base',
      capacity: 'Capacidad',
      description: 'Descripción',
      create: 'Crear',
      cancel: 'Cancelar',
      creating: 'Creando...',
      sold: 'vendidas',
      available: 'disponibles',
      rifa: 'Rifa',
      sorteo: 'Sorteo',
      cena: 'Cena',
      concierto: 'Concierto',
      confirmCancel: '¿Estás seguro de que quieres cancelar este evento? Se notificará a todos los compradores.',
      eventCreatedSuccess: 'Evento creado exitosamente',
      eventCreatedError: 'Error al crear el evento',
      fillAllFields: 'Por favor, completa todos los campos',
      ticketCategories: 'Categorías de Entradas',
      addCategory: 'Agregar categoría',
      categoryName: 'Nombre de la categoría',
      categoryPrice: 'Precio',
      categoryCapacity: 'Capacidad',
      categoryColor: 'Color',
      removeCategory: 'Eliminar',
      useTicketCategories: 'Usar categorías de entradas (gradas)',
    },
    en: {
      adminPanel: 'Admin Panel',
      backToEvents: 'Back to events',
      createEvent: 'Create New Event',
      myEvents: 'My Events',
      attendees: 'Attendees',
      tickets: 'Tickets',
      revenue: 'Revenue',
      viewAttendees: 'View attendees',
      exportCSV: 'Export CSV',
      cancelEvent: 'Cancel event',
      eventName: 'Event name',
      eventType: 'Event type',
      location: 'Location',
      date: 'Date',
      time: 'Time',
      price: 'Base price',
      capacity: 'Capacity',
      description: 'Description',
      create: 'Create',
      cancel: 'Cancel',
      creating: 'Creating...',
      sold: 'sold',
      available: 'available',
      rifa: 'Raffle',
      sorteo: 'Draw',
      cena: 'Dinner',
      concierto: 'Concert',
      confirmCancel: 'Are you sure you want to cancel this event? All buyers will be notified.',
      eventCreatedSuccess: 'Event created successfully',
      eventCreatedError: 'Error creating event',
      fillAllFields: 'Please fill in all fields',
      ticketCategories: 'Ticket Categories',
      addCategory: 'Add category',
      categoryName: 'Category name',
      categoryPrice: 'Price',
      categoryCapacity: 'Capacity',
      categoryColor: 'Color',
      removeCategory: 'Remove',
      useTicketCategories: 'Use ticket categories (rows)',
    }
  };

  const t = translations[language];

  const mockAttendees = [
    { id: '1', name: 'María García', email: 'maria@email.com', tickets: 2, checkedIn: true },
    { id: '2', name: 'Juan Pérez', email: 'juan@email.com', tickets: 1, checkedIn: false },
    { id: '3', name: 'Ana Martínez', email: 'ana@email.com', tickets: 4, checkedIn: true },
  ];

  const resetForm = () => {
    setNewEvent({
      title: '',
      type: 'concierto',
      location: '',
      date: '',
      time: '',
      price: '',
      capacity: '',
      description: '',
      ticketTypes: [],
    });
  };

  const validateForm = () => {
    if (!newEvent.title || !newEvent.location || !newEvent.date || !newEvent.time || 
        !newEvent.price || !newEvent.capacity) {
      toast.error(t.fillAllFields);
      return false;
    }
    
    // Validar que price y capacity sean números positivos
    if (Number(newEvent.price) <= 0) {
      toast.error(language === 'es' ? 'El precio debe ser mayor a 0' : 'Price must be greater than 0');
      return false;
    }
    
    if (Number(newEvent.capacity) <= 0) {
      toast.error(language === 'es' ? 'La capacidad debe ser mayor a 0' : 'Capacity must be greater than 0');
      return false;
    }
    
    return true;
  };

  const handleCreateEvent = async () => {
    console.log('Creating event with data:', newEvent); // Debug
    
    if (!validateForm()) {
      console.log('Validation failed'); // Debug
      return;
    }

    setIsCreating(true);

    try {
      // Crear el evento localmente
      const createdEvent: any = {
        title: newEvent.title,
        type: newEvent.type,
        location: newEvent.location,
        date: new Date(newEvent.date + 'T' + newEvent.time).toISOString(),
        time: newEvent.time,
        price: Number(newEvent.price),
        capacity: Number(newEvent.capacity),
        description: newEvent.description || '',
        sold: 0,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      };

      // Si se usan categorías de entradas, agregarlas al evento
      if (useCategories && newEvent.ticketTypes.length > 0) {
        createdEvent.ticketTypes = newEvent.ticketTypes;
      }

      console.log('Adding event:', createdEvent); // Debug
      console.log('Access token:', localStorage.getItem('accessToken')); // Debug

      // Guardar en el backend y agregar a la lista local
      await addEvent(createdEvent);

      toast.success(t.eventCreatedSuccess);
      resetForm();
      setUseCategories(false);
      setShowCreateEvent(false);
    } catch (error: any) {
      console.error('Error creating event:', error); // Debug
      console.error('Error message:', error?.message); // Debug
      
      // Mostrar error específico al usuario
      if (error?.message?.includes('Solo administradores')) {
        toast.error(language === 'es' 
          ? 'Debes iniciar sesión como administrador para crear eventos' 
          : 'You must log in as administrator to create events');
      } else if (error?.message?.includes('No autorizado')) {
        toast.error(language === 'es' 
          ? 'Por favor, inicia sesión como administrador' 
          : 'Please log in as administrator');
      } else {
        toast.error(error?.message || t.eventCreatedError);
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1>{t.adminPanel}</h1>
          <div className="flex gap-4">
            <Link href="/" className="text-[#00A859] hover:underline">
              {t.backToEvents}
            </Link>
            <button
              onClick={() => setShowCreateEvent(true)}
              className="flex items-center gap-2 px-6 py-3 bg-[#00A859] text-white rounded-xl hover:bg-[#008A47] transition-colors"
            >
              <Plus className="w-5 h-5" />
              {t.createEvent}
            </button>
          </div>
        </div>

        {/* Create Event Modal */}
        {showCreateEvent && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                resetForm();
                setShowCreateEvent(false);
              }
            }}
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
              <h2 className="mb-6">{t.createEvent}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2">{t.eventName} *</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border-2 rounded-lg focus:border-[#00A859] focus:outline-none" 
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder={language === 'es' ? 'Ej: Concierto Benéfico 2025' : 'Ex: Charity Concert 2025'}
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-2">{t.eventType} *</label>
                  <select 
                    className="w-full px-4 py-3 border-2 rounded-lg focus:border-[#00A859] focus:outline-none"
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as EventType })}
                    required
                  >
                    <option value="concierto">{t.concierto}</option>
                    <option value="cena">{t.cena}</option>
                    <option value="rifa">{t.rifa}</option>
                    <option value="sorteo">{t.sorteo}</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">{t.location} *</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 border-2 rounded-lg focus:border-[#00A859] focus:outline-none" 
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    placeholder={language === 'es' ? 'Ej: Auditorio CUDECA, Benalmádena' : 'Ex: CUDECA Auditorium, Benalmádena'}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">{t.date} *</label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-3 border-2 rounded-lg focus:border-[#00A859] focus:outline-none" 
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2">{t.time} *</label>
                    <input 
                      type="time" 
                      className="w-full px-4 py-3 border-2 rounded-lg focus:border-[#00A859] focus:outline-none" 
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">{t.price} *</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-3 border-2 rounded-lg focus:border-[#00A859] focus:outline-none" 
                      placeholder="0€"
                      value={newEvent.price}
                      onChange={(e) => setNewEvent({ ...newEvent, price: e.target.value })}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2">{t.capacity} *</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-3 border-2 rounded-lg focus:border-[#00A859] focus:outline-none" 
                      value={newEvent.capacity}
                      onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
                      min="1"
                      placeholder={language === 'es' ? 'Ej: 200' : 'Ex: 200'}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2">{t.description}</label>
                  <textarea 
                    rows={4} 
                    className="w-full px-4 py-3 border-2 rounded-lg focus:border-[#00A859] focus:outline-none resize-none"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder={language === 'es' ? 'Descripción del evento (opcional)' : 'Event description (optional)'}
                  />
                </div>

                {/* Ticket Categories Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={useCategories}
                        onChange={(e) => {
                          setUseCategories(e.target.checked);
                          if (e.target.checked && newEvent.ticketTypes.length === 0) {
                            addTicketCategory();
                          }
                        }}
                        className="w-4 h-4 rounded border-2 text-[#00A859] focus:ring-[#00A859]"
                      />
                      <span>{t.useTicketCategories}</span>
                    </label>
                  </div>

                  {useCategories && (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 mb-3">
                        {language === 'es' 
                          ? 'Define diferentes categorías de entradas con precios y capacidades específicas'
                          : 'Define different ticket categories with specific prices and capacities'}
                      </p>
                      
                      {newEvent.ticketTypes.map((category, index) => (
                        <div key={category.id} className="p-4 border-2 rounded-lg bg-gray-50">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-6 h-6 rounded" 
                                style={{ backgroundColor: category.color }}
                              />
                              <span className="text-sm">
                                {language === 'es' ? 'Categoría' : 'Category'} #{index + 1}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeTicketCategory(index)}
                              className="text-red-600 hover:text-red-700 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-sm mb-1">{t.categoryName} *</label>
                              <input 
                                type="text" 
                                className="w-full px-3 py-2 border-2 rounded-lg focus:border-[#00A859] focus:outline-none text-sm" 
                                value={category.name}
                                onChange={(e) => updateTicketCategory(index, 'name', e.target.value)}
                                placeholder={language === 'es' ? 'Ej: Grada Superior' : 'Ex: Upper Row'}
                              />
                            </div>
                            <div>
                              <label className="block text-sm mb-1">{t.categoryPrice} *</label>
                              <input 
                                type="number" 
                                className="w-full px-3 py-2 border-2 rounded-lg focus:border-[#00A859] focus:outline-none text-sm" 
                                value={category.price}
                                onChange={(e) => updateTicketCategory(index, 'price', Number(e.target.value))}
                                min="0"
                                step="0.01"
                                placeholder="0€"
                              />
                            </div>
                            <div>
                              <label className="block text-sm mb-1">{t.categoryCapacity} *</label>
                              <input 
                                type="number" 
                                className="w-full px-3 py-2 border-2 rounded-lg focus:border-[#00A859] focus:outline-none text-sm" 
                                value={category.available}
                                onChange={(e) => updateTicketCategory(index, 'available', Number(e.target.value))}
                                min="0"
                                placeholder="0"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={addTicketCategory}
                        className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#00A859] hover:text-[#00A859] transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        {t.addCategory}
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => {
                      resetForm();
                      setShowCreateEvent(false);
                    }}
                    disabled={isCreating}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={handleCreateEvent}
                    disabled={isCreating}
                    className="flex-1 px-6 py-3 bg-[#00A859] text-white rounded-xl hover:bg-[#008A47] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating ? t.creating : t.create}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Events List */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b">
            <h2>{t.myEvents}</h2>
          </div>
          <div className="divide-y">
            {events.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Calendar className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-xl text-gray-600 mb-2">
                    {language === 'es' ? 'No hay eventos creados' : 'No events created'}
                  </p>
                  <p className="text-gray-500">
                    {language === 'es' 
                      ? 'Haz clic en "Crear Evento Nuevo" para comenzar' 
                      : 'Click "Create New Event" to get started'}
                  </p>
                </div>
              </div>
            ) : (
              events.map((event) => (
                <div key={event.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="mb-2">{event.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(event.date).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US')}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        if (confirm(t.confirmCancel)) {
                          setDeletingEventId(event.id);
                          try {
                            await removeEvent(event.id);
                            toast.success('Evento eliminado correctamente');
                          } catch (error: any) {
                            console.error('Error al eliminar:', error);
                            toast.error(error.message || 'Error al eliminar el evento. Por favor, inténtalo de nuevo.');
                          } finally {
                            setDeletingEventId(null);
                          }
                        }
                      }}
                      disabled={deletingEventId === event.id}
                      className="text-red-600 hover:text-red-700 p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      title={t.cancelEvent}
                    >
                      {deletingEventId === event.id ? (
                        <div className="animate-spin h-5 w-5 border-2 border-red-600 border-t-transparent rounded-full" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">{t.tickets}</p>
                      <p className="text-2xl text-[#00A859]">
                        {event.sold || 0} / {event.capacity || 0}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(event.capacity || 0) - (event.sold || 0)} {t.available}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">{t.attendees}</p>
                      <p className="text-2xl text-[#00A859]">{event.sold || 0}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">{t.revenue}</p>
                      <p className="text-2xl text-[#00A859]">
                        {((event.sold || 0) * event.price).toLocaleString()}€
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
                      className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Users className="w-4 h-4" />
                      {t.viewAttendees}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Download className="w-4 h-4" />
                      {t.exportCSV}
                    </button>
                  </div>

                  {/* Attendees List */}
                  {selectedEvent === event.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="mb-3">{t.attendees}</h4>
                      <div className="space-y-2">
                        {mockAttendees.map((attendee) => (
                          <div
                            key={attendee.id}
                            className="flex items-center justify-between p-3 bg-white rounded-lg"
                          >
                            <div>
                              <p>{attendee.name}</p>
                              <p className="text-sm text-gray-600">{attendee.email}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-gray-600">
                                {attendee.tickets} {t.tickets.toLowerCase()}
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full text-xs ${
                                  attendee.checkedIn
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {attendee.checkedIn ? '✓ Checked in' : 'Not checked in'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}