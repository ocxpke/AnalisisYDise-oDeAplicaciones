import { projectId, publicAnonKey } from './supabase/info';

const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-e30de6da`;

export const defaultUsers = [
  {
    email: 'admin@cudeca.org',
    password: 'Admin2025!',
    name: 'María González',
    phone: '+34 600 000 001',
    role: 'admin'
  },
  {
    email: 'usuario1@example.com',
    password: 'Usuario2025!',
    name: 'Carlos Martínez',
    phone: '+34 600 000 002',
    role: 'user'
  },
  {
    email: 'usuario2@example.com',
    password: 'Usuario2025!',
    name: 'Ana López',
    phone: '+34 600 000 003',
    role: 'user'
  },
  {
    email: 'usuario3@example.com',
    password: 'Usuario2025!',
    name: 'Pedro Sánchez',
    phone: '+34 600 000 004',
    role: 'user'
  },
];

export const initializeUsers = async () => {
  const results = [];

  for (const user of defaultUsers) {
    try {
      const response = await fetch(`${baseUrl}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (response.ok) {
        results.push({ success: true, email: user.email, role: user.role });
      } else {
        results.push({ success: false, email: user.email, error: data.error });
      }
    } catch (error) {
      results.push({ success: false, email: user.email, error: 'Error de conexión' });
    }
  }

  return results;
};
