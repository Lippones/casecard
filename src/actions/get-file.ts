'use server'
import { env } from '@/env'
import { s3Client } from '@/lib/storage'
import { GetObjectCommand } from '@aws-sdk/client-s3'

export async function getFile(fileName: string) {
  const data = await s3Client.send(
    new GetObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: fileName,
    }),
  )

  const file = await data.Body?.transformToByteArray()

  return file
}
