import { User, LogIn, LogOut, Shield } from "lucide-react";
import { Link } from "./Link";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { AuthModal } from "./AuthModal";

interface HeaderProps {
  language: "es" | "en";
  onLanguageChange: (lang: "es" | "en") => void;
  simplifiedMode: boolean;
}

export function Header({
  language,
  onLanguageChange,
  simplifiedMode,
}: HeaderProps) {
  const { user, isAdmin } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const translations = {
    es: {
      donateNow: "Dona Ahora",
      becomeMember: "Hazte Socio",
      myAccount: "Mi Cuenta",
      signIn: "Iniciar Sesión",
      welcome: "Hola",
      adminPanel: "Administración",
    },
    en: {
      donateNow: "Donate Now",
      becomeMember: "Become a Member",
      myAccount: "My Account",
      signIn: "Sign In",
      welcome: "Hello",
      adminPanel: "Administration",
    },
  };

  const t = translations[language];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-black text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-3">
            <button
              onClick={() => onLanguageChange("es")}
              className={`flex items-center gap-1 px-2 py-1 rounded ${
                language === "es"
                  ? "bg-red-600"
                  : "bg-transparent"
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-red-600"></span>
              <span className="text-sm">ES</span>
            </button>
            <button
              onClick={() => onLanguageChange("en")}
              className={`flex items-center gap-1 px-2 py-1 rounded ${
                language === "en"
                  ? "bg-blue-600"
                  : "bg-transparent"
              }`}
            >
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              <span className="text-sm">EN</span>
            </button>
          </div>
          <div
            className={`flex gap-6 ${simplifiedMode ? "text-xl" : "text-sm"}`}
          >
            <Link href="/donate" className="hover:underline">
              {t.donateNow}
            </Link>
            <Link
              href="/become-member"
              className="hover:underline"
            >
              {t.becomeMember}
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-[#00A859] text-white py-6 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <img
              src="https://www.cudeca.org/wp-content/themes/cudeca/images/logo.png"
              alt="Cudeca"
              className="h-10 w-auto"
            />
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span
                  className={`${simplifiedMode ? "text-lg" : "text-sm"} opacity-90`}
                >
                  {t.welcome}, {user.name}
                </span>
                <Link
                  href="/account"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <User
                    className={
                      simplifiedMode ? "w-8 h-8" : "w-6 h-6"
                    }
                  />
                  <span
                    className={
                      simplifiedMode ? "text-xl" : "text-base"
                    }
                  >
                    {t.myAccount}
                  </span>
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <Shield
                      className={
                        simplifiedMode ? "w-8 h-8" : "w-6 h-6"
                      }
                    />
                    <span
                      className={
                        simplifiedMode ? "text-xl" : "text-base"
                      }
                    >
                      {t.adminPanel}
                    </span>
                  </Link>
                )}
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity bg-white text-[#00A859] px-4 py-2 rounded-lg"
              >
                <LogIn
                  className={
                    simplifiedMode ? "w-7 h-7" : "w-5 h-5"
                  }
                />
                <span
                  className={
                    simplifiedMode ? "text-lg" : "text-sm"
                  }
                >
                  {t.signIn}
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}