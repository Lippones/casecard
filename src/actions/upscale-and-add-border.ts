import sharp from 'sharp'

export async function upscaleAndAddBorder(
  inputImagePath: Buffer
) {
  const borderSize = 37
  const width = 1011
  const height = 638

  const file = await sharp(inputImagePath)
    .resize({
      width: width - 2 * borderSize,
      height: height - 2 * borderSize,
      fit: 'inside',
    })
    .extend({
      top: borderSize,
      bottom: borderSize,
      left: borderSize,
      right: borderSize,
      background: { r: 255, g: 255, b: 255 },
    })
    .png({ quality: 100 })
    .toBuffer()

  return file
}
