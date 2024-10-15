// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function convertJsonToBuffer(json: any) {
  const jsonString = JSON.stringify(json)

  const buffer = Buffer.from(jsonString)

  return buffer
}
