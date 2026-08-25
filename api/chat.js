export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { message, imageBase64, imageMimeType } = req.body

  if (!message && !imageBase64) {
    return res.status(400).json({ error: 'Message or image is required' })
  }

  try {
    const parts = []

    if (message) {
      parts.push({ text: message })
    }

    if (imageBase64) {
      parts.push({
        inline_data: {
          mime_type: imageMimeType,
          data: imageBase64
        }
      })
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }]
        })
      }
    )

    const data = await response.json()

    if (data.error) {
      return res.status(500).json({ error: data.error.message })
    }

    const reply = data.candidates[0].content.parts[0].text
    return res.status(200).json({ reply })

  } catch (error) {
    return res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}