'use server'
import { env } from '@/env'
import { s3Client } from '@/lib/storage'
import { PutObjectCommand } from '@aws-sdk/client-s3'

export async function uploadFile(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer())

  const fileName = `card_image_${new Date().getTime()}`

  const command = new PutObjectCommand({
    Bucket: env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: file.type,
  })

  await s3Client.send(command)

  const encodedFilename = encodeURIComponent(fileName)
  const url = `https://${env.AWS_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${encodedFilename}`

  return {
    url,
    accessKey: fileName,
  }
}
