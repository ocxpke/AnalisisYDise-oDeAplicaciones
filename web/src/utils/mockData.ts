import { Event, TicketType } from '../types';

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Dani Martín - Gira 25 P*t*s Años',
    location: 'Movistar Arena, Madrid',
    date: '2025-11-14',
    time: '21:00',
    price: 15,
    image: 'https://images.unsplash.com/photo-1648260029310-5f1da359af9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25jZXJ0JTIwY3Jvd2QlMjBsaWdodHN8ZW58MXx8fHwxNzY0MDMxODE3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Una noche única para celebrar los 25 años de carrera de Dani Martín, con un recorrido por las canciones que marcaron a toda una generación: desde los grandes éxitos de El Canto del Loco hasta sus temas más personales y actuales. Un concierto lleno de energía, recuerdos y emoción.\n\nAdemás de disfrutar de un espectáculo inolvidable, tu entrada contribuye a apoyar la labor de CUDECA en el cuidado y acompañamiento de personas con cáncer y otras enfermedades avanzadas.\n\nMúsica que deja huella. Un concierto que deja impacto.',
    type: 'concierto',
    capacity: 10000,
    sold: 6342,
    hasSeating: true,
    ticketTypes: [
      { id: 't1', name: 'Grada Superior', price: 15, color: '#9333EA', available: 1200 },
      { id: 't2', name: 'Grada Media', price: 25, color: '#3B82F6', available: 800 },
      { id: 't3', name: 'Grada Inferior 1', price: 35, color: '#06B6D4', available: 450 },
      { id: 't4', name: 'Grada Inferior 2', price: 50, color: '#10B981', available: 320 },
      { id: 't5', name: 'Pista', price: 45, color: '#EF4444', available: 890 },
      { id: 't6', name: 'FrontStage', price: 70, color: '#F59E0B', available: 98 },
    ],
    venueMap: {
      zones: [
        { id: 't6', name: 'FrontStage', color: '#F59E0B', coordinates: '' },
        { id: 't3', name: 'Grada Inferior 1', color: '#06B6D4', coordinates: '' },
        { id: 't4', name: 'Grada Inferior 2', color: '#10B981', coordinates: '' },
        { id: 't2', name: 'Grada Media', color: '#3B82F6', coordinates: '' },
        { id: 't1', name: 'Grada Superior', color: '#9333EA', coordinates: '' },
        { id: 't5', name: 'Pista', color: '#EF4444', coordinates: '' },
      ]
    }
  },
  {
    id: '2',
    title: 'Cena Benéfica Anual CUDECA',
    location: 'Hotel Marbella Club, Marbella',
    date: '2025-12-10',
    time: '20:30',
    price: 150,
    image: 'https://images.unsplash.com/photo-1646781652500-40015cee4917?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFyaXR5JTIwZGlubmVyJTIwZ2FsYXxlbnwxfHx8fDE3NjQwNzQ1ODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Únete a nosotros en nuestra cena benéfica anual, una velada elegante para apoyar los programas de cuidados paliativos de CUDECA. Disfruta de una cena de gala de tres platos preparada por chefs reconocidos, música en vivo, subasta solidaria y la oportunidad de conocer a otros colaboradores comprometidos con nuestra causa.\n\nTodos los fondos recaudados se destinarán a proporcionar atención especializada gratuita a pacientes y sus familias. Cada asiento vendido significa más cuidado, más apoyo y más dignidad para quienes más lo necesitan.',
    type: 'cena',
    capacity: 200,
    sold: 142,
    ticketTypes: [
      { id: 'cena1', name: 'Mesa Individual', price: 150, color: '#10B981', available: 58 },
      { id: 'cena2', name: 'Mesa VIP (8 personas)', price: 1500, color: '#F59E0B', available: 3 },
    ]
  },
  {
    id: '3',
    title: 'Gran Rifa Solidaria 2025',
    location: 'Online',
    date: '2025-12-20',
    time: '12:00',
    price: 5,
    image: 'https://images.unsplash.com/photo-1758958440893-5d71cef566c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWZmbGUlMjB0aWNrZXRzJTIwbnVtYmVyc3xlbnwxfHx8fDE3NjQwNzQ1ODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: '¡Participa en nuestra Gran Rifa Solidaria 2025 y gana increíbles premios mientras apoyas a CUDECA!\n\nPremios:\n🎁 Primer premio: Viaje para 2 personas a París (vuelos + hotel 4 noches)\n🎁 Segundo premio: iPhone 15 Pro Max\n🎁 Tercer premio: Cesta gourmet valorada en 500€\n🎁 Del 4º al 10º premio: Vales de 100€ en El Corte Inglés\n\nCada número cuesta solo 5€ y puedes comprar todos los que quieras. El sorteo se realizará el 20 de diciembre de 2025 mediante sistema aleatorio certificado. Los ganadores serán contactados por email y teléfono.\n\n¡Mucha suerte y gracias por tu solidaridad!',
    type: 'rifa',
    capacity: 10000,
    sold: 4563,
    raffleNumbers: Array.from({ length: 10000 }, (_, i) => ({
      number: i + 1,
      available: Math.random() > 0.45
    }))
  },
  {
    id: '4',
    title: 'Sorteo Fin de Año CUDECA',
    location: 'Online',
    date: '2025-12-31',
    time: '18:00',
    price: 3,
    image: 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjB5ZWFyJTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzY0MDc0NTg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: '🎉 ¡Despide el año con nuestro Sorteo Especial de Fin de Año! 🎉\n\nParticipa y ayuda a CUDECA mientras tienes la oportunidad de ganar increíbles premios:\n\nPremios:\n🎁 Primer premio: Escapada de fin de semana para 2 personas (hotel 5 estrellas + spa)\n🎁 Segundo premio: Smart TV 65 pulgadas\n🎁 Tercer premio: Cesta gourmet premium valorada en 300€\n🎁 Del 4º al 15º premio: Vales de 50€ para restaurantes\n\nCada participación cuesta solo 3€. El sorteo se celebrará el 31 de diciembre a las 18:00h mediante sistema aleatorio certificado. Los ganadores serán contactados por email y teléfono.\n\n¡Participa y que tengas mucha suerte en 2026!',
    type: 'sorteo',
    capacity: 5000,
    sold: 1234,
    ticketTypes: [
      { id: 'sorteo1', name: 'Participación', price: 3, color: '#10B981', available: 3766 },
    ]
  },
];

export const generateQRCode = (ticketId: string): string => {
  return `CUDECA-${ticketId}-${Date.now()}`;
};
