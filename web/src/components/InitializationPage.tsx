import { useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { initializeUsers, defaultUsers } from '../utils/initializeUsers';
import { initializeEvents } from '../utils/initializeEvents';

interface InitializationPageProps {
  onComplete: () => void;
}

export const InitializationPage = ({ onComplete }: InitializationPageProps) => {
  const [step, setStep] = useState<'start' | 'users' | 'events' | 'complete'>('start');
  const [usersResult, setUsersResult] = useState<any[]>([]);
  const [eventsResult, setEventsResult] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleInitializeUsers = async () => {
    setLoading(true);
    setStep('users');
    
    try {
      const results = await initializeUsers();
      setUsersResult(results);
    } catch (error) {
      console.error('Error initializing users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInitializeEvents = async () => {
    setLoading(true);
    setStep('events');
    
    try {
      const results = await initializeEvents();
      setEventsResult(results);
      setStep('complete');
    } catch (error) {
      console.error('Error initializing events:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStart = () => (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-[#00A859] mb-6">Inicializar Sistema CUDECA</h2>
      
      <div className="space-y-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-800 mb-2">¿Qué hará este proceso?</h3>
          <ul className="text-blue-700 text-sm space-y-1 list-disc list-inside">
            <li>Crear 1 usuario administrador</li>
            <li>Crear 3 usuarios normales de ejemplo</li>
            <li>Cargar todos los eventos del catálogo</li>
            <li>Configurar permisos y roles</li>
          </ul>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="text-amber-800 mb-2">⚠️ Importante</h3>
          <p className="text-amber-700 text-sm">
            Este proceso solo debe ejecutarse una vez. Si ya has inicializado el sistema, 
            algunos pasos pueden fallar si los datos ya existen.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="mb-3">Usuarios que se crearán:</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <div>
                <div className="text-[#00A859]">👤 Administrador</div>
                <div className="text-gray-600">{defaultUsers[0].email}</div>
              </div>
              <div className="text-xs text-gray-500">
                Contraseña: {defaultUsers[0].password}
              </div>
            </div>
            {defaultUsers.slice(1).map((user, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-white rounded">
                <div>
                  <div>👤 {user.name}</div>
                  <div className="text-gray-600">{user.email}</div>
                </div>
                <div className="text-xs text-gray-500">
                  Contraseña: {user.password}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleInitializeUsers}
        disabled={loading}
        className="w-full bg-[#00A859] text-white py-4 rounded-lg hover:bg-[#008F4C] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Inicializando...
          </>
        ) : (
          'Comenzar Inicialización'
        )}
      </button>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-[#00A859] mb-6">Paso 1: Creación de Usuarios</h2>
      
      <div className="space-y-3 mb-8">
        {usersResult.map((result, index) => (
          <div 
            key={index}
            className={`flex items-center gap-3 p-4 rounded-lg border ${
              result.success 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}
          >
            {result.success ? (
              <Check className="text-green-600" size={20} />
            ) : (
              <X className="text-red-600" size={20} />
            )}
            <div className="flex-1">
              <div className={result.success ? 'text-green-800' : 'text-red-800'}>
                {result.email}
                {result.role === 'admin' && ' (Administrador)'}
              </div>
              {!result.success && result.error && (
                <div className="text-red-600 text-sm mt-1">{result.error}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleInitializeEvents}
        disabled={loading}
        className="w-full bg-[#00A859] text-white py-4 rounded-lg hover:bg-[#008F4C] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            Cargando eventos...
          </>
        ) : (
          'Continuar: Cargar Eventos'
        )}
      </button>
    </div>
  );

  const renderEvents = () => (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      <h2 className="text-[#00A859] mb-6">Paso 2: Carga de Eventos</h2>
      
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-[#00A859]" size={48} />
      </div>
      
      <p className="text-center text-gray-600">
        Cargando eventos en la base de datos...
      </p>
    </div>
  );

  const renderComplete = () => (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Check className="text-green-600" size={32} />
        </div>
        <h2 className="text-[#00A859]">¡Sistema Inicializado!</h2>
      </div>

      <div className="space-y-4 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-green-800 mb-3">✅ Usuarios creados</h3>
          <div className="space-y-2 text-sm">
            {usersResult.filter(r => r.success).map((result, index) => (
              <div key={index} className="text-green-700">
                • {result.email} {result.role === 'admin' ? '(Administrador)' : ''}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-green-800 mb-3">✅ Eventos cargados</h3>
          <div className="space-y-2 text-sm">
            {eventsResult.filter(r => r.success).map((result, index) => (
              <div key={index} className="text-green-700">
                • {result.title}
              </div>
            ))}
          </div>
        </div>

        {(usersResult.some(r => !r.success) || eventsResult.some(r => !r.success)) && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="text-amber-800 mb-2">⚠️ Algunas operaciones fallaron</h3>
            <p className="text-amber-700 text-sm">
              Algunos elementos ya existían en la base de datos o hubo errores. 
              Esto es normal si ya has inicializado el sistema antes.
            </p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-800 mb-2">🔑 Credenciales de acceso</h3>
          <div className="text-blue-700 text-sm space-y-1">
            <p><strong>Admin:</strong> {defaultUsers[0].email} / {defaultUsers[0].password}</p>
            <p><strong>Usuarios:</strong> Contraseña común: Usuario2025!</p>
          </div>
        </div>
      </div>

      <button
        onClick={onComplete}
        className="w-full bg-[#00A859] text-white py-4 rounded-lg hover:bg-[#008F4C] transition-colors"
      >
        Ir al Inicio
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {step === 'start' && renderStart()}
        {step === 'users' && renderUsers()}
        {step === 'events' && renderEvents()}
        {step === 'complete' && renderComplete()}
      </div>
    </div>
  );
};