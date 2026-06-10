import React from 'react'

export default function Testimonial({
  quote = `GetCapsa is not only an innovative, excellent digital platform, but it is also the best thing to ever happen to small and medium enterprises in Nigeria and Africa.`,
  author = 'Cynthia Chukwu,',
  role = 'CEO, J&C Atlantic Supplies',
  location = 'Lagos, Nigeria',
  onPrev,
  onNext
}) {
  return (
    <section className="flex items-end mb-[10px]">
      <div className="bg-gradient-to-b from-white/6 to-white/3 rounded-2xl p-7 text-white shadow-lg border border-white/12 backdrop-blur-md px-[20px]">
        <p className="text-[18px] leading-[1.45] font-semibold mb-4">{quote}</p>

        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-sm">{author}</div>
            <div className="text-sm opacity-95">{role}</div>
            <div className="text-xs opacity-80">{location}</div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onPrev}
              aria-label="Previous testimonial"
              className="w-9 h-9 rounded-full border border-white/18 bg-white/4 flex items-center justify-center text-white text-lg hover:translate-y-[-2px] transition-transform"
            >
              ⟵
            </button>
            <button
              onClick={onNext}
              aria-label="Next testimonial"
              className="w-9 h-9 rounded-full border border-white/18 bg-white/4 flex items-center justify-center text-white text-lg hover:translate-y-[-2px] transition-transform"
            >
              ⟶
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
