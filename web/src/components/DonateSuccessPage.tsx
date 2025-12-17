import { Check } from 'lucide-react';

interface DonateSuccessPageProps {
  language: 'es' | 'en';
  simplifiedMode: boolean;
  amount: number;
  onBackToHome: () => void;
}

export function DonateSuccessPage({ language, simplifiedMode, amount, onBackToHome }: DonateSuccessPageProps) {
  const translations = {
    es: {
      title: 'Donación Exitosa',
      thankYou: '¡Gracias por tu donación!',
      description: `Tu donación de ${amount}€ ha sido procesada con éxito. Tu apoyo es fundamental para que CUDECA pueda seguir proporcionando cuidados paliativos gratuitos a personas con cáncer y otras enfermedades avanzadas.`,
      impact: 'Tu generosidad marca la diferencia en la vida de muchas familias.',
      backToHome: 'Volver a Inicio',
    },
    en: {
      title: 'Donation Successful',
      thankYou: 'Thank you for your donation!',
      description: `Your donation of ${amount}€ has been processed successfully. Your support is crucial for CUDECA to continue providing free palliative care to people with cancer and other advanced illnesses.`,
      impact: 'Your generosity makes a difference in the lives of many families.',
      backToHome: 'Back to Home',
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-[#00A859] rounded-full flex items-center justify-center">
              <Check className="w-16 h-16 text-white" strokeWidth={3} />
            </div>
          </div>

          {/* Title */}
          <h1 className={`text-center text-[#00A859] mb-4 ${simplifiedMode ? 'text-3xl' : ''}`}>
            {t.thankYou}
          </h1>

          {/* Amount */}
          <div className={`text-center mb-6 ${simplifiedMode ? 'text-3xl' : 'text-2xl'}`}>
            <span className="text-[#00A859]">{amount}€</span>
          </div>

          {/* Description */}
          <p className={`text-gray-700 mb-6 text-center ${simplifiedMode ? 'text-xl' : ''}`}>
            {t.description}
          </p>

          {/* Impact message */}
          <div className={`bg-[#D4E8DC] rounded-xl p-6 mb-8 ${simplifiedMode ? 'text-xl' : ''}`}>
            <p className="text-center text-gray-800">
              {t.impact}
            </p>
          </div>

          {/* Back to Home Button */}
          <button
            className={`w-full bg-[#00A859] text-white rounded-xl hover:bg-[#008A47] transition-colors ${
              simplifiedMode ? 'py-6 text-2xl' : 'py-4 text-lg'
            }`}
            onClick={onBackToHome}
          >
            {t.backToHome}
          </button>
        </div>
      </div>
    </div>
  );
}
