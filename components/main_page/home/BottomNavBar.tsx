"use client";

import { usePathname, useRouter } from "next/navigation";

import { Home, Ticket, Heart, MessageSquare, User } from "lucide-react";
import React from "react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

function NavItem({ icon, label, active = false, onClick }: NavItemProps) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "64px",
        height: "64px",
        fontFamily: "Plus Jakarta Sans, sans-serif",
        fontSize: "10px",
        fontWeight: 500,
        lineHeight: "22px",
        letterSpacing: "0.005em",
        color: active ? "#F41F52" : "#BFC6CC",
        gap: "2px",
      }}
    >
      <div style={{ width: "20px", height: "20px" }}>{icon}</div>
      <span>{label}</span>
    </div>
  );
}

export default function BottomNavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: "Home", icon: <Home size={20} />, href: "/main_page/home" },
    {
      label: "My Order",
      icon: <Ticket size={20} />,
      href: "/main_page/myorder",
    },
    {
      label: "Search",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      ),
      href: "/main_page/search",
    },

    {
      label: "Message",
      icon: <MessageSquare size={20} />,
      href: "/main_page/message",
    },
    { label: "Profile", icon: <User size={20} />, href: "/setting/profile" },
  ];

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "64px",
        background: "#FFFFFF",
        borderTop: "1px solid #E5E5E5",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        zIndex: 10,
      }}
    >
      {navItems.map((item) => (
        <NavItem
          key={item.label}
          icon={item.icon}
          label={item.label}
          active={pathname === item.href}
          onClick={() => router.push(item.href)}
          href={""}
        />
      ))}
    </div>
  );
}
