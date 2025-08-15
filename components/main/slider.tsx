'use client'

import { InformationCircleIcon } from '@heroicons/react/24/solid'
import { useEffect, useMemo, useRef, useState } from 'react'

export default function Slider() {

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
      ['밥 먹었어?', '밥은 먹었어?', '밥 먹었지?'],
      ['밥 먹었어요?', '식사하셨어요?', '식사하셨나요?'],
      ['식사하셨습니까?', '식사하신 건가요?', '식사는 하셨나요?'],
    ],
    greeting: [
      ['잘 지내?', '요즘 잘 지내?', '잘 지내고 있지?'],
      ['잘 지내세요?', '요즘 잘 지내세요?', '잘 지내고 계시나요?'],
      ['안녕하십니까?', '안녕하세요, 잘 지내십니까?', '요즘 안녕하신지요?'],
    ],
    ask_where: [
      ['어디 가?', '어디 가는 중이야?', '어디로 가?'],
      ['어디 가세요?', '어디 가고 계세요?', '어디로 가시는 중인가요?'],
      ['어디로 가십니까?', '어디로 이동 중이십니까?', '목적지가 어디십니까?'],
    ],
    ask_doing: [
      ['뭐 해?', '지금 뭐 해?', '뭐 하는 중이야?'],
      ['뭐 하세요?', '지금 뭐 하고 계세요?', '무엇을 하고 계시나요?'],
      ['무엇을 하십니까?', '지금 무엇을 하고 계십니까?', '현재 하시는 일은 무엇입니까?'],
    ],
    ask_day: [
      ['오늘 하루 어땠어?', '오늘 잘 보냈어?', '오늘 하루 괜찮았지?'],
      ['오늘 하루 어떠셨어요?', '오늘 하루 잘 보내셨어요?', '오늘 괜찮으셨나요?'],
      ['오늘 하루 어떠셨습니까?', '오늘 하루 잘 보내셨습니까?', '금일 일정은 어떠셨습니까?'],
    ],
    ask_weekend: [
      ['주말 잘 보냈어?', '주말 어땠어?', '주말 재밌었지?'],
      ['주말 잘 보내셨어요?', '주말 잘 지내셨어요?', '주말은 어떠셨어요?'],
      ['주말 잘 보내셨습니까?', '주말은 어떠셨습니까?', '주말 일정은 순조로우셨습니까?'],
    ],
    ask_okay: [
      ['괜찮아?', '좀 괜찮아?', '많이 괜찮아?'],
      ['괜찮으세요?', '좀 괜찮으세요?', '많이 괜찮으세요?'],
      ['괜찮으십니까?', '좀 괜찮으십니까?', '건강은 괜찮으십니까?'],
    ],
  } as const

  // ── 서울 자정 기준 "오늘의 상황" 고정 선택 (하루 1개 키 고정)
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
      <div className="w-[296px] bg-gray-100 border border-gray-200 text-center py-3 my-2 mb-4 rounded-xl">
        <div className="mt-1 text-base">{currentSentence}</div>
      </div>
      <div className="flex justify-center mb-4">
          <span className="inline-flex items-center bg-white px-3 py-1 text-xs text-gray-600 rounded-full shadow border">
            <InformationCircleIcon className="w-4 h-4 mr-1 text-blue-600" />
            Move the slider to match your situation
          </span>
        </div>

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
            onChange={(e) => setLevel(Number(e.target.value))}
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
        <span >Formality Levelness</span>
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
            onChange={(e) => setFam(Number(e.target.value))}
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