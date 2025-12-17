import { useState, useEffect } from "react";
import {
  Ticket as TicketIcon,
  Gift,
  User,
  Edit,
  Loader,
  LogOut,
  Wallet as WalletIcon,
  Plus,
} from "lucide-react";
import { Link } from "./Link";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../utils/supabaseClient";
import { WalletModal } from "./WalletModal";

interface UserAccountProps {
  language: "es" | "en";
  simplifiedMode: boolean;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  dni?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  isMember?: boolean;
  memberSince?: string;
  role: string;
  createdAt: string;
  wallet?: number;
}

interface Ticket {
  id: string;
  eventId: string;
  eventTitle?: string;
  eventDate?: string;
  ticketType: string;
  qrCode: string;
  used: boolean;
  purchaseId: string;
}

interface Purchase {
  id: string;
  eventId: string;
  totalAmount: number;
  donation: number;
  createdAt: string;
  eventTitle?: string;
}

interface Donation {
  id: string;
  amount: number;
  createdAt: string;
  eventTitle?: string;
}

export function UserAccount({
  language,
  simplifiedMode,
}: UserAccountProps) {
  const { user, signOut, refreshUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserProfile | null>(
    null,
  );
  const [donations, setDonations] = useState<Donation[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    dni: "",
    address: "",
    postalCode: "",
  });
  const [showWalletModal, setShowWalletModal] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Obtener perfil del usuario directamente de Supabase
      const { data: profileData, error: profileError } =
        await supabase
          .from("usuario")
          .select("*")
          .eq("id", parseInt(user.id))
          .single();

      if (profileError || !profileData) {
        console.error("Error obteniendo perfil:", profileError);
        setLoading(false);
        return;
      }

      // Crear el objeto userData con los datos de la base de datos
      setUserData({
        id: String(profileData.id),
        email: profileData.email,
        name: `${profileData.nombre || ""} ${profileData.apellidos || ""}`.trim(),
        phone: profileData.telefono || "",
        dni: profileData.dni || "",
        address: profileData.direccion || "",
        city: "",
        postalCode: profileData.codigopostal || "",
        isMember: profileData.socio,
        memberSince: profileData.fechasocio || "",
        /*? profileData.fechanacimiento
          : undefined,*/
        role: user.role || "user",
        createdAt:
          profileData.fechanacimiento ||
          new Date().toISOString(),
        wallet: profileData.monedero || 0,
      });

      setEditForm({
        name: `${profileData.nombre || ""} ${profileData.apellidos || ""}`.trim(),
        phone: profileData.telefono || "",
        dni: profileData.dni || "",
        address: profileData.direccion || "",
        postalCode: profileData.codigopostal || "",
      });

      // Obtener entradas del usuario
      const { data: ticketsData } = await supabase
        .from("entrada")
        .select("*, evento(*)")
        .eq("usuario_id", parseInt(user.id));

      if (ticketsData) {
        // Cargar todos los event_ids únicos para obtener los ticket types
        const eventIds = [...new Set(ticketsData.map((t: any) => t.evento_id))];
        const { data: allTicketTypes } = await supabase
          .from("event_ticket_types")
          .select("*")
          .in("event_id", eventIds);

        const mappedTickets = ticketsData.map((t: any) => {
          // LÓGICA CORREGIDA PARA DETERMINAR EL NOMBRE DEL TIPO DE ENTRADA
          let typeName = "General";

          if (t.evento?.tipoevento === "rifa") {
            typeName = `Participación Nº ${t.zona}`;
          } else if (allTicketTypes && allTicketTypes.length > 0) {
            // Buscar el tipo de entrada en la tabla
            const ticketType = allTicketTypes.find(
              (tt: any) => tt.event_id === t.evento_id && tt.zona === t.zona && tt.fila === t.fila,
            );
            if (ticketType) {
              typeName = ticketType.nombre;
            }
          }

          return {
            id: String(t.id),
            eventId: String(t.evento_id),
            eventTitle: t.evento?.nombre || "Evento",
            eventDate: t.evento?.fecha,
            ticketType: typeName, // Usamos el nombre encontrado
            qrCode: `TICKET-${t.id}`, // Generamos un string visual para el QR ya que la tabla codigoqr no siempre se cruza aquí
            used: false,
            purchaseId: String(t.compra_id),
          };
        });
        setTickets(mappedTickets);
      }

      // Obtener compras del usuario
      const { data: purchasesData } = await supabase
        .from("compra")
        .select("*, evento(*)")
        .eq("usuario_id", parseInt(user.id))
        .order("fechacompra", { ascending: false });

      if (purchasesData) {
        const mappedPurchases = purchasesData.map((p: any) => ({
          id: String(p.id),
          eventId: String(p.evento_id),
          totalAmount: p.totalcompra || 0,
          donation: 0, // La tabla compra no tiene campo donación explícito en este contexto
          createdAt: p.fechacompra || new Date().toISOString(),
          eventTitle: p.evento?.nombre || "Evento",
        }));
        setPurchases(mappedPurchases);
      }

      // Obtener donaciones del usuario
      const { data: donationsData, error: donationsError } =
        await supabase
          .from("donacion")
          .select("id, cantidad, fecha, evento(nombre)")
          .eq("usuario_id", parseInt(user.id))
          .order("fecha", { ascending: false });

      if (donationsError) {
        console.error(
          "Error obteniendo donaciones:",
          donationsError,
        );
      } else if (donationsData) {
        const mappedDonations = donationsData.map((d: any) => ({
          id: String(d.id),
          amount: d.cantidad,
          createdAt: d.fecha,
          eventTitle: d.evento?.nombre || "Donación",
        }));

        setDonations(mappedDonations);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      // Separar nombre y apellidos
      const nameParts = editForm.name.trim().split(" ");
      const nombre = nameParts[0] || "";
      const apellidos = nameParts.slice(1).join(" ") || "";

      // Actualizar en la base de datos usando el email del usuario
      const { data, error } = await supabase
        .from("usuario")
        .update({
          nombre: nombre,
          apellidos: apellidos,
          telefono: editForm.phone,
          dni: editForm.dni,
          direccion: editForm.address,
          codigopostal: editForm.postalCode,
        })
        .eq("email", user.email)
        .select()
        .single();

      if (error) {
        console.error("Error actualizando perfil:", error);
        alert("Error al actualizar el perfil");
        return;
      }

      // Actualizar el estado local
      setUserData({
        ...userData!,
        name: editForm.name,
        phone: editForm.phone,
        dni: editForm.dni,
        address: editForm.address,
        postalCode: editForm.postalCode,
      });

      refreshUser();

      setEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error al guardar el perfil");
    }
  };

  const translations = {
    es: {
      myAccount: "Mi Cuenta",
      myTickets: "Mis Entradas",
      myDonations: "Mis Donaciones",
      personalData: "Datos Personales",
      memberStatus: "Estado de Socio",
      wallet: "Monedero",
      walletBalance: "Saldo disponible",
      addMoney: "Añadir dinero",
      backToEvents: "Volver a eventos",
      edit: "Editar",
      save: "Guardar",
      cancel: "Cancelar",
      signOut: "Cerrar Sesión",
      name: "Nombre completo",
      email: "Email",
      phone: "Teléfono",
      dni: "DNI/NIE",
      address: "Dirección",
      city: "Ciudad",
      postalCode: "Código Postal",
      member: "Socio desde",
      notMember: "No eres socio",
      becomeMember: "Hazte socio",
      ticketType: "Tipo",
      date: "Fecha",
      used: "Utilizada",
      notUsed: "Sin usar",
      downloadTicket: "Descargar",
      amount: "Cantidad",
      total: "Total donado",
      noTickets: "No tienes entradas aún",
      noPurchases: "No has realizado compras aún",
      loading: "Cargando...",
    },
    en: {
      myAccount: "My Account",
      myTickets: "My Tickets",
      myDonations: "My Donations",
      personalData: "Personal Data",
      memberStatus: "Member Status",
      wallet: "Wallet",
      walletBalance: "Available balance",
      addMoney: "Add money",
      backToEvents: "Back to events",
      edit: "Edit",
      save: "Save",
      cancel: "Cancel",
      signOut: "Sign Out",
      name: "Full Name",
      email: "Email",
      phone: "Phone",
      dni: "ID Number",
      address: "Address",
      city: "City",
      postalCode: "Postal Code",
      member: "Member since",
      notMember: "Not a member",
      becomeMember: "Become a member",
      ticketType: "Type",
      date: "Date",
      used: "Used",
      notUsed: "Not used",
      downloadTicket: "Download",
      amount: "Amount",
      total: "Total donated",
      noTickets: "No tickets yet",
      noPurchases: "No purchases yet",
      loading: "Loading...",
    },
  };

  const t = translations[language];

  const totalDonations = donations.reduce(
    (sum, d) => sum + d.amount,
    0,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-[#00A859] mx-auto mb-4" />
          <p className="text-xl text-gray-600">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">
            Error al cargar los datos del usuario
          </p>
          <Link
            href="/"
            className="text-[#00A859] hover:underline mt-4 inline-block"
          >
            {t.backToEvents}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        className={`max-w-6xl mx-auto px-4 ${simplifiedMode ? "py-8" : "py-12"}`}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className={simplifiedMode ? "text-3xl" : ""}>
            {t.myAccount}
          </h1>
          <Link
            href="/"
            className={`text-[#00A859] hover:underline ${simplifiedMode ? "text-xl" : ""}`}
          >
            {t.backToEvents}
          </Link>
        </div>

        <div
          className={`grid gap-6 ${simplifiedMode ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"}`}
        >
          {/* Left Column - Personal Data */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2
                  className={simplifiedMode ? "text-2xl" : ""}
                >
                  {t.personalData}
                </h2>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className={`flex items-center gap-2 text-[#00A859] hover:underline ${
                      simplifiedMode ? "text-lg" : ""
                    }`}
                  >
                    <Edit
                      className={
                        simplifiedMode ? "w-6 h-6" : "w-4 h-4"
                      }
                    />
                    {t.edit}
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditing(false);
                        setEditForm({
                          name: userData.name || "",
                          phone: userData.phone || "",
                          dni: userData.dni || "",
                          address: userData.address || "",
                          postalCode: userData.postalCode || "",
                        });
                      }}
                      className="text-gray-600 hover:underline"
                    >
                      {t.cancel}
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="text-[#00A859] hover:underline"
                    >
                      {t.save}
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-gray-600 mb-1 ${simplifiedMode ? "text-lg" : "text-sm"}`}
                  >
                    {t.name}
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          name: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-lg ${simplifiedMode ? "text-lg" : ""}`}
                    />
                  ) : (
                    <p
                      className={
                        simplifiedMode ? "text-lg" : ""
                      }
                    >
                      {userData.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-gray-600 mb-1 ${simplifiedMode ? "text-lg" : "text-sm"}`}
                  >
                    {t.email}
                  </label>
                  <p
                    className={`${simplifiedMode ? "text-lg" : ""} text-gray-500`}
                  >
                    {userData.email}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    El email no se puede cambiar
                  </p>
                </div>

                <div>
                  <label
                    className={`block text-gray-600 mb-1 ${simplifiedMode ? "text-lg" : "text-sm"}`}
                  >
                    {t.phone}
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          phone: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-lg ${simplifiedMode ? "text-lg" : ""}`}
                      placeholder="+34 600 000 000"
                    />
                  ) : (
                    <p
                      className={
                        simplifiedMode ? "text-lg" : ""
                      }
                    >
                      {userData.phone || "-"}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-gray-600 mb-1 ${simplifiedMode ? "text-lg" : "text-sm"}`}
                  >
                    {t.dni}
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={editForm.dni}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          dni: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-lg ${simplifiedMode ? "text-lg" : ""}`}
                      placeholder="12345678A"
                    />
                  ) : (
                    <p
                      className={
                        simplifiedMode ? "text-lg" : ""
                      }
                    >
                      {userData.dni || "-"}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-gray-600 mb-1 ${simplifiedMode ? "text-lg" : "text-sm"}`}
                  >
                    {t.address}
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={editForm.address}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          address: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-lg ${simplifiedMode ? "text-lg" : ""}`}
                      placeholder="Calle Principal, 123"
                    />
                  ) : (
                    <p
                      className={
                        simplifiedMode ? "text-lg" : ""
                      }
                    >
                      {userData.address || "-"}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={`block text-gray-600 mb-1 ${simplifiedMode ? "text-lg" : "text-sm"}`}
                  >
                    {t.postalCode}
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={editForm.postalCode}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          postalCode: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-lg ${simplifiedMode ? "text-lg" : ""}`}
                      placeholder="29018"
                    />
                  ) : (
                    <p
                      className={
                        simplifiedMode ? "text-lg" : ""
                      }
                    >
                      {userData.postalCode || "-"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Member Status */}
            <div
              className={`rounded-xl shadow-lg p-6 mb-6 ${
                userData.isMember
                  ? "bg-[#00A859] text-white"
                  : "bg-white"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <User
                  className={
                    simplifiedMode ? "w-8 h-8" : "w-6 h-6"
                  }
                />
                <h3 className={simplifiedMode ? "text-xl" : ""}>
                  {t.memberStatus}
                </h3>
              </div>
              {userData.isMember && userData.memberSince ? (
                <p className={simplifiedMode ? "text-lg" : ""}>
                  {t.member}{" "}
                  {new Date(
                    userData.memberSince,
                  ).toLocaleDateString(
                    language === "es" ? "es-ES" : "en-US",
                  )}
                </p>
              ) : (
                <>
                  <p
                    className={`mb-4 ${simplifiedMode ? "text-lg" : ""}`}
                  >
                    {t.notMember}
                  </p>
                  <Link
                    href="/become-member"
                    className={`block w-full text-center bg-[#00A859] text-white rounded-lg hover:bg-[#008A47] transition-colors ${
                      simplifiedMode ? "py-4 text-xl" : "py-2"
                    }`}
                  >
                    {t.becomeMember}
                  </Link>
                </>
              )}
            </div>

            {/* Monedero Digital */}
            <div className="bg-gradient-to-br from-[#00A859] to-[#008A47] text-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <WalletIcon
                  className={
                    simplifiedMode ? "w-8 h-8" : "w-6 h-6"
                  }
                />
                <h3 className={simplifiedMode ? "text-xl" : ""}>
                  {t.wallet}
                </h3>
              </div>
              <div className="mb-4">
                <p
                  className={`opacity-90 mb-1 ${simplifiedMode ? "text-lg" : "text-sm"}`}
                >
                  {t.walletBalance}
                </p>
                <p
                  className={
                    simplifiedMode ? "text-5xl" : "text-4xl"
                  }
                >
                  {(userData.wallet || 0).toFixed(2)}€
                </p>
              </div>
              <button
                onClick={() => setShowWalletModal(true)}
                className={`w-full bg-white text-[#00A859] rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 ${
                  simplifiedMode ? "py-4 text-xl" : "py-3"
                }`}
              >
                <Plus
                  className={
                    simplifiedMode ? "w-6 h-6" : "w-5 h-5"
                  }
                />
                <span>{t.addMoney}</span>
              </button>
            </div>

            {/* Cerrar Sesión */}
            <button
              onClick={handleSignOut}
              className={`w-full bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-lg ${
                simplifiedMode ? "py-4 text-xl" : "py-3"
              }`}
            >
              <LogOut
                className={
                  simplifiedMode ? "w-8 h-8" : "w-5 h-5"
                }
              />
              <span>{t.signOut}</span>
            </button>
          </div>

          {/* Right Column - Tickets and Donations */}
          <div className="lg:col-span-2">
            {/* Tickets */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <TicketIcon
                  className={
                    simplifiedMode ? "w-8 h-8" : "w-6 h-6"
                  }
                />
                <h2
                  className={simplifiedMode ? "text-2xl" : ""}
                >
                  {t.myTickets}
                </h2>
              </div>
              {tickets.length > 0 ? (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex items-center justify-between p-4 border-2 rounded-xl"
                    >
                      <div className="flex-1">
                        <h3
                          className={
                            simplifiedMode ? "text-xl" : ""
                          }
                        >
                          {ticket.eventTitle || "Evento"}
                        </h3>
                        <p
                          className={`text-gray-600 ${simplifiedMode ? "text-lg" : "text-sm"}`}
                        >
                          {ticket.ticketType} •{" "}
                          {ticket.eventDate
                            ? new Date(
                                ticket.eventDate,
                              ).toLocaleDateString(
                                language === "es"
                                  ? "es-ES"
                                  : "en-US",
                              )
                            : "-"}
                        </p>
                        <p
                          className={`mt-1 ${simplifiedMode ? "text-lg" : "text-sm"} ${
                            ticket.used
                              ? "text-red-600"
                              : "text-[#00A859]"
                          }`}
                        >
                          {ticket.used ? t.used : t.notUsed}
                        </p>
                      </div>
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="text-xs text-center">
                            <div className="mb-1">QR</div>
                            <div className="text-[8px]">
                              {ticket.qrCode.slice(0, 12)}...
                            </div>
                          </div>
                        </div>
                        <button
                          className={`text-[#00A859] hover:underline ${
                            simplifiedMode
                              ? "text-lg"
                              : "text-sm"
                          }`}
                        >
                          {t.downloadTicket}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  {t.noTickets}
                </p>
              )}
            </div>

            {/* Donations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <Gift
                  className={
                    simplifiedMode ? "w-8 h-8" : "w-6 h-6"
                  }
                />
                <h2
                  className={simplifiedMode ? "text-2xl" : ""}
                >
                  {t.myDonations}
                </h2>
              </div>
              {donations.length > 0 ? (
                <>
                  <div className="space-y-3 mb-6">
                    {donations.map((donation) => (
                      <div
                        key={donation.id}
                        className="flex justify-between items-center p-4 border rounded-xl"
                      >
                        <div>
                          <p
                            className={
                              simplifiedMode ? "text-lg" : ""
                            }
                          >
                            {donation.eventTitle}
                          </p>
                          <p
                            className={`text-gray-600 ${simplifiedMode ? "text-lg" : "text-sm"}`}
                          >
                            {new Date(
                              donation.createdAt,
                            ).toLocaleDateString(
                              language === "es"
                                ? "es-ES"
                                : "en-US",
                            )}
                          </p>
                        </div>
                        <p
                          className={`text-[#00A859] ${simplifiedMode ? "text-2xl" : "text-xl"}`}
                        >
                          {donation.amount}€
                        </p>
                      </div>
                    ))}
                  </div>

                  <div
                    className={`flex justify-between items-center p-4 bg-[#00A859] text-white rounded-xl ${
                      simplifiedMode ? "text-2xl" : "text-xl"
                    }`}
                  >
                    <span>{t.total}:</span>
                    <span>{totalDonations.toFixed(2)}€</span>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No has realizado donaciones aún
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de añadir dinero */}
      {showWalletModal && (
        <WalletModal
          language={language}
          simplifiedMode={simplifiedMode}
          userId={userData.id}
          currentBalance={userData.wallet || 0}
          onClose={() => setShowWalletModal(false)}
          onSuccess={loadUserData}
        />
      )}
    </div>
  );
}