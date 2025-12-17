import { useState, useEffect } from "react";
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  Smartphone,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../utils/supabaseClient";
import {
  projectId,
  publicAnonKey,
} from "../utils/supabase/info";

interface DonatePageProps {
  language: "es" | "en";
  simplifiedMode: boolean;
  onDonationComplete: (amount: number) => void;
}

const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-e30de6da`;

export function DonatePage({
  language,
  simplifiedMode,
  onDonationComplete,
}: DonatePageProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: cantidad, 2: método de pago, 3: datos de pago
  const [selectedAmount, setSelectedAmount] = useState<
    number | null
  >(null);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "paypal" | "bizum" | null
  >(null);

  // Datos personales (autocompletados si usuario autenticado)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Datos de tarjeta
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // Autocompletar datos si el usuario está autenticado
  useEffect(() => {
    if (user) {
      setFirstName(user.name.split(" ")[0] || "");
      setLastName(user.name.split(" ")[1] || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
    }
  }, [user]);

  const translations = {
    es: {
      title: "Haz una Donación",
      description:
        "Tu donación nos ayuda a continuar proporcionando cuidados paliativos de calidad a quienes más lo necesitan.",
      selectAmount: "Selecciona una cantidad",
      customAmount: "Otra cantidad",
      continue: "Continuar",
      back: "Volver",
      paymentMethod: "Método de Pago",
      card: "Tarjeta Bancaria",
      paypal: "Paypal",
      bizum: "Bizum",
      donate: "Donar",
      selectAmountError:
        "Por favor, selecciona o introduce una cantidad",
      selectPaymentMethod:
        "Por favor, selecciona un método de pago",
      personalData: "Datos Personales",
      firstName: "Nombre",
      lastName: "Apellidos",
      email: "Correo Electrónico",
      phone: "Teléfono",
      address: "Dirección",
      city: "Ciudad",
      postalCode: "Código Postal",
      cardNumber: "Número de Tarjeta",
      cardName: "Nombre del Titular",
      expiryDate: "Fecha de Expiración (MM/AA)",
      cvv: "CVV",
      paymentDetails: "Datos de Pago",
      paypalInstructions: "Instrucciones de PayPal",
      paypalInfo:
        "Serás redirigido a PayPal para completar tu donación de forma segura.",
      paypalEmail: "Email de CUDECA: donaciones@cudeca.org",
      bizumInstructions: "Instrucciones de Bizum",
      bizumInfo: "Envía tu pago a través de Bizum al número:",
      bizumNumber: "600 123 456",
      completeAllFields:
        "Por favor, completa todos los campos de la tarjeta",
      donationSuccess: "¡Donación realizada con éxito!",
      donationSuccessMessage:
        "Tu donación se ha procesado correctamente. Recibirás un certificado por email.",
    },
    en: {
      title: "Make a Donation",
      description:
        "Your donation helps us continue providing quality palliative care to those who need it most.",
      selectAmount: "Select an amount",
      customAmount: "Custom amount",
      continue: "Continue",
      back: "Back",
      paymentMethod: "Payment Method",
      card: "Tarjeta Bancaria",
      paypal: "Paypal",
      bizum: "Bizum",
      donate: "Donate",
      selectAmountError: "Please select or enter an amount",
      selectPaymentMethod: "Please select a payment method",
      personalData: "Personal Data",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      phone: "Phone",
      address: "Address",
      city: "City",
      postalCode: "Postal Code",
      cardNumber: "Card Number",
      cardName: "Cardholder Name",
      expiryDate: "Expiry Date (MM/YY)",
      cvv: "CVV",
      paymentDetails: "Payment Details",
      paypalInstructions: "PayPal Instructions",
      paypalInfo:
        "You will be redirected to PayPal to complete your donation securely.",
      paypalEmail: "CUDECA Email: donaciones@cudeca.org",
      bizumInstructions: "Bizum Instructions",
      bizumInfo: "Send your payment via Bizum to:",
      bizumNumber: "600 123 456",
      completeAllFields: "Please complete all card fields",
      donationSuccess: "Donation Successful!",
      donationSuccessMessage:
        "Your donation has been processed successfully. You will receive a certificate by email.",
    },
  };

  const t = translations[language];

  const donationAmounts = [10, 25, 50, 100, 250, 500];

  const getFinalAmount = () => {
    if (customAmount) {
      return parseFloat(customAmount) || 0;
    }
    return selectedAmount || 0;
  };

  const handleConfirm = async () => {
    const amount = getFinalAmount();
    if (amount <= 0) {
      alert(t.selectAmountError);
      return;
    }

    // Validar campos según el método de pago
    if (paymentMethod === "card") {
      if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !address ||
        !city ||
        !postalCode ||
        !cardNumber ||
        !cardName ||
        !expiryDate ||
        !cvv
      ) {
        alert(t.completeAllFields);
        return;
      }
    } else if (
      paymentMethod === "paypal" ||
      paymentMethod === "bizum"
    ) {
      if (!firstName || !lastName || !email || !phone) {
        alert(t.completeAllFields);
        return;
      }
    }

    try {
      const { error } = await supabase.from("donacion").insert({
        cantidad: amount,
        fecha: new Date().toISOString(),
        usuario_id: user?.id ?? null, // si no está logueado
      });

      if (error) {
        console.error(error);
        alert("Error al registrar la donación");
        return;
      }

      alert(
        `${t.donationSuccess}\n\n${t.donationSuccessMessage}`,
      );
      onDonationComplete(amount);
    } catch (err) {
      console.error(err);
      alert("Error inesperado al procesar la donación");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="mb-6">{t.title}</h1>
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* PASO 1: Selección de Cantidad */}
          {step === 1 && (
            <>
              <p
                className={`text-gray-700 mb-8 ${simplifiedMode ? "text-xl" : ""}`}
              >
                {t.description}
              </p>

              <h2
                className={`mb-6 text-gray-800 ${simplifiedMode ? "text-2xl" : ""}`}
              >
                {t.selectAmount}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {donationAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount("");
                    }}
                    className={`px-6 border-2 rounded-xl transition-colors ${
                      selectedAmount === amount && !customAmount
                        ? "border-[#00A859] bg-[#D4E8DC]"
                        : "border-gray-300 hover:border-[#00A859] hover:bg-gray-50"
                    } ${simplifiedMode ? "py-6 text-2xl" : "py-4 text-xl"}`}
                  >
                    {amount}€
                  </button>
                ))}
              </div>

              <div className="mb-8">
                <label
                  className={`block mb-2 text-gray-700 ${simplifiedMode ? "text-xl" : ""}`}
                >
                  {t.customAmount}
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="€"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                  }}
                  className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                    simplifiedMode ? "py-4 text-xl" : "py-3"
                  }`}
                />
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!selectedAmount && !customAmount}
                className={`w-full bg-[#00A859] text-white rounded-xl hover:bg-[#008A47] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ${
                  simplifiedMode
                    ? "py-6 text-2xl"
                    : "py-4 text-lg"
                }`}
              >
                {t.continue}
              </button>
            </>
          )}

          {/* PASO 2: Método de Pago */}
          {step === 2 && (
            <>
              <button
                onClick={() => setStep(1)}
                className={`flex items-center gap-2 text-gray-600 hover:text-[#00A859] transition-colors mb-6 ${
                  simplifiedMode ? "text-xl" : ""
                }`}
              >
                <ArrowLeft
                  className={
                    simplifiedMode ? "w-6 h-6" : "w-5 h-5"
                  }
                />
                {t.back}
              </button>

              <h2
                className={`mb-6 text-gray-800 ${simplifiedMode ? "text-2xl" : ""}`}
              >
                {t.paymentMethod}
              </h2>

              <div className="space-y-4 mb-8">
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`w-full px-6 border-2 rounded-xl transition-colors flex items-center gap-4 ${
                    paymentMethod === "card"
                      ? "border-[#00A859] bg-[#D4E8DC]"
                      : "border-gray-300 hover:border-[#00A859] hover:bg-gray-50"
                  } ${simplifiedMode ? "py-6" : "py-4"}`}
                >
                  <CreditCard
                    className={
                      simplifiedMode ? "w-8 h-8" : "w-6 h-6"
                    }
                  />
                  <span
                    className={
                      simplifiedMode ? "text-xl" : "text-lg"
                    }
                  >
                    {t.card}
                  </span>
                </button>

                <button
                  onClick={() => setPaymentMethod("paypal")}
                  className={`w-full px-6 border-2 rounded-xl transition-colors flex items-center gap-4 ${
                    paymentMethod === "paypal"
                      ? "border-[#00A859] bg-[#D4E8DC]"
                      : "border-gray-300 hover:border-[#00A859] hover:bg-gray-50"
                  } ${simplifiedMode ? "py-6" : "py-4"}`}
                >
                  <Wallet
                    className={
                      simplifiedMode ? "w-8 h-8" : "w-6 h-6"
                    }
                  />
                  <span
                    className={
                      simplifiedMode ? "text-xl" : "text-lg"
                    }
                  >
                    {t.paypal}
                  </span>
                </button>

                <button
                  onClick={() => setPaymentMethod("bizum")}
                  className={`w-full px-6 border-2 rounded-xl transition-colors flex items-center gap-4 ${
                    paymentMethod === "bizum"
                      ? "border-[#00A859] bg-[#D4E8DC]"
                      : "border-gray-300 hover:border-[#00A859] hover:bg-gray-50"
                  } ${simplifiedMode ? "py-6" : "py-4"}`}
                >
                  <Smartphone
                    className={
                      simplifiedMode ? "w-8 h-8" : "w-6 h-6"
                    }
                  />
                  <span
                    className={
                      simplifiedMode ? "text-xl" : "text-lg"
                    }
                  >
                    {t.bizum}
                  </span>
                </button>
              </div>

              <button
                onClick={() => setStep(3)}
                disabled={!paymentMethod}
                className={`w-full bg-[#00A859] text-white rounded-xl hover:bg-[#008A47] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ${
                  simplifiedMode
                    ? "py-6 text-2xl"
                    : "py-4 text-lg"
                }`}
              >
                {t.continue}
              </button>
            </>
          )}

          {/* PASO 3: Datos de Pago */}
          {step === 3 && (
            <>
              <button
                onClick={() => setStep(2)}
                className={`flex items-center gap-2 text-gray-600 hover:text-[#00A859] transition-colors mb-6 ${
                  simplifiedMode ? "text-xl" : ""
                }`}
              >
                <ArrowLeft
                  className={
                    simplifiedMode ? "w-6 h-6" : "w-5 h-5"
                  }
                />
                {t.back}
              </button>

              {/* Formulario de Tarjeta */}
              {paymentMethod === "card" && (
                <>
                  <h2
                    className={`mb-6 text-gray-800 ${simplifiedMode ? "text-2xl" : ""}`}
                  >
                    {t.paymentDetails}
                  </h2>

                  {/* Datos Personales */}
                  <h3
                    className={`mb-4 text-gray-700 ${simplifiedMode ? "text-xl" : ""}`}
                  >
                    {t.personalData}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <input
                      type="text"
                      placeholder={t.firstName}
                      value={firstName}
                      onChange={(e) =>
                        setFirstName(e.target.value)
                      }
                      className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                        simplifiedMode ? "py-4 text-xl" : "py-3"
                      }`}
                    />
                    <input
                      type="text"
                      placeholder={t.lastName}
                      value={lastName}
                      onChange={(e) =>
                        setLastName(e.target.value)
                      }
                      className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                        simplifiedMode ? "py-4 text-xl" : "py-3"
                      }`}
                    />
                    <input
                      type="email"
                      placeholder={t.email}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                        simplifiedMode ? "py-4 text-xl" : "py-3"
                      }`}
                    />
                    <input
                      type="tel"
                      placeholder={t.phone}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                        simplifiedMode ? "py-4 text-xl" : "py-3"
                      }`}
                    />
                    <input
                      type="text"
                      placeholder={t.address}
                      value={address}
                      onChange={(e) =>
                        setAddress(e.target.value)
                      }
                      className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none md:col-span-2 ${
                        simplifiedMode ? "py-4 text-xl" : "py-3"
                      }`}
                    />
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

                  {/* Datos de Tarjeta */}
                  <h3
                    className={`mb-4 text-gray-700 ${simplifiedMode ? "text-xl" : ""}`}
                  >
                    {t.card}
                  </h3>
                  <div className="space-y-4 mb-8">
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
                          simplifiedMode
                            ? "py-4 text-xl"
                            : "py-3"
                        }`}
                      />
                      <input
                        type="text"
                        placeholder={t.cvv}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        maxLength={3}
                        className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                          simplifiedMode
                            ? "py-4 text-xl"
                            : "py-3"
                        }`}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Instrucciones de PayPal */}
              {paymentMethod === "paypal" && (
                <>
                  <h2
                    className={`mb-6 text-gray-800 ${simplifiedMode ? "text-2xl" : ""}`}
                  >
                    {t.paypalInstructions}
                  </h2>

                  {/* Datos Personales Básicos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <input
                      type="text"
                      placeholder={t.firstName}
                      value={firstName}
                      onChange={(e) =>
                        setFirstName(e.target.value)
                      }
                      className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                        simplifiedMode ? "py-4 text-xl" : "py-3"
                      }`}
                    />
                    <input
                      type="text"
                      placeholder={t.lastName}
                      value={lastName}
                      onChange={(e) =>
                        setLastName(e.target.value)
                      }
                      className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                        simplifiedMode ? "py-4 text-xl" : "py-3"
                      }`}
                    />
                    <input
                      type="email"
                      placeholder={t.email}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                        simplifiedMode ? "py-4 text-xl" : "py-3"
                      }`}
                    />
                    <input
                      type="tel"
                      placeholder={t.phone}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                        simplifiedMode ? "py-4 text-xl" : "py-3"
                      }`}
                    />
                  </div>

                  <div
                    className={`bg-gray-50 p-6 rounded-xl mb-6 ${simplifiedMode ? "text-lg" : ""}`}
                  >
                    <p className="mb-2">{t.paypalInfo}</p>
                    <p className="text-[#00A859] text-xl mt-2">
                      {t.paypalEmail}
                    </p>
                  </div>
                </>
              )}

              {/* Instrucciones de Bizum */}
              {paymentMethod === "bizum" && (
                <>
                  <h2
                    className={`mb-6 text-gray-800 ${simplifiedMode ? "text-2xl" : ""}`}
                  >
                    {t.bizumInstructions}
                  </h2>

                  {/* Datos Personales Básicos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <input
                      type="text"
                      placeholder={t.firstName}
                      value={firstName}
                      onChange={(e) =>
                        setFirstName(e.target.value)
                      }
                      className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                        simplifiedMode ? "py-4 text-xl" : "py-3"
                      }`}
                    />
                    <input
                      type="text"
                      placeholder={t.lastName}
                      value={lastName}
                      onChange={(e) =>
                        setLastName(e.target.value)
                      }
                      className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                        simplifiedMode ? "py-4 text-xl" : "py-3"
                      }`}
                    />
                    <input
                      type="email"
                      placeholder={t.email}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                        simplifiedMode ? "py-4 text-xl" : "py-3"
                      }`}
                    />
                    <input
                      type="tel"
                      placeholder={t.phone}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                        simplifiedMode ? "py-4 text-xl" : "py-3"
                      }`}
                    />
                  </div>

                  <div
                    className={`bg-gray-50 p-6 rounded-xl mb-6 ${simplifiedMode ? "text-lg" : ""}`}
                  >
                    <p className="mb-2">{t.bizumInfo}</p>
                    <p className="text-[#00A859] text-2xl">
                      {t.bizumNumber}
                    </p>
                  </div>
                </>
              )}

              <button
                onClick={handleConfirm}
                disabled={
                  paymentMethod === "card" &&
                  (!cardNumber ||
                    !cardName ||
                    !expiryDate ||
                    !cvv)
                }
                className={`w-full bg-[#00A859] text-white rounded-xl hover:bg-[#008A47] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ${
                  simplifiedMode
                    ? "py-6 text-2xl"
                    : "py-4 text-lg"
                }`}
              >
                {t.donate}{" "}
                {getFinalAmount() > 0 && `${getFinalAmount()}€`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}