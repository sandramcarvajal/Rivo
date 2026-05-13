export interface User {
  id: string;
  name: string;
  email: string;
  role: 'driver' | 'passenger' | null;
  avatar: string;
  hasCompletedProfile: boolean;
  cedula?: string;
  celula?: string;
}

export interface Route {
  id: string;
  driverId: string;
  driverName: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  seats: number;
  availableSeats: number;
  price: number;
  status: 'active' | 'completed' | 'cancelled';
}

export interface JoinRequest {
  id: string;
  routeId: string;
  passengerId: string;
  passengerName: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: string;
}

export const MOCK_ROUTES: Route[] = [
  {
    id: 'r1',
    driverId: 'u1',
    driverName: 'Carlos Ruiz',
    origin: 'SYC',
    destination: 'Delacuesta CC',
    date: '2026-05-01',
    time: '07:30',
    seats: 4,
    availableSeats: 2,
    price: 5000,
    status: 'active',
  },
  {
    id: 'r2',
    driverId: 'u3',
    driverName: 'Laura Gomez',
    origin: 'Centro Comercial Andino',
    destination: 'Sede Norte',
    date: '2026-05-01',
    time: '17:15',
    seats: 3,
    availableSeats: 3,
    price: 6000,
    status: 'active',
  },
  {
    id: 'r3',
    driverId: 'u4',
    driverName: 'Andres Felipe',
    origin: 'Sede Principal',
    destination: 'Chía',
    date: '2026-05-02',
    time: '18:00',
    seats: 4,
    availableSeats: 1,
    price: 8000,
    status: 'active',
  },
];

export const MOCK_REQUESTS: JoinRequest[] = [
  {
    id: 'req1',
    routeId: 'r1',
    passengerId: 'u2',
    passengerName: 'Maria Jimémez',
    status: 'pending',
    timestamp: '2026-04-30T10:00:00Z',
  }
];
