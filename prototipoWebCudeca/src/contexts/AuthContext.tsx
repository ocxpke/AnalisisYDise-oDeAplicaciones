import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "../utils/supabaseClient";

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  membershipType?: "individual" | "family" | "corporate" | null;
  membershipActive?: boolean;
  membershipDate?: string;
  phone?: string;
  address?: string;
  zipCode?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    nombre: string,
    apellidos: string,
    telefono: string,
    dni?: string,
    direccion?: string,
    codigoPostal?: string,
    fechaNacimiento?: string,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider",
    );
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Helper para hashear contraseñas (simple, en producción usar bcrypt)
const hashPassword = async (
  password: string,
): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const savedUserId = localStorage.getItem("userId");
      console.log(
        "[AuthContext] Verificando sesión. userId en localStorage:",
        savedUserId,
      );

      if (!savedUserId) {
        console.log(
          "[AuthContext] No hay userId guardado, no hay sesión",
        );
        setLoading(false);
        return;
      }

      // Obtener usuario de la base de datos
      const { data, error } = await supabase
        .from("usuario")
        .select("*")
        .eq("id", parseInt(savedUserId))
        .single();

      if (error || !data) {
        console.log(
          "[AuthContext] Usuario no encontrado o error, limpiando localStorage",
        );
        localStorage.removeItem("userId");
        setLoading(false);
        return;
      }

      console.log(
        "[AuthContext] Usuario encontrado y sesión iniciada:",
        data.email,
      );
      setUser({
        id: String(data.id),
        email: data.email || "",
        name: `${data.nombre} ${data.apellidos}`.trim(),
        role: data.admin ? "admin" : "user",
        phone: data.telefono,
        address: data.direccion,
        zipCode: data.codigopostal,
        membershipActive: data.socio || false,
        membershipDate: data.fechasocio || null,
      });
    } catch (error) {
      console.error("Error checking session:", error);
      localStorage.removeItem("userId");
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Buscar usuario por email
      const { data: userData, error } = await supabase
        .from("usuario")
        .select("*")
        .eq("email", email)
        .single();

      if (error || !userData) {
        throw new Error("Email o contraseña incorrectos");
      }

      // TEMPORAL: Verificar contraseña sin hashear para pruebas
      // En producción se debe usar hash
      if (!userData.password) {
        // Si no tiene password guardado, guardar el que introduce
        await supabase
          .from("usuario")
          .update({ password: password })
          .eq("id", userData.id);
      } else if (userData.password !== password) {
        throw new Error("Email o contraseña incorrectos");
      }

      // Guardar sesión
      localStorage.setItem("userId", String(userData.id));

      setUser({
        id: String(userData.id),
        email: userData.email || "",
        name: `${userData.nombre} ${userData.apellidos}`.trim(),
        role: userData.admin ? "admin" : "user",
        phone: userData.telefono,
        address: userData.direccion,
        zipCode: userData.codigopostal,
        membershipActive: userData.socio || false,
        membershipDate: userData.fechasocio || null,
      });
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    nombre: string,
    apellidos: string,
    telefono: string,
    dni?: string,
    direccion?: string,
    codigoPostal?: string,
    fechaNacimiento?: string,
  ) => {
    try {
      // Verificar si el email ya existe
      const { data: existing } = await supabase
        .from("usuario")
        .select("id")
        .eq("email", email)
        .single();

      if (existing) {
        throw new Error("Ya existe una cuenta con este email");
      }

      // TEMPORAL: Guardar contraseña sin hashear para pruebas
      // En producción se debe hashear
      const storedPassword = password;

      // Obtener el último ID
      const { data: lastUser } = await supabase
        .from("usuario")
        .select("id")
        .order("id", { ascending: false })
        .limit(1)
        .single();

      const nextId = (lastUser?.id || 0) + 1;

      // Preparar fecha de nacimiento
      const birthDate = fechaNacimiento
        ? new Date(fechaNacimiento).toISOString()
        : new Date().toISOString();

      // Crear usuario
      const { data: newUser, error } = await supabase
        .from("usuario")
        .insert({
          id: nextId,
          email: email,
          nombre: nombre,
          apellidos: apellidos,
          telefono: telefono || "",
          dni: dni || null,
          direccion: direccion || null,
          codigopostal: codigoPostal || null,
          socio: false,
          admin: false,
          password: storedPassword,
          fechanacimiento: birthDate,
        })
        .select()
        .single();

      if (error) {
        console.error("Error al crear usuario:", error);
        throw new Error(
          error.message || "Error al registrarse",
        );
      }

      // Iniciar sesión automáticamente
      await signIn(email, password);
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      localStorage.removeItem("userId");

      // Redirigir a la pantalla principal
      window.dispatchEvent(
        new CustomEvent("navigate", {
          detail: { href: "/" },
        }),
      );
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const refreshUser = async () => {
    await checkSession();
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        refreshUser,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};