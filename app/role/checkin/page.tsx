/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, FormEvent } from "react";
import { apiFetch } from "@/lib/api";
import { QrReader } from "react-qr-reader";

type MessageType = "success" | "error" | "info" | "";

interface TicketResult {
  eventTitle: string;
  ticketId: string;
  qr: string;
  area: string;
}

// ===== API Checkin with QR =====
async function checkinTicket(token: string, email: string, password: string) {
  return apiFetch("/checkins", {
    method: "POST",
    body: JSON.stringify({
      checkin_device: "staff-web",
      staff_email: email,
      staff_password: password,
      token: token,
    }),
  });
}

const StaffPage: React.FC = () => {
  const [step, setStep] = useState<"qr" | "login" | "approved">("qr");
  const [qr, setQr] = useState(""); // state qr giờ là token
  const [fullUrl, setFullUrl] = useState(""); // lưu full URL gốc
  const [ticketInfo, setTicketInfo] = useState<TicketResult | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<MessageType>("");
  const [showScanner, setShowScanner] = useState(false);

  const showMessage = (msg: string, type: MessageType) => {
    setMessage(msg);
    setMessageType(type);
  };

  // ===== Step 2: Login + gọi API checkin =====
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("=== FE gửi request checkin ===");
    console.log("Token gửi lên:", qr);
    console.log("Email staff:", email);
    console.log("Password staff:", password);

    try {
      const res = await checkinTicket(qr, email, password);

      // BE trả về ticket → FE lưu lại
      if (res.data?.ticket) {
        setTicketInfo({
          eventTitle: res.data.ticket.event_title,
          ticketId: res.data.ticket.id,
          qr: res.data.ticket.token,
          area: res.data.ticket.area,
        });
      }

      setStep("approved");
      showMessage("Duyệt vé thành công!", "success");
    } catch (err: any) {
      showMessage("Không thể duyệt vé: " + err.message, "error");
    }
  };

  const getMessageClasses = () => {
    if (!message) return "hidden";
    const base = "mt-4 p-2 rounded text-center";
    if (messageType === "success") return `${base} bg-[#F41F52] text-white`;
    if (messageType === "error") return `${base} bg-red-400 text-white`;
    if (messageType === "info") return `${base} bg-blue-400 text-white`;
    return base;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border-t-4 border-[#F41F52]">
        <h1 className="text-2xl font-bold mb-6 text-center text-[#F41F52]">
          Staff Ticket Check
        </h1>

        {/* ===== STEP 1: Quét QR ===== */}
        {step === "qr" && (
          <>
            <button
              type="button"
              onClick={() => setShowScanner(!showScanner)}
              className="w-full bg-[#F41F52] text-white py-2 rounded-lg font-bold mb-4 hover:bg-[#D4133D] transition-colors"
            >
              {showScanner ? "Tắt camera" : "Quét mã QR bằng camera"}
            </button>

            {showScanner && (
              <div className="mb-4">
                <QrReader
                  constraints={{ facingMode: "environment" }}
                  onResult={(result) => {
                    if (!!result) {
                      const scanned = result.getText();

                      // Lấy token từ URL nếu là URL
                      let token = scanned;
                      try {
                        const url = new URL(scanned);
                        token = url.searchParams.get("token") || scanned;
                        setFullUrl(scanned); // lưu full URL gốc
                      } catch {
                        token = scanned;
                        setFullUrl(scanned);
                      }

                      setQr(token); // lưu token thật
                      setShowScanner(false);
                      setStep("login");
                      showMessage(
                        "Quét QR thành công! Vui lòng đăng nhập.",
                        "info"
                      );
                    }
                  }}
                  className="w-full h-full"
                />
              </div>
            )}
          </>
        )}

        {/* ===== STEP 2: Đăng nhập ===== */}
        {step === "login" && (
          <form onSubmit={handleLogin}>
            <p className="mb-2 text-gray-500 text-sm break-all">
              URL: <span className="text-blue-500">{fullUrl}</span>
            </p>
            <p className="mb-4 text-gray-700 break-all">
              Token: <span className="font-bold text-[#F41F52]">{qr}</span>
            </p>

            <label className="block mb-2 font-medium text-gray-700">
              Email Staff:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-[#F41F52] rounded-lg mb-4"
              required
            />

            <label className="block mb-2 font-medium text-gray-700">
              Mật khẩu:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-[#F41F52] rounded-lg mb-4"
              required
            />

            <button className="w-full bg-[#F41F52] text-white py-2 rounded-lg font-bold hover:bg-[#D4133D] transition-colors">
              Đăng nhập và duyệt vé
            </button>
          </form>
        )}

        {/* ===== STEP 3: Approved ===== */}
        {step === "approved" && ticketInfo && (
          <div className="text-center">
            <p className="text-lg mb-4 text-[#F41F52]">
              ✅ Vé đã được duyệt thành công!
            </p>

            <p>Token: {ticketInfo.qr}</p>
            <p>Sự kiện: {ticketInfo.eventTitle}</p>
            <p>Khu vực: {ticketInfo.area}</p>

            <button
              onClick={() => {
                setStep("qr");
                setQr("");
                setFullUrl("");
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
