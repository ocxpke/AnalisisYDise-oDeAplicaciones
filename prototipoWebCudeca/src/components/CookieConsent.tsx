import { useState, useEffect } from "react";
import { X, Cookie } from "lucide-react";

interface CookieConsentProps {
  language: "es" | "en";
}

export function CookieConsent({
  language,
}: CookieConsentProps) {
  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShow(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setShow(false);
  };

  const translations = {
    es: {
      title: "Uso de Cookies",
      message:
        "Utilizamos cookies propias y de terceros para mejorar tu experiencia de navegación y analizar el tráfico. Las cookies necesarias son esenciales para el funcionamiento del sitio.",
      necessary: "Cookies necesarias",
      analytics: "Cookies analíticas",
      marketing: "Cookies de marketing",
      necessaryDesc:
        "Estas cookies son esenciales para el funcionamiento del sitio web.",
      analyticsDesc:
        "Nos ayudan a comprender cómo los visitantes interactúan con el sitio.",
      marketingDesc:
        "Se utilizan para mostrar anuncios relevantes.",
      acceptAll: "Aceptar todas",
      rejectAll: "Rechazar opcionales",
      customize: "Personalizar",
      savePreferences: "Guardar preferencias",
      moreInfo: "Más información",
      privacyPolicy: "Política de Privacidad",
      cookiePolicy: "Política de Cookies",
    },
    en: {
      title: "Cookie Usage",
      message:
        "We use our own and third-party cookies to improve your browsing experience and analyze traffic. Necessary cookies are essential for the site to function.",
      necessary: "Necessary cookies",
      analytics: "Analytics cookies",
      marketing: "Marketing cookies",
      necessaryDesc:
        "These cookies are essential for the website to function.",
      analyticsDesc:
        "Help us understand how visitors interact with the site.",
      marketingDesc: "Used to show relevant advertisements.",
      acceptAll: "Accept all",
      rejectAll: "Reject optional",
      customize: "Customize",
      savePreferences: "Save preferences",
      moreInfo: "More information",
      privacyPolicy: "Privacy Policy",
      cookiePolicy: "Cookie Policy",
    },
  };

  const t = translations[language];

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-end justify-center p-4 z-50">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "#ffffff99" }}
      ></div>
      <div className="relative bg-white rounded-t-2xl max-w-4xl w-full shadow-2xl">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Cookie className="w-8 h-8 text-[#00A859]" />
              <h3>{t.title}</h3>
            </div>
            <button
              onClick={handleReject}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <p className="text-gray-700 mb-4">{t.message}</p>

          {showDetails && (
            <div className="space-y-3 mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="mb-1">{t.necessary}</p>
                  <p className="text-sm text-gray-600">
                    {t.necessaryDesc}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="mt-1 w-5 h-5"
                />
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="mb-1">{t.analytics}</p>
                  <p className="text-sm text-gray-600">
                    {t.analyticsDesc}
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="mt-1 w-5 h-5"
                />
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="mb-1">{t.marketing}</p>
                  <p className="text-sm text-gray-600">
                    {t.marketingDesc}
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="mt-1 w-5 h-5"
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAccept}
              className="flex-1 min-w-[150px] px-6 py-3 bg-[#00A859] text-white rounded-xl hover:bg-[#008A47] transition-colors"
            >
              {t.acceptAll}
            </button>
            <button
              onClick={handleReject}
              className="flex-1 min-w-[150px] px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              {t.rejectAll}
            </button>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              {showDetails ? t.savePreferences : t.customize}
            </button>
          </div>

          <div className="mt-4 text-center">
            <a
              href="#"
              className="text-sm text-[#00A859] hover:underline mr-4"
            >
              {t.privacyPolicy}
            </a>
            <a
              href="#"
              className="text-sm text-[#00A859] hover:underline"
            >
              {t.cookiePolicy}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}