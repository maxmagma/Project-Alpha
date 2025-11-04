import Replicate from 'replicate'

if (!process.env.REPLICATE_API_TOKEN) {
  console.warn('REPLICATE_API_TOKEN is not defined - AI visualizer will not work')
}

export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || 'dummy-token',
})

export async function generateVisualization({
  venueImageUrl,
  prompt,
  style,
}: {
  venueImageUrl: string
  prompt: string
  style?: string
}) {
  if (!process.env.REPLICATE_API_TOKEN) {
    console.log('AI generation would run with:', { venueImageUrl, prompt, style })
    return {
      output: 'https://via.placeholder.com/1024x1024?text=AI+Generated+Preview',
      error: null,
    }
  }

  try {
    // Using SDXL for image-to-image generation
    const output = await replicate.run(
      'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
      {
        input: {
          image: venueImageUrl,
          prompt: `${prompt}${style ? `, ${style} style` : ''}, wedding venue, elegant, high quality, professional photography`,
          negative_prompt: 'low quality, blurry, distorted, ugly, watermark',
          num_inference_steps: 30,
          guidance_scale: 7.5,
          prompt_strength: 0.8,
        },
      }
    )

    return {
      output: Array.isArray(output) ? output[0] : output,
      error: null,
    }
  } catch (error) {
    console.error('Replicate API error:', error)
    return {
      output: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export async function generateProductPlacement({
  venueImageUrl,
  products,
  style,
}: {
  venueImageUrl: string
  products: Array<{ name: string; category: string }>
  style: string
}) {
  const productDescriptions = products.map(p => `${p.name} (${p.category})`).join(', ')

  const prompt = `A beautifully styled wedding venue featuring: ${productDescriptions}.
    The scene should showcase these products in an elegant ${style} style arrangement.`

  return await generateVisualization({
    venueImageUrl,
    prompt,
    style,
  })
}
