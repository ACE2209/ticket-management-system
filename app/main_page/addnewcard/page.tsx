"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddCardPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [showCvv, setShowCvv] = useState(false);
  const [touched, setTouched] = useState(false);

  // --- format helpers ---
  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const handleChange = (field: string, value: string) => {
    if (field === "number") {
      value = formatCardNumber(value);
    }

    if (field === "expiry") {
      const digits = value.replace(/\D/g, "").slice(0, 4);
      if (digits.length >= 3) {
        const month = parseInt(digits.slice(0, 2), 10);
        if (month < 1 || month > 12) {
          setErrors((p) => ({ ...p, expiry: "Invalid month (01–12)" }));
        } else {
          setErrors((p) => ({ ...p, expiry: "" }));
        }
        value = digits.slice(0, 2) + "/" + digits.slice(2);
      } else {
        value = digits;
        setErrors((p) => ({ ...p, expiry: "" }));
      }
    }

    if (field === "cvv") value = value.replace(/\D/g, "").slice(0, 3);

    if (field === "name") {
      // xoá số, và chuyển thành chữ in hoa
      value = value.replace(/\d/g, "").toUpperCase();
    }

    setForm((p) => ({ ...p, [field]: value }));
  };

  // --- validation ---
  const validate = () => {
    const errs: typeof errors = { number: "", name: "", expiry: "", cvv: "" };
    const onlyDigits = (s: string) => s.replace(/\D/g, "");

    const digits = onlyDigits(form.number);
    if (digits.length !== 16) {
      errs.number = "Card number must be 16 digits";
    } else {
      const isValidLuhn = (num: string) => {
        let sum = 0;
        let double = false;
        for (let i = num.length - 1; i >= 0; i--) {
          let n = parseInt(num[i], 10);
          if (double) {
            n *= 2;
            if (n > 9) n -= 9;
          }
          sum += n;
          double = !double;
        }
        return sum % 10 === 0;
      };
      if (!isValidLuhn(digits)) errs.number = "Invalid card number";
    }

    if (!form.name.trim()) errs.name = "Card holder name required";
    else if (/\d/.test(form.name)) errs.name = "Name must not contain numbers";

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry)) {
      errs.expiry = "Format MM/YY";
    } else {
      const [mm, yy] = form.expiry.split("/").map((n) => parseInt(n, 10));
      const now = new Date();
      const currentYear = now.getFullYear() % 100;
      const currentMonth = now.getMonth() + 1;
      if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
        errs.expiry = "Card expired";
      }
    }

    if (!/^\d{3}$/.test(form.cvv)) errs.cvv = "CVV must be 3 digits";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!validate()) return;
    alert("✅ Card added successfully!");
    setForm({ number: "", name: "", expiry: "", cvv: "" });
    setErrors({ number: "", name: "", expiry: "", cvv: "" });
    setTouched(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-6 pt-6">
      <div className="flex items-center w-full mb-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-base font-semibold ml-3 px-2 py-1 rounded">
          Add New Card
        </h1>
      </div>

      <div className="w-full flex justify-center mb-3">
        <Image
          src="/images/card.png"
          alt="Card"
          width={360}
          height={210}
          className="object-contain"
          priority
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-3"
      >
        {/* Card Number */}
        <div>
          <label className="text-gray-600 text-sm">Card Number</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            value={form.number}
            onChange={(e) => handleChange("number", e.target.value)}
            className={`mt-1 w-full px-4 py-3 rounded-2xl bg-gray-100 text-sm outline-none transition ${
              touched && errors.number
                ? "ring-2 ring-red-300"
                : "focus:ring-2 focus:ring-pink-400"
            }`}
          />
          {touched && errors.number && (
            <p className="text-red-500 text-xs mt-1">{errors.number}</p>
          )}
        </div>

        {/* Holder Name */}
        <div>
          <label className="text-gray-600 text-sm">Card Holder Name</label>
          <input
            type="text"
            placeholder="FULL NAME"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={`mt-1 w-full px-4 py-3 rounded-2xl bg-gray-100 text-sm outline-none transition ${
              touched && errors.name
                ? "ring-2 ring-red-300"
                : "focus:ring-2 focus:ring-pink-400"
            }`}
          />
          {touched && errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Expiry + CVV */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-gray-600 text-sm">Expired</label>
            <input
              type="text"
              placeholder="MM/YY"
              maxLength={5}
              value={form.expiry}
              onChange={(e) => handleChange("expiry", e.target.value)}
              className={`mt-1 w-full px-4 py-3 rounded-2xl bg-gray-100 text-sm outline-none transition ${
                touched && errors.expiry
                  ? "ring-2 ring-red-300"
                  : "focus:ring-2 focus:ring-pink-400"
              }`}
            />
            {touched && errors.expiry && (
              <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>
            )}
          </div>

          <div className="flex-1 relative">
            <label className="text-gray-600 text-sm">CVV</label>
            <div className="relative mt-1">
              <input
                type={showCvv ? "text" : "password"}
                inputMode="numeric"
                maxLength={3}
                placeholder="123"
                value={form.cvv}
                onChange={(e) => handleChange("cvv", e.target.value)}
                className={`w-full px-4 py-3 rounded-2xl bg-gray-100 text-sm outline-none transition ${
                  touched && errors.cvv
                    ? "ring-2 ring-red-300"
                    : "focus:ring-2 focus:ring-pink-400"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowCvv(!showCvv)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-600"
              >
                {showCvv ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {touched && errors.cvv && (
              <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={!form.number || !form.name || !form.expiry || !form.cvv}
          className={`mt-2 w-full py-3 rounded-2xl font-semibold text-white transition ${
            !form.number || !form.name || !form.expiry || !form.cvv
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#FF2C55] hover:bg-[#ff1e4a]"
          }`}
        >
          Add Card
        </button>
      </form>
    </div>
  );
}
