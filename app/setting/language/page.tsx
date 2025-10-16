'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, Check } from 'lucide-react'

export default function BeautifulUI() {
  const router = useRouter()
  const [selected, setSelected] = useState('English')

  const suggestedLanguages = ['English', 'Tiếng Việt', 'Français']
  const otherLanguages = ['Español', 'Deutsch', '日本語', '한국어', '中文', 'Português', 'Italiano', 'Русский']

  return (
    <div className="min-h-screen flex justify-center bg-gray-50">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl bg-white shadow-sm rounded-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline text-sm font-medium">Back</span>
          </button>
          <h1 className="text-lg font-semibold text-center flex-1">Choose Language</h1>
          <div className="w-12" /> {/* giữ header cân bằng */}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3 space-y-6">

          {/* Suggested */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 mb-2">Suggested</h2>
            <div className="flex flex-col gap-2">
              {suggestedLanguages.map(lang => (
                <button
                  key={lang}
                  onClick={() => setSelected(lang)}
                  aria-pressed={selected === lang}
                  className={`flex justify-between items-center rounded-xl px-4 py-3 text-left transition
                    ${selected === lang ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'}
                  `}
                >
                  <span>{lang}</span>
                  {selected === lang && <Check size={18} className="text-blue-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" />

          {/* Other */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 mb-2">Other Languages</h2>
            <div className="flex flex-col gap-2">
              {otherLanguages.map(lang => (
                <button
                  key={lang}
                  onClick={() => setSelected(lang)}
                  aria-pressed={selected === lang}
                  className={`flex justify-between items-center rounded-xl px-4 py-3 text-left transition
                    ${selected === lang ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'}
                  `}
                >
                  <span>{lang}</span>
                  {selected === lang && <Check size={18} className="text-blue-600" />}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
