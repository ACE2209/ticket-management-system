"use client";

import { useCallback, useMemo, useState } from "react";
import {
  X,
  Radio,
  MessageCircle,
  Mail,
  Twitter,
  Instagram,
  Facebook,
  Send,
  MoreHorizontal,
} from "lucide-react";

type Action = {
  key: string;
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
};

export default function SharePage({
  onClose,
  title,
}: {
  onClose?: () => void;
  title?: string;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  const shareTitle = title || "Check this out";
  const currentUrl =
    typeof window !== "undefined"
      ? window.location.origin + (window.location.pathname || "")
      : "";

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.left = "-1000px";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied("Link copied to clipboard");
      setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied("Could not copy link");
      setTimeout(() => setCopied(null), 1800);
    }
  }, []);

  const webShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: shareTitle, url: currentUrl });
        return;
      }
    } catch {}
    copyToClipboard(currentUrl);
  }, [copyToClipboard, currentUrl, shareTitle]);

  const open = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  const actions: Action[] = useMemo(
    () => [
      {
        key: "airdrop",
        label: "AirDrop",
        onClick: () => webShare(),
        icon: <Radio size={28} strokeWidth={1.6} className="text-[#F41F52]" />,
      },
      {
        key: "message",
        label: "Message",
        onClick: () =>
          open(`sms:?&body=${encodeURIComponent(`${shareTitle} ${currentUrl}`)}`),
        icon: (
          <MessageCircle size={28} strokeWidth={1.6} className="text-[#F41F52]" />
        ),
      },
      {
        key: "mail",
        label: "Mail",
        onClick: () =>
          open(
            `mailto:?subject=${encodeURIComponent(
              shareTitle
            )}&body=${encodeURIComponent(currentUrl)}`
          ),
        icon: <Mail size={28} strokeWidth={1.6} className="text-[#F41F52]" />,
      },
      {
        key: "twitter",
        label: "Twitter",
        onClick: () =>
          open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(
              shareTitle
            )}&url=${encodeURIComponent(currentUrl)}`
          ),
        icon: <Twitter size={28} strokeWidth={1.6} className="text-[#F41F52]" />,
      },
      {
        key: "instagram",
        label: "Instagram",
        onClick: () => copyToClipboard(currentUrl),
        icon: <Instagram size={28} strokeWidth={1.6} className="text-[#F41F52]" />,
      },
      {
        key: "facebook",
        label: "Facebook",
        onClick: () =>
          open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              currentUrl
            )}`
          ),
        icon: <Facebook size={28} strokeWidth={1.6} className="text-[#F41F52]" />,
      },
      {
        key: "telegram",
        label: "Telegram",
        onClick: () =>
          open(
            `https://t.me/share/url?url=${encodeURIComponent(
              currentUrl
            )}&text=${encodeURIComponent(shareTitle)}`
          ),
        icon: <Send size={28} strokeWidth={1.6} className="text-[#F41F52]" />,
      },
      {
        key: "other",
        label: "Other",
        onClick: () => webShare(),
        icon: <MoreHorizontal size={28} strokeWidth={1.6} className="text-[#F41F52]" />,
      },
    ],
    [copyToClipboard, currentUrl, open, shareTitle, webShare]
  );

  const close = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center animate-slide-up">
      {/* background */}
      <button
        aria-label="Close"
        onClick={close}
        className="absolute inset-0 bg-[rgba(31,29,43,0.24)] backdrop-blur-[10px]"
      />

      {/* Bottom Sheet */}
      <section
        className="relative w-full max-w-screen-sm bg-[#FEFEFE] rounded-t-[32px] px-6 pt-5 pb-6 shadow-lg"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)" }}
        aria-label="Share sheet"
      >
        <div className="flex items-center justify-between border-b border-[#E3E7EC] pb-4 mb-4">
          <div className="w-6 h-6" />
          <h2 className="text-[20px] font-semibold text-[#111111]">Share to</h2>
          <button
            onClick={close}
            className="w-6 h-6 rounded-full flex items-center justify-center text-[#78828A] hover:bg-gray-100"
            aria-label="Close share"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {actions.map((a) => (
            <button
              key={a.key}
              onClick={a.onClick}
              className="flex flex-col items-center gap-2 focus:outline-none"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#F6F8FE] flex items-center justify-center">
                {a.icon}
              </div>
              <span className="text-[12px] text-[#111111] font-medium text-center">
                {a.label}
              </span>
            </button>
          ))}
        </div>

        {copied && (
          <div className="mt-4 text-center text-[12px] text-[#78828A]">
            {copied}
          </div>
        )}
      </section>

      <style jsx global>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0.5;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
