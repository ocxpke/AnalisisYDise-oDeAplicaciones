import { Eye, EyeOff } from 'lucide-react';

interface SimplifiedModeToggleProps {
  simplified: boolean;
  onChange: (simplified: boolean) => void;
  language: 'es' | 'en';
}

export function SimplifiedModeToggle({ simplified, onChange, language }: SimplifiedModeToggleProps) {
  const translations = {
    es: {
      normal: 'Modo Normal',
      simplified: 'Modo Fácil',
      toggle: 'Cambiar a',
    },
    en: {
      normal: 'Normal Mode',
      simplified: 'Easy Mode',
      toggle: 'Switch to',
    }
  };

  const t = translations[language];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => onChange(!simplified)}
        className={`flex items-center gap-3 px-6 rounded-full shadow-2xl transition-all hover:scale-105 ${
          simplified 
            ? 'py-5 text-xl bg-[#00A859] text-white'
            : 'py-4 bg-white text-gray-700 border-2 border-gray-300'
        }`}
        title={`${t.toggle} ${simplified ? t.normal : t.simplified}`}
      >
        {simplified ? (
          <>
            <Eye className="w-6 h-6" />
            <span>{t.normal}</span>
          </>
        ) : (
          <>
            <EyeOff className="w-5 h-5" />
            <span>{t.simplified}</span>
          </>
        )}
      </button>
    </div>
  );
}
