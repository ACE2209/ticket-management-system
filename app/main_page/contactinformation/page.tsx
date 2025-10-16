'use client';

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

  // Refs to focus on first invalid field on submit
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);

  // Detailed realtime validation
  useEffect(() => {
    const newErrors = { name: '', email: '', phone: '' };

    // NAME
    const name = form.name.trim();
    if (!name) {
      newErrors.name = 'Please enter your full name.';
    } else if (name.length < 2) {
      newErrors.name = 'Name is too short (min 2 characters).';
    } else if (!/^[A-Za-zÀ-ỹ\s]+$/.test(name)) {
      // contains characters other than letters and spaces
      // give specific hint about numbers/special chars
      newErrors.name = 'Name cannot contain numbers or special characters.';
    } else {
      newErrors.name = '';
    }

    // EMAIL
    const email = form.email.trim();
    if (!email) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email looks invalid (example: you@domain.com).';
    } else {
      newErrors.email = '';
    }

    // PHONE
    const phone = form.phone.trim();
    if (!phone) {
      newErrors.phone = 'Please enter your mobile number.';
    } else if (!/^[0-9+()-\s]+$/.test(phone)) {
      // allow some separators/plus, but warn if letters present
      newErrors.phone = 'Phone must contain digits only (you can use +, - or spaces).';
    } else {
      // normalize digits count by removing non-digits
      const digits = phone.replace(/\D/g, '');
      if (digits.length < 8) newErrors.phone = 'Phone number is too short (min 8 digits).';
      else if (digits.length > 15) newErrors.phone = 'Phone number is too long (max 15 digits).';
      else newErrors.phone = '';
    }

    setErrors(newErrors);
  }, [form.name, form.email, form.phone]);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If there are any errors, focus first invalid field
    if (errors.name || errors.email || errors.phone || !form.accept) {
      if (errors.name && nameRef.current) nameRef.current.focus();
      else if (errors.email && emailRef.current) emailRef.current.focus();
      else if (errors.phone && phoneRef.current) phoneRef.current.focus();
      else if (!form.accept) {
        // scroll to checkboxes (we don't have a ref here — keep it simple)
        window.scrollTo({ top: 300, behavior: 'smooth' });
      }
      return;
    }

    // all good
    alert('✅ Form submitted successfully!');
    // continue flow...
  };

  // overall validity: no error messages, and accept is checked
  const hasErrors = !!(errors.name || errors.email || errors.phone);
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
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Full Name</label>
          <input
            ref={nameRef}
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Type your full name"
            className={`w-full rounded-full border px-5 py-3.5 bg-gray-50 text-gray-900 outline-none transition-all focus:ring-2 ${
              errors.name ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-red-400/20'
            }`}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          {errors.name ? (
            <p id="name-error" className="text-sm text-red-500 mt-1">{errors.name}</p>
          ) : (
            <p className="text-sm text-gray-400 mt-1">Use letters and spaces only.</p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Email Address</label>
          <input
            ref={emailRef}
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="Type your email"
            className={`w-full rounded-full border px-5 py-3.5 bg-gray-50 text-gray-900 outline-none transition-all focus:ring-2 ${
              errors.email ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-red-400/20'
            }`}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email ? (
            <p id="email-error" className="text-sm text-red-500 mt-1">{errors.email}</p>
          ) : (
            <p className="text-sm text-gray-400 mt-1">We will send booking info to this email.</p>
          )}
        </div>

        {/* Mobile Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Mobile Phone</label>
          <input
            ref={phoneRef}
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="Type your mobile"
            className={`w-full rounded-full border px-5 py-3.5 bg-gray-50 text-gray-900 outline-none transition-all focus:ring-2 ${
              errors.phone ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-red-400/20'
            }`}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone ? (
            <p id="phone-error" className="text-sm text-red-500 mt-1">{errors.phone}</p>
          ) : (
            <p className="text-sm text-gray-400 mt-1">Include country code if needed (e.g. +84)</p>
          )}
        </div>

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
            !isValid ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 active:scale-[0.98]'
          }`}
          aria-disabled={!isValid}
        >
          Continue
        </button>
      </form>
    </div>
  );
}

/* ✅ Checkbox component — vuông nhẹ, tick đỏ chuẩn UI */
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
