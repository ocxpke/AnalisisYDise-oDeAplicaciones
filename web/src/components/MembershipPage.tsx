import { useState, useEffect } from "react";
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  Smartphone,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../utils/supabaseClient";
import { toast } from "sonner@2.0.3";
import { Link } from "./Link";

interface MembershipPageProps {
  language: "es" | "en";
  simplifiedMode: boolean;
}

export function MembershipPage({
  language,
  simplifiedMode,
}: MembershipPageProps) {
  const { user, refreshUser } = useAuth();
  const [step, setStep] = useState(1); // 1: info/registro, 2: método de pago, 3: datos de pago
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "paypal" | "bizum" | null
  >(null);
  const [showSuccessMessage, setShowSuccessMessage] =
    useState(false);

  // DEBUG: Verificar estado inicial de localStorage
  useEffect(() => {
    console.log(
      "[MembershipPage] Estado inicial localStorage userId:",
      localStorage.getItem("userId"),
    );
    console.log("[MembershipPage] Usuario actual:", user);
  }, []);

  // Datos personales (autocompletados si usuario autenticado)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [dni, setDni] = useState("");

  // Datos de tarjeta
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // Cuota fija de 20€
  const MEMBERSHIP_PRICE = 20;

  // Verificar si el usuario ya es socio - mostrar mensaje informativo
  useEffect(() => {
    if (user && user.membershipActive) {
      // Usuario ya es socio, mostrar mensaje informativo
      toast.info(
        language === "es"
          ? "¡Ya eres socio de CUDECA! Consulta los detalles de tu membresía."
          : "You are already a CUDECA member! Check your membership details.",
      );
    }
  }, [user, language]);

  // Autocompletar datos si el usuario está autenticado
  useEffect(() => {
    if (user && !user.membershipActive) {
      setFirstName(user.name.split(" ")[0] || "");
      setLastName(user.name.split(" ")[1] || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      //setCity(user.city || "");
      setPostalCode(user.zipCode || "");

      // Si el usuario está autenticado y no es socio, ir directo a método de pago
      setStep(2);
    }
  }, [user]);

  const translations = {
    es: {
      title: "Hazte Socio de CUDECA",
      description:
        "Como socio de CUDECA, formarás parte de una comunidad comprometida con los cuidados paliativos. Tu cuota mensual de 20€ nos ayuda a planificar y mantener nuestros servicios.",
      benefitsTitle: "Beneficios de ser Socio",
      benefit1Title: "Certificado de Donación",
      benefit1Desc:
        "Como socio, recibirás un certificado de donación cada vez que realices una contribución.",
      benefit2Title: "Desgravación Fiscal",
      benefit2Desc:
        "Tus donaciones desgravan en la declaración de la renta:",
      benefit2Detail1:
        "Hasta un 80% de los primeros 250€ donados",
      benefit2Detail2:
        "El resto desgrava alrededor del 40% según la normativa vigente",
      benefit3Title: "Apoyo Continuado",
      benefit3Desc:
        "Tu cuota regular nos permite planificar mejor nuestros servicios de cuidados paliativos.",
      membershipFee: "Cuota de socio: 20€/mes",
      continue: "Continuar al Pago",
      continueToPay: "Hacerse Socio - 20€/mes",
      back: "Volver",
      paymentMethod: "Método de Pago",
      card: "Tarjeta Bancaria",
      paypal: "Paypal",
      bizum: "Bizum",
      confirm: "Confirmar Suscripción",
      selectPaymentMethod:
        "Por favor, selecciona un método de pago",
      personalData: "Datos Personales",
      createAccount: "Crear Cuenta",
      firstName: "Nombre",
      lastName: "Apellidos",
      email: "Correo Electrónico",
      phone: "Teléfono",
      address: "Dirección",
      city: "Ciudad",
      postalCode: "Código Postal",
      password: "Contraseña",
      confirmPassword: "Confirmar Contraseña",
      cardNumber: "Número de Tarjeta",
      cardName: "Nombre del Titular",
      expiryDate: "Fecha de Expiración (MM/AA)",
      cvv: "CVV",
      paymentDetails: "Datos de Pago",
      paypalInstructions: "Instrucciones de PayPal",
      paypalInfo:
        "Serás redirigido a PayPal para completar tu suscripción de forma segura.",
      paypalEmail: "Email de CUDECA: donaciones@cudeca.org",
      bizumInstructions: "Instrucciones de Bizum",
      bizumInfo: "Envía tu pago a través de Bizum al número:",
      bizumNumber: "600 123 456",
      completeAllFields: "Por favor, completa todos los campos",
      passwordsDontMatch: "Las contraseñas no coinciden",
      membershipSuccess: "¡Suscripción realizada con éxito!",
      membershipSuccessMessage:
        "Tu suscripción se ha procesado correctamente. Se ha creado tu cuenta y recibirás un email de confirmación.",
      membershipSuccessMessageUser:
        "Tu suscripción se ha procesado correctamente. Recibirás un email de confirmación.",
      backToHome: "Volver al Inicio",
      alreadyMember: "Ya eres Socio de CUDECA",
      alreadyMemberMessage:
        "Ya tienes una membresía activa. Gracias por tu apoyo continuo.",
      membershipDetails: "Detalles de tu Membresía",
      membershipSince: "Socio desde",
      monthlyFee: "Cuota Mensual",
      goToProfile: "Ir a Mi Perfil",
    },
    en: {
      title: "Become a CUDECA Member",
      description:
        "As a CUDECA member, you will be part of a community committed to palliative care. Your monthly fee of €20 helps us plan and maintain our services.",
      benefitsTitle: "Membership Benefits",
      benefit1Title: "Donation Certificate",
      benefit1Desc:
        "As a member, you will receive a donation certificate every time you make a contribution.",
      benefit2Title: "Tax Deduction",
      benefit2Desc: "Your donations are tax deductible:",
      benefit2Detail1: "Up to 80% of the first €250 donated",
      benefit2Detail2:
        "The rest deducts approximately 40% according to current regulations",
      benefit3Title: "Continuous Support",
      benefit3Desc:
        "Your regular fee helps us better plan our palliative care services.",
      membershipFee: "Membership fee: €20/month",
      continue: "Continue to Payment",
      continueToPay: "Become a Member - €20/month",
      back: "Back",
      paymentMethod: "Payment Method",
      card: "Bank Card",
      paypal: "Paypal",
      bizum: "Bizum",
      confirm: "Confirm Subscription",
      selectPaymentMethod: "Please select a payment method",
      personalData: "Personal Data",
      createAccount: "Create Account",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      phone: "Phone",
      address: "Address",
      city: "City",
      postalCode: "Postal Code",
      password: "Password",
      confirmPassword: "Confirm Password",
      cardNumber: "Card Number",
      cardName: "Cardholder Name",
      expiryDate: "Expiry Date (MM/YY)",
      cvv: "CVV",
      paymentDetails: "Payment Details",
      paypalInstructions: "PayPal Instructions",
      paypalInfo:
        "You will be redirected to PayPal to complete your subscription securely.",
      paypalEmail: "CUDECA Email: donaciones@cudeca.org",
      bizumInstructions: "Bizum Instructions",
      bizumInfo: "Send your payment via Bizum to:",
      bizumNumber: "600 123 456",
      completeAllFields: "Please complete all fields",
      passwordsDontMatch: "Passwords do not match",
      membershipSuccess: "Subscription Successful!",
      membershipSuccessMessage:
        "Your subscription has been processed successfully. Your account has been created and you will receive a confirmation email.",
      membershipSuccessMessageUser:
        "Your subscription has been processed successfully. You will receive a confirmation email.",
      backToHome: "Back to Home",
      alreadyMember: "You are already a CUDECA Member",
      alreadyMemberMessage:
        "You already have an active membership. Thank you for your continued support.",
      membershipDetails: "Your Membership Details",
      membershipSince: "Member since",
      monthlyFee: "Monthly Fee",
      goToProfile: "Go to My Profile",
    },
  };

  const t = translations[language];

  const handleConfirm = async () => {
    console.log("handleConfirm iniciado");

    // Si no es usuario, validar contraseñas y campos obligatorios
    if (!user) {
      if (
        !firstName ||
        !lastName ||
        !email ||
        !phone ||
        !password ||
        !confirmPassword
      ) {
        toast.error(t.completeAllFields);
        return;
      }
      if (password !== confirmPassword) {
        toast.error(t.passwordsDontMatch);
        return;
      }
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
        toast.error(t.completeAllFields);
        return;
      }
    } else if (
      paymentMethod === "paypal" ||
      paymentMethod === "bizum"
    ) {
      if (!firstName || !lastName || !email || !phone) {
        toast.error(t.completeAllFields);
        return;
      }
    }

    try {
      if (!user) {
        console.log(
          "Creando nuevo usuario sin iniciar sesión...",
        );

        // IMPORTANTE: Asegurarse de que NO hay sesión activa
        localStorage.removeItem("userId");
        console.log("LocalStorage limpiado");

        // Crear nueva cuenta de usuario en la base de datos SIN iniciar sesión
        // Primero obtener el siguiente ID
        const { data: maxIdData, error: maxIdError } =
          await supabase
            .from("usuario")
            .select("id")
            .order("id", { ascending: false })
            .limit(1);

        if (maxIdError) {
          console.error("Error al obtener max ID:", maxIdError);
        }

        const nextId =
          maxIdData && maxIdData.length > 0
            ? maxIdData[0].id + 1
            : 1;
        console.log("Próximo ID:", nextId);

        // Crear fecha de nacimiento por defecto si no está proporcionada
        // Usar fecha actual menos 30 años como default
        const defaultBirthDate =
          birthDate ||
          new Date(
            new Date().setFullYear(
              new Date().getFullYear() - 30,
            ),
          ).toISOString();

        // Insertar nuevo usuario como socio (pero NO iniciar sesión)
        const { data: insertData, error: insertError } =
          await supabase
            .from("usuario")
            .insert({
              id: nextId,
              nombre: firstName,
              apellidos: lastName,
              email: email,
              telefono: phone || null,
              direccion: address || null,
              codigopostal: postalCode || null,
              dni: dni || null,
              fechanacimiento: defaultBirthDate,
              password: password,
              socio: true, // Marcar como socio
              fechasocio: new Date().toISOString(), // Guardar fecha actual como fecha de socio
              admin: false,
            })
            .select();

        if (insertError) {
          console.error("Error al crear usuario:", insertError);
          toast.error(
            `Error al crear la cuenta: ${insertError.message}`,
          );
          return;
        }

        console.log(
          "Usuario creado exitosamente (sin login):",
          insertData,
        );
        toast.success(
          "¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.",
        );

        // CRÍTICO: Asegurarse de que localStorage esté limpio antes de mostrar éxito
        localStorage.removeItem("userId");
        console.log("LocalStorage verificado como limpio");

        // Mostrar mensaje de éxito (SIN redirección automática)
        setShowSuccessMessage(true);
      } else {
        console.log("Actualizando usuario existente...");

        // Actualizar usuario existente para marcarlo como socio con fecha actual
        const { error: updateError } = await supabase
          .from("usuario")
          .update({
            nombre: firstName,
            apellidos: lastName,
            telefono: phone || null,
            direccion: address || null,
            codigopostal: postalCode || null,
            socio: true,
            fechasocio: new Date().toISOString(), // Guardar fecha actual como fecha de socio
          })
          .eq("id", user.id);

        if (updateError) {
          console.error(
            "Error al actualizar usuario:",
            updateError,
          );
          toast.error(
            `Error al procesar la suscripción: ${updateError.message}`,
          );
          return;
        }

        console.log("Usuario actualizado exitosamente");
        toast.success("¡Suscripción completada exitosamente!");

        // Recargar los datos del usuario para obtener la fecha de socio actualizada
        await refreshUser();

        // Mostrar mensaje de éxito (SIN redirección automática)
        setShowSuccessMessage(true);
      }
    } catch (error) {
      console.error(
        "Error en el proceso de suscripción:",
        error,
      );
      toast.error(
        "Error al procesar la suscripción. Por favor, inténtalo de nuevo.",
      );
    }
  };

  // Verificar si el usuario ya tiene membresía
  const isAlreadyMember = user && user.membershipActive;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="mb-6">{t.title}</h1>
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Mensaje si ya es Socio */}
          {isAlreadyMember && !showSuccessMessage && (
            <div className="text-center py-12">
              <div className="mb-6">
                <div className="w-20 h-20 bg-[#00A859] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2
                  className={`text-[#00A859] mb-4 ${simplifiedMode ? "text-3xl" : "text-2xl"}`}
                >
                  {t.alreadyMember}
                </h2>
                <p
                  className={`text-gray-700 mb-8 ${simplifiedMode ? "text-xl" : ""}`}
                >
                  {t.alreadyMemberMessage}
                </p>

                {/* Detalles de la membresía */}
                <div className="bg-gray-50 p-6 rounded-xl max-w-md mx-auto mb-8">
                  <h3
                    className={`mb-4 text-gray-800 ${simplifiedMode ? "text-xl" : ""}`}
                  >
                    {t.membershipDetails}
                  </h3>
                  <div className="space-y-2 text-left">
                    <p
                      className={`text-gray-700 ${simplifiedMode ? "text-lg" : ""}`}
                    >
                      <strong>{t.monthlyFee}:</strong>{" "}
                      {MEMBERSHIP_PRICE}€
                    </p>
                    {user.membershipDate && (
                      <p
                        className={`text-gray-700 ${simplifiedMode ? "text-lg" : ""}`}
                      >
                        <strong>{t.membershipSince}:</strong>{" "}
                        {new Date(
                          user.membershipDate,
                        ).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <Link
                href="/account"
                className={`bg-[#00A859] text-white rounded-xl hover:bg-[#008A47] transition-colors px-8 ${
                  simplifiedMode
                    ? "py-6 text-2xl"
                    : "py-4 text-lg"
                }`}
              >
                {t.goToProfile}
              </Link>
            </div>
          )}

          {/* Mensaje de Éxito */}
          {showSuccessMessage && (
            <div className="text-center py-12">
              <div className="mb-6">
                <div className="w-20 h-20 bg-[#00A859] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2
                  className={`text-[#00A859] mb-4 ${simplifiedMode ? "text-3xl" : "text-2xl"}`}
                >
                  {t.membershipSuccess}
                </h2>
                <p
                  className={`text-gray-700 mb-8 ${simplifiedMode ? "text-xl" : ""}`}
                >
                  {user
                    ? t.membershipSuccessMessageUser
                    : t.membershipSuccessMessage}
                </p>
              </div>
              <Link
                href="/"
                className={`bg-[#00A859] text-white rounded-xl hover:bg-[#008A47] transition-colors px-8 ${
                  simplifiedMode
                    ? "py-6 text-2xl"
                    : "py-4 text-lg"
                }`}
              >
                {t.backToHome}
              </Link>
            </div>
          )}

          {/* PASO 1: Información y Beneficios (solo para no usuarios) */}
          {!isAlreadyMember &&
            !showSuccessMessage &&
            step === 1 && (
              <>
                <p
                  className={`text-gray-700 mb-8 ${simplifiedMode ? "text-xl" : ""}`}
                >
                  {t.description}
                </p>

                {/* Sección de Beneficios */}
                {language === "es" && (
                  <div className="bg-[#D4E8DC] rounded-xl p-6 mb-8">
                    <h2
                      className={`text-[#00A859] mb-6 ${simplifiedMode ? "text-2xl" : "text-xl"}`}
                    >
                      {t.benefitsTitle}
                    </h2>

                    <div className="space-y-6">
                      {/* Beneficio 1: Certificado */}
                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-[#00A859] rounded-full flex items-center justify-center mt-1">
                            <svg
                              className="w-5 h-5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3
                              className={`text-gray-800 mb-2 ${simplifiedMode ? "text-xl" : "text-lg"}`}
                            >
                              {t.benefit1Title}
                            </h3>
                            <p
                              className={`text-gray-700 ${simplifiedMode ? "text-lg" : "text-base"}`}
                            >
                              {t.benefit1Desc}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Beneficio 2: Desgravación Fiscal */}
                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-[#00A859] rounded-full flex items-center justify-center mt-1">
                            <svg
                              className="w-5 h-5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3
                              className={`text-gray-800 mb-2 ${simplifiedMode ? "text-xl" : "text-lg"}`}
                            >
                              {t.benefit2Title}
                            </h3>
                            <p
                              className={`text-gray-700 mb-3 ${simplifiedMode ? "text-lg" : "text-base"}`}
                            >
                              {t.benefit2Desc}
                            </p>
                            <ul
                              className={`space-y-2 ml-4 ${simplifiedMode ? "text-lg" : "text-base"}`}
                            >
                              <li className="flex items-start gap-2 text-gray-700">
                                <span className="text-[#00A859] mt-1">
                                  •
                                </span>
                                <span>
                                  <strong>80%</strong>{" "}
                                  {t.benefit2Detail1.replace(
                                    "Hasta un 80% de ",
                                    "de ",
                                  )}
                                </span>
                              </li>
                              <li className="flex items-start gap-2 text-gray-700">
                                <span className="text-[#00A859] mt-1">
                                  •
                                </span>
                                <span>
                                  <strong>40%</strong>{" "}
                                  {t.benefit2Detail2.replace(
                                    "El resto desgrava alrededor del 40% ",
                                    "",
                                  )}
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Beneficio 3: Apoyo Continuado */}
                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-[#00A859] rounded-full flex items-center justify-center mt-1">
                            <svg
                              className="w-5 h-5 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h3
                              className={`text-gray-800 mb-2 ${simplifiedMode ? "text-xl" : "text-lg"}`}
                            >
                              {t.benefit3Title}
                            </h3>
                            <p
                              className={`text-gray-700 ${simplifiedMode ? "text-lg" : "text-base"}`}
                            >
                              {t.benefit3Desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mostrar precio */}
                <div className="bg-[#00A859] text-white text-center p-6 rounded-xl mb-8">
                  <p
                    className={
                      simplifiedMode ? "text-3xl" : "text-2xl"
                    }
                  >
                    <strong>{MEMBERSHIP_PRICE}€</strong>/mes
                  </p>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className={`w-full bg-[#00A859] text-white rounded-xl hover:bg-[#008A47] transition-colors ${
                    simplifiedMode
                      ? "py-6 text-2xl"
                      : "py-4 text-lg"
                  }`}
                >
                  {t.continueToPay}
                </button>
              </>
            )}

          {/* PASO 2: Método de Pago (para usuarios autenticados no socios O continuación de paso 1) */}
          {!isAlreadyMember &&
            !showSuccessMessage &&
            step === 2 && (
              <>
                {!user && (
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
                )}

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
          {!isAlreadyMember &&
            !showSuccessMessage &&
            step === 3 && (
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

                <h2
                  className={`mb-6 text-gray-800 ${simplifiedMode ? "text-2xl" : ""}`}
                >
                  {t.paymentDetails}
                </h2>

                {/* Datos Personales */}
                <h3
                  className={`mb-4 text-gray-700 ${simplifiedMode ? "text-xl" : ""}`}
                >
                  {!user ? t.createAccount : t.personalData}
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
                    disabled={!!user}
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

                  {/* Dirección completa - SIEMPRE visible, no solo para tarjeta */}
                  <input
                    type="text"
                    placeholder={t.address}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
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

                  {/* Campos de contraseña solo si NO hay usuario autenticado */}
                  {!user && (
                    <>
                      <input
                        type="password"
                        placeholder={t.password}
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                        className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                          simplifiedMode
                            ? "py-4 text-xl"
                            : "py-3"
                        }`}
                      />
                      <input
                        type="password"
                        placeholder={t.confirmPassword}
                        value={confirmPassword}
                        onChange={(e) =>
                          setConfirmPassword(e.target.value)
                        }
                        className={`w-full px-4 border-2 border-gray-300 rounded-xl focus:border-[#00A859] focus:outline-none ${
                          simplifiedMode
                            ? "py-4 text-xl"
                            : "py-3"
                        }`}
                      />
                    </>
                  )}
                </div>

                {/* Formulario de Tarjeta */}
                {paymentMethod === "card" && (
                  <>
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
                          simplifiedMode
                            ? "py-4 text-xl"
                            : "py-3"
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
                          simplifiedMode
                            ? "py-4 text-xl"
                            : "py-3"
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
                          onChange={(e) =>
                            setCvv(e.target.value)
                          }
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
                  <div
                    className={`bg-gray-50 p-6 rounded-xl mb-6 ${simplifiedMode ? "text-lg" : ""}`}
                  >
                    <h3 className="mb-2">
                      {t.paypalInstructions}
                    </h3>
                    <p className="mb-2">{t.paypalInfo}</p>
                    <p className="text-[#00A859] text-xl mt-2">
                      {t.paypalEmail}
                    </p>
                  </div>
                )}

                {/* Instrucciones de Bizum */}
                {paymentMethod === "bizum" && (
                  <div
                    className={`bg-gray-50 p-6 rounded-xl mb-6 ${simplifiedMode ? "text-lg" : ""}`}
                  >
                    <h3 className="mb-2">
                      {t.bizumInstructions}
                    </h3>
                    <p className="mb-2">{t.bizumInfo}</p>
                    <p className="text-[#00A859] text-2xl">
                      {t.bizumNumber}
                    </p>
                  </div>
                )}

                <button
                  onClick={handleConfirm}
                  className={`w-full bg-[#00A859] text-white rounded-xl hover:bg-[#008A47] transition-colors ${
                    simplifiedMode
                      ? "py-6 text-2xl"
                      : "py-4 text-lg"
                  }`}
                >
                  {t.confirm} ({MEMBERSHIP_PRICE}€/mes)
                </button>
              </>
            )}
        </div>
      </div>
    </div>
  );
}