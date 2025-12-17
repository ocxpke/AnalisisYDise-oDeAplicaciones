import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Check,
  CreditCard,
  Wallet,
  Smartphone,
  Download,
  Mail,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import { generateQRCode } from "../utils/mockData";
import { useEvents } from "../contexts/EventsContext";
import { CartItem, User, Ticket } from "../types";
import { Link } from "./Link";
import { TicketView } from "./TicketView";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../utils/supabaseClient";
import {
  projectId,
  publicAnonKey,
} from "../utils/supabase/info";
import { VenueMap } from "./VenueMap";

interface PurchaseFlowProps {
  eventId: string;
  language: "es" | "en";
  simplifiedMode: boolean;
  onComplete: () => void;
}

export function PurchaseFlow({
  eventId,
  language,
  simplifiedMode,
  onComplete,
}: PurchaseFlowProps) {
  const { events, refreshEvents } = useEvents();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [donation, setDonation] = useState(0);
  const [acceptsMarketing, setAcceptsMarketing] =
    useState(false);
  const [acceptsGDPR, setAcceptsGDPR] = useState(false);
  const [userData, setUserData] = useState<Partial<User>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dni: "",
    address: "",
    isMember: false,
  });
  const [selectedNumbers, setSelectedNumbers] = useState<
    number[]
  >([]);
  const [selectedTickets, setSelectedTickets] = useState<{
    [ticketId: string]: number;
  }>({});
  const [generatedTickets, setGeneratedTickets] = useState<
    Ticket[]
  >([]);
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "paypal" | "bizum" | "wallet"
  >("card");
  const [walletBalance, setWalletBalance] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] =
    useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-e30de6da`;

  const event = events.find((e) => e.id === eventId);

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          const { data: profileData, error } = await supabase
            .from("usuario")
            .select("*")
            .eq("id", parseInt(user.id))
            .single();

          if (error || !profileData) {
            console.error("Error obteniendo perfil:", error);
            return;
          }

          setWalletBalance(profileData.monedero || 0);

          setUserData({
            firstName: profileData.nombre || "",
            lastName: profileData.apellidos || "",
            email: profileData.email || "",
            phone: profileData.telefono || "",
            dni: profileData.dni || "",
            address: profileData.direccion || "",
            isMember: profileData.socio || false,
          });

          // 🔹 Precargar datos de pago si existen
          const { data: lastPayment } = await supabase
            .from("pago")
            .select("*")
            .eq("usuario_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          if (lastPayment) {
            setCardNumber(lastPayment.tarjeta_numero || "");
            setCardName(lastPayment.titular || "");
            setExpiryDate(lastPayment.expiracion || "");
            setCvv(lastPayment.cvv || "");
            setCity(
              lastPayment.ciudad || profileData.ciudad || "",
            );
            setPostalCode(
              lastPayment.codigopostal ||
                profileData.codigopostal ||
                "",
            );
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
        }
      }
    };

    loadUserData();
  }, [user]);

  if (!event) return null;

  const translations = {
    es: {
      step1: "Selección de entradas",
      step2: "Datos personales",
      step3: "Pago",
      step4: "Confirmación",
      selectTicketType: "Elige el tipo de entrada",
      quantity: "Cantidad",
      donation: "Donación adicional (opcional)",
      acceptMarketing: "Quiero recibir información de CUDECA",
      acceptGDPR: "Acepto la cesión de datos según RGPD",
      continue: "Continuar",
      back: "Volver",
      firstName: "Nombre",
      lastName: "Apellidos",
      email: "Email",
      phone: "Teléfono",
      dni: "DNI",
      address:
        "Dirección (opcional, para certificado de donación)",
      isMember: "Soy socio de CUDECA",
      becomeMember: "Quiero hacerme socio ahora",
      paymentMethod: "Método de pago",
      card: "Tarjeta Bancaria",
      paypal: "Paypal",
      bizum: "Bizum",
      wallet: "Monedero Digital",
      walletBalance: "Saldo disponible",
      insufficientBalance:
        "Saldo insuficiente. Por favor, añade dinero a tu monedero o selecciona otro método de pago.",
      noExtraFees: "CUDECA no cobra gastos extra ni seguros",
      completePurchase: "Completar compra",
      thankYou: "¡Gracias por tu compra!",
      purchaseComplete: "Tu compra se ha completado con éxito",
      ticketsSent: "Tus entradas han sido enviadas a",
      downloadPDF: "Descargar PDF",
      sendEmail: "Enviar por email",
      backToEvents: "Volver a eventos",
      total: "Total",
      selectNumbers: "Selecciona tus números",
      autoSelect: "Selección automática",
      numbersSelected: "números seleccionados",
      available: "Disponible",
      soldOut: "Agotado",
      cardNumber: "Número de Tarjeta",
      cardName: "Nombre del Titular",
      expiryDate: "Fecha de Expiración (MM/AA)",
      cvv: "CVV",
      city: "Ciudad",
      postalCode: "Código Postal",
      cardDetails: "Datos de la Tarjeta",
      billingInfo: "Información de Facturación",
      completeAllFields:
        "Por favor, completa todos los campos de la tarjeta",
      purchaseSuccess: "¡Compra realizada con éxito!",
      purchaseSuccessMessage:
        "Tu compra se ha procesado correctamente. Recibirás un email con tus entradas.",
    },
    en: {
      step1: "Ticket selection",
      step2: "Personal details",
      step3: "Payment",
      step4: "Confirmation",
      selectTicketType: "Choose ticket type",
      quantity: "Quantity",
      donation: "Additional donation (optional)",
      acceptMarketing:
        "I want to receive information from CUDECA",
      acceptGDPR: "I accept data processing according to GDPR",
      continue: "Continue",
      back: "Back",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      phone: "Phone",
      dni: "ID Number",
      address: "Address (optional, for donation certificate)",
      isMember: "I am a CUDECA member",
      becomeMember: "I want to become a member now",
      paymentMethod: "Payment method",
      card: "Credit/Debit Card",
      paypal: "Paypal",
      bizum: "Bizum",
      wallet: "Digital Wallet",
      walletBalance: "Available balance",
      insufficientBalance:
        "Insufficient balance. Please add money to your wallet or select another payment method.",
      noExtraFees:
        "CUDECA does not charge extra fees or insurance",
      completePurchase: "Complete purchase",
      thankYou: "Thank you for your purchase!",
      purchaseComplete:
        "Your purchase has been completed successfully",
      ticketsSent: "Your tickets have been sent to",
      downloadPDF: "Download PDF",
      sendEmail: "Send by email",
      backToEvents: "Back to events",
      total: "Total",
      selectNumbers: "Select your numbers",
      autoSelect: "Auto select",
      numbersSelected: "numbers selected",
      available: "Available",
      soldOut: "Sold out",
      cardNumber: "Card Number",
      cardName: "Cardholder Name",
      expiryDate: "Expiry Date (MM/YY)",
      cvv: "CVV",
      city: "City",
      postalCode: "Postal Code",
      cardDetails: "Card Details",
      billingInfo: "Billing Information",
      completeAllFields: "Please complete all card fields",
      purchaseSuccess: "Purchase Successful!",
      purchaseSuccessMessage:
        "Your purchase has been processed successfully. You will receive an email with your tickets.",
    },
  };

  const t = translations[language];

  const calculateTotal = () => {
    if (event.type === "rifa") {
      const raffleTotal = selectedNumbers.length * event.price;
      return raffleTotal + donation;
    }
    const ticketsTotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    return ticketsTotal + donation;
  };
  const totalCost = calculateTotal();

  const handleQuantityChange = (
    ticketTypeId: number,
    delta: number,
  ) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.ticketTypeId === ticketTypeId,
      );
      const ticketType = event.ticketTypes?.find(
        (tt) => tt.id === ticketTypeId,
      );

      if (!ticketType) return prevCart;

      if (existingItem) {
        const newQuantity = Math.max(
          0,
          existingItem.quantity + delta,
        );
        if (newQuantity === 0) {
          return prevCart.filter(
            (item) => item.ticketTypeId !== ticketTypeId,
          );
        }
        return prevCart.map((item) =>
          item.ticketTypeId === ticketTypeId
            ? { ...item, quantity: newQuantity }
            : item,
        );
      } else if (delta > 0) {
        return [
          ...prevCart,
          {
            eventId,
            ticketTypeId,
            quantity: 1,
            price: ticketType.price,
            ticketTypeName: ticketType.name,
          },
        ];
      }
      return prevCart;
    });
  };

  const handleNumberSelect = (number: number) => {
    setSelectedNumbers((prev) => {
      if (prev.includes(number)) {
        return prev.filter((n) => n !== number);
      }
      return [...prev, number];
    });
  };

  const handleAutoSelect = (count: number) => {
    if (!event.rafflenumbers) return;
    const available = event.rafflenumbers
      .filter((rn) => rn.available)
      .map((rn) => rn.number)
      .slice(0, count);
    setSelectedNumbers(available);
  };

  // Codigo para gestionar el bloqueo de botones teniendo en cuenta el campo entradas de la tabla evento
  /*const handleTicketChange = (
    ticketId: string,
    qty: number,
  ) => {
    setSelectedTickets((prev) => ({
      ...prev,
      [ticketId]: qty,
    }));
  };
  const totalSelected = Object.values(selectedTickets).reduce(
    (sum, qty) => sum + qty,
    0,
  );
  const canAddTickets = totalSelected <= event.availableTickets;*/

  const canContinueStep1 = () => {
    if (event.type === "rifa") {
      return selectedNumbers.length > 0 && acceptsGDPR;
    }
    return cart.length > 0 && acceptsGDPR;
  };

  const canContinueStep2 = () => {
    return (
      userData.firstName &&
      userData.lastName &&
      userData.email &&
      userData.phone
    );
  };

  const handleCompletePurchase = async () => {
    if (paymentMethod === "card") {
      if (
        !cardNumber ||
        !cardName ||
        !expiryDate ||
        !cvv ||
        !city ||
        !postalCode
      ) {
        alert(t.completeAllFields);
        return;
      }
    }

    if (paymentMethod === "bizum") {
      if (
        !userData.firstName ||
        !userData.lastName ||
        !userData.email ||
        !userData.phone ||
        !userData.address ||
        !city ||
        !postalCode
      ) {
        alert(t.completeAllFields);
        return;
      }
    }

    // Validar saldo del monedero si el método de pago es wallet
    if (paymentMethod === "wallet") {
      if (walletBalance < totalCost) {
        toast.error(t.insufficientBalance);
        return;
      }
    }

    setIsProcessing(true);

    try {
      const ticketsData: Array<{
        id?: number;
        type?: string;
        name: string;
        price: number;
        quantity: number;
        details?: { raffleNumber: number };
      }> = [];

      if (event.type === "rifa") {
        selectedNumbers.forEach((number) => {
          ticketsData.push({
            type: "rifa",
            name: "Rifa",
            price: event.price || 0,
            quantity: 1,
            details: { raffleNumber: number },
          });
        });
      } else {
        cart.forEach((item) => {
          const ticketType = event.ticketTypes?.find(
            (tt) => tt.id === item.ticketTypeId,
          );
          if (!ticketType) return; // Evitar errores si no encuentra el tipo

          ticketsData.push({
            id: ticketType.id,
            name: ticketType.name || "General",
            price: item.price || 0,
            quantity: item.quantity,
          });
        });
      }

      let pagoId: number | null = null;

      const { data: pago, error: pagoError } = await supabase
        .from("pago")
        .insert({
          usuario_id: user ? parseInt(user.id) : null,
          metodo: paymentMethod,
          tarjeta_numero:
            paymentMethod === "card" ? cardNumber : null,
          titular: paymentMethod === "card" ? cardName : null,
          expiracion:
            paymentMethod === "card" ? expiryDate : null,
          cvv: paymentMethod === "card" ? cvv : null,
          email_pago:
            paymentMethod === "paypal" ? userData.email : null,
          telefono:
            paymentMethod === "bizum" ? userData.phone : null,
          ciudad: city,
          codigopostal: postalCode,
        })
        .select("id")
        .single();

      if (pagoError) {
        console.error("Error saving payment:", pagoError);
        throw new Error("Error guardando datos de pago");
      }

      pagoId = pago?.id || null;

      const purchaseData = {
        eventId,
        tickets: ticketsData,
        donation,
        paymentMethod,
        totalAmount: totalCost,
        pagoId,
        userId: user?.id || null,
        userData: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          phone: userData.phone,
          dni: userData.dni,
          address: userData.address,
          isMember: userData.isMember,
        },
        eventData: {
          title: event.title,
          date: event.date,
          location: event.location,
        },
      };

      const response = await fetch(`${baseUrl}/purchases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(purchaseData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error creating purchase:", errorData);
        throw new Error(
          errorData.error || "Error al procesar la compra",
        );
      }

      const result = await response.json();
      console.log(result);

      // BLOQUEAR NÚMEROS DE RIFA TRAS COMPRA
      if (event.type === "rifa") {
        const updatedRaffleNumbers = event.rafflenumbers.map(
          (rn) =>
            selectedNumbers.includes(rn.number)
              ? { ...rn, available: false }
              : rn,
        );
        const { error: raffleError } = await supabase
          .from("evento")
          .update({ rafflenumbers: updatedRaffleNumbers })
          .eq("id", eventId);
        if (raffleError) {
          console.error(
            "Error bloqueando números de rifa:",
            raffleError,
          );
          throw new Error(
            "Error al bloquear números de la rifa",
          );
        }
      }

      // SINCRONIZAR UI INMEDIATAMENTE (FIX DEL DELAY VISUAL)
      event.rafflenumbers = event.rafflenumbers.map((rn) =>
        selectedNumbers.includes(rn.number)
          ? { ...rn, available: false }
          : rn,
      );

      if (paymentMethod === "wallet" && user) {
        const newBalance = walletBalance - totalCost;
        const { error: walletError } = await supabase
          .from("usuario")
          .update({ monedero: newBalance })
          .eq("id", parseInt(user.id));

        if (walletError) {
          console.error(
            "Error actualizando monedero:",
            walletError,
          );
        } else {
          setWalletBalance(newBalance);
        }
      }

      const tickets: Ticket[] = result.tickets.map(
        (ticket: any) => ({
          id: ticket.id,
          purchaseId: ticket.purchaseId,
          eventId: ticket.eventId,
          ticketType: ticket.typeName || ticket.ticketType,
          qrCode: ticket.qrCode,
          used: ticket.used,
          raffleNumber: ticket.raffleNumber,
        }),
      );

      setGeneratedTickets(tickets);
      setShowSuccessMessage(true);

      // Refrescar eventos para actualizar disponibilidad
      await refreshEvents();

      setTimeout(() => {
        setShowSuccessMessage(false);
        setStep(4);
      }, 3000);
    } catch (error) {
      console.error("Error completing purchase:", error);
      alert(
        language === "es"
          ? "Error al completar la compra. Por favor, inténtalo de nuevo."
          : "Error completing purchase. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with event info */}
      <div className="bg-white shadow-sm">
        <div
          className={`max-w-4xl mx-auto px-4 ${simplifiedMode ? "py-6" : "py-4"}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className={simplifiedMode ? "text-2xl" : ""}>
                {event.title}
              </h2>
              <p
                className={`text-gray-600 ${simplifiedMode ? "text-lg" : "text-sm"}`}
              >
                {event.location}
              </p>
            </div>
            {step < 4 && (
              <Link
                href={`/event/${eventId}`}
                className={`text-[#00A859] hover:underline ${simplifiedMode ? "text-xl" : ""}`}
              >
                {t.back}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      {step < 4 && (
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className="flex items-center flex-1"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= s
                        ? "bg-[#00A859] text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        step > s
                          ? "bg-[#00A859]"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div
        className={`max-w-4xl mx-auto px-4 ${simplifiedMode ? "py-8" : "py-12"}`}
      >
        {/* Step 1: Ticket Selection */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2
              className={`mb-6 ${simplifiedMode ? "text-2xl" : ""}`}
            >
              {t.step1}
            </h2>

            {event.type === "rifa" && event.rafflenumbers && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className={simplifiedMode ? "text-xl" : ""}
                  >
                    {t.selectNumbers}
                  </h3>
                  <div className="flex gap-2">
                    {[1, 5, 10].map((count) => (
                      <button
                        key={count}
                        onClick={() => handleAutoSelect(count)}
                        className={`px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg ${
                          simplifiedMode ? "text-lg" : ""
                        }`}
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>
                <p
                  className={`text-gray-600 mb-4 ${simplifiedMode ? "text-lg" : ""}`}
                >
                  {selectedNumbers.length} {t.numbersSelected} -{" "}
                  {selectedNumbers.length * event.price}€
                </p>
                <div className="grid grid-cols-10 gap-2 max-h-96 overflow-y-auto p-4 bg-gray-50 rounded-lg">
                  {event.rafflenumbers
                    .slice(0, 100)
                    .map((rn) => (
                      <button
                        key={rn.number}
                        onClick={() =>
                          rn.available &&
                          handleNumberSelect(rn.number)
                        }
                        disabled={!rn.available}
                        className={`aspect-square rounded-lg flex items-center justify-center transition-all ${
                          selectedNumbers.includes(rn.number)
                            ? "bg-[#00A859] text-white"
                            : rn.available
                              ? "bg-white border-2 border-gray-300 hover:border-[#00A859]"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        } ${simplifiedMode ? "text-lg" : "text-sm"}`}
                      >
                        {rn.number}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {event.ticketTypes &&
              event.ticketTypes.length > 0 && (
                <div className="mb-8">
                  {/* Mapa del recinto */}
                  <VenueMap
                    venueMap={event.venueMap}
                    simplifiedMode={simplifiedMode}
                    language={language}
                  />

                  <h3
                    className={`mb-6 ${simplifiedMode ? "text-xl" : ""}`}
                  >
                    {t.selectTicketType}
                  </h3>
                  <div className="space-y-3">
                    {event.ticketTypes.map((ticketType) => {
                      const cartItem = cart.find(
                        (item) =>
                          item.ticketTypeId === ticketType.id,
                      );
                      const quantity = cartItem?.quantity || 0;

                      return (
                        <div
                          key={ticketType.id}
                          className="flex items-center justify-between p-5 border-2 rounded-xl bg-white hover:border-[#00A859] hover:shadow-md transition-all"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div
                              className="w-10 h-10 rounded"
                              style={{
                                backgroundColor:
                                  ticketType.color,
                              }}
                            />
                            <div className="flex-1">
                              <p
                                className={`${simplifiedMode ? "text-xl mb-1" : "mb-1"}`}
                              >
                                {ticketType.name}
                              </p>
                              {/* --- CAMBIO AQUÍ: Se eliminó la visualización de stock --- */}
                              <p
                                className={`text-gray-600 ${simplifiedMode ? "text-lg" : "text-sm"}`}
                              >
                                {ticketType.price}€
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  ticketType.id,
                                  -1,
                                )
                              }
                              disabled={quantity <= 0}
                              className={`w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center ${
                                simplifiedMode
                                  ? "text-2xl"
                                  : "text-xl"
                              }`}
                            >
                              −
                            </button>
                            <span
                              className={`w-12 text-center ${simplifiedMode ? "text-2xl" : "text-xl"}`}
                            >
                              {quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  ticketType.id,
                                  1,
                                )
                              }
                              disabled={
                                quantity >= ticketType.available
                              }
                              className={`w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center ${
                                simplifiedMode
                                  ? "text-2xl"
                                  : "text-xl"
                              }`}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* Donation */}
            <div className="mb-8">
              <label
                className={`block mb-2 ${simplifiedMode ? "text-xl" : ""}`}
              >
                {t.donation}
              </label>
              <input
                type="number"
                min="0"
                step="5"
                value={donation}
                onChange={(e) =>
                  setDonation(Number(e.target.value))
                }
                className={`w-full px-4 border-2 rounded-lg ${simplifiedMode ? "py-4 text-xl" : "py-3"}`}
                placeholder="0€"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-4 mb-8">
              <label
                className={`flex items-start gap-3 cursor-pointer ${simplifiedMode ? "text-lg" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={acceptsMarketing}
                  onChange={(e) =>
                    setAcceptsMarketing(e.target.checked)
                  }
                  className={`mt-1 ${simplifiedMode ? "w-6 h-6" : "w-5 h-5"}`}
                />
                <span>{t.acceptMarketing}</span>
              </label>
              <label
                className={`flex items-start gap-3 cursor-pointer ${simplifiedMode ? "text-lg" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={acceptsGDPR}
                  onChange={(e) =>
                    setAcceptsGDPR(e.target.checked)
                  }
                  className={`mt-1 ${simplifiedMode ? "w-6 h-6" : "w-5 h-5"}`}
                />
                <span>{t.acceptGDPR} *</span>
              </label>
            </div>

            {/* Total */}
            <div
              className={`flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg ${
                simplifiedMode ? "text-2xl" : "text-xl"
              }`}
            >
              <span>{t.total}:</span>
              <span className="text-[#00A859]">
                {totalCost}€
              </span>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!canContinueStep1()}
              className={`w-full bg-[#00A859] text-white rounded-xl hover:bg-[#008A47] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ${
                simplifiedMode
                  ? "py-6 text-2xl"
                  : "py-4 text-lg"
              }`}
            >
              {t.continue}
            </button>
          </div>
        )}

        {/* Step 2: Personal Data */}
        {step === 2 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2
              className={`mb-6 ${simplifiedMode ? "text-2xl" : ""}`}
            >
              {t.step2}
            </h2>

            <div className="space-y-4 mb-8">
              <div>
                <label
                  className={`block mb-2 ${simplifiedMode ? "text-xl" : ""}`}
                >
                  {t.firstName} *
                </label>
                <input
                  type="text"
                  value={userData.firstName}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      firstName: e.target.value,
                    })
                  }
                  className={`w-full px-4 border-2 rounded-lg ${simplifiedMode ? "py-4 text-xl" : "py-3"}`}
                />
              </div>

              <div>
                <label
                  className={`block mb-2 ${simplifiedMode ? "text-xl" : ""}`}
                >
                  {t.lastName} *
                </label>
                <input
                  type="text"
                  value={userData.lastName}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      lastName: e.target.value,
                    })
                  }
                  className={`w-full px-4 border-2 rounded-lg ${simplifiedMode ? "py-4 text-xl" : "py-3"}`}
                />
              </div>

              <div>
                <label
                  className={`block mb-2 ${simplifiedMode ? "text-xl" : ""}`}
                >
                  {t.email} *
                </label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      email: e.target.value,
                    })
                  }
                  className={`w-full px-4 border-2 rounded-lg ${simplifiedMode ? "py-4 text-xl" : "py-3"}`}
                />
              </div>

              <div>
                <label
                  className={`block mb-2 ${simplifiedMode ? "text-xl" : ""}`}
                >
                  {t.phone} *
                </label>
                <input
                  type="tel"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      phone: e.target.value,
                    })
                  }
                  className={`w-full px-4 border-2 rounded-lg ${simplifiedMode ? "py-4 text-xl" : "py-3"}`}
                />
              </div>

              <div>
                <label
                  className={`block mb-2 ${simplifiedMode ? "text-xl" : ""}`}
                >
                  {t.dni}
                </label>
                <input
                  type="text"
                  value={userData.dni}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      dni: e.target.value,
                    })
                  }
                  className={`w-full px-4 border-2 rounded-lg ${simplifiedMode ? "py-4 text-xl" : "py-3"}`}
                />
              </div>

              <div>
                <label
                  className={`block mb-2 ${simplifiedMode ? "text-xl" : ""}`}
                >
                  {t.address}
                </label>
                <input
                  type="text"
                  value={userData.address}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      address: e.target.value,
                    })
                  }
                  className={`w-full px-4 border-2 rounded-lg ${simplifiedMode ? "py-4 text-xl" : "py-3"}`}
                />
              </div>

              {/* Solo mostrar checkbox de socio si el usuario NO está autenticado */}
              {!user && (
                <label
                  className={`flex items-start gap-3 cursor-pointer ${simplifiedMode ? "text-lg" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={userData.isMember}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        isMember: e.target.checked,
                      })
                    }
                    className={`mt-1 ${simplifiedMode ? "w-6 h-6" : "w-5 h-5"}`}
                  />
                  <span>{t.isMember}</span>
                </label>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className={`flex-1 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors ${
                  simplifiedMode
                    ? "py-6 text-2xl"
                    : "py-4 text-lg"
                }`}
              >
                {t.back}
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!canContinueStep2()}
                className={`flex-1 bg-[#00A859] text-white rounded-xl hover:bg-[#008A47] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ${
                  simplifiedMode
                    ? "py-6 text-2xl"
                    : "py-4 text-lg"
                }`}
              >
                {t.continue}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2
              className={`mb-6 ${simplifiedMode ? "text-2xl" : ""}`}
            >
              {t.step3}
            </h2>

            <h3
              className={`mb-4 ${simplifiedMode ? "text-xl" : ""}`}
            >
              {t.paymentMethod}
            </h3>

            <div className="space-y-3 mb-8">
              <button
                className={`w-full flex items-center justify-center gap-3 p-4 border-2 rounded-xl transition-colors ${
                  paymentMethod === "card"
                    ? "border-[#00A859] bg-[#D4E8DC]"
                    : "border-gray-300 hover:border-[#00A859] hover:bg-gray-50"
                } ${simplifiedMode ? "text-xl" : ""}`}
                onClick={() => setPaymentMethod("card")}
              >
                <CreditCard
                  className={
                    simplifiedMode ? "w-8 h-8" : "w-6 h-6"
                  }
                />
                {t.card}
              </button>

              <button
                className={`w-full flex items-center justify-center gap-3 p-4 border-2 rounded-xl transition-colors ${
                  paymentMethod === "paypal"
                    ? "border-[#00A859] bg-[#D4E8DC]"
                    : "border-gray-300 hover:border-[#00A859] hover:bg-gray-50"
                } ${simplifiedMode ? "text-xl" : ""}`}
                onClick={() => setPaymentMethod("paypal")}
              >
                <Wallet
                  className={
                    simplifiedMode ? "w-8 h-8" : "w-6 h-6"
                  }
                />
                {t.paypal}
              </button>

              <button
                className={`w-full flex items-center justify-center gap-3 p-4 border-2 rounded-xl transition-colors ${
                  paymentMethod === "bizum"
                    ? "border-[#00A859] bg-[#D4E8DC]"
                    : "border-gray-300 hover:border-[#00A859] hover:bg-gray-50"
                } ${simplifiedMode ? "text-xl" : ""}`}
                onClick={() => setPaymentMethod("bizum")}
              >
                <Smartphone
                  className={
                    simplifiedMode ? "w-8 h-8" : "w-6 h-6"
                  }
                />
                {t.bizum}
              </button>

              {user && (
                <button
                  className={`w-full flex flex-col items-center justify-center gap-2 p-4 border-2 rounded-xl transition-colors ${
                    paymentMethod === "wallet"
                      ? "border-[#00A859] bg-[#D4E8DC]"
                      : "border-gray-300 hover:border-[#00A859] hover:bg-gray-50"
                  } ${simplifiedMode ? "text-xl" : ""}`}
                  onClick={() => setPaymentMethod("wallet")}
                >
                  <div className="flex items-center gap-3">
                    <Wallet
                      className={
                        simplifiedMode ? "w-8 h-8" : "w-6 h-6"
                      }
                    />
                    {t.wallet}
                  </div>
                  <div
                    className={`text-sm ${paymentMethod === "wallet" ? "text-[#00A859]" : "text-gray-600"}`}
                  >
                    {t.walletBalance}:{" "}
                    {walletBalance.toFixed(2)}€
                  </div>
                  {walletBalance < totalCost && (
                    <div className="text-xs text-red-600">
                      {t.insufficientBalance}
                    </div>
                  )}
                </button>
              )}
            </div>

            {/* Formulario de Tarjeta */}
            {paymentMethod === "card" && (
              <div className="mb-8">
                <h3
                  className={`mb-4 ${simplifiedMode ? "text-xl" : ""}`}
                >
                  {t.cardDetails}
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder={t.cardNumber}
                    value={cardNumber}
                    onChange={(e) =>
                      setCardNumber(e.target.value)
                    }
                    maxLength={19}
                    className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                      simplifiedMode ? "py-4 text-xl" : "py-3"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder={t.cardName}
                    value={cardName}
                    onChange={(e) =>
                      setCardName(e.target.value)
                    }
                    className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                      simplifiedMode ? "py-4 text-xl" : "py-3"
                    }`}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder={t.expiryDate}
                      value={expiryDate}
                      onChange={(e) =>
                        setExpiryDate(e.target.value)
                      }
                      maxLength={5}
                      className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                        simplifiedMode ? "py-4 text-xl" : "py-3"
                      }`}
                    />
                    <input
                      type="text"
                      placeholder={t.cvv}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      maxLength={3}
                      className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                        simplifiedMode ? "py-4 text-xl" : "py-3"
                      }`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder={t.city}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                        simplifiedMode ? "py-4 text-xl" : "py-3"
                      }`}
                    />
                    <input
                      type="text"
                      placeholder={t.postalCode}
                      value={postalCode}
                      onChange={(e) =>
                        setPostalCode(e.target.value)
                      }
                      className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                        simplifiedMode ? "py-4 text-xl" : "py-3"
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Formulario de Bizum */}
            {paymentMethod === "bizum" && (
              <div className="mb-8">
                <h3
                  className={`mb-4 ${simplifiedMode ? "text-xl" : ""}`}
                >
                  {t.billingInfo}
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder={t.firstName}
                      value={userData.firstName}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          firstName: e.target.value,
                        })
                      }
                      className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                        simplifiedMode ? "py-4 text-xl" : "py-3"
                      }`}
                    />
                    <input
                      type="text"
                      placeholder={t.lastName}
                      value={userData.lastName}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          lastName: e.target.value,
                        })
                      }
                      className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                        simplifiedMode ? "py-4 text-xl" : "py-3"
                      }`}
                    />
                  </div>
                  <input
                    type="email"
                    placeholder={t.email}
                    value={userData.email}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        email: e.target.value,
                      })
                    }
                    className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                      simplifiedMode ? "py-4 text-xl" : "py-3"
                    }`}
                  />
                  <input
                    type="tel"
                    placeholder={t.phone}
                    value={userData.phone}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        phone: e.target.value,
                      })
                    }
                    className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                      simplifiedMode ? "py-4 text-xl" : "py-3"
                    }`}
                  />
                  <input
                    type="text"
                    placeholder={t.address}
                    value={userData.address}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        address: e.target.value,
                      })
                    }
                    className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                      simplifiedMode ? "py-4 text-xl" : "py-3"
                    }`}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder={t.city}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                        simplifiedMode ? "py-4 text-xl" : "py-3"
                      }`}
                    />
                    <input
                      type="text"
                      placeholder={t.postalCode}
                      value={postalCode}
                      onChange={(e) =>
                        setPostalCode(e.target.value)
                      }
                      className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                        simplifiedMode ? "py-4 text-xl" : "py-3"
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Total */}
            <div
              className={`flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-lg ${
                simplifiedMode ? "text-2xl" : "text-xl"
              }`}
            >
              <span>{t.total}:</span>
              <span className="text-[#00A859]">
                {totalCost}€
              </span>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className={`flex-1 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors ${
                  simplifiedMode
                    ? "py-6 text-2xl"
                    : "py-4 text-lg"
                }`}
              >
                {t.back}
              </button>
              <button
                onClick={handleCompletePurchase}
                disabled={
                  isProcessing ||
                  (paymentMethod === "card" &&
                    (!cardNumber ||
                      !cardName ||
                      !expiryDate ||
                      !cvv ||
                      !city ||
                      !postalCode)) ||
                  (paymentMethod === "bizum" &&
                    (!userData.firstName ||
                      !userData.lastName ||
                      !userData.email ||
                      !userData.phone ||
                      !userData.address ||
                      !city ||
                      !postalCode))
                }
                className={`flex-1 bg-[#00A859] text-white rounded-xl hover:bg-[#008A47] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ${
                  simplifiedMode
                    ? "py-6 text-2xl"
                    : "py-4 text-lg"
                }`}
              >
                {isProcessing
                  ? language === "es"
                    ? "Procesando compra..."
                    : "Processing purchase..."
                  : t.completePurchase}
              </button>
            </div>
          </div>
        )}

        {/* Mensaje de éxito */}
        {showSuccessMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-in fade-in zoom-in duration-300">
              <div className="flex justify-center mb-6">
                <div className="bg-[#00A859] rounded-full p-4">
                  <CheckCircle className="w-16 h-16 text-white" />
                </div>
              </div>
              <h2 className="text-3xl mb-4 text-[#00A859]">
                {t.purchaseSuccess}
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                {t.purchaseSuccessMessage}
              </p>
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <div
                  className="w-2 h-2 bg-[#00A859] rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-[#00A859] rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-[#00A859] rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <TicketView
            tickets={generatedTickets}
            userEmail={userData.email || ""}
            userName={`${userData.firstName} ${userData.lastName}`}
            language={language}
            simplifiedMode={simplifiedMode}
            onBackToEvents={onComplete}
          />
        )}
      </div>
    </div>
  );
}