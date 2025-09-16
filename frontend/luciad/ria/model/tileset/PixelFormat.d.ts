/**
 * An enumeration to describe the pixel type of an image. It represents how the data is structured.
 * @since 2019.1
 */
export declare enum PixelFormat {
  /**
   * Indicates that the image is a 3-band image in 24-bit RGB format.
   */
  RGB_888 = "RGB_888",
  /**
   * Indicates that the image is a 4-byte RGBA image with transparency.
   */
  RGBA_8888 = "RGBA_8888",
  /**
   * Indicates that the image is a single-band image consisting of 16-bit unsigned short data.
   */
  USHORT = "USHORT",
  /**
   * Indicates that the image is a single-band image consisting of 32-bit unsigned int data.
   */
  UINT_32 = "UINT_32",
  /**
   * Indicates that the image is a single-band image consisting of 32-bit float data.
   */
  FLOAT_32 = "FLOAT_32",
}