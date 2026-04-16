/**
 * chatController.js
 * Uses OpenAI if OPENAI_API_KEY is set; otherwise returns rich mock responses.
 */

// ── Mock knowledge base ───────────────────────────────────────
const KNOWLEDGE = {
  'income certificate': `**Income Certificate — Step-by-Step Guide**

1. 📋 **Gather documents**: Aadhaar card, Ration card, Salary slips (last 3 months) or income affidavit, Bank passbook
2. 🌐 **Go to Services** → Select "Income Certificate"
3. 📝 **Fill the form**: Enter your full name, DOB, Aadhaar number, address and annual income
4. 📁 **Upload documents**: Scanned copies in PDF/JPG (max 2 MB each)
5. ✅ **Submit** and note your reference number
6. 📅 **Collect**: Certificate ready in 7–10 working days from your local Tahsildar office

**Fee**: ₹30 | **Validity**: 6 months`,

  'caste certificate': `**Caste Certificate — Step-by-Step Guide**

1. 📋 **Gather**: Aadhaar, Ration card, Parent's community certificate, School TC or Birth certificate
2. 🌐 **Go to Services** → Select "Caste Certificate"
3. 📝 **Fill**: Name, community, sub-caste, father's name and details
4. 📁 **Upload** parent's community certificate as primary proof
5. ✅ **Submit** application
6. 📅 **Ready in** 15–21 working days

**Fee**: ₹30 | **Issuing Authority**: Revenue Department`,

  'birth certificate': `**Birth Certificate — Step-by-Step Guide**

1. 📋 **Gather**: Hospital discharge summary, Parent Aadhaar cards, Marriage certificate, Address proof
2. 👶 **Go to Services** → Select "Birth Certificate"
3. 📝 **Enter**: Child's name, DOB, place of birth, parent names
4. 📁 **Upload** hospital records
5. ✅ **Submit** (within 21 days of birth it's free; after that ₹20)
6. 📅 **Ready in** 3–5 working days

**Tip**: Register within 21 days to avoid late fees`,

  'pension': `**Pension Scheme — Eligibility & Process**

**Types Available**:
- 👴 Old Age Pension (age 60+)
- 👩 Widow Pension
- ♿ Disability Pension

1. ✅ **Check eligibility** at your local welfare office
2. 📋 **Gather**: Age proof, BPL/income certificate, Bank passbook, Aadhaar
3. 🤝 **Go to Services** → Select appropriate pension scheme
4. 🏦 **Enter correct bank details** for DBT (direct benefit transfer)
5. ✅ **Submit** and await field officer verification

**Fee**: Free | **Processing**: 30–45 days`,

  'ration card': `**Ration Card — Application Guide**

**Card types**: APL (Above Poverty Line) | BPL (Below Poverty Line) | AAY (Antyodaya)

1. 📋 **Gather**: Aadhaar of all family members, Address proof, Income proof, Passport photos
2. 🌐 **Go to Services** → Select "Ration Card"
3. 👨‍👩‍👧 **Add all family members** with their Aadhaar numbers
4. 🏠 **Enter address** (must match Aadhaar)
5. 📁 **Upload** documents
6. ✅ **Submit** — card delivered to your address in 21–30 days

**Fee**: ₹50`,

  'scholarship': `**Scholarship Application — Guide**

**Eligible communities**: SC / ST / OBC / Minority students

1. ✅ **Eligibility**: Family income below ₹2.5 lakh/year
2. 📋 **Gather**: Community certificate, Income certificate, Last year marksheets, College admission proof, Bank passbook
3. 🎓 **Go to Services** → Select "Scholarship Application"
4. 📝 **Fill**: Academic details, institution name, course
5. 🏦 **Enter bank account** for scholarship disbursement
6. 📁 **Upload** all certificates
7. ✅ **Submit** — processed in 45–60 days

**Fee**: Free | **Amount**: Varies by course & community`,

  default: `👋 **Hello! I'm Smart Guide AI Assistant.**

I can help you with information on:
- 📜 Income Certificate
- 🏛️ Caste Certificate
- 👶 Birth Certificate
- 👴 Pension Schemes (Old Age / Widow / Disability)
- 🪪 Ration Card
- 🎓 Scholarships

Just ask me something like:
- *"How to apply for income certificate?"*
- *"What documents are needed for caste certificate?"*
- *"What is the fee for birth certificate?"*
- *"Am I eligible for old age pension?"*

I'm here 24/7 to guide you! 🙏`,
}

// ── Keyword matcher ───────────────────────────────────────────
const getMockResponse = (message) => {
  const m = message.toLowerCase()
  if (m.includes('income'))      return KNOWLEDGE['income certificate']
  if (m.includes('caste') || m.includes('community')) return KNOWLEDGE['caste certificate']
  if (m.includes('birth'))       return KNOWLEDGE['birth certificate']
  if (m.includes('pension') || m.includes('old age') || m.includes('widow')) return KNOWLEDGE['pension']
  if (m.includes('ration'))      return KNOWLEDGE['ration card']
  if (m.includes('scholarship') || m.includes('education') || m.includes('study')) return KNOWLEDGE['scholarship']
  return KNOWLEDGE.default
}

// ── OpenAI client (lazy init) ─────────────────────────────────
let openai = null
const getOpenAI = () => {
  if (openai) return openai
  if (!process.env.OPENAI_API_KEY) return null
  const { OpenAI } = require('openai')
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  return openai
}

// ── POST /api/chat ────────────────────────────────────────────
const sendMessage = async (req, res, next) => {
  try {
    const { message, history = [], lang = 'en' } = req.body

    if (!message || typeof message !== 'string' || message.trim().length === 0)
      return res.status(400).json({ success: false, message: 'Message is required' })

    const client = getOpenAI()

    // ── OpenAI path ───────────────────────────────────────────
    if (client) {
      const langInstructions = {
        ta: 'Reply in Tamil language. ',
        hi: 'Reply in Hindi language. ',
        en: '',
      }

      const systemPrompt = `${langInstructions[lang] || ''}You are Smart Guide AI, an expert assistant that helps Indian citizens apply for government services like income certificates, caste certificates, birth certificates, pension schemes, ration cards, and scholarships. 
Be concise, accurate, and supportive. Format responses with numbered steps when explaining processes. 
Always mention required documents, fees, and processing times when relevant. If the user asks something unrelated to government services, politely redirect them.`

      const messages = [
        { role: 'system', content: systemPrompt },
        ...history.slice(-8).map(m => ({
          role:    m.role === 'ai' ? 'assistant' : 'user',
          content: m.content || m.text || '',
        })),
        { role: 'user', content: message },
      ]

      const completion = await client.chat.completions.create({
        model:       'gpt-3.5-turbo',
        messages,
        max_tokens:  500,
        temperature: 0.5,
      })

      const reply = completion.choices[0]?.message?.content?.trim() || getMockResponse(message)
      return res.json({ success: true, reply, source: 'openai' })
    }

    // ── Mock fallback ─────────────────────────────────────────
    // Simulate network delay for realism
    await new Promise(r => setTimeout(r, 600 + Math.random() * 400))
    const reply = getMockResponse(message)
    res.json({ success: true, reply, source: 'mock' })

  } catch (err) {
    // If OpenAI call fails, fall back to mock
    if (err.status === 429 || err.code === 'insufficient_quota') {
      const reply = getMockResponse(req.body.message || '')
      return res.json({ success: true, reply, source: 'mock-fallback' })
    }
    next(err)
  }
}

module.exports = { sendMessage }
