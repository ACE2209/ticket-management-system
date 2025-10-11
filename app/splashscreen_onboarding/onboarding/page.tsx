"use client";

import Image from "next/image";

import { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { useRouter } from "next/navigation";

const slides = [
  {
    title: "Thousands of venues & vendors in one app",
    subtitle:
      "Semper in cursus magna et eu varius nunc adipiscing. Elementum justo, laoreet id sem .",
    imageSrc: "/splashscreen_onboarding/giaodiengioithieu1.jpg",
  },
  {
    title: "Discover events near you",
    subtitle:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.",
    imageSrc: "/splashscreen_onboarding/giaodiengioithieu2.jpg",
  },
  {
    title: "Follow your favorites about upcoming events",
    subtitle:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    imageSrc: "/splashscreen_onboarding/giaodiengioithieu3.jpg",
  },
];

export default function OnboardingPage() {
  const [index, setIndex] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (index < slides.length - 1) setIndex(index + 1);
  };

  const handlePrev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleNext(), // THÊM: Vuốt trái để chuyển slide tiếp theo
    onSwipedRight: () => handlePrev(), // Vuốt phải để quay lại slide trước
    trackMouse: true,
  });

  const current = slides[index];
  const isLastSlide = index === slides.length - 1;
  return (
    // Added Flexbox classes: 'flex', 'justify-center', 'items-center'
    <div className="card bg-[#F41F52] min-h-screen relative cursor-pointer flex justify-center items-center">
      <Image
        src="/splashscreen_onboarding/khungip.png"
        alt="Onboarding frame"
        width={296.58}
        height={599.96}
        priority
      />

      <Image
        src={current.imageSrc}
        alt={`Onboarding ${index + 1}`}
        width={265.88}
        height={575.14}
        className="absolute rounded-[30px] z-20"
      />
      <div
        className="absolute z-30 bg-[#FEFEFE] bottom-0 left-1/2 transform -translate-x-1/2"
        style={{
          width: "100%", // Ensures it spans the full width of the view to be centered properly
          maxWidth: "420px", // Optional: to constrain max width on larger screens
        }}
        {...handlers}
      >
        {!isLastSlide ? (
          // ------------------- SLIDE 1 + 2 -------------------
          <div
            className="bg-white rounded-[16px] mx-auto mt-6 flex flex-col items-center"
            style={{
              width: "327px",
              height: "301px",
              padding: "16px 24px",
              gap: "32px",
            }}
          >
            <div
              className="flex flex-col items-center text-center"
              style={{
                width: "279px",
              }}
            >
              <h4
                style={{
                  fontFamily: "'Plus Jakarta Sans'",
                  fontWeight: 700,
                  fontSize: "24px",
                  lineHeight: "32px",
                  letterSpacing: "0.005em",
                  color: "#111111",
                  marginBottom: "16px",
                }}
              >
                {current.title}
              </h4>
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans'",
                  fontWeight: 400,
                  fontSize: "14px",
                  lineHeight: "22px",
                  letterSpacing: "0.005em",
                  color: "#78828A",
                }}
              >
                {current.subtitle}
              </p>
            </div>

            {/* Slider indicator */}
            <div className="flex gap-2 items-center justify-center">
              {slides.map((_, idx) => (
                <div
                  key={idx}
                  className={
                    idx === index
                      ? "w-4 h-2 rounded-full bg-[#FF2D55]"
                      : "w-2 h-2 rounded-full bg-[#D9D9D9]"
                  }
                />
              ))}
            </div>

            {/* Bottom row */}
            <div className="flex justify-between items-center w-full">
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans'",
                  fontSize: "14px",
                  color: "#78828A",
                  cursor: "pointer",
                }}
                onClick={() =>
                  router.push("/splashscreen_onboarding/splashscreen")
                }
              >
                Skip
              </span>
              <button
                className="w-12 h-12 bg-[#FF2D55] rounded-full flex items-center justify-center"
                onClick={handleNext}
              >
                <span className="text-white text-xl">→</span>
              </button>
            </div>
          </div>
        ) : (
          // ------------------- SLIDE 3 -------------------
          <div
            className="flex flex-col items-center justify-center text-center mx-auto mt-6"
            style={{
              width: "327px",
              height: "301px",
              padding: "16px 24px",
              gap: "24px",
            }}
          >
            <h4
              style={{
                fontFamily: "'Plus Jakarta Sans'",
                fontWeight: 700,
                fontSize: "24px",
                lineHeight: "32px",
                letterSpacing: "0.005em",
                color: "#111111",
              }}
            >
              Follow your favorites about upcoming events
            </h4>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans'",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "22px",
                letterSpacing: "0.005em",
                color: "#78828A",
                opacity: 0.8,
              }}
            >
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>

            {/* Get Started button */}
            <button
              className="bg-[#FF2D55] rounded-full py-3 px-10 text-white text-[18px] font-semibold"
              style={{
                width: "279px",
                height: "56px",
              }}
              onClick={() => router.push("/sign_auth/signin")}
            >
              Get Started
            </button>

            <p
              style={{
                fontFamily: "'Plus Jakarta Sans'",
                fontWeight: 600,
                fontSize: "16px",
                lineHeight: "24px",
                color: "#78828A",
              }}
            >
              Don’t have an account?{" "}
              <span
                style={{
                  color: "#FF2D55",
                  cursor: "pointer",
                }}
                onClick={() => router.push("/sign_auth/createaccount")}
              >
                Register
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
