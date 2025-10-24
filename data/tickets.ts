// data/tickets.ts

export interface TicketItem {
  id: number;             // id duy nhất của vé
  eventId: number;        // liên kết với event.id
  barcode: string;        // mã barcode riêng
  area: string;           // khu vực ngồi
  seat?: string;          // (optional) chỗ ngồi cụ thể
  type: string;           // loại vé: VIP / Standard / Balcony...
  price: string;          // giá vé
}

// 🟩 Dữ liệu vé — mỗi event có thể có nhiều vé khác nhau
export const ticketsData: TicketItem[] = [
  // 🎉 Event 0 — Neon Nights
  {
    id: 0,
    eventId: 0,
    barcode: "BB001-A",
    area: "Ballroom 001 - Zone A",
    type: "VIP Ticket",
    price: "$120",
  },
  {
    id: 1,
    eventId: 0,
    barcode: "BB001-B",
    area: "Ballroom 001 - Zone B",
    type: "Standard Ticket",
    price: "$90",
  },
  {
    id: 2,
    eventId: 0,
    barcode: "BB001-C",
    area: "Ballroom 001 - Zone C",
    type: "Balcony Ticket",
    price: "$70",
  },

  // 🎨 Event 1 — Watercolor Workshop
  {
    id: 3,
    eventId: 1,
    barcode: "BB002-A",
    area: "Studio Hall 2",
    type: "Workshop Pass",
    price: "$185",
  },

  // 🎸 Event 2 — Rock Legends Concert
  {
    id: 4,
    eventId: 2,
    barcode: "BB003-A",
    area: "Stadium Zone A",
    type: "Front Row Ticket",
    price: "$220",
  },
  {
    id: 5,
    eventId: 2,
    barcode: "BB003-B",
    area: "Stadium Zone B",
    type: "Standard Seat",
    price: "$150",
  },

  // 🍜 Event 3 — Taste of Asia
  {
    id: 6,
    eventId: 3,
    barcode: "BB004-A",
    area: "Main Street Hall A",
    type: "General Entry",
    price: "$190",
  },

  // 📸 Event 4 — Digital Photography
  {
    id: 7,
    eventId: 4,
    barcode: "BB005-A",
    area: "Room 202 Front Row",
    type: "VIP Workshop",
    price: "$150",
  },
  {
    id: 8,
    eventId: 4,
    barcode: "BB005-B",
    area: "Room 202 Back Row",
    type: "Standard Seat",
    price: "$120",
  },

  // ⚽ Event 5 — Charity Marathon
  {
    id: 9,
    eventId: 5,
    barcode: "BB006-A",
    area: "Start Zone 1",
    type: "Runner Pass",
    price: "$50",
  },
];
