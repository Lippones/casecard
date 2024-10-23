'use server'
import { env } from '@/env'
import { s3Client } from '@/lib/storage'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { createSafeActionClient } from 'next-safe-action'
import { z } from 'zod'
import { getSignedUrl as s3SignedUrl } from '@aws-sdk/s3-request-presigner'

export const getSignedUrl = createSafeActionClient()
  .schema(
    z.object({
      fileName: z.string(),
    }),
  )
  .action(async ({ parsedInput: { fileName } }) => {
    const command = new GetObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: fileName,
    })

    const signedUrl = await s3SignedUrl(s3Client, command, {
      expiresIn: 60, // Tempo de expiração em segundos
    })

    return signedUrl
  })
