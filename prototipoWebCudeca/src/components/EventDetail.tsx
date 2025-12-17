import { Calendar, MapPin, ArrowLeft } from "lucide-react";
import { useEvents } from "../contexts/EventsContext";
import { Link } from "./Link";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface EventDetailProps {
  eventId: string;
  language: "es" | "en";
  simplifiedMode: boolean;
  onBuyClick: () => void;
}

export function EventDetail({
  eventId,
  language,
  simplifiedMode,
  onBuyClick,
}: EventDetailProps) {
  const { events } = useEvents();
  const event = events.find((e) => e.id === eventId);

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        Event not found
      </div>
    );
  }

  const formatDate = (date: string, time: string) => {
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const formattedDate = d.toLocaleDateString(
      language === "es" ? "es-ES" : "en-US",
      options,
    );
    return `${formattedDate}, ${time}`;
  };

  const translations = {
    es: {
      backToEvents: "Volver a eventos",
      buyTicket: "Comprar entrada",
      from: "A partir de",
      description: "Descripción",
      availability: "Disponibilidad",
      available: "disponibles",
      sold: "vendidas",
    },
    en: {
      backToEvents: "Back to events",
      buyTicket: "Buy ticket",
      from: "From",
      description: "Description",
      availability: "Availability",
      available: "available",
      sold: "sold",
    },
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back button */}
      <div
        className={`bg-white ${simplifiedMode ? "py-6" : "py-4"}`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <Link
            href="/"
            className={`inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 ${simplifiedMode ? "text-xl" : ""}`}
          >
            <ArrowLeft
              className={simplifiedMode ? "w-6 h-6" : "w-5 h-5"}
            />
            {t.backToEvents}
          </Link>
        </div>
      </div>

      <div
        className={`max-w-7xl mx-auto px-4 ${simplifiedMode ? "py-8" : "py-12"}`}
      >
        <div
          className={`grid ${simplifiedMode ? "grid-cols-1 gap-8" : "grid-cols-1 lg:grid-cols-2 gap-12"}`}
        >
          {/* Left column - Image */}
          <div className="rounded-2xl overflow-hidden shadow-lg">
            {event.image ? (
              <ImageWithFallback
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full aspect-[4/3] bg-[#00A859] flex items-center justify-center">
                <div className="text-white text-center p-8">
                  <h2 className="text-3xl mb-2">
                    {event.title}
                  </h2>
                  <p className="text-xl opacity-90">
                    Fundación CUDECA
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right column - Details */}
          <div className="bg-[#D4E8DC] rounded-2xl p-8">
            <h1
              className={`mb-4 ${simplifiedMode ? "text-3xl" : ""}`}
            >
              {event.title}
            </h1>

            <div className="flex items-start gap-3 text-gray-700 mb-3">
              <MapPin
                className={`flex-shrink-0 mt-1 ${simplifiedMode ? "w-6 h-6" : "w-5 h-5"}`}
              />
              <span className={simplifiedMode ? "text-xl" : ""}>
                {event.location}
              </span>
            </div>

            <div className="flex items-start gap-3 text-[#00A859] mb-6">
              <Calendar
                className={`flex-shrink-0 mt-1 ${simplifiedMode ? "w-6 h-6" : "w-5 h-5"}`}
              />
              <span className={simplifiedMode ? "text-xl" : ""}>
                {formatDate(event.date, event.time)}
              </span>
            </div>

            <div className="mb-6">
              <p
                className={`text-gray-800 ${simplifiedMode ? "text-2xl" : "text-xl"}`}
              >
                <span className="text-gray-600">{t.from}</span>{" "}
                <span className="text-[#00A859]">
                  {event.price}€
                </span>
              </p>
            </div>

            {event.capacity && (
              <div className="mb-8 p-4 bg-white rounded-lg">
                <h3
                  className={`mb-2 ${simplifiedMode ? "text-xl" : ""}`}
                >
                  {t.availability}
                </h3>
                <div className="flex gap-4">
                  <span
                    className={`text-[#00A859] ${simplifiedMode ? "text-lg" : ""}`}
                  >
                    {event.capacity - (event.sold || 0)}{" "}
                    {t.available}
                  </span>
                </div>
                <div className="mt-3 w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-[#00A859] h-3 rounded-full transition-all"
                    style={{
                      width: `${((event.sold || 0) / event.capacity) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <div className="mb-8">
              <h3
                className={`mb-3 ${simplifiedMode ? "text-xl" : ""}`}
              >
                {t.description}
              </h3>
              <div
                className={`text-gray-700 whitespace-pre-line ${simplifiedMode ? "text-lg" : ""}`}
              >
                {event.description}
              </div>
            </div>

            <button
              disabled={event.capacity - (event.sold || 0) == 0}
              onClick={onBuyClick}
              className={`w-full bg-[#00A859] text-white rounded-xl hover:bg-[#008A47] transition-colors shadow-lg ${
                simplifiedMode
                  ? "py-6 text-2xl"
                  : "py-4 text-lg"
              } disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300`}
            >
              {t.buyTicket}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}