import { ArrowLeft } from "lucide-react";
import { Link } from "./Link";

interface CookiesPolicyPageProps {
  language: "es" | "en";
}

export function CookiesPolicyPage({
  language,
}: CookiesPolicyPageProps) {
  const content = {
    es: {
      title: "Política de Cookies",
      backToHome: "Volver al Inicio",
      sections: [
        {
          title: "1. ¿Qué son las Cookies?",
          content: `Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita una página web. Sirven para que la web funcione correctamente, recordar sus preferencias y recopilar información sobre el uso del sitio.

Las cookies no almacenan información sensible como datos bancarios o contraseñas.`,
        },
        {
          title: "2. Tipos de Cookies Utilizadas",
          content: `El sitio web de la Fundación CUDECA utiliza los siguientes tipos de cookies:

- Cookies técnicas o necesarias: Permiten la navegación por la web y el uso de sus funcionalidades básicas.
- Cookies de personalización: Permiten recordar sus preferencias, como el idioma seleccionado.
- Cookies de análisis: Nos ayudan a entender cómo interactúan los usuarios con la web para mejorar nuestros servicios.
- Cookies de terceros: Pueden ser instaladas por servicios externos como herramientas de análisis o pasarelas de pago.`,
        },
        {
          title: "3. Cookies Utilizadas en este Sitio Web",
          content: `Actualmente, este sitio web puede utilizar las siguientes cookies:

- Cookies técnicas: Necesarias para el funcionamiento del sitio.
- Cookies de sesión: Se eliminan al cerrar el navegador.
- Cookies persistentes: Permanecen almacenadas durante un período determinado.

En ningún caso se utilizan cookies con fines publicitarios sin su consentimiento expreso.`,
        },
        {
          title: "4. Cookies de Terceros",
          content: `Este sitio web puede utilizar servicios de terceros que, por cuenta de CUDECA, recopilan información con fines estadísticos o de funcionamiento del servicio.

Entre estos terceros pueden encontrarse:
- Proveedores de servicios de pago (PayPal, Bizum).
- Proveedores tecnológicos y de hosting.
- Herramientas de análisis web.

CUDECA no se hace responsable del contenido ni de las políticas de privacidad de estos terceros.`,
        },
        {
          title: "5. Gestión y Configuración de Cookies",
          content: `Puede permitir, bloquear o eliminar las cookies instaladas en su dispositivo mediante la configuración de las opciones de su navegador.

A continuación, le facilitamos enlaces a la configuración de cookies en los navegadores más comunes:
- Google Chrome
- Mozilla Firefox
- Safari
- Microsoft Edge

La desactivación de algunas cookies puede afectar al correcto funcionamiento del sitio web.`,
        },
        {
          title: "6. Consentimiento",
          content: `Al acceder a este sitio web por primera vez, se le mostrará un aviso de cookies donde podrá aceptar, rechazar o configurar el uso de cookies.

El consentimiento otorgado puede ser retirado en cualquier momento mediante la configuración de su navegador o del panel de gestión de cookies, si estuviera disponible.`,
        },
        {
          title: "7. Actualizaciones de la Política de Cookies",
          content: `CUDECA se reserva el derecho a modificar la presente Política de Cookies para adaptarla a cambios normativos o técnicos.

Cualquier modificación será publicada en esta página con suficiente antelación a su entrada en vigor.`,
        },
        {
          title: "8. Contacto",
          content: `Si tiene cualquier duda o consulta sobre nuestra Política de Cookies, puede ponerse en contacto con nosotros a través de:

Fundación CUDECA
Calle Dehesa del Camarate 1
29004 Málaga
Email: info@cudeca.org
Teléfono: +34 952 56 49 10`,
        },
      ],
    },
    en: {
      title: "Cookie Policy",
      backToHome: "Back to Home",
      sections: [
        {
          title: "1. What Are Cookies?",
          content: `Cookies are small text files that are stored on your device when you visit a website. They help the website function properly, remember your preferences, and collect information about site usage.

Cookies do not store sensitive information such as banking details or passwords.`,
        },
        {
          title: "2. Types of Cookies Used",
          content: `The CUDECA Foundation website uses the following types of cookies:

- Technical or necessary cookies: Enable navigation and basic website functionality.
- Preference cookies: Remember user preferences such as selected language.
- Analytics cookies: Help us understand how users interact with the website to improve our services.
- Third-party cookies: Set by external services such as analytics tools or payment providers.`,
        },
        {
          title: "3. Cookies Used on This Website",
          content: `This website may use the following cookies:

- Technical cookies: Necessary for website operation.
- Session cookies: Deleted when the browser is closed.
- Persistent cookies: Remain stored for a defined period.

No advertising cookies are used without your explicit consent.`,
        },
        {
          title: "4. Third-Party Cookies",
          content: `This website may use third-party services that collect information for statistical or service-related purposes on behalf of CUDECA.

These third parties may include:
- Payment service providers (PayPal, Bizum).
- Technology and hosting providers.
- Web analytics tools.

CUDECA is not responsible for the content or privacy policies of these third parties.`,
        },
        {
          title: "5. Managing and Configuring Cookies",
          content: `You can allow, block, or delete cookies installed on your device through your browser settings.

Below are links to cookie management options for common browsers:
- Google Chrome
- Mozilla Firefox
- Safari
- Microsoft Edge

Disabling certain cookies may affect the proper functioning of the website.`,
        },
        {
          title: "6. Consent",
          content: `When you first access this website, you will be shown a cookie notice where you can accept, reject, or configure cookie usage.

You may withdraw your consent at any time through your browser settings or a cookie management panel, if available.`,
        },
        {
          title: "7. Updates to the Cookie Policy",
          content: `CUDECA reserves the right to modify this Cookie Policy to adapt it to regulatory or technical changes.

Any updates will be published on this page with sufficient notice before coming into effect.`,
        },
        {
          title: "8. Contact",
          content: `If you have any questions regarding our Cookie Policy, please contact us at:

CUDECA Foundation
Calle Dehesa del Camarate 1
29004 Málaga
Email: info@cudeca.org
Phone: +34 952 56 49 10`,
        },
      ],
    },
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#00A859] hover:text-[#008A47] transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            {t.backToHome}
          </Link>
          <h1 className="text-gray-900 mt-2">{t.title}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8">
          {t.sections.map((section, index) => (
            <section key={index}>
              <h2 className="text-gray-900 mb-4">
                {section.title}
              </h2>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex justify-center gap-6 text-sm">
          <Link
            href="/"
            className="text-gray-600 hover:text-[#00A859] transition-colors"
          >
            {t.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
}