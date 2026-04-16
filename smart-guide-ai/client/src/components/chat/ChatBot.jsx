import { useState, useRef, useEffect } from 'react'
import { Bot, X, Send, Minimize2, Sparkles, RotateCcw } from 'lucide-react'
import { chatAPI } from '../../services/api'
import { useLanguageStore } from '../../store'
import { t } from '../../utils/i18n'
import clsx from 'clsx'

// Mock AI responses for demo (used when API unavailable)
const MOCK_RESPONSES = {
  income: `**How to apply for Income Certificate:**\n\n1. 📋 Gather documents: Aadhaar, Ration Card, Salary slips (3 months)\n2. 🌐 Visit our Services page and select "Income Certificate"\n3. 📝 Fill in personal details and family income declaration\n4. 📁 Upload scanned documents (PDF/JPG, max 2MB each)\n5. ✅ Submit and note your application reference number\n6. 📅 Collect certificate in 7–10 working days\n\n*Fees: ₹30 | Processing: 7–10 days*`,
  caste:  `**How to apply for Caste Certificate:**\n\n1. 📋 Gather: Aadhaar, Ration Card, Parent's community certificate\n2. 🏛️ Select "Caste Certificate" from Services\n3. 📝 Enter community and sub-caste details\n4. 📁 Upload parent's community certificate as primary proof\n5. ✅ Submit application\n6. 📅 Ready in 15–21 working days\n\n*Fees: ₹30 | Processing: 15–21 days*`,
  birth:  `**How to apply for Birth Certificate:**\n\n1. 📋 Gather: Hospital discharge summary, Parent Aadhaar, Marriage certificate\n2. 👶 Select "Birth Certificate" from Services\n3. 📝 Enter child and parent details accurately\n4. 📁 Upload hospital records\n5. ✅ Submit within 21 days of birth (free); after that ₹20 fee\n\n*Processing: 3–5 working days*`,
  pension:`**How to apply for Pension Scheme:**\n\n1. ✅ Check eligibility: Age 60+ (Old Age), Widow, or Disability\n2. 📋 Gather: Age proof, BPL certificate, Bank passbook, Aadhaar\n3. 🤝 Select appropriate pension scheme\n4. 🏦 Provide correct bank account details for direct transfer\n5. ✅ Submit and await district welfare officer verification\n\n*Processing: 30–45 days | Free of cost*`,
  default:`👋 **Hello! I'm your Smart Guide AI Assistant.**\n\nI can help you with:\n• 📜 Income Certificate\n• 🏛️ Caste Certificate\n• 👶 Birth Certificate\n• 👴 Pension Schemes\n• 🪪 Ration Card\n• 🎓 Scholarships\n\nJust ask something like:\n*"How to apply for income certificate?"*\n*"What documents do I need for caste certificate?"*`,
}

const getMockResponse = (msg) => {
  const m = msg.toLowerCase()
  if (m.includes('income'))   return MOCK_RESPONSES.income
  if (m.includes('caste'))    return MOCK_RESPONSES.caste
  if (m.includes('birth'))    return MOCK_RESPONSES.birth
  if (m.includes('pension'))  return MOCK_RESPONSES.pension
  return MOCK_RESPONSES.default
}

const Typing = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    {[0,1,2].map(i => (
      <span key={i} className="w-2 h-2 bg-primary-400 rounded-full animate-pulse-dot"
        style={{ animationDelay: `${i * 0.2}s` }} />
    ))}
  </div>
)

const formatMessage = (text) => {
  // Simple markdown-like rendering
  return text
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**'))
        return <p key={i} className="font-bold text-slate-900 dark:text-white mb-1">{line.slice(2,-2)}</p>
      if (line.startsWith('• ') || /^\d+\. /.test(line))
        return <p key={i} className="ml-1 text-slate-700 dark:text-slate-200">{line}</p>
      if (line.startsWith('*') && line.endsWith('*'))
        return <p key={i} className="italic text-slate-500 dark:text-slate-400 text-xs mt-1">{line.slice(1,-1)}</p>
      return line ? <p key={i} className="text-slate-700 dark:text-slate-200">{line}</p> : <br key={i} />
    })
}

export default function ChatBot() {
  const [isOpen, setIsOpen]   = useState(false)
  const [messages, setMessages] = useState([
    { role: 'ai', text: MOCK_RESPONSES.default, id: 0 },
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const endRef                = useRef(null)
  const { lang }              = useLanguageStore()

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg, id: Date.now() }])
    setLoading(true)

    try {
      const history = messages.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }))
      const res = await chatAPI.send(userMsg, history, lang)
      const aiText = res.data?.reply || getMockResponse(userMsg)
      setMessages(prev => [...prev, { role: 'ai', text: aiText, id: Date.now() + 1 }])
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: getMockResponse(userMsg), id: Date.now() + 1 }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className={clsx(
          'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl shadow-2xl shadow-primary-500/40',
          'bg-gradient-to-br from-primary-500 to-primary-700',
          'flex items-center justify-center text-white',
          'transition-all duration-300 hover:scale-110',
          isOpen && 'scale-0 opacity-0 pointer-events-none'
        )}
        aria-label="Open AI Assistant"
      >
        <Bot size={24} />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 rounded-full animate-pulse-dot" />
      </button>

      {/* Chat panel */}
      <div className={clsx(
        'fixed bottom-6 right-6 z-50 w-80 sm:w-96',
        'flex flex-col rounded-2xl overflow-hidden',
        'shadow-2xl shadow-slate-900/30',
        'transition-all duration-300 origin-bottom-right',
        isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0 pointer-events-none'
      )} style={{ height: '500px' }}>

        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Smart Guide AI</p>
              <p className="text-primary-200 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                Online 24/7
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMessages([{ role: 'ai', text: MOCK_RESPONSES.default, id: 0 }])}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              title="Clear chat"
            ><RotateCcw size={14} className="text-white" /></button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            ><X size={16} className="text-white" /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 p-3 space-y-3 custom-scrollbar">
          {messages.map(m => (
            <div key={m.id} className={clsx('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
              {m.role === 'ai' && (
                <div className="w-6 h-6 rounded-lg bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center mr-1.5 mt-1 flex-shrink-0">
                  <Sparkles size={11} className="text-primary-600 dark:text-primary-400" />
                </div>
              )}
              <div className={m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                {m.role === 'ai' ? formatMessage(m.text) : m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="w-6 h-6 rounded-lg bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center mr-1.5 mt-1">
                <Sparkles size={11} className="text-primary-600 dark:text-primary-400" />
              </div>
              <div className="chat-bubble-ai !px-1"><Typing /></div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Suggestions */}
        <div className="px-3 py-2 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {['Income cert?','Caste cert?','Birth cert?','Pension?'].map(s => (
              <button
                key={s}
                onClick={() => { setInput(s); }}
                className="flex-shrink-0 px-2.5 py-1 text-xs rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-800 hover:bg-primary-100 transition-colors"
              >{s}</button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="bg-white dark:bg-slate-800 px-3 pb-3">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 px-3 py-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder={t(lang, 'type_message')}
              className="flex-1 bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none"
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="w-7 h-7 rounded-lg bg-primary-600 disabled:bg-primary-300 flex items-center justify-center transition-colors hover:bg-primary-700"
            >
              <Send size={13} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
