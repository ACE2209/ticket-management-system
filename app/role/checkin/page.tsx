"use client";

import React, { useState, FormEvent } from "react";
import { listEventsData } from "@/data/events"; // chỉnh theo path project

type MessageType = "success" | "error" | "info" | "";

interface TicketResult {
  eventTitle: string;
  ticketId: string;
  barcode: string;
  area: string;
}

const staffAccount = { email: "staff@test.com", password: "123456" };

const StaffPage: React.FC = () => {

  const [step, setStep] = useState<"barcode" | "login" | "approved">("barcode");
  const [barcode, setBarcode] = useState<string>("");
  const [ticketInfo, setTicketInfo] = useState<TicketResult | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<MessageType>("");

  const showMessage = (msg: string, type: MessageType) => {
    setMessage(msg);
    setMessageType(type);
  };

  // ===== Step 1: Kiểm tra barcode =====
  const handleBarcodeSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let found: TicketResult | null = null;
    for (const event of listEventsData) {
      for (const area of event.areas || []) {
        const ticket = area.tickets.find((t) => t.barcode === barcode);
        if (ticket) {
          found = {
            eventTitle: event.title,
            ticketId: ticket.id,
            barcode: ticket.barcode,
            area: area.name,
          };
          break;
        }
      }
      if (found) break;
    }

    if (found) {
      setTicketInfo(found);
      showMessage("Barcode hợp lệ! Hãy đăng nhập để duyệt vé.", "info");
      setStep("login");
    } else {
      showMessage("Barcode không hợp lệ!", "error");
    }
  };

  // ===== Step 2: Login Staff =====
  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email === staffAccount.email && password === staffAccount.password) {
      showMessage("Đăng nhập thành công! Bạn có thể duyệt vé.", "success");
      setStep("approved");
    } else {
      showMessage("Email hoặc mật khẩu không đúng!", "error");
    }
  };

  // ===== helper class message =====
  const getMessageClasses = (): string => {
    if (!message) return "hidden";
    const base = "mt-4 p-2 rounded text-center";
    if (messageType === "success") return base + " bg-[#F41F52] text-white";
    if (messageType === "error") return base + " bg-[#F41F52]/30 text-white";
    if (messageType === "info") return base + " bg-[#F41F52]/50 text-white";
    return base;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border-t-4 border-[#F41F52]">
        <h1 className="text-2xl font-bold mb-6 text-center text-[#F41F52]">Staff Ticket Check</h1>

        {step === "barcode" && (
          <form onSubmit={handleBarcodeSubmit}>
            <label className="block mb-2 font-medium text-gray-700">Nhập Barcode:</label>
            <input
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              className="w-full px-4 py-2 border border-[#F41F52] rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#F41F52]"
              placeholder="VD: VIP001"
              required
            />
            <button className="w-full bg-[#F41F52] text-white py-2 rounded-lg font-bold hover:bg-[#D4133D] transition-colors">
              Kiểm tra Barcode
            </button>
          </form>
        )}

        {step === "login" && ticketInfo && (
          <form onSubmit={handleLogin}>
            <p className="mb-4 text-center text-gray-700">
              Barcode: <span className="font-bold text-[#F41F52]">{ticketInfo.barcode}</span> <br />
              Sự kiện: <span className="font-bold text-[#F41F52]">{ticketInfo.eventTitle}</span>
            </p>
            <label className="block mb-2 font-medium text-gray-700">Email Staff:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-[#F41F52] rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#F41F52]"
              placeholder="staff@test.com"
              required
            />
            <label className="block mb-2 font-medium text-gray-700">Mật khẩu:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-[#F41F52] rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#F41F52]"
              placeholder="123456"
              required
            />
            <button className="w-full bg-[#F41F52] text-white py-2 rounded-lg font-bold hover:bg-[#D4133D] transition-colors">
              Đăng nhập và duyệt vé
            </button>
          </form>
        )}

        {step === "approved" && ticketInfo && (
          <div className="text-center">
            <p className="text-lg mb-4 text-[#F41F52]">✅ Vé đã được duyệt thành công!</p>
            <p>Barcode: {ticketInfo.barcode}</p>
            <p>Sự kiện: {ticketInfo.eventTitle}</p>
            <p>Khu vực: {ticketInfo.area}</p>
            <button
              onClick={() => {
                setStep("barcode");
                setBarcode("");
                setEmail("");
                setPassword("");
                setTicketInfo(null);
                setMessage("");
              }}
              className="mt-4 bg-[#F41F52] text-white py-2 px-4 rounded-lg hover:bg-[#D4133D] transition-colors"
            >
              Quét vé tiếp theo
            </button>
          </div>
        )}

        {message && <div className={getMessageClasses()}>{message}</div>}
      </div>
    </div>
  );
};

export default StaffPage;
