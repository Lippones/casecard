export function convertBufferToJson(buffer: Buffer) {
  const jsonString = buffer.toString()

  console.log(jsonString)

  const json = JSON.parse(jsonString)

  return json
}
