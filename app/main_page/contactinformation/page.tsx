"use client";

import React from 'react'

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function ContactInformation() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    updates: false,
    bestEvents: true,
    accept: true,
  });

  const [errors, setErrors] = useState({ name: '', email: '', phone: '' });
  const [touched, setTouched] = useState({ name: false, email: false, phone: false });

  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);

  // 🔍 Validate logic — runs realtime
  useEffect(() => {
    const newErrors = { name: '', email: '', phone: '' };

    // NAME
    const name = form.name.trim();
    if (!name) {
      newErrors.name = 'Please enter your full name.';
    } else if (name.length < 2) {
      newErrors.name = 'Name is too short (min 2 characters).';
    } else if (!/^[A-Za-zÀ-ỹ\s]+$/.test(name)) {
      newErrors.name = 'Name cannot contain numbers or special characters.';
    }

    // EMAIL
    const email = form.email.trim();
    if (!email) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email looks invalid (example: you@domain.com).';
    }

    // PHONE
    const phone = form.phone.trim();
    if (!phone) {
      newErrors.phone = 'Please enter your mobile number.';
    } else if (!/^[0-9+()-\s]+$/.test(phone)) {
      newErrors.phone = 'Phone must contain digits only.';
    } else {
      const digits = phone.replace(/\D/g, '');
      if (digits.length < 8) newErrors.phone = 'Phone number is too short (min 8 digits).';
      else if (digits.length > 15) newErrors.phone = 'Phone number is too long (max 15 digits).';
    }

    setErrors(newErrors);
  }, [form.name, form.email, form.phone]);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // mark all touched when submit
    setTouched({ name: true, email: true, phone: true });

    if (errors.name || errors.email || errors.phone || !form.accept) {
      if (errors.name && nameRef.current) nameRef.current.focus();
      else if (errors.email && emailRef.current) emailRef.current.focus();
      else if (errors.phone && phoneRef.current) phoneRef.current.focus();
      return;
    }

    alert('✅ Form submitted successfully!');
  };

  const hasErrors =
    (!!errors.name && touched.name) ||
    (!!errors.email && touched.email) ||
    (!!errors.phone && touched.phone);
  const isValid = !hasErrors && form.accept;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-6 overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="w-full max-w-md flex items-center mb-6">
        <button onClick={() => router.back()} className="p-2">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold text-gray-900">
          <span className="bg-yellow-300 rounded px-1">Contact</span> Information
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white space-y-5">
        {/* Full Name */}
        <Field
          label="Full Name"
          ref={nameRef}
          value={form.name}
          onChange={(v) => handleChange('name', v)}
          onBlur={() => handleBlur('name')}
          error={touched.name ? errors.name : ''}
          placeholder="Type your full name"
          hint="Use letters and spaces only."
        />

        {/* Email Address */}
        <Field
          label="Email Address"
          ref={emailRef}
          value={form.email}
          onChange={(v) => handleChange('email', v)}
          onBlur={() => handleBlur('email')}
          error={touched.email ? errors.email : ''}
          placeholder="Type your email"
          hint="We will send booking info to this email."
        />

        {/* Mobile Phone */}
        <Field
          label="Mobile Phone"
          ref={phoneRef}
          value={form.phone}
          onChange={(v) => handleChange('phone', v)}
          onBlur={() => handleBlur('phone')}
          error={touched.phone ? errors.phone : ''}
          placeholder="Type your mobile"
          hint="Include country code if needed (e.g. +84)"
        />

        {/* Checkboxes */}
        <div className="space-y-3 pt-2">
          <Checkbox
            checked={form.updates}
            onChange={(val) => handleChange('updates', val)}
            label="Keep me updated on more events and news from this event organizer."
          />

          <Checkbox
            checked={form.bestEvents}
            onChange={(val) => handleChange('bestEvents', val)}
            label="Send me emails about the best events happening nearby or online."
          />

          <Checkbox
            checked={form.accept}
            onChange={(val) => handleChange('accept', val)}
            label={
              <>
                I accept the{' '}
                <span className="font-semibold text-gray-900">Eventer Terms of Service</span>,{' '}
                <span className="font-semibold text-gray-900">Community Guidelines</span>, and{' '}
                <span className="font-semibold text-gray-900">Privacy Policy</span>.
              </>
            }
            required
          />
        </div>

        {/* Continue Button */}
        <button
          type="submit"
          disabled={!isValid}
          className={`w-full mt-6 rounded-full py-3 text-white font-semibold transition-all ${
            !isValid
              ? 'bg-red-300 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600 active:scale-[0.98]'
          }`}
        >
          Continue
        </button>
      </form>
    </div>
  );
}

/* Input Field component */
const Field = React.forwardRef<
  HTMLInputElement,
  {
    label: string;
    value: string;
    onChange: (v: string) => void;
    onBlur: () => void;
    error?: string;
    placeholder?: string;
    hint?: string;
  }
>(function Field({ label, value, onChange, onBlur, error, placeholder, hint }, ref) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-800 mb-1">{label}</label>
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`w-full rounded-full border px-5 py-3.5 bg-gray-50 text-gray-900 outline-none transition-all focus:ring-2 ${
          error ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-red-400/20'
        }`}
      />
      {error ? (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      ) : (
        <p className="text-sm text-gray-400 mt-1">{hint}</p>
      )}
    </div>
  );
});

/* Checkbox component — vuông góc, tick đỏ */
function Checkbox({
  checked,
  onChange,
  label,
  required = false,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  label: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer select-none relative">
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          required={required}
          className="peer appearance-none w-5 h-5 border border-gray-400 rounded-[4px] cursor-pointer transition-all duration-200 checked:bg-red-500 checked:border-red-500 focus:ring-2 focus:ring-red-400"
        />
        <svg
          className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200 pointer-events-none"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-7.071 7.071a1 1 0 01-1.414 0L3.293 8.828a1 1 0 111.414-1.414l4.243 4.243 6.364-6.364a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <span>{label}</span>
    </label>
  );
}
