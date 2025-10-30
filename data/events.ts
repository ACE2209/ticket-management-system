export interface EventItem {
  id: number;
  category: string;
  title: string;
  location: string;
  date: string;
  time: string; 
  area: string; 
  price: string;
  image: string;
  barcode: string;
  areas?: Area[];
  bookedSeats?: string[];
}

export interface Ticket {
  id: string;
  barcode: string;
}

export interface Area {
  name: string;
  tickets: Ticket[];
}

export const listEventsData: EventItem[] = [
  {
    id: 0,
    category: "Themed Party",
    title: "Neon Nights: Glow Rave Extravaganza",
    location: "Sydney, Australia",
    date: "28 Oct, 2024",
    time: "07:30 PM",
    area: "Ballroom 001",
    price: "$90",
    image: "/images/event_other_1.jpg",
    barcode: "BB001",
    areas: [
      {
        name: "VIP Zone",
        tickets: [
          { id: "VIP-001", barcode: "VIP001" },
          { id: "VIP-002", barcode: "VIP002" },
        ],
      },
      {
        name: "Standard Zone",
        tickets: [
          { id: "STD-101", barcode: "STD101" },
          { id: "STD-102", barcode: "STD102" },
          { id: "STD-103", barcode: "STD103" },
        ],
      },
    ],
    bookedSeats: ["A1", "A2", "B3", "C5", "D8"],
  },
  {
    id: 1,
    category: "Art Exhibition",
    title: "Creative self care: Guide to Intuitive Watercolor",
    location: "Sydney, Australia",
    date: "23 Oct, 2024",
    time: "06:00 PM",
    area: "The Living Gallery",
    price: "$185",
    image: "/images/event_other_2.jpg",
    barcode: "BB002",
    areas: [
      {
        name: "VIP Zone",
        tickets: [
          { id: "VIP-101", barcode: "VIP101" },
          { id: "VIP-102", barcode: "VIP102" },
        ],
      },
      {
        name: "Standard Zone",
        tickets: [
          { id: "STD-201", barcode: "STD201" },
          { id: "STD-202", barcode: "STD202" },
        ],
      },
    ],
  },
  {
    id: 2,
    category: "Live Concert",
    title: "The Ultimate Rock Legends Tribute Night",
    location: "Melbourne, Australia",
    date: "05 Nov, 2024",
    time: "08:00 PM",
    area: "Stadium Zone A",
    price: "$195",
    image: "/images/event_other_3.jpg",
    barcode: "BB003",
    areas: [
      {
        name: "VIP Zone",
        tickets: [
          { id: "VIP-201", barcode: "VIP201" },
          { id: "VIP-202", barcode: "VIP202" },
        ],
      },
      {
        name: "Standard Zone",
        tickets: [
          { id: "STD-301", barcode: "STD301" },
          { id: "STD-302", barcode: "STD302" },
          { id: "STD-303", barcode: "STD303" },
        ],
      },
    ],
  },
  {
    id: 3,
    category: "Food Festival",
    title: "Taste of Asia: Street Food Edition",
    location: "Brisbane, Australia",
    date: "12 Nov, 2024",
    time: "04:00 PM",
    area: "Main Street Hall",
    price: "$190",
    image: "/images/event_other_4.jpg",
    barcode: "BB004",
    areas: [
      {
        name: "VIP Zone",
        tickets: [
          { id: "VIP-301", barcode: "VIP301" },
          { id: "VIP-302", barcode: "VIP302" },
        ],
      },
      {
        name: "Standard Zone",
        tickets: [
          { id: "STD-401", barcode: "STD401" },
          { id: "STD-402", barcode: "STD402" },
        ],
      },
    ],
  },
  {
    id: 4,
    category: "Workshop",
    title: "Mastering Digital Photography Basics",
    location: "Adelaide, Australia",
    date: "19 Nov, 2024",
    time: "10:00 AM",
    area: "Room 202",
    price: "$120",
    image: "/images/event_other_5.jpg",
    barcode: "BB005",
    areas: [
      {
        name: "VIP Zone",
        tickets: [
          { id: "VIP-401", barcode: "VIP401" },
          { id: "VIP-402", barcode: "VIP402" },
        ],
      },
      {
        name: "Standard Zone",
        tickets: [
          { id: "STD-501", barcode: "STD501" },
          { id: "STD-502", barcode: "STD502" },
        ],
      },
    ],
  },
  {
    id: 5,
    category: "Sporting Event",
    title: "Annual Charity Marathon Run",
    location: "Perth, Australia",
    date: "01 Dec, 2024",
    time: "06:00 AM",
    area: "City Park Arena",
    price: "$50",
    image: "/images/event_other_6.jpg",
    barcode: "BB006",
    areas: [
      {
        name: "VIP Zone",
        tickets: [
          { id: "VIP-501", barcode: "VIP501" },
          { id: "VIP-502", barcode: "VIP502" },
        ],
      },
      {
        name: "Standard Zone",
        tickets: [
          { id: "STD-601", barcode: "STD601" },
          { id: "STD-602", barcode: "STD602" },
        ],
      },
    ],
  },
  {
    id: 6,
    category: "Comedy Show",
    title: "Laugh Factory: Best Stand-Up Acts",
    location: "Sydney, Australia",
    date: "15 Dec, 2024",
    time: "08:30 PM",
    area: "Hall 5B",
    price: "$75",
    image: "/images/event_other_7.jpg",
    barcode: "BB007",
    areas: [
      {
        name: "VIP Zone",
        tickets: [
          { id: "VIP-601", barcode: "VIP601" },
          { id: "VIP-602", barcode: "VIP602" },
        ],
      },
      {
        name: "Standard Zone",
        tickets: [
          { id: "STD-701", barcode: "STD701" },
          { id: "STD-702", barcode: "STD702" },
        ],
      },
    ],
  },
  {
    id: 7,
    category: "Film Screening",
    title: "Indie Films Showcase: New Directors",
    location: "Canberra, Australia",
    date: "05 Jan, 2027",
    time: "05:30 PM",
    area: "Cinema Room 4",
    price: "$45",
    image: "/images/event_other_8.jpg",
    barcode: "BB008",
    areas: [
      {
        name: "VIP Zone",
        tickets: [
          { id: "VIP-701", barcode: "VIP701" },
          { id: "VIP-702", barcode: "VIP702" },
        ],
      },
      {
        name: "Standard Zone",
        tickets: [
          { id: "STD-801", barcode: "STD801" },
          { id: "STD-802", barcode: "STD802" },
        ],
      },
    ],
  },
  {
    id: 8,
    category: "Networking",
    title: "Tech Innovators Meetup and Mixer",
    location: "Melbourne, Australia",
    date: "20 Jan, 2025",
    time: "03:00 PM",
    area: "Tech Hub Hall",
    price: "$350",
    image: "/images/event_other_9.jpg",
    barcode: "BB009",
    areas: [
      {
        name: "VIP Zone",
        tickets: [
          { id: "VIP-801", barcode: "VIP801" },
          { id: "VIP-802", barcode: "VIP802" },
        ],
      },
      {
        name: "Standard Zone",
        tickets: [
          { id: "STD-901", barcode: "STD901" },
          { id: "STD-902", barcode: "STD902" },
        ],
      },
    ],
  },
  {
    id: 9,
    category: "Market",
    title: "Local Artisans Craft Market",
    location: "Sydney, Australia",
    date: "03 Feb, 2026",
    time: "09:00 AM",
    area: "Outdoor Market Zone",
    price: "$1288",
    image: "/images/event_other_10.jpg",
    barcode: "BB010",
    areas: [
      {
        name: "VIP Zone",
        tickets: [
          { id: "VIP-901", barcode: "VIP901" },
          { id: "VIP-902", barcode: "VIP902" },
        ],
      },
      {
        name: "Standard Zone",
        tickets: [
          { id: "STD-1001", barcode: "STD1001" },
          { id: "STD-1002", barcode: "STD1002" },
        ],
      },
    ],
  },
];

export interface CategoryItem {
  id: number;
  title: string;
  subtitle: string;
  image: string;
}

export const categoriesData: CategoryItem[] = [
  {
    id: 0,
    title: "Music Festival",
    subtitle: "Live Sound",
    image: "/images/club4.jpg",
  },
  {
    id: 1,
    title: "Themed Party",
    subtitle: "Costume Fun",
    image: "/images/club5.jpg",
  },
  {
    id: 2,
    title: "Night Club Event",
    subtitle: "Dance Vibes",
    image: "/images/club1.jpg",
  },
  {
    id: 3,
    title: "Beach Party",
    subtitle: "Sunset Vibes",
    image: "/images/club6.jpg",
  },
  {
    id: 4,
    title: "Night Pulse Club",
    subtitle: "Live Sound",
    image: "/images/club2.jpg",
  },
  {
    id: 5,
    title: "Neon Glow Party",
    subtitle: "Live Sound",
    image: "/images/club3.jpg",
  },
];

export interface PopularEventItem {
  date: string;
  location: string;
  title: string;
  image: string;
}

export const popularEventsData: PopularEventItem[] = [
  {
    date: "October 08, 2022",
    location: "Colomadu, Surakarta",
    title: "Music concert dramala band special edition october",
    image: "/images/event1.jpg",
  },
  {
    date: "November 15, 2022",
    location: "Jakarta, Indonesia",
    title: "Art Exhibition: Modern Nusantara",
    image: "/images/event2.jpg",
  },
  {
    date: "December 01, 2022",
    location: "Bandung, Indonesia",
    title: "Culinary Festival: Street Food Delights",
    image: "/images/event3.jpg",
  },
  {
    date: "January 20, 2023",
    location: "Bali, Indonesia",
    title: "Beach Yoga Retreat",
    image: "/images/event4.jpg",
  },
];
