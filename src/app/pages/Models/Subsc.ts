export interface Subscription {
    id?: number; // facultatif pour POST
    planName: string;
    description: string;
    price: number;
    status: string; // e.g. "ACTIVE", "EXPIRED"
    expiryDate: string; // ISO format: "2025-12-31"
  }
  