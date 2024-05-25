export async function validateImageFile(file: File): Promise<boolean> {
  const acceptedTypes = ['image/jpeg', 'image/png']
  const MB_BYTES = 1 * 1024 * 1024 // 1MB in bytes

  if (file.size > MB_BYTES || !acceptedTypes.includes(file.type)) {
    return false
  }

  // Read the first few bytes of the file to check the magic number
  const fileSlice = file.slice(0, 4)
  const arrayBuffer = await fileSlice.arrayBuffer()
  const uint8Array = new Uint8Array(arrayBuffer)

  // JPEG files start with [0xFF, 0xD8, 0xFF]
  const jpegMagicNumber = [0xff, 0xd8, 0xff]
  // PNG files start with [0x89, 0x50, 0x4E, 0x47]
  const pngMagicNumber = [0x89, 0x50, 0x4e, 0x47]

  const isJpeg = jpegMagicNumber.every(
    (byte, index) => byte === uint8Array[index],
  )
  const isPng = pngMagicNumber.every(
    (byte, index) => byte === uint8Array[index],
  )

  return isJpeg || isPng
}
