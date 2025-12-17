export type EventType =
  | "rifa"
  | "sorteo"
  | "cena"
  | "concierto";

export interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  price: number;
  image: string;
  description: string;
  type: EventType;
  capacity?: number;
  sold?: number;
  availableTickets?: number;
  hasSeating?: boolean;
  ticketTypes?: TicketType[];
  rafflenumbers?: RaffleNumber[];
  venueMap?: VenueMap;
}

export interface VenueMap {
  imageUrl?: string;
  zones: VenueZone[];
}

export interface VenueZone {
  id: string;
  name: string;
  color: string;
  coordinates: string; // SVG path o coordenadas del polígono
}

export interface TicketType {
  id: number;
  name: string;
  price: number;
  color: string;
  available: number;
}

export interface RaffleNumber {
  number: number;
  available: boolean;
}

export interface CartItem {
  eventId: string;
  ticketTypeId?: number;
  quantity: number;
  price: number;
  ticketTypeName?: string;
  raffleNumbers?: number[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dni: string;
  address?: string;
  isMember: boolean;
  acceptsMarketing: boolean;
}

export interface Purchase {
  id: string;
  userId: string;
  eventId: string;
  tickets: Ticket[];
  total: number;
  date: string;
  donation?: number;
}

export interface Ticket {
  id: string;
  purchaseId: string;
  eventId: string;
  ticketType: string;
  qrCode: string;
  used: boolean;
  raffleNumber?: number;
}