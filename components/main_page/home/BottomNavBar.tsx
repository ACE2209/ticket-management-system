"use client";

import { Home, Ticket, Heart, MessageSquare, User } from "lucide-react";
import React from "react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function NavItem({ icon, label, active = false }: NavItemProps) {
  return (
    <div
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
      <NavItem icon={<Home size={20} />} label="Home" active />
      <NavItem icon={<Ticket size={20} />} label="My Order" />
      <NavItem icon={<Heart size={20} />} label="Favorite" />
      <NavItem icon={<MessageSquare size={20} />} label="Message" />
      <NavItem icon={<User size={20} />} label="Profile" />
    </div>
  );
}
