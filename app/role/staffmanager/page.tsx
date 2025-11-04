"use client";

import React, { useState } from "react";
import { listEventsData } from "@/data/events"; // ⬅️ nhớ đúng đường dẫn nha

interface UsedTicket {
  barcode: string;
  used: boolean;
}

/**
 * Staff Ticket Check Page
 */
const StaffManagerPage: React.FC = () => {
  const [barcode, setBarcode] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info" | "">("");
  const [usedTickets, setUsedTickets] = useState<UsedTicket[]>([]);

  const showMessage = (msg: string, type: "success" | "error" | "info" | "") => {
    setMessage(msg);
    setMessageType(type);
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();

    if (!barcode.trim()) {
      showMessage("Please enter a barcode.", "error");
      return;
    }

    showMessage("Checking ticket...", "info");

    // Tìm vé trong danh sách events
    let foundTicket = null;
    let foundEventTitle = "";
    let foundArea = "";

    for (const event of listEventsData) {
      for (const area of event.areas || []) {
        const ticket = area.tickets.find((t) => t.barcode === barcode);
        if (ticket) {
          foundTicket = ticket;
          foundEventTitle = event.title;
          foundArea = area.name;
          break;
        }
      }
      if (foundTicket) break;
    }

    if (!foundTicket) {
      showMessage(`❌ Ticket "${barcode}" not found!`, "error");
      return;
    }

    // Check đã sử dụng chưa
    const isUsed = usedTickets.some((t) => t.barcode === barcode && t.used);

    if (isUsed) {
      showMessage(`⚠️ Ticket "${barcode}" has already been used!`, "error");
    } else {
      // Đánh dấu vé là đã dùng
      setUsedTickets((prev) => [...prev, { barcode, used: true }]);
      showMessage(
        `✅ Ticket valid!\nEvent: ${foundEventTitle}\nArea: ${foundArea}`,
        "success"
      );
    }

    setBarcode("");
  };

  const getMessageClasses = (): string => {
    if (!message) return "hidden";
    let classes =
      "mt-6 p-3 text-sm rounded-lg text-center whitespace-pre-line transition-all duration-300";
    if (messageType === "success") {
      classes += " bg-green-100 text-green-800";
    } else if (messageType === "error") {
      classes += " bg-red-100 text-red-800";
    } else if (messageType === "info") {
      classes += " bg-blue-100 text-blue-800";
    }
    return classes;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-[#F41F52] mb-6">
          Ticket Check
        </h1>

        <form onSubmit={handleCheck}>
          <label
            htmlFor="barcode"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter Barcode
          </label>
          <input
            type="text"
            id="barcode"
            name="barcode"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Enter ticket barcode..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#F41F52] focus:border-[#F41F52]"
          />

          <button
            type="submit"
            className="w-full bg-[#F41F52] text-white py-3 mt-4 rounded-xl font-bold text-lg shadow-md hover:bg-[#D4133D] transform hover:scale-[1.02] transition-all"
          >
            Check Ticket
          </button>
        </form>

        {message && (
          <div className={getMessageClasses()} role="alert">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffManagerPage;
