export interface Notification {
  id: number;
  avatar?: string;
  icon?: string;
  text: string;
  time: string;
  date: "today" | "yesterday";
}

export const notifications: Notification[] = [
  {
    id: 1,
    avatar: "/images/avatar1.jpg",
    text: "Jhone Elean and 8 others friend joined to Art & Craft Professional event",
    time: "2 hours Ago",
    date: "today"
  },
  {
    id: 2,
    avatar: "/images/avatar2.jpg",
    text: "Eddy Max and 2 others commented on Stock Investing for Beginners 10-11",
    time: "2 hours Ago",
    date: "today"
  },
  {
    id: 3,
    icon: "🎉",
    text: "Jazz Club NY just added Jazz is: Now - Joel Ross in Concert",
    time: "2 hours Ago",
    date: "today"
  },
  {
    id: 4,
    icon: "🛍️",
    text: "Successfully purchased Daft punk discovery: 20 Years Anniversary Party tickets",
    time: "2 hours Ago",
    date: "yesterday"
  },
  {
    id: 5,
    avatar: "/images/avatar3.jpg",
    text: "Lucy Leslie and 8 others commented on Hard Rock Rooftop Cool Party Sunshine",
    time: "2 hours Ago",
    date: "yesterday"
  },
  {
    id: 6,
    icon: "📅",
    text: "Be Ready, Your saved event will be uploaded after 2 minutes !",
    time: "2 hours Ago",
    date: "yesterday"
  }
];