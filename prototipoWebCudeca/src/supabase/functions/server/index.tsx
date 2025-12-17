import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import { useEvents } from "../../../contexts/EventsContext";

const app = new Hono();
const { loadEvents } = useEvents();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("*", logger(console.log));

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

function generateQRCode(): string {
  return `QR-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

app.post("/make-server-e30de6da/purchases", async (c) => {
  try {
    const body = await c.req.json();
    const {
      eventId,
      tickets,
      donation,
      totalAmount,
      userData,
      userId: bodyUserId,
    } = body;

    if (
      !eventId ||
      !tickets ||
      tickets.length === 0 ||
      !totalAmount ||
      !userData
    ) {
      return c.json({ error: "Datos incompletos" }, 400);
    }

    // 1️⃣ Gestión de usuario
    let userId: string | null = null;

    if (bodyUserId) {
      const { data: existingUser } = await supabase
        .from("usuario")
        .select("id")
        .eq("id", bodyUserId)
        .single();
      if (existingUser) userId = existingUser.id;
    }

    if (!userId && userData.email) {
      const { data: existingUser } = await supabase
        .from("usuario")
        .select("id")
        .eq("email", userData.email)
        .single();

      if (existingUser) {
        userId = existingUser.id;
      } else {
        const nameParts = userData.name?.split(" ") || [];
        const nombre =
          userData.firstName || nameParts[0] || "Usuario";
        const apellidos =
          userData.lastName ||
          nameParts.slice(1).join(" ") ||
          "Anónimo";

        const { data: newUser, error: createError } =
          await supabase
            .from("usuario")
            .insert({
              nombre,
              apellidos,
              email: userData.email,
              telefono: userData.phone || "",
              dni: userData.dni || null,
              direccion: userData.address || null,
              socio: userData.isMember || false,
              admin: false,
              password: "",
              fechanacimiento: new Date().toISOString(),
            })
            .select("id")
            .single();

        if (!createError) userId = newUser.id;
      }
    }

    // 2️⃣ Obtener evento
    const { data: evento, error: eventoError } = await supabase
      .from("evento")
      .select("*")
      .eq("id", eventId)
      .single();

    if (eventoError || !evento)
      return c.json({ error: "Evento no encontrado" }, 404);

    // 3️⃣ Obtener tipos de tickets
    const { data: ticketTypes } = await supabase
      .from("event_ticket_types")
      .select("*")
      .eq("event_id", eventId);

    // Clonar rafflenumbers si existen
    const updatedRaffleNumbers = evento.rafflenumbers
      ? JSON.parse(JSON.stringify(evento.rafflenumbers))
      : null;

    // Map para actualizar disponibilidad de tickets
    const ticketTypeUpdates = new Map<
      number,
      { disponibles: number }
    >();
    let totalTickets = 0;
    let entra = false;

    for (const ticket of tickets) {
      const quantity = ticket.quantity || 1;
      totalTickets += quantity;

      // Rifas
      if (
        ticket.details?.raffleNumber &&
        updatedRaffleNumbers
      ) {
        const raffleIndex = updatedRaffleNumbers.findIndex(
          (r: any) => r.number === ticket.details.raffleNumber,
        );
        if (
          raffleIndex === -1 ||
          !updatedRaffleNumbers[raffleIndex].available
        ) {
          return c.json(
            {
              error: `El número ${ticket.details.raffleNumber} ya no está disponible.`,
            },
            400,
          );
        }
        updatedRaffleNumbers[raffleIndex].available = false;
      }

      // Tickets normales
      else if (
        ticket.id &&
        ticketTypes &&
        ticketTypes.length > 0
      ) {
        entra = true;
        const ticketType = ticketTypes.find(
          (tt: any) => tt.id === ticket.id,
        );
        if (!ticketType) {
          return c.json(
            {
              error: `Tipo de entrada inválido: ${ticket.type}`,
            },
            400,
          );
        }

        if (ticketType.disponibles < quantity) {
          return c.json(
            {
              error: `No hay suficientes entradas de tipo ${ticketType.nombre}`,
            },
            400,
          );
        }

        ticketTypeUpdates.set(ticketType.id, {
          disponibles: ticketType.disponibles - quantity,
        });
      }
    }

    if (evento.entradas < totalTickets) {
      return c.json(
        {
          error:
            "No hay suficientes entradas totales disponibles",
        },
        400,
      );
    }

    // 4️⃣ Crear compra
    const { data: nuevaCompra, error: compraError } =
      await supabase
        .from("compra")
        .insert({
          fechacompra: new Date().toISOString(),
          cantidadentradas: totalTickets,
          precioentrada: evento.precioentrada || 0,
          totalcompra: totalAmount,
          usuario_id: userId,
          evento_id: eventId,
        })
        .select()
        .single();

    if (compraError)
      return c.json({ error: "Error al crear compra" }, 500);

    // 5️⃣ Crear entradas individuales
    const entradasCreadas = [];
    for (const ticket of tickets) {
      const quantity = ticket.quantity || 1;
      const precio = ticket.price || evento.precioentrada || 0;

      for (let i = 0; i < quantity; i++) {
        const { data: nuevaEntrada, error: entradaError } =
          await supabase
            .from("entrada")
            .insert({
              precio,
              evento_id: eventId,
              usuario_id: userId,
              compra_id: nuevaCompra.id,
              ticket_type_id:
                ticket.type !== "rifa" ? ticket.type : null,
            })
            .select()
            .single();

        if (entradaError) continue;

        const codigoQR = generateQRCode();
        await supabase.from("codigoqr").insert({
          entrada_id: nuevaEntrada.id,
          codigo: codigoQR,
        });

        entradasCreadas.push({
          id: nuevaEntrada.id,
          purchaseId: nuevaCompra.id,
          eventId,
          ticketType: ticket.name || "General",
          qrCode: codigoQR,
          used: false,
          raffleNumber: ticket.details?.raffleNumber || null,
        });
      }
    }

    // 6️⃣ Actualizar evento
    await supabase
      .from("evento")
      .update({
        entradas: evento.entradas - totalTickets,
        recaudacionactual:
          (evento.recaudacionactual || 0) + totalAmount,
        rafflenumbers: updatedRaffleNumbers,
      })
      .eq("id", eventId);

    // 7️⃣ Actualizar disponibilidad de tickets
    for (const [id, update] of ticketTypeUpdates) {
      await supabase
        .from("event_ticket_types")
        .update({ disponibles: update.disponibles })
        .eq("id", id);
    }

    // 8️⃣ Registrar donación
    if (donation && donation > 0) {
      await supabase.from("donacion").insert({
        cantidad: donation,
        fecha: new Date().toISOString(),
        usuario_id: userId,
        evento_id: eventId,
      });
    }

    await loadEvents();

    return c.json({
      success: true,
      purchaseId: nuevaCompra.id,
      tickets: entradasCreadas,
      message:
        "Compra exitosas" +
        (entra == false ? "no entra" : "entra"),
    });
  } catch (error: any) {
    console.error("Error:", error);
    return c.json({ error: error.message }, 500);
  }
});

app.get(
  "/make-server-e30de6da/purchases/:userId",
  async (c) => {
    const userId = c.req.param("userId");
    const { data: compras } = await supabase
      .from("compra")
      .select("*, evento(*)")
      .eq("usuario_id", parseInt(userId))
      .order("fechacompra", { ascending: false });

    const mapped = (compras || []).map((cp: any) => ({
      id: cp.id,
      eventId: cp.evento_id,
      eventTitle: cp.evento?.nombre,
      totalAmount: cp.totalcompra,
      ticketCount: cp.cantidadentradas,
      createdAt: cp.fechacompra,
    }));
    return c.json({ purchases: mapped });
  },
);

app.get("/make-server-e30de6da/tickets/:userId", async (c) => {
  const userId = c.req.param("userId");
  const { data: entradas } = await supabase
    .from("entrada")
    .select("*, evento(*), codigoqr(*)")
    .eq("usuario_id", parseInt(userId))
    .order("id", { ascending: false });

  // Cargar todos los event_ids únicos
  const eventIds = [
    ...new Set((entradas || []).map((e: any) => e.evento_id)),
  ];
  const { data: allTicketTypes } = await supabase
    .from("event_ticket_types")
    .select("*")
    .in("event_id", eventIds);

  const mapped = (entradas || []).map((ent: any) => {
    let ticketTypeName = "General";

    if (ent.evento?.tipoevento === "rifa") {
      ticketTypeName = `Participación Nº ${ent.id}`;
    } else if (
      ent.ticket_type_id && //todo revisar
      allTicketTypes &&
      allTicketTypes.length > 0
    ) {
      // Buscar el tipo de entrada en la tabla
      const ticketType = allTicketTypes.find(
        (tt: any) => tt.id === ent.ticket_type_id,
      );
      if (ticketType) ticketTypeName = ticketType.nombre;
    }

    return {
      id: ent.id,
      eventId: ent.evento_id,
      eventTitle: ent.evento?.nombre,
      eventDate: ent.evento?.fecha,
      ticketType: ticketTypeName,
      qrCode: ent.codigoqr?.codigo,
      used: false,
      purchaseId: ent.compra_id,
      raffleNumber: ent.raffleNumber || null,
    };
  });
  return c.json({ tickets: mapped });
});

app.get("/make-server-e30de6da/events", async (c) => {
  const { data: eventos } = await supabase
    .from("evento")
    .select("*")
    .order("fecha", { ascending: true });
  return c.json({ events: eventos || [] });
});

app.get("/make-server-e30de6da/health", (c) =>
  c.json({ status: "ok" }),
);

Deno.serve(app.fetch);