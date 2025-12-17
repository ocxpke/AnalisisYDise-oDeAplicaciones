import { Calendar, MapPin, Download, Mail, Check } from 'lucide-react';
import { Ticket } from '../types';
import { mockEvents } from '../utils/mockData';
import { QRCodeSVG } from 'qrcode.react';

interface TicketViewProps {
  tickets: Ticket[];
  userEmail: string;
  userName: string;
  language: 'es' | 'en';
  simplifiedMode: boolean;
  onBackToEvents: () => void;
}

export function TicketView({ 
  tickets, 
  userEmail, 
  userName, 
  language, 
  simplifiedMode,
  onBackToEvents 
}: TicketViewProps) {
  const event = mockEvents.find(e => e.id === tickets[0]?.eventId);

  const translations = {
    es: {
      thankYou: '¡Gracias por tu compra!',
      purchaseComplete: 'Tu compra se ha completado con éxito',
      ticketsSent: 'Tus entradas han sido enviadas a',
      downloadPDF: 'Descargar entradas',
      sendEmail: 'Reenviar por email',
      backToEvents: 'Volver a eventos',
      ticket: 'Entrada',
      name: 'Nombre',
      date: 'Fecha',
      location: 'Ubicación',
      number: 'Número',
      ticketNumber: 'Entrada #',
    },
    en: {
      thankYou: 'Thank you for your purchase!',
      purchaseComplete: 'Your purchase has been completed successfully',
      ticketsSent: 'Your tickets have been sent to',
      downloadPDF: 'Download tickets',
      sendEmail: 'Resend by email',
      backToEvents: 'Back to events',
      ticket: 'Ticket',
      name: 'Name',
      date: 'Date',
      location: 'Location',
      number: 'Number',
      ticketNumber: 'Ticket #',
    }
  };

  const t = translations[language];

  const formatDate = (date?: string, time?: string) => {
    if (!date || !time) return '';
    const d = new Date(date);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    const formattedDate = d.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', options);
    return `${formattedDate}, ${time}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Header */}
      <div className="bg-[#00A859] text-white">
        <div className={`max-w-4xl mx-auto px-4 text-center ${simplifiedMode ? 'py-12' : 'py-8'}`}>
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-[#00A859]" />
          </div>
          <h1 className={simplifiedMode ? 'text-3xl mb-4' : 'mb-4'}>{t.thankYou}</h1>
          <p className={simplifiedMode ? 'text-xl' : ''}>{t.purchaseComplete}</p>
        </div>
      </div>

      <div className={`max-w-4xl mx-auto px-4 ${simplifiedMode ? 'py-8' : 'py-12'}`}>
        {/* Email confirmation message */}
        <div className={`bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-center ${
          simplifiedMode ? 'text-lg' : ''
        }`}>
          <p className="text-blue-800">
            {t.ticketsSent} <span className="font-semibold">{userEmail}</span>
          </p>
        </div>

        {/* Tickets */}
        <div className="space-y-6 mb-8">
          {tickets.map((ticket, index) => (
            <div key={ticket.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Ticket header with CUDECA branding */}
              <div className="bg-[#00A859] text-white p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className={simplifiedMode ? 'text-2xl mb-2' : 'mb-2'}>
                      {event?.title || 'Evento CUDECA'}
                    </h2>
                    <p className={`opacity-90 ${simplifiedMode ? 'text-lg' : 'text-sm'}`}>
                      {t.ticketNumber}{index + 1} • {ticket.ticketType}
                    </p>
                  </div>
                  <div className={`${simplifiedMode ? 'text-xl' : ''}`}>
                    {ticket.raffleNumber && (
                      <div className="bg-white text-[#00A859] rounded-lg px-4 py-2">
                        <div className={`${simplifiedMode ? 'text-sm' : 'text-xs'}`}>
                          {t.number}
                        </div>
                        <div className={simplifiedMode ? 'text-3xl' : 'text-2xl'}>
                          {ticket.raffleNumber}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Ticket body */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Event details */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className={`flex-shrink-0 mt-1 text-[#00A859] ${
                        simplifiedMode ? 'w-6 h-6' : 'w-5 h-5'
                      }`} />
                      <div>
                        <p className={`text-gray-500 ${simplifiedMode ? 'text-lg' : 'text-sm'}`}>
                          {t.date}
                        </p>
                        <p className={simplifiedMode ? 'text-xl' : ''}>
                          {formatDate(event?.date, event?.time)}
                        </p>
                      </div>
                    </div>

                    {event?.location && (
                      <div className="flex items-start gap-3">
                        <MapPin className={`flex-shrink-0 mt-1 text-[#00A859] ${
                          simplifiedMode ? 'w-6 h-6' : 'w-5 h-5'
                        }`} />
                        <div>
                          <p className={`text-gray-500 ${simplifiedMode ? 'text-lg' : 'text-sm'}`}>
                            {t.location}
                          </p>
                          <p className={simplifiedMode ? 'text-xl' : ''}>
                            {event.location}
                          </p>
                        </div>
                      </div>
                    )}

                    <div>
                      <p className={`text-gray-500 ${simplifiedMode ? 'text-lg' : 'text-sm'}`}>
                        {t.name}
                      </p>
                      <p className={simplifiedMode ? 'text-xl' : ''}>
                        {userName}
                      </p>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-200">
                      <QRCodeSVG value={ticket.qrCode} size={128} />
                    </div>
                    <p className={`text-gray-500 mt-3 text-center ${
                      simplifiedMode ? 'text-lg' : 'text-xs'
                    }`}>
                      Presenta este código en el evento
                    </p>
                  </div>
                </div>

                {/* Ticket ID */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-gray-400 text-center text-xs">
                    ID: {ticket.id}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className={`grid gap-4 mb-8 ${simplifiedMode ? 'grid-cols-1' : 'grid-cols-2'}`}>
          <button className={`flex items-center justify-center gap-2 px-6 bg-[#00A859] text-white rounded-xl hover:bg-[#008A47] transition-colors ${ 
            simplifiedMode ? 'py-6 text-xl' : 'py-4'
          }`}>
            <Download className={simplifiedMode ? 'w-6 h-6' : 'w-5 h-5'} />
            {t.downloadPDF}
          </button>
          <button className={`flex items-center justify-center gap-2 px-6 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors ${
            simplifiedMode ? 'py-6 text-xl' : 'py-4'
          }`}>
            <Mail className={simplifiedMode ? 'w-6 h-6' : 'w-5 h-5'} />
            {t.sendEmail}
          </button>
        </div>

        <button
          onClick={onBackToEvents}
          className={`w-full border-2 border-[#00A859] text-[#00A859] rounded-xl hover:bg-[#D4E8DC] transition-colors ${
            simplifiedMode ? 'py-6 text-2xl' : 'py-4 text-lg'
          }`}
        >
          {t.backToEvents}
        </button>
      </div>
    </div>
  );
}