"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

// Define types for roles and message types for better type safety
type Role = "Admin" | "Organizer" | "Support Staff";
type MessageType = "success" | "error" | "info" | "";

// Main component must be named App and exported as default
const SignInAdminPage: React.FC = () => {
  const router = useRouter();

  // State with explicit types
  const [activeRole, setActiveRole] = useState<Role>("Admin");
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<MessageType>("");

  // List of roles for mapping
  const roles: Role[] = ["Admin", "Organizer", "Support Staff"];

  /**
   * Function to switch the active login role.
   * @param {Role} role - The role to switch to.
   */
  const switchRole = (role: Role): void => {
    setActiveRole(role);
    setMessage("");
    setMessageType("");
  };

  /**
   * Function to display the feedback message.
   * @param {string} msg - Message content.
   * @param {MessageType} type - Message type.
   */
  const showMessage = (msg: string, type: MessageType): void => {
    setMessage(msg);
    setMessageType(type);
  };

  /**
   * Handles the login event (simulated only).
   * @param {FormEvent<HTMLFormElement>} e - Form submit event.
   */
  const handleLogin = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    showMessage(`Attempting to log in as ${activeRole}...`, "info");

    setTimeout(() => {
      // ✅ Tạo danh sách tài khoản cho từng role
      const accounts = {
        Admin: { email: "admin@test.com", password: "123456" },
        Organizer: { email: "organizer@test.com", password: "123456" },
        "Support Staff": { email: "staff@test.com", password: "123456" },
      };

      const account = accounts[activeRole];

      if (email === account.email && password === account.password) {
        showMessage(`Login successful as ${activeRole}! Welcome.`, "success");

        setTimeout(() => {
          if (activeRole === "Admin") router.push("/role/adminmanager");
          else if (activeRole === "Organizer")
            router.push("/role/organizermanager");
          else router.push("/role/staffmanager");
        }, 800);
      } else {
        showMessage(
          `Error: Incorrect email or password for role ${activeRole}.`,
          "error"
        );
      }
    }, 1500);
  };

  /**
   * Helper function to get dynamic classes for the role buttons.
   * @param {Role} role - The current role being rendered.
   * @returns {string} Tailwind CSS class string.
   */
  const getRoleButtonClasses = (role: Role): string => {
    const baseClasses =
      "flex-1 py-2 px-1 text-sm font-medium text-center rounded-lg focus:outline-none transition-colors duration-200";
    if (activeRole === role) {
      return `${baseClasses} text-white bg-[#F41F52] shadow-md hover:bg-[#D4133D] focus:ring-2 focus:ring-[#F41F52] focus:ring-opacity-50`;
    } else {
      return `${baseClasses} text-gray-600 bg-transparent hover:bg-white hover:text-[#F41F52]`;
    }
  };

  /**
   * Helper function to get dynamic classes for the feedback message box.
   * @returns {string} Tailwind CSS class string.
   */
  const getMessageClasses = (): string => {
    if (!message) return "hidden";
    let classes =
      "mt-6 p-3 text-sm rounded-lg text-center transition-all duration-300";
    if (messageType === "success") {
      classes += " bg-green-100 text-green-800";
    } else if (messageType === "error") {
      classes += " bg-red-100 text-red-800";
    } else if (messageType === "info") {
      classes += " bg-blue-100 text-blue-800";
    }
    return classes;
  };

  const mainTitle = `${activeRole} Login`;

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-4 font-sans">
      <div
        id="login-card"
        className="bg-white w-full max-w-sm rounded-xl shadow-2xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-500"
      >
        <div className="bg-[#F41F52] h-2"></div>

        <div className="p-8">
          <h1
            id="main-title"
            className="text-3xl font-extrabold text-gray-800 mb-2 text-center"
          >
            {mainTitle}
          </h1>
          <p id="sub-title" className="text-center text-sm text-gray-500 mb-8">
            Logging in as:{" "}
            <span id="current-role" className="font-semibold text-[#F41F52]">
              {activeRole}
            </span>
          </p>

          {/* Role Selection Tabs */}
          <div className="flex space-x-2 mb-8 p-1 bg-gray-50 rounded-lg">
            {roles.map((role) => (
              <button
                key={role}
                data-role={role}
                onClick={() => switchRole(role)}
                className={getRoleButtonClasses(role)}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email / Username
              </label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Enter email or username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#F41F52] focus:border-[#F41F52] placeholder-gray-400"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#F41F52] focus:border-[#F41F52] placeholder-gray-400"
                required
              />
              <div className="mt-2 text-right">
                <a
                  href="#"
                  className="text-xs font-medium text-[#F41F52] hover:text-[#D4133D]"
                >
                  Forgot Password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#F41F52] text-white py-3 rounded-xl font-bold text-lg uppercase shadow-lg hover:bg-[#D4133D] focus:outline-none focus:ring-4 focus:ring-[#F41F52]/20 transform hover:scale-[1.02]"
            >
              Log In
            </button>
          </form>

          {message && (
            <div className={getMessageClasses()} role="alert">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignInAdminPage;
