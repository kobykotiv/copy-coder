'use server'

import { getEnhancedPrompt } from '@/lib/mediator'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function generatePromptAction(base64Image: string, applicationType: string, temperature: number = 0.2) {
  try {
    // Save the base64 image to a temporary file
    const imageBuffer = Buffer.from(base64Image.split(',')[1], 'base64')
    const tempImagePath = join('/tmp', `${uuidv4()}.png`)
    await writeFile(tempImagePath, imageBuffer)

    // Generate prompt from the image using the mediator
    const stream = await getEnhancedPrompt(tempImagePath, applicationType, temperature)
    return stream

  } catch (error) {
    console.error('Error in generatePromptAction:', error)
    throw error
  }
}
