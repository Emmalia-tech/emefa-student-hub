export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { message, imageBase64, imageMimeType } = req.body

  if (!message && !imageBase64) {
    return res.status(400).json({ error: 'Message or image is required' })
  }

  const parts = []
  if (message) parts.push({ text: message })
  if (imageBase64) {
    parts.push({
      inline_data: {
        mime_type: imageMimeType,
        data: imageBase64
      }
    })
  }

  const callGemini = async () => {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts }] })
      }
    )
    return response.json()
  }

  try {
    let data = await callGemini()

    const isOverloaded = data.error && (
      data.error.message?.toLowerCase().includes('overloaded') ||
      data.error.message?.toLowerCase().includes('high demand') ||
      data.error.code === 503
    )

    if (isOverloaded) {
      await new Promise(resolve => setTimeout(resolve, 1500))
      data = await callGemini()
    }

    if (data.error) {
      const friendlyMessage = data.error.message?.toLowerCase().includes('overloaded') ||
        data.error.message?.toLowerCase().includes('high demand')
        ? 'The AI is quite busy right now. Please try sending your message again in a moment.'
        : data.error.message

      return res.status(500).json({ error: friendlyMessage })
    }

    const reply = data.candidates[0].content.parts[0].text
    return res.status(200).json({ reply })

  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}