'use server'
import { env } from '@/env'
import { s3Client } from '@/lib/storage'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { createSafeActionClient } from 'next-safe-action'
import { z } from 'zod'

export const getFile = createSafeActionClient()
  .schema(
    z.object({
      fileName: z.string(),
    }),
  )
  .action(async ({ parsedInput: { fileName } }) => {
    const data = await s3Client.send(
      new GetObjectCommand({
        Bucket: env.AWS_BUCKET_NAME,
        Key: fileName,
      }),
    )

    const fileBuffer = await data.Body?.transformToByteArray()

    if (!fileBuffer) {
      throw new Error('File not found or failed to load')
    }

    return fileBuffer
  })
