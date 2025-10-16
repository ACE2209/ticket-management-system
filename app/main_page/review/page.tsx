'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, MoreHorizontal } from 'lucide-react';

type ReviewItem = {
  id: string;
  rating: number; // 1..5
  content: string;
  author: string;
  date: string;
};

type ReviewsResponse = {
  average: number;
  total: number;
  counts: { [k: number]: number };
  reviews: ReviewItem[];
};

export default function ReviewsPage() {
  const router = useRouter();

  const [data, setData] = useState<ReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Dữ liệu hardcode mock trước (thay vì gọi API)
    const reviews: ReviewItem[] = [
      { id: 'r1', rating: 4, content: 'Lorem ipsum dolor sit amet, adipiscing elit. Sed at gravida nulla, neque. Duis quam ut netus donec enim vitae ac diam.', author: 'Talan Geidt', date: '2022-06-27' },
      { id: 'r2', rating: 5, content: 'Amazing experience, top notch! Will join again.', author: 'Maria F', date: '2022-06-22' },
      { id: 'r3', rating: 3, content: 'It was okay, but organization could be better.', author: 'John Doe', date: '2022-06-20' },
      { id: 'r4', rating: 4, content: 'Enjoyed the speakers and overall vibe!', author: 'Sarah L', date: '2022-06-18' },
      { id: 'r5', rating: 5, content: 'Absolutely worth it! Learned a lot from the sessions.', author: 'Nguyen K', date: '2022-06-15' },
    ];

    const counts = { 1: 0, 2: 0, 3: 1, 4: 2, 5: 2 };
    const average = 4.4;
    const total = reviews.length;

    setTimeout(() => {
      setData({ average, total, counts, reviews });
      setLoading(false);
    }, 600); // giả lập loading
  }, []);

  const barPercent = (count: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-4">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Header */}
      <div className="w-full max-w-md flex items-center mb-4">
        <button onClick={() => router.back()} aria-label="Back" className="p-2">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="flex-1 text-center text-lg font-semibold text-gray-900">Review</h1>
      </div>

      {/* Content */}
      <div className="w-full max-w-md">
        {loading ? (
          <div className="p-6 bg-white rounded-xl shadow-sm animate-pulse space-y-3">
            <div className="h-6 w-28 bg-gray-200 rounded" />
            <div className="h-32 bg-gray-100 rounded" />
          </div>
        ) : data ? (
          <>
            {/* summary card */}
            <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm mb-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-3xl font-bold">{data.average.toFixed(1)}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center text-yellow-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4" />
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">
                      Based on {data.total} review{data.total > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                {/* bars */}
                <div className="w-36">
                  <div className="space-y-1">
                    {([5, 4, 3, 2, 1] as number[]).map((star) => {
                      const cnt = data.counts[star] || 0;
                      const pct = barPercent(cnt, data.total);
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <div className="text-xs text-gray-500 w-3">{star}</div>
                          <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="h-2 bg-red-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="w-8 text-xs text-gray-500 text-right">{cnt}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* review list */}
            <div className="bg-white rounded-xl border border-gray-100">
              <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
                {data.reviews.map((r) => (
                  <article key={r.id} className="p-4 border-b last:border-b-0">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-semibold text-yellow-500">{r.rating}.0</div>
                          <div className="flex text-yellow-500">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star
                                key={idx}
                                className={`w-4 h-4 ${idx < r.rating ? '' : 'opacity-30'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">{r.date}</div>
                      </div>
                      <button className="p-2 text-gray-500">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="mt-3 text-sm text-gray-700 leading-relaxed">{r.content}</p>
                    <div className="mt-3 text-sm text-gray-500">{r.author}</div>
                  </article>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
