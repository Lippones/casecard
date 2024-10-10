import { randomUUID } from 'node:crypto'
import { type NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { env } from '@/env'
import { s3Client } from '@/lib/storage'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const uploadId = randomUUID()

    if (!file) {
      return NextResponse.json({
        error: 'No file uploaded',
      })
    }
    if (!(file instanceof File)) {
      return NextResponse.json({
        error: 'Invalid file',
      })
    }

    const { url } = await uploadFile(file, `${file.name}_${uploadId}`)

    return NextResponse.json({
      url,
    })
  } catch (e) {
    return NextResponse.json({
      error: 'Error uploading file',
    })
  }
}

async function uploadFile(file: File, filename: string) {
  const buffer = Buffer.from(await file.arrayBuffer())

  const command = new PutObjectCommand({
    Bucket: env.AWS_BUCKET_NAME,
    Key: filename,
    Body: buffer,
    ContentType: file.type,
  })

  await s3Client.send(command)

  const encodedFilename = encodeURIComponent(filename)
  const url = `https://${env.AWS_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${encodedFilename}`

  return {
    url,
  }
}