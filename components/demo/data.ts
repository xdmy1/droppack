export type StatusKey =
  | "pending"
  | "loaded"
  | "inTransit"
  | "outForDelivery"
  | "delivered";

export type Currency = "EUR" | "MDL" | "GBP";

export type DemoPackage = {
  code: string;
  sender: string;
  senderPhone: string;
  recipient: string;
  recipientPhone: string;
  pickupAddr: string;
  deliveryAddr: string;
  route: string;
  driverId: string | null;
  weightKg: number;
  cod: number;
  currency: Currency;
  status: StatusKey;
  createdAt: string;
  notes?: string;
  proofPhoto?: boolean;
  signature?: boolean;
};

export type DemoDriver = {
  id: string;
  name: string;
  initials: string;
  vehicle: string;
  route: string;
  phone: string;
};

export const DRIVERS: DemoDriver[] = [
  {
    id: "vasile",
    name: "Vasile Roșu",
    initials: "VR",
    vehicle: "Mercedes Sprinter · MD-2841",
    route: "Chișinău → Berlin",
    phone: "+373 68 111 222",
  },
  {
    id: "ion",
    name: "Ion Lungu",
    initials: "IL",
    vehicle: "VW Crafter · MD-1129",
    route: "Bălți → Roma",
    phone: "+373 68 333 444",
  },
  {
    id: "andrei",
    name: "Andrei Cebotari",
    initials: "AC",
    vehicle: "Iveco Daily · MD-7702",
    route: "Chișinău → Bruxelles",
    phone: "+373 79 555 666",
  },
];

export const PACKAGES: DemoPackage[] = [
  {
    code: "DP-2841",
    sender: "Maria Cebotari",
    senderPhone: "+373 79 112 233",
    recipient: "Andrei Roșca",
    recipientPhone: "+49 30 12345678",
    pickupAddr: "Str. Albișoara 14, Chișinău",
    deliveryAddr: "Hauptstr. 12, Berlin",
    route: "Chișinău → Berlin",
    driverId: "vasile",
    weightKg: 4.2,
    cod: 80,
    currency: "EUR",
    status: "delivered",
    createdAt: "2026-05-04",
    proofPhoto: true,
    signature: true,
    notes: "Predat la ușă, etajul 3.",
  },
  {
    code: "DP-2842",
    sender: "Ion Lungu",
    senderPhone: "+373 79 887 654",
    recipient: "Elena Popa",
    recipientPhone: "+39 06 5555 1212",
    pickupAddr: "Str. Bucureşti 23, Bălți",
    deliveryAddr: "Via Salaria 88, Roma",
    route: "Bălți → Roma",
    driverId: "ion",
    weightKg: 12.6,
    cod: 150,
    currency: "EUR",
    status: "outForDelivery",
    createdAt: "2026-05-05",
    notes: "Sună cu 30 min înainte.",
  },
  {
    code: "DP-2843",
    sender: "Familia Curcă",
    senderPhone: "+373 60 998 877",
    recipient: "Sergiu Bunescu",
    recipientPhone: "+31 6 1234 5678",
    pickupAddr: "Str. Pușkin 4, Chișinău",
    deliveryAddr: "Goethestr. 5, Amsterdam",
    route: "Chișinău → Amsterdam",
    driverId: "vasile",
    weightKg: 7.8,
    cod: 0,
    currency: "EUR",
    status: "inTransit",
    createdAt: "2026-05-06",
  },
  {
    code: "DP-2844",
    sender: "Galina Tofan",
    senderPhone: "+40 31 222 4455",
    recipient: "Mihai Vrabie",
    recipientPhone: "+420 222 333 444",
    pickupAddr: "Str. Dorobanți 45, București",
    deliveryAddr: "Václavské nám. 3, Praga",
    route: "București → Praga",
    driverId: "andrei",
    weightKg: 3.1,
    cod: 60,
    currency: "EUR",
    status: "loaded",
    createdAt: "2026-05-06",
  },
  {
    code: "DP-2845",
    sender: "Nicu Buburuz",
    senderPhone: "+373 78 121 314",
    recipient: "Cristina Munteanu",
    recipientPhone: "+32 2 333 4455",
    pickupAddr: "Str. Eminescu 8, Chișinău",
    deliveryAddr: "Av. Louise 200, Bruxelles",
    route: "Chișinău → Bruxelles",
    driverId: null,
    weightKg: 2.4,
    cod: 0,
    currency: "EUR",
    status: "pending",
    createdAt: "2026-05-06",
  },
  {
    code: "DP-2846",
    sender: "Veronica Lazăr",
    senderPhone: "+373 69 555 121",
    recipient: "Daniel Stoica",
    recipientPhone: "+44 7700 900123",
    pickupAddr: "Str. Vlaicu Pârcălab 10, Chișinău",
    deliveryAddr: "Baker St. 221B, Londra",
    route: "Chișinău → Londra",
    driverId: null,
    weightKg: 1.8,
    cod: 90,
    currency: "GBP",
    status: "pending",
    createdAt: "2026-05-06",
  },
  {
    code: "DP-2847",
    sender: "Petru Crețu",
    senderPhone: "+373 79 444 311",
    recipient: "Olga Vrabie",
    recipientPhone: "+373 79 222 119",
    pickupAddr: "Str. Negruzzi 5, Chișinău",
    deliveryAddr: "Str. Kogălniceanu 12, Chișinău",
    route: "Intern · Chișinău",
    driverId: "andrei",
    weightKg: 0.8,
    cod: 350,
    currency: "MDL",
    status: "delivered",
    createdAt: "2026-05-05",
    proofPhoto: true,
    signature: true,
  },
  {
    code: "DP-2848",
    sender: "Tudor Iliescu",
    senderPhone: "+373 60 717 818",
    recipient: "Anna Schmidt",
    recipientPhone: "+49 89 6543 2100",
    pickupAddr: "Str. 31 August 12, Chișinău",
    deliveryAddr: "Marienplatz 1, München",
    route: "Chișinău → München",
    driverId: "vasile",
    weightKg: 5.5,
    cod: 200,
    currency: "EUR",
    status: "loaded",
    createdAt: "2026-05-06",
  },
];

