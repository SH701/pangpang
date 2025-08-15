'use client'

import { ChevronDownIcon, InformationCircleIcon,ChevronUpIcon  } from '@heroicons/react/24/solid'
import { useEffect, useMemo, useRef, useState } from 'react'

export default function Slider() {
  const [showInfo,setShowInfo] = useState(true) 
  const [showex,setShowex]=useState(false)
  const steps = ['Low', '', 'High'] as const
  const max = steps.length - 1
  const [level, setLevel] = useState(0)
  const percent = (level / max) * 100

  const famSteps = ['Low', '', 'High'] as const
  const fMax = famSteps.length - 1
  const [fam, setFam] = useState(0) 
  const fPercent = (fam / fMax) * 100

  const expressions = {
   ask_eat: [
    [
      {
        phrase: '이거 먹어',
        explanation: 'Pure casual Korean! Family members use this direct, warm tone. No formality needed when you’re super close. 🤗'
      },
      {
        phrase: '이거 먹어봐',
        explanation: 'Adding “봐” softens it slightly while keeping the close relationship. Perfect for friends in public spaces. ☕'
      },
      {
        phrase: '이거 한 번 먹어봐요',
        explanation: 'Even with closeness, you show respect for the setting. “한 번” adds gentle suggestion rather than command. 🫱'
      },
    ],
    [
      {
        phrase: '이것 좀 먹어볼래?',
        explanation: 'Question form (“~볼래?”) makes it a suggestion, not an order. “좀” adds politeness while staying friendly. 🍪'
      },
      {
        phrase: '이것 좀 드세요',
        explanation: 'Standard workplace politeness. “드세요” shows respect, “좀” keeps it approachable. Safe for most office situations! 💼'
      },
      {
        phrase: '이것 한 번 드셔보세요',
        explanation: 'More formal but still natural. Perfect for semi-formal work gatherings where respect matters. 🍽️'
      },
    ],
    [
      {
        phrase: '이것 좀 드셔보세요',
        explanation: 'Service industry standard. Polite but approachable — wants to maintain customer friendliness. 🛍️'
      },
      {
        phrase: '이것 드셔보시겠어요?',
        explanation: 'Professional service tone. The question form gives customer choice while showing proper respect. 🎩'
      },
      {
        phrase: '이것 드시겠습니까?',
        explanation: 'Top-tier service Korean. Formal but natural — what you’d hear at luxury hotels or formal business meetings. ✨'
      },
    ]
  ],
   ask_did_you_eat: [
    // Low Intimacy
    [
      {
        phrase: '밥 먹었어?',
        explanation: 'Classic Korean greeting! Shows care in the most casual way. This is how Korean families check on each other. 🐥'
      },
      {
        phrase: '밥 먹었어요?',
        explanation: 'Adding “요” shows basic politeness while maintaining warmth. Perfect for close friends when you want to be slightly more polite. 🌼'
      },
      {
        phrase: '식사 하셨어요?',
        explanation: '“식사” is more formal than “밥”, and “하셨어요” shows respect. Great when talking to people you’re close to but need to respect. 🙇'
      },
    ],
    // Medium Intimacy
    [
      {
        phrase: '밥은 먹었어?',
        explanation: 'Adding “은” makes it slightly more structured. Common in relaxed workplace conversations during breaks. 🍵'
      },
      {
        phrase: '점심 드셨어요?',
        explanation: '“점심” specifies the meal, “드셨어요” shows workplace-appropriate respect. Standard office small talk. 💼'
      },
      {
        phrase: '식사는 하셨습니까?',
        explanation: 'Business-level formality. “습니까” ending shows professional respect. Used when checking on clients or partners. 🗝️'
      },
    ],
    // High Intimacy
    [
      {
        phrase: '밥 드셨어요?',
        explanation: 'Casual but respectful service tone. Common in casual restaurants or when vendors check on customers. 🍚'
      },
      {
        phrase: '식사 하셨습니까?',
        explanation: 'Professional hospitality language. Shows proper respect while maintaining service industry warmth. 🏨'
      },
      {
        phrase: '진지 드셨습니까?',
        explanation: '“진지” is the highest honorific for meal. Reserved for VIP treatment or very formal dining situations. 🍷'
      },
    ]
  ],
    apology: [
    // Low Intimacy
    [
      {
        phrase: '잘못했어',
        explanation: 'Direct admission among family. No extra formality needed — just honest acknowledgment between close people. 💔'
      },
      {
        phrase: '내가 잘못했어',
        explanation: 'Adding “내가” (I) takes clear responsibility. Shows sincerity while keeping the casual tone with friends. 🤗'
      },
      {
        phrase: '제가 잘못했어요',
        explanation: '“제가” is the humble form of “I”, with polite “어요” ending. Shows respect while maintaining some closeness. 🙏'
      },
    ],
    // Medium Intimacy
    [
      {
        phrase: '내 실수야',
        explanation: '“실수” (mistake) sounds more professional than “잘못”. Good for minor work errors in relaxed settings. 😅'
      },
      {
        phrase: '제가 실수했습니다',
        explanation: 'Standard workplace apology. “실수했습니다” is professional but not overly dramatic. Safe for most office situations. 💼'
      },
      {
        phrase: '저의 잘못입니다',
        explanation: '“저의 잘못입니다” is structured and takes clear responsibility. Perfect for formal work apologies. 📖'
      },
    ],
    // High Intimacy
    [
      {
        phrase: '제가 잘못했네요',
        explanation: '“네요” ending softens the formality while maintaining respect. Common in service industry apologies. 👜'
      },
      {
        phrase: '저의 실수였습니다',
        explanation: 'Formal but natural business language. “였습니다” shows the mistake is acknowledged and resolved. 🗂️'
      },
      {
        phrase: '저의 부주의였습니다',
        explanation: '“부주의” (carelessness) shows deep responsibility. Used for serious situations requiring maximum respect and accountability. 📄'
      },
    ]
  ],
} as const

  const situationKeys = useMemo(
    () => Object.keys(expressions) as Array<keyof typeof expressions>,
    []
  )

  const getSeoulParts = () => {
    const fmt = (opt: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', ...opt })
    const y = Number(fmt({ year: 'numeric' }).format(new Date()))
    const m = Number(fmt({ month: '2-digit' }).format(new Date()))
    const d = Number(fmt({ day: '2-digit' }).format(new Date()))
    return { y, m, d }
  }

  const getSeoulDateKey = () => {
    const { y, m, d } = getSeoulParts()
    const mm = String(m).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    return `${y}-${mm}-${dd}`
  }

  const hash = (str: string) => {
    let h = 5381
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h) + str.charCodeAt(i)
    return Math.abs(h)
  }

  const [situationIdx, setSituationIdx] = useState(
    () => hash(getSeoulDateKey()) % situationKeys.length
  )
  const timerRef = useRef<number | null>(null)

  const msUntilNextSeoulMidnight = () => {
    const { y, m, d } = getSeoulParts()
    // KST(UTC+9) 자정 → UTC로는 전날 15:00, 따라서 -9시간
    const nextDayUTC = Date.UTC(y, m - 1, d + 1, -9, 0, 0)
    const nowUTC = Date.now()
    return Math.max(0, nextDayUTC - nowUTC)
  }

  useEffect(() => {
    const schedule = () => {
      const ms = msUntilNextSeoulMidnight()
      timerRef.current = window.setTimeout(() => {
        const newIdx = hash(getSeoulDateKey()) % situationKeys.length
        setSituationIdx(newIdx)
        schedule()
      }, ms)
    }
    schedule()
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const currentKey = situationKeys[situationIdx]
  const currentSentence = expressions[currentKey][level][fam]

  return (
    <div className="w-[335px] flex flex-col justify-center items-center rounded-xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] mx-auto bg-white mt-5">
      <span className="font-semibold text-lg py-2 px-4 mt-3">Today`s honorific expression</span>

      {/* 오늘의 문장 */}
     <div className="w-[296px] bg-gray-100 border border-gray-200 py-3 my-2 mb-4 rounded-xl">
  <div className=" text-base relative text-center px-8 py-1">
    <span>{currentSentence.phrase}</span>
    <button
      onClick={() => setShowex((prev) => !prev)}
      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
    >
      {showex ? (
        <ChevronUpIcon className="size-5" />
      ) : (
        <ChevronDownIcon className="size-5" />
      )}
    </button>
  </div>

  {showex && (
    <div className="text-[13px] px-2 py-1 text-center border-t border-gray-400 text-gray-700">
      {currentSentence.explanation}
    </div>
  )}
</div>
{showInfo && (
          <div className="flex justify-center mb-4">
          <span className="inline-flex items-center bg-white px-3 py-1 text-xs text-gray-600 rounded-full shadow border">
            <InformationCircleIcon className="w-4 h-4 mr-1 text-blue-600" />
            Move the slider to match your situation
          </span>
        </div>
      )}
      {/* 슬라이더 박스 */}
      <div className="w-[335px] px-4 max-w-md mx-auto border rounded-xl border-blue-400 bg-[#EFF6FF] pb-4">
        <div className='pt-2'>
        <span >Intimacy Level</span>
        </div>
        <div className="relative h-2 mb-2 mt-6">
          <div className="absolute inset-0 bg-gray-200 rounded-full" />
          {steps.map((_, i) => (
            <div
              key={`lvl-tick-${i}`}
              className={`absolute top-1/2 z-10 w-3 h-3 rounded-full border-2 transform -translate-x-1/2 -translate-y-1/2 transition-colors ${
                i <= level ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
              }`}
              style={{ left: `${(i / max) * 100}%` }}
            />
          ))}
          <div
            className="absolute inset-y-0 left-0 bg-blue-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
          <div
            className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-300 ease-out"
            style={{ left: `${percent}%` }}
          >
            <div className="w-6 h-6 bg-white border-2 border-blue-600 rounded-full shadow -translate-x-1/2" />
          </div>
          <input
            type="range"
            min={0}
            max={max}
            step={1}
            value={level}
            onChange={(e) => {
              setLevel(Number(e.target.value))  
              setShowInfo(false)}}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Speech level"
          />
        </div>
          
        <div className="flex justify-between text-[11px] text-gray-600 pb-3 mb-2 border-b border-gray-300">
          {steps.map((label, i) => (
            <span
              key={`lvl-label-${i}`}
              className={`flex-1 ${i === 0 ? 'text-left' : i === steps.length - 1 ? 'text-right' : 'text-center'}`}
            >
              {label}
            </span>
          ))}
          
        </div>
         <div className='pb-4'>
        <span >Formality Level</span>
        </div>
          

        <div className="relative h-2 mb-2">
          
          <div className="absolute inset-0 bg-gray-200 rounded-full" />
          
          {famSteps.map((_, i) => (
            <div
              key={`fam-tick-${i}`}
              className={`absolute top-1/2 z-10 w-3 h-3 rounded-full border-2 transform -translate-x-1/2 -translate-y-1/2 transition-colors ${
                i <= fam ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'
              }`}
              style={{ left: `${(i / fMax) * 100}%` }}
            />
          ))}
          <div
            className="absolute inset-y-0 left-0 bg-blue-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${fPercent}%` }}
          />
          <div
            className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-300 ease-out"
            style={{ left: `${fPercent}%` }}
          >
            <div className="w-6 h-6 bg-white border-2 border-blue-600 rounded-full shadow -translate-x-1/2" />
          </div>
          <input
            type="range"
            min={0}
            max={fMax}
            step={1}
            value={fam}
            onChange={(e) => {
              setFam(Number(e.target.value)) 
              setShowInfo(false)}}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Familiarity level"
          />
        </div>

        <div className="flex justify-between text-[11px] text-gray-600">
          {famSteps.map((label, i) => (
            <span
              key={`fam-label-${i}`}
              className={`flex-1 ${i === 0 ? 'text-left' : i === famSteps.length - 1 ? 'text-right' : 'text-center'}`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}