"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function LegalandPoliciesPage() {
  const router = useRouter();

  return (
    <div
      className="flex flex-col min-h-screen bg-white relative pb-24"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* Header */}
      <div className="relative w-full flex items-center justify-center pt-10 pb-6">
        <button
          onClick={() => router.back()}
          className="absolute left-6 w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-5 h-5 text-black" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">
          Legal and Policies
        </h2>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 custom-scrollbar">
        <section className="space-y-4 pb-24">
          <h3 className="text-lg font-semibold text-gray-900">Terms</h3>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ornare
            quam vel facilisis feugiat amet sagittis arcu, tortor. Sapien,
            consequat ultrices morbi orci semper sit nulla. Leo auctor ut etiam
            est, amet aliquet ut vivamus. Odio vulputate est id tincidunt fames.
          </p>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ornare
            quam vel facilisis feugiat amet sagittis arcu, tortor. Sapien,
            consequat ultrices morbi orci semper sit nulla. Leo auctor ut etiam
            est, amet aliquet ut vivamus. Odio vulputate est id tincidunt fames.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mt-8">
            Changes to the Service and/or Terms:
          </h3>
          <p className="text-gray-600">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget ornare
            quam vel facilisis feugiat amet sagittis arcu, tortor. Sapien,
            consequat ultrices morbi orci semper sit nulla. Leo auctor ut etiam
            est, amet aliquet ut vivamus. Odio vulputate est id tincidunt fames.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. A nostrum
            explicabo maiores officiis tenetur est, non laudantium in sed quae
            recusandae quis porro! Quidem, magnam accusantium repellat ex
            debitis hic? Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Atque dolorem temporibus officiis, blanditiis dolores
            laudantium, similique sunt tenetur dolor accusamus option molestiae
            dicta obcaecati maiores voluptate fugit nulla enim consectetur?
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cupiditate
            ipsum aspernatur repudiandae consequatur totam magnam velit aliquid
            obcaecati, delectus, dolor nesciunt repellendus ipsa beatae ex sequi
            harum repellat voluptatum perferendis! Eum dolorum sapiente modi
            molestias nesciunt eos deleniti vel nostrum quibusdam architecto
            voluptas iste tempora explicabo eius unde eligendi vitae temporibus
            minima ut corrupti, pariatur quam! Vel non omnis error? Magni
            praesentium impedit ullam molestias quibusdam, dolorem, odit eum
            eius incidunt, amet assumenda dolores. Ea nam quidem, reiciendis sit
            necessitatibus debitis est aliquam, voluptatum, alias itaque quod
            velit quibusdam illum? Repudiandae, blanditiis laudantium cupiditate
            unde iusto aliquam totam, architecto doloribus deserunt consectetur
            autem ratione! Quae, unde maiores. Ullam impedit laborum voluptatem
            unde doloremque doloribus ipsum hic cumque perferendis, veritatis
            debitis. Enim minus dicta voluptatem. Alias, dolorum vel omnis odio
            earum in cupiditate cumque? Reprehenderit, est assumenda veniam
            libero ipsa maiores quaerat commodi nihil sed ducimus magnam quod
            maxime voluptate laudantium?
          </p>
          <p className="text-gray-600"></p>
        </section>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #e5e7eb;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #ff1744;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #ff0033;
        }
      `}</style>
    </div>
  );
}
