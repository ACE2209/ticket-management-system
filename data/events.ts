// app/main_page/event_list/data.ts

// 👇 Định nghĩa kiểu dữ liệu cho 1 event
export interface EventItem {
  category: string;
  title: string;
  location: string;
  date: string;
  price: string;
  image: string;
}

// 👇 Dữ liệu 10 sự kiện mẫu
export const listEventsData: EventItem[] = [
  {
    category: "Themed Party",
    title: "Neon Nights: Glow Rave Extravaganza",
    location: "Sydney, Australia",
    date: "28 Oct, 2024",
    price: "$90",
    image: "/main_page/home/event_other_1.jpg",
  },
  {
    category: "Art Exhibition",
    title: "Creative self care: Guide to Intuitive Watercolor",
    location: "Sydney, Australia",
    date: "23 Oct, 2024",
    price: "$185",
    image: "/main_page/home/event_other_2.jpg",
  },
  {
    category: "Live Concert",
    title: "The Ultimate Rock Legends Tribute Night",
    location: "Melbourne, Australia",
    date: "05 Nov, 2024",
    price: "$195",
    image: "/main_page/home/event_other_3.jpg",
  },
  {
    category: "Food Festival",
    title: "Taste of Asia: Street Food Edition",
    location: "Brisbane, Australia",
    date: "12 Nov, 2024",
    price: "$190",
    image: "/main_page/home/event_other_4.jpg",
  },
  {
    category: "Workshop",
    title: "Mastering Digital Photography Basics",
    location: "Adelaide, Australia",
    date: "19 Nov, 2024",
    price: "$120",
    image: "/main_page/home/event_other_5.jpg",
  },
  {
    category: "Sporting Event",
    title: "Annual Charity Marathon Run",
    location: "Perth, Australia",
    date: "01 Dec, 2024",
    price: "$50",
    image: "/main_page/home/event_other_6.jpg",
  },
  {
    category: "Comedy Show",
    title: "Laugh Factory: Best Stand-Up Acts",
    location: "Sydney, Australia",
    date: "15 Dec, 2024",
    price: "$75",
    image: "/main_page/home/event_other_7.jpg",
  },
  {
    category: "Film Screening",
    title: "Indie Films Showcase: New Directors",
    location: "Canberra, Australia",
    date: "05 Jan, 2025",
    price: "$45",
    image: "/main_page/home/event_other_8.jpg",
  },
  {
    category: "Networking",
    title: "Tech Innovators Meetup and Mixer",
    location: "Melbourne, Australia",
    date: "20 Jan, 2025",
    price: "$350",
    image: "/main_page/home/event_other_9.jpg",
  },
  {
    category: "Market",
    title: "Local Artisans Craft Market",
    location: "Sydney, Australia",
    date: "03 Feb, 2025",
    price: "$1288",
    image: "/main_page/home/event_other_10.jpg",
  },
];
