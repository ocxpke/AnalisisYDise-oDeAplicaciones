import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signin" | "signup";
}

export const AuthModal = ({
  isOpen,
  onClose,
  initialMode = "signin",
}: AuthModalProps) => {
  const [mode, setMode] = useState<"signin" | "signup">(
    initialMode,
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState(""); // Cambiado de "name" a "nombre"
  const [apellidos, setApellidos] = useState(""); // Nuevo campo separado
  const [phone, setPhone] = useState("");
  const [dni, setDni] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [birthDate, setBirthDate] = useState(""); // Nueva fecha de nacimiento
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signin") {
        await signIn(email, password);
        onClose();
      } else {
        await signUp(
          email,
          password,
          nombre,
          apellidos,
          phone,
          dni,
          address,
          postalCode,
          birthDate,
        );
        onClose();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al procesar la solicitud",
      );
    } finally {
      setLoading(false);
    }
  };

  // No renderizar nada si el modal está cerrado
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="sticky top-4 left-full -ml-10 text-gray-400 hover:text-gray-600 z-10 bg-white rounded-full p-1"
        >
          <X size={24} />
        </button>

        <div className="p-6 pt-2">
          <h2 className="mb-6 text-[#00A859]">
            {mode === "signin"
              ? "Iniciar Sesión"
              : "Crear Cuenta"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <>
                <div>
                  <label
                    htmlFor="nombre"
                    className="block text-sm mb-1"
                  >
                    Nombre *
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A859]"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="apellidos"
                    className="block text-sm mb-1"
                  >
                    Apellidos *
                  </label>
                  <input
                    id="apellidos"
                    type="text"
                    value={apellidos}
                    onChange={(e) =>
                      setApellidos(e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A859]"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm mb-1"
                  >
                    Teléfono *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A859]"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="dni"
                    className="block text-sm mb-1"
                  >
                    DNI (opcional)
                  </label>
                  <input
                    id="dni"
                    type="text"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A859]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm mb-1"
                  >
                    Dirección (opcional)
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A859]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="postalCode"
                    className="block text-sm mb-1"
                  >
                    Código Postal (opcional)
                  </label>
                  <input
                    id="postalCode"
                    type="text"
                    value={postalCode}
                    onChange={(e) =>
                      setPostalCode(e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A859]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="birthDate"
                    className="block text-sm mb-1"
                  >
                    Fecha de Nacimiento (opcional)
                  </label>
                  <input
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) =>
                      setBirthDate(e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A859]"
                  />
                </div>
              </>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm mb-1"
              >
                Email *
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A859]"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm mb-1"
              >
                Contraseña *
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A859]"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00A859] text-white py-3 rounded-lg hover:bg-[#008F4C] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading
                ? "Cargando..."
                : mode === "signin"
                  ? "Iniciar Sesión"
                  : "Crear Cuenta"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setMode(
                  mode === "signin" ? "signup" : "signin",
                );
                setError("");
              }}
              className="text-[#00A859] hover:underline"
            >
              {mode === "signin"
                ? "¿No tienes cuenta? Regístrate"
                : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};