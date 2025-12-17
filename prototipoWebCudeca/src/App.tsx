import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { Header } from "./components/Header";
import { EventsList } from "./components/EventsList";
import { EventDetail } from "./components/EventDetail";
import { PurchaseFlow } from "./components/PurchaseFlow";
import { DonatePage } from "./components/DonatePage";
import { DonateSuccessPage } from "./components/DonateSuccessPage";
import { MembershipPage } from "./components/MembershipPage";
import { UserAccount } from "./components/UserAccount";
import { QRScanner } from "./components/QRScanner";
import { AdminEventManager } from "./components/AdminEventManager";
import { SimplifiedModeToggle } from "./components/SimplifiedModeToggle";
import { CookieConsent } from "./components/CookieConsent";
import { InitializationPage } from "./components/InitializationPage";
import { Footer } from "./components/Footer";
import { PrivacyPolicyPage } from "./components/PrivacyPolicyPage";
import { CookiesPolicyPage } from "./components/CookiesPolicyPage";
import { EventsProvider } from "./contexts/EventsContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Event } from "./types";

const VolunteerPage = ({
  language,
}: {
  language: "es" | "en";
}) => (
  <div className="container mx-auto px-4 py-12 max-w-4xl">
    <h1 className="text-3xl font-bold mb-6 text-gray-900">
      {language === "es" ? "Voluntariado" : "Volunteering"}
    </h1>
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <p className="text-lg text-gray-600 mb-4">
        {language === "es"
          ? "¿Quieres ayudarnos en nuestros próximos eventos? Rellena este formulario y nos pondremos en contacto contigo."
          : "Do you want to help us in our upcoming events? Fill out this form and we will contact you."}
      </p>
      <div className="bg-blue-50 text-blue-800 p-4 rounded-lg">
        {language === "es"
          ? "Próximamente: Formulario de inscripción de voluntarios."
          : "Coming soon: Volunteer registration form."}
      </div>
    </div>
  </div>
);

type Page =
  | { type: "home" }
  | { type: "event"; id: string }
  | { type: "purchase"; eventId: string }
  | { type: "account" }
  | { type: "admin" }
  | { type: "qr-scanner" }
  | { type: "donate" }
  | { type: "donate-success"; amount: number }
  | { type: "become-member" }
  | { type: "volunteer" }
  | { type: "privacy" }
  | { type: "cookies" }
  | { type: "init" };

function AppContent() {
  const { isAdmin, user } = useAuth();
  const [language, setLanguage] = useState<"es" | "en">("es");
  const [simplifiedMode, setSimplifiedMode] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>({
    type: "home",
  });

  useEffect(() => {
    const handleNavigation = (e: Event) => {
      const customEvent = e as CustomEvent<{ href: string }>;
      const href = customEvent.detail.href;

      if (href === "/") {
        setCurrentPage({ type: "home" });
      } else if (href === "/account") {
        setCurrentPage({ type: "account" });
      } else if (href === "/admin") {
        if (!isAdmin) {
          toast.error(
            language === "es"
              ? "No tienes permisos para acceder al panel de administrador"
              : "You do not have permission to access the admin panel",
          );
          setCurrentPage({ type: "home" });
          return;
        }
        setCurrentPage({ type: "admin" });
      } else if (href === "/qr-scanner") {
        setCurrentPage({ type: "qr-scanner" });
      } else if (href === "/donate") {
        setCurrentPage({ type: "donate" });
      } else if (href === "/become-member") {
        setCurrentPage({ type: "become-member" });
      } else if (href === "/voluntariado") {
        setCurrentPage({ type: "volunteer" });
      } else if (href === "/privacy") {
        setCurrentPage({ type: "privacy" });
      } else if (href === "/cookies") {
        setCurrentPage({ type: "cookies" });
      } else if (href.startsWith("/event/")) {
        const id = href.replace("/event/", "");
        setCurrentPage({ type: "event", id });
      } else if (href.startsWith("/purchase/")) {
        const eventId = href.replace("/purchase/", "");
        setCurrentPage({ type: "purchase", eventId });
      }
    };

    window.addEventListener("navigate", handleNavigation);
    return () =>
      window.removeEventListener("navigate", handleNavigation);
  }, [isAdmin, language]);

  const renderPage = () => {
    switch (currentPage.type) {
      case "home":
        return (
          <EventsList
            language={language}
            simplifiedMode={simplifiedMode}
          />
        );

      case "event":
        return (
          <EventDetail
            eventId={currentPage.id}
            language={language}
            simplifiedMode={simplifiedMode}
            onBuyClick={() =>
              setCurrentPage({
                type: "purchase",
                eventId: currentPage.id,
              })
            }
          />
        );

      case "purchase":
        return (
          <PurchaseFlow
            eventId={currentPage.eventId}
            language={language}
            simplifiedMode={simplifiedMode}
            onComplete={() => setCurrentPage({ type: "home" })}
          />
        );

      case "account":
        return (
          <UserAccount
            language={language}
            simplifiedMode={simplifiedMode}
          />
        );

      case "admin":
        if (!isAdmin) {
          toast.error(
            language === "es"
              ? "No tienes permisos para acceder al panel de administrador"
              : "You do not have permission to access the admin panel",
          );
          setCurrentPage({ type: "home" });
          return (
            <EventsList
              language={language}
              simplifiedMode={simplifiedMode}
            />
          );
        }
        return <AdminEventManager onEventsUpdate={() => {}} />;

      case "qr-scanner":
        return <QRScanner language={language} />;

      case "init":
        return (
          <InitializationPage
            onComplete={() => setCurrentPage({ type: "home" })}
          />
        );

      case "donate":
        return (
          <DonatePage
            language={language}
            simplifiedMode={simplifiedMode}
            onDonationComplete={(amount) =>
              setCurrentPage({ type: "donate-success", amount })
            }
          />
        );

      case "donate-success":
        return (
          <DonateSuccessPage
            language={language}
            simplifiedMode={simplifiedMode}
            amount={currentPage.amount}
            onBackToHome={() =>
              setCurrentPage({ type: "home" })
            }
          />
        );

      case "become-member":
        return (
          <MembershipPage
            language={language}
            simplifiedMode={simplifiedMode}
          />
        );

      case "volunteer":
        return <VolunteerPage language={language} />;

      case "privacy":
        return <PrivacyPolicyPage language={language} />;

      case "cookies":
        return <CookiesPolicyPage language={language} />;

      default:
        return (
          <EventsList
            language={language}
            simplifiedMode={simplifiedMode}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {currentPage.type !== "purchase" &&
        currentPage.type !== "qr-scanner" &&
        currentPage.type !== "privacy" &&
        currentPage.type !== "cookies" && (
          <Header
            language={language}
            onLanguageChange={setLanguage}
            simplifiedMode={simplifiedMode}
          />
        )}

      {renderPage()}

      {currentPage.type !== "purchase" &&
        currentPage.type !== "qr-scanner" &&
        currentPage.type !== "privacy" &&
        currentPage.type !== "cookies" && (
          <SimplifiedModeToggle
            simplified={simplifiedMode}
            onChange={setSimplifiedMode}
            language={language}
          />
        )}

      <CookieConsent language={language} />
      <Toaster />

      {currentPage.type !== "purchase" &&
        currentPage.type !== "qr-scanner" &&
        currentPage.type !== "admin" &&
        currentPage.type !== "privacy" &&
        currentPage.type !== "cookies" && (
          <Footer language={language} />
        )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <EventsProvider>
        <AppContent />
      </EventsProvider>
    </AuthProvider>
  );
}