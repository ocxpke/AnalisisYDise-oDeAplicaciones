import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "../utils/supabaseClient";
import { Event } from "../types";
import { Link } from "./Link";

interface AdminEventManagerProps {
  onEventsUpdate: () => void;
}

export const AdminEventManager = ({
  onEventsUpdate,
}: AdminEventManagerProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] =
    useState<Event | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<
    string | null
  >(null);
  const [formData, setFormData] = useState<Partial<Event>>({
    title: "",
    location: "",
    date: "",
    time: "",
    price: 0,
    image: "",
    description: "",
    type: "concierto",
    capacity: 100,
    sold: 0,
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<
    string | null
  >(null);

  // Estados para configuración personalizada de entradas
  const [useCustomTickets, setUseCustomTickets] =
    useState(false);
  const [customTickets, setCustomTickets] = useState<
    Array<{
      nombre: string;
      color: string;
      precio: number;
      cantidad: number;
    }>
  >([]);
  const [newTicket, setNewTicket] = useState({
    nombre: "",
    color: "#F59E0B",
    precio: 0,
    cantidad: 0,
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);

      // Cargar eventos directamente desde Supabase
      const { data: eventos, error } = await supabase
        .from("evento")
        .select("*")
        .order("fecha", { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      if (eventos) {
        const mappedEvents = eventos.map((evento) => {
          const eventDate = new Date(evento.fecha);
          const timeString = eventDate.toLocaleTimeString(
            "es-ES",
            { hour: "2-digit", minute: "2-digit" },
          );

          let description = "";

          if (evento.tipoevento === "cena") {
            description =
              "Disfruta de una cena solidaria en apoyo a los cuidados paliativos de CUDECA.";
          } else if (evento.tipoevento === "concierto") {
            description =
              "Concierto benéfico para apoyar la labor de CUDECA.";
          } else if (evento.tipoevento === "marcha") {
            description =
              "Participa en nuestra marcha solidaria.";
          } else if (evento.tipoevento === "rifa") {
            description =
              "Participa en nuestra rifa solidaria.";
          } else if (evento.tipoevento === "sorteo") {
            description = "Gran sorteo solidario.";
          }

          // Usar el precio desde la base de datos
          const price =
            parseFloat(String(evento.precioentrada || 0)) || 0;

          return {
            id: String(evento.id),
            title: evento.nombre,
            date: evento.fecha,
            time: timeString,
            location: evento.ubicacion || "Por determinar",
            price: price,
            image: evento.imageurl || "",
            description: evento.descripcion || description,
            type: evento.tipoevento,
            status: evento.estadoevento || "active",
            capacity: evento.aforo,
            sold: evento.aforo - evento.entradas,
            availableTickets: evento.entradas,
            currentFundraising: evento.recaudacionactual || 0,
            fundraisingGoal: evento.objetivorecaudacion || 0,
          } as Event;
        });

        setEvents(mappedEvents);
      }
    } catch (error) {
      console.error("Error loading events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (
    file: File,
  ): Promise<string | null> => {
    try {
      setUploadingImage(true);

      console.log(
        "Iniciando subida de imagen:",
        file.name,
        "Tamaño:",
        file.size,
      );

      // Generar nombre único para el archivo
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `event-images/${fileName}`;

      console.log("Ruta de destino:", filePath);

      // Subir archivo a Supabase Storage
      const { data, error } = await supabase.storage
        .from("cudeca-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Error de Supabase Storage:", error);
        // Proporcionar mensaje de error más informativo
        if (error.message.includes("not found")) {
          throw new Error(
            "El bucket de almacenamiento no está configurado. Por favor, sigue las instrucciones en CONFIGURAR_STORAGE_SUPABASE.md",
          );
        }
        if (
          error.message.includes("row-level security") ||
          error.message.includes("policy")
        ) {
          throw new Error(
            "Error de permisos. Verifica que las políticas del bucket estén configuradas correctamente (usa políticas públicas). Ver CONFIGURAR_STORAGE_SUPABASE.md",
          );
        }
        throw new Error(
          `Error al subir imagen: ${error.message}`,
        );
      }

      console.log("Imagen subida exitosamente:", data);

      // Obtener URL pública
      const {
        data: { publicUrl },
      } = supabase.storage
        .from("cudeca-images")
        .getPublicUrl(filePath);

      console.log("URL pública generada:", publicUrl);

      return publicUrl;
    } catch (error: any) {
      console.error("Error uploading image:", error);
      alert("Error al subir la imagen: " + error.message);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      alert("Por favor seleccione un archivo de imagen válido");
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no puede superar los 5MB");
      return;
    }

    setImageFile(file);

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, image: "" });
  };

  function buildConfigEntradas({
    useCustomTickets,
    customTickets,
    formData,
  }: {
    useCustomTickets: boolean;
    customTickets: any[];
    formData: any;
  }) {
    // Calcular aforo y precio según configuración y la configuracion de entradas
    let aforo = 0;
    let precioEntrada = 0;
    let configEntradas: {
      color: string;
      nombre: string;
      precio: number;
      cantidad: number;
    }[] = [];

    if (useCustomTickets && customTickets.length > 0) {
      configEntradas = customTickets.map((ticket) => ({
        color: ticket.color,
        nombre: ticket.nombre,
        precio: ticket.precio,
        cantidad: ticket.cantidad,
      }));
    } else {
      const precioDef =
        parseFloat(String(formData.price || 0)) || 0;
      const cantidadDef =
        parseInt(String(formData.capacity || 100)) || 100;

      configEntradas = [
        {
          color: "#F59E0B",
          nombre: "Entrada General",
          precio: precioDef,
          cantidad: cantidadDef,
        },
      ];
    }

    // Configuración personalizada: calcular aforo total
    aforo = configEntradas.reduce(
      (sum, ticket) => sum + ticket.cantidad,
      0,
    );
    // Precio base es el de la zona más económica
    precioEntrada = Math.min(
      ...configEntradas.map((ticket) => ticket.precio),
    );

    return { configEntradas, aforo, precioEntrada };
  }

  const handleCreate = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Debe iniciar sesión");
        return;
      }

      // Validar campos requeridos
      if (
        !formData.title ||
        !formData.location ||
        !formData.date ||
        !formData.time
      ) {
        alert("Por favor complete todos los campos requeridos");
        return;
      }

      // Validar configuración personalizada si está activada
      if (useCustomTickets && customTickets.length === 0) {
        alert(
          "Por favor añade al menos una zona de entrada personalizada o desactiva la configuración personalizada",
        );
        return;
      }

      // Subir imagen si hay una seleccionada
      let imageUrl = formData.image || null;
      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      // Obtener el último ID
      const { data: lastEvent } = await supabase
        .from("evento")
        .select("id")
        .order("id", { ascending: false })
        .limit(1)
        .single();

      const nextId = (lastEvent?.id || 0) + 1;

      // Combinar fecha y hora
      const dateTime = `${formData.date}T${formData.time || "00:00"}:00`;

      const objetivoRecaudacion =
        parseFloat(String(formData.fundraisingGoal || 0)) || 0;

      const { configEntradas, aforo, precioEntrada } =
        buildConfigEntradas({
          useCustomTickets,
          customTickets,
          formData,
        });

      // Log para debugging
      console.log("Creating event with data:", {
        precioEntrada,
        aforo,
        objetivoRecaudacion,
        useCustomTickets,
        configEntradas,
        formData,
      });

      // Función para generar los números de la rifa
      const raffleNumbers =
        formData.type === "rifa" || formData.type === "sorteo"
          ? Array.from({ length: aforo }, (_, i) => ({
              number: i + 1,
              available: true,
            }))
          : null;

      // Crear evento
      const { error } = await supabase.from("evento").insert({
        id: nextId,
        nombre: formData.title,
        fecha: dateTime,
        ubicacion: formData.location,
        aforo: aforo,
        recaudacionactual: 0,
        objetivorecaudacion: objetivoRecaudacion,
        tipoevento: formData.type || "concierto",
        estadoevento: "active",
        entradas: aforo,
        precioentrada: precioEntrada,
        imageurl: imageUrl,
        descripcion: formData.description || null,
        rafflenumbers: raffleNumbers,
      });

      if (error) {
        console.error("Supabase error details:", error);
        throw new Error(error.message);
      }

      // Guardar tipos de entradas en la tabla event_ticket_types
      const ticketsToInsert =
        useCustomTickets && customTickets.length > 0
          ? customTickets
          : [
              {
                nombre: "Entrada General",
                color: "#F59E0B",
                precio: precioEntrada,
                cantidad: aforo,
              },
            ];

      const ticketTypesData = ticketsToInsert.map(
        (ticket, index) => ({
          event_id: nextId,
          nombre: ticket.nombre,
          precio: parseFloat(String(ticket.precio || 0)) || 0,
          cantidad: parseInt(String(ticket.cantidad || 0)) || 0,
          disponibles:
            parseInt(String(ticket.cantidad || 0)) || 0,
          color: ticket.color || "#00A859",
        }),
      );

      const { error: ticketTypesError } = await supabase
        .from("event_ticket_types")
        .insert(ticketTypesData);

      if (ticketTypesError) {
        console.error(
          "Error creating ticket types:",
          ticketTypesError,
        );
        // No lanzar error para no interrumpir, pero avisar
        alert(
          "Evento creado pero hubo un error guardando los tipos de entradas",
        );
      }

      alert("Evento creado correctamente");
      setShowForm(false);
      resetForm();
      setUseCustomTickets(false);
      setCustomTickets([]);
      setNewTicket({
        nombre: "",
        color: "#F59E0B",
        precio: 0,
        cantidad: 0,
      });
      loadEvents();
      onEventsUpdate();
    } catch (error: any) {
      console.error("Error creating event:", error);
      alert(error.message || "Error al crear evento");
    }
  };

  const handleUpdate = async () => {
    if (!editingEvent) return;

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Debe iniciar sesión");
        return;
      }

      // Subir imagen si hay una nueva seleccionada
      let imageUrl = formData.image || null;
      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      // Combinar fecha y hora
      const dateTime = `${formData.date}T${formData.time || "00:00"}:00`;

      // Construir config de entradas (tickets por defecto o personalizados)
      const { configEntradas, aforo, precioEntrada } =
        buildConfigEntradas({
          useCustomTickets,
          customTickets,
          formData,
        });

      // Actualizar tabla evento
      const { error: eventError } = await supabase
        .from("evento")
        .update({
          nombre: formData.title,
          fecha: dateTime,
          ubicacion: formData.location,
          tipoevento: formData.type,
          imageurl: imageUrl,
          descripcion: formData.description || null,
          aforo,
          entradas: aforo,
          precioentrada: precioEntrada,
        })
        .eq("id", parseInt(editingEvent.id));

      if (eventError) throw new Error(eventError.message);

      // --- Actualizar tipos de entradas ---
      const { data: existingTickets } = await supabase
        .from("event_ticket_types")
        .select("*")
        .eq("event_id", parseInt(editingEvent.id));

      for (let i = 0; i < configEntradas.length; i++) {
        const ticket = configEntradas[i];
        const existing = existingTickets?.find(
          (t) => t.nombre === ticket.nombre,
        );

        if (existing) {
          const vendidas =
            existing.cantidad - existing.disponibles;
          if (ticket.cantidad < vendidas) {
            alert(
              `No se puede reducir la cantidad de "${ticket.nombre}" por debajo de las entradas vendidas (${vendidas})`,
            );
            // Mantener la cantidad actual para evitar inconsistencias
            continue;
          }

          const nuevasDisponibles = ticket.cantidad - vendidas;

          const { error: updateError } = await supabase
            .from("event_ticket_types")
            .update({
              cantidad: ticket.cantidad,
              precio: ticket.precio,
              color: ticket.color,
              disponibles: nuevasDisponibles,
            })
            .eq("id", existing.id);

          if (updateError)
            console.error(
              "Error actualizando ticket:",
              updateError,
            );
        } else {
          // Insertar nueva categoría de ticket
          const { error: insertError } = await supabase
            .from("event_ticket_types")
            .insert({
              event_id: parseInt(editingEvent.id),
              nombre: ticket.nombre,
              precio: ticket.precio,
              cantidad: ticket.cantidad,
              disponibles: ticket.cantidad,
              color: ticket.color || "#00A859",
            });

          if (insertError)
            console.error(
              "Error insertando ticket:",
              insertError,
            );
        }
      }

      alert("Evento actualizado correctamente");
      setEditingEvent(null);
      resetForm();
      loadEvents();
      onEventsUpdate();
    } catch (error: any) {
      console.error("Error updating event:", error);
      alert(error.message || "Error al actualizar evento");
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm("¿Está seguro de eliminar este evento?"))
      return;

    setDeletingEventId(eventId);

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("Debe iniciar sesión como administrador");
        setDeletingEventId(null);
        return;
      }

      // Optimistic UI update
      setEvents((prevEvents) =>
        prevEvents.filter((e) => e.id !== eventId),
      );

      const { error } = await supabase
        .from("evento")
        .delete()
        .eq("id", parseInt(eventId));

      if (error) {
        // Revert on error
        await loadEvents();
        throw new Error(error.message);
      }

      alert("Evento eliminado correctamente");
      await loadEvents();
      onEventsUpdate();
    } catch (error: any) {
      console.error("Error deleting event:", error);
      alert(error.message || "Error al eliminar evento");
    } finally {
      setDeletingEventId(null);
    }
  };

  const startEdit = (event: Event) => {
    setEditingEvent(event);

    // Extraer fecha y hora del timestamp completo
    const eventDate = new Date(event.date);
    const dateString = eventDate.toISOString().split("T")[0]; // YYYY-MM-DD
    const timeString =
      event.time || eventDate.toTimeString().slice(0, 5); // HH:MM

    setFormData({
      ...event,
      date: dateString,
      time: timeString,
    });
    setShowForm(true);
    // Limpiar el archivo de imagen pero mantener la URL existente
    setImageFile(null);
    setImagePreview(null);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      location: "",
      date: "",
      time: "",
      price: 0,
      image: "",
      description: "",
      type: "concierto",
      capacity: 100,
      sold: 0,
    });
    setEditingEvent(null);
    setImageFile(null);
    setImagePreview(null);
    // Limpiar configuración personalizada
    setUseCustomTickets(false);
    setCustomTickets([]);
    setNewTicket({
      nombre: "",
      color: "#F59E0B",
      precio: 0,
      cantidad: 0,
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        Cargando eventos...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[#00A859] mb-2">
              Panel de Administración
            </h1>
            <p className="text-gray-600">
              Gestión de eventos y entradas
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-[#00A859] hover:underline"
          >
            <ArrowLeft size={20} />
            Volver a eventos
          </Link>
        </div>

        {/* Gestión de Eventos Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-[#00A859]">
              Gestión de Eventos
            </h2>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingEvent(null);
                resetForm();
              }}
              className="flex items-center gap-2 bg-[#00A859] text-white px-4 py-2 rounded-lg hover:bg-[#008F4C]"
            >
              <Plus size={20} />
              Nuevo Evento
            </button>
          </div>

          {showForm && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3>
                  {editingEvent
                    ? "Editar Evento"
                    : "Nuevo Evento"}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">
                    Ubicación *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">
                    Hora *
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        time: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">
                    Precio base (€) *
                  </label>
                  <input
                    type="number"
                    value={formData.price ?? 0}
                    onChange={(e) => {
                      const value =
                        e.target.value === ""
                          ? 0
                          : Number(e.target.value);
                      setFormData({
                        ...formData,
                        price: value,
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">
                    Tipo *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="concierto">
                      Concierto/Evento
                    </option>
                    <option value="cena">Cena</option>
                    <option value="rifa">Rifa/Sorteo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1">
                    Capacidad *
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        capacity: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                    min="1"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">
                    Imagen del evento
                  </label>

                  {/* Mostrar imagen actual si existe */}
                  {editingEvent &&
                    formData.image &&
                    !imagePreview && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-2">
                          Imagen actual:
                        </p>
                        <div className="relative inline-block">
                          <img
                            src={formData.image}
                            alt="Imagen actual"
                            className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                          />
                        </div>
                      </div>
                    )}

                  {/* Preview de nueva imagen */}
                  {imagePreview && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-2">
                        Nueva imagen:
                      </p>
                      <div className="relative inline-block">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          onClick={clearImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          title="Eliminar imagen"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Botón de subida */}
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                      disabled={uploadingImage}
                    />
                    <label
                      htmlFor="image-upload"
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                        uploadingImage
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-[#00A859] hover:bg-[#008F4C] text-white"
                      }`}
                    >
                      {uploadingImage ? (
                        <>
                          <div className="animate-spin h-[18px] w-[18px] border-2 border-white border-t-transparent rounded-full" />
                          Subiendo...
                        </>
                      ) : (
                        <>
                          <Upload size={18} />
                          {imagePreview ||
                          (editingEvent && formData.image)
                            ? "Cambiar imagen"
                            : "Subir imagen"}
                        </>
                      )}
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Formatos: JPG, PNG, GIF. Tamaño máximo: 5MB
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">
                    O usar URL de imagen
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        image: e.target.value,
                      })
                    }
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    disabled={!!imageFile}
                  />
                  {imageFile && (
                    <p className="text-xs text-orange-600 mt-1">
                      Has seleccionado una imagen para subir. Si
                      quieres usar una URL en su lugar, elimina
                      primero la imagen seleccionada.
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">
                    Descripción *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows={4}
                    required
                  />
                </div>
              </div>

              {/* Configuración personalizada de entradas */}
              {!editingEvent &&
                formData.type !== "rifa" &&
                formData.type !== "sorteo" && (
                  <div className="border-t pt-4">
                    <div className="flex items-center gap-3 mb-4">
                      <input
                        type="checkbox"
                        id="useCustomTickets"
                        checked={useCustomTickets}
                        onChange={(e) => {
                          setUseCustomTickets(e.target.checked);
                          if (!e.target.checked) {
                            setCustomTickets([]);
                          }
                        }}
                        className="w-4 h-4 text-[#00A859] border-gray-300 rounded focus:ring-[#00A859]"
                      />
                      <label
                        htmlFor="useCustomTickets"
                        className="text-sm font-medium"
                      >
                        Usar configuración personalizada de
                        entradas (zonas con diferentes precios)
                      </label>
                    </div>

                    {useCustomTickets && (
                      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                        <p className="text-sm text-gray-600 mb-3">
                          Define diferentes zonas o tipos de
                          entrada con precios y cantidades
                          específicas
                        </p>

                        {/* Lista de entradas personalizadas */}
                        {customTickets.length > 0 && (
                          <div className="space-y-2 mb-4">
                            <p className="text-sm font-medium">
                              Zonas configuradas:
                            </p>
                            {customTickets.map(
                              (ticket, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200"
                                >
                                  <div
                                    className="w-6 h-6 rounded"
                                    style={{
                                      backgroundColor:
                                        ticket.color,
                                    }}
                                  />
                                  <div className="flex-1">
                                    <p className="font-medium">
                                      {ticket.nombre}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {ticket.precio}€ •{" "}
                                      {ticket.cantidad} entradas
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => {
                                      setCustomTickets(
                                        customTickets.filter(
                                          (_, i) => i !== index,
                                        ),
                                      );
                                    }}
                                    className="text-red-600 hover:bg-red-50 p-2 rounded"
                                    title="Eliminar zona"
                                  >
                                    <X size={18} />
                                  </button>
                                </div>
                              ),
                            )}
                          </div>
                        )}

                        {/* Formulario para añadir nueva zona */}
                        <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
                          <p className="text-sm font-medium">
                            Añadir nueva zona:
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                Nombre de la zona *
                              </label>
                              <input
                                type="text"
                                value={newTicket.nombre}
                                onChange={(e) =>
                                  setNewTicket({
                                    ...newTicket,
                                    nombre: e.target.value,
                                  })
                                }
                                placeholder="Ej: Front Stage VIP, Platea, General..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                Color de identificación
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="color"
                                  value={newTicket.color}
                                  onChange={(e) =>
                                    setNewTicket({
                                      ...newTicket,
                                      color: e.target.value,
                                    })
                                  }
                                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                                />
                                <input
                                  type="text"
                                  value={newTicket.color}
                                  onChange={(e) =>
                                    setNewTicket({
                                      ...newTicket,
                                      color: e.target.value,
                                    })
                                  }
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                  placeholder="#F59E0B"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                Precio (€) *
                              </label>
                              <input
                                type="number"
                                value={newTicket.precio}
                                onChange={(e) =>
                                  setNewTicket({
                                    ...newTicket,
                                    precio: Number(
                                      e.target.value,
                                    ),
                                  })
                                }
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                Cantidad de entradas *
                              </label>
                              <input
                                type="number"
                                value={newTicket.cantidad}
                                onChange={(e) =>
                                  setNewTicket({
                                    ...newTicket,
                                    cantidad: Number(
                                      e.target.value,
                                    ),
                                  })
                                }
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (
                                !newTicket.nombre ||
                                newTicket.precio <= 0 ||
                                newTicket.cantidad <= 0
                              ) {
                                alert(
                                  "Por favor completa todos los campos de la zona",
                                );
                                return;
                              }
                              setCustomTickets([
                                ...customTickets,
                                newTicket,
                              ]);
                              setNewTicket({
                                nombre: "",
                                color: "#F59E0B",
                                precio: 0,
                                cantidad: 0,
                              });
                            }}
                            className="w-full bg-[#00A859] text-white px-4 py-2 rounded-lg hover:bg-[#008F4C] text-sm flex items-center justify-center gap-2"
                          >
                            <Plus size={16} />
                            Añadir zona
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              {!editingEvent &&
                formData.type !== "rifa" &&
                formData.type !== "sorteo" &&
                !useCustomTickets && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800">
                      ℹ️ Se creará automáticamente una "Entrada
                      General" con precio de{" "}
                      {formData.price || 0}€ y{" "}
                      {formData.capacity || 100} entradas
                      disponibles.
                    </p>
                  </div>
                )}

              <div className="flex gap-3">
                <button
                  onClick={
                    editingEvent ? handleUpdate : handleCreate
                  }
                  className="flex items-center gap-2 bg-[#00A859] text-white px-4 py-2 rounded-lg hover:bg-[#008F4C]"
                  disabled={uploadingImage}
                >
                  <Save size={18} />
                  {editingEvent ? "Actualizar" : "Crear"}
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white border border-gray-200 rounded-lg p-4 flex items-start gap-4"
              >
                {event.image && (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {event.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    {event.date} • {event.time} • {event.price}€
                  </p>
                  <p className="text-sm text-gray-600">
                    Capacidad: {event.sold || 0}/
                    {event.capacity}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(event)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Editar"
                    disabled={deletingEventId === event.id}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Eliminar"
                    disabled={deletingEventId === event.id}
                  >
                    {deletingEventId === event.id ? (
                      <div className="animate-spin h-[18px] w-[18px] border-2 border-red-600 border-t-transparent rounded-full" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              </div>
            ))}

            {events.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No hay eventos. Crea el primero.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};