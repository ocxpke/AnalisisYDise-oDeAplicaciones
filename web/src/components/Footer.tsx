import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Link } from "./Link"; //

interface FooterProps {
  language: "es" | "en";
}

export function Footer({ language }: FooterProps) {
  const translations = {
    es: {
      about: "Sobre CUDECA",
      aboutText:
        "CUDECA es una fundación sin ánimo de lucro que proporciona cuidados paliativos especializados y gratuitos a personas con cáncer y otras enfermedades avanzadas en la provincia de Málaga.",
      quickLinks: "Enlaces rápidos",
      events: "Eventos",
      donate: "Donar",
      becomeMember: "Hazte socio",
      volunteer: "Voluntariado",
      contact: "Contacto",
      address: "Calle Dehesa del Camarate 1, 29004 Málaga",
      phone: "+34 952 56 49 10",
      email: "info@cudeca.org",
      legal: "Legal",
      privacy: "Política de Privacidad",
      cookies: "Política de Cookies",
      terms: "Términos y Condiciones",
      transparency: "Transparencia",
      copyright:
        "© 2025 Fundación CUDECA. Todos los derechos reservados.",
      followUs: "Síguenos",
    },
    en: {
      about: "About CUDECA",
      aboutText:
        "CUDECA is a non-profit foundation that provides specialized and free palliative care to people with cancer and other advanced illnesses in the province of Málaga.",
      quickLinks: "Quick links",
      events: "Events",
      donate: "Donate",
      becomeMember: "Become a member",
      volunteer: "Volunteer",
      contact: "Contact",
      address: "Calle Dehesa del Camarate 1, 29004 Málaga",
      phone: "+34 952 56 49 10",
      email: "info@cudeca.org",
      legal: "Legal",
      privacy: "Privacy Policy",
      cookies: "Cookie Policy",
      terms: "Terms and Conditions",
      transparency: "Transparency",
      copyright:
        "© 2025 CUDECA Foundation. All rights reserved.",
      followUs: "Follow us",
    },
  };

  const t = translations[language];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-white mb-4">{t.about}</h3>
            <p className="text-sm leading-relaxed">
              {t.aboutText}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4">{t.quickLinks}</h3>
            <ul className="space-y-2 text-sm">
              {/* Usamos tu componente Link y las rutas que App.tsx espera */}
              <li>
                <Link
                  href="/"
                  className="hover:text-[#00A859] transition-colors"
                >
                  {t.events}
                </Link>
              </li>
              <li>
                <Link
                  href="/donate"
                  className="hover:text-[#00A859] transition-colors"
                >
                  {t.donate}
                </Link>
              </li>
              <li>
                <Link
                  href="/become-member"
                  className="hover:text-[#00A859] transition-colors"
                >
                  {t.becomeMember}
                </Link>
              </li>
              {/* Añadimos ruta nueva para voluntariado */}
              <li>
                <Link
                  href="/voluntariado"
                  className="hover:text-[#00A859] transition-colors"
                >
                  {t.volunteer}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white mb-4">{t.contact}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>{t.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a
                  href={`tel:${t.phone}`}
                  className="hover:text-[#00A859] transition-colors"
                >
                  {t.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a
                  href={`mailto:${t.email}`}
                  className="hover:text-[#00A859] transition-colors"
                >
                  {t.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-white mb-4">{t.followUs}</h3>
            <div className="flex gap-3">
              <a
                href="https://facebook.com/AmigosDeCudeca"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#00A859] transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/cudeca"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#00A859] transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/fundacioncudeca/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#00A859] transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com/c/cudecamalaga"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#00A859] transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">{t.copyright}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <Link
                href="/privacy"
                className="hover:text-[#00A859] transition-colors"
              >
                {t.privacy}
              </Link>
              <Link
                href="/cookies"
                className="hover:text-[#00A859] transition-colors"
              >
                {t.cookies}
              </Link>
              <Link
                href="/terms"
                className="hover:text-[#00A859] transition-colors"
              >
                {t.terms}
              </Link>
              <Link
                href="/transparency"
                className="hover:text-[#00A859] transition-colors"
              >
                {t.transparency}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}