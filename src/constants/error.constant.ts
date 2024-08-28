export const enum ERROR_MESSAGES {
  // User-related errors
  USER_NOT_FOUND = "User not found",
  USER_ALREADY_EXIST = "User already exists",
  USERNAME_ALREADY_EXIST = "Username already exists",
  PROVIDE_USERID = "Please provide UserId",
  INVALID_PASSWORD = "Invalid password",
  INVALID_OLD_PASSWORD = "Invalid old password",
  PASSWORD_NOT_MATCH = "Passwords do not match",
  EXIST_USER_PASSWORD_NOT_MATCH = "User exist and Passwords do not match",
  INVALID_EMAIL = "Invalid email",
  NOT_VALID_PASSWORD = "Password must contain at least 8 characters, including one number, one uppercase and one lowercase letter.",
  VERIFY_EMAIL = "Check mail, Credentials sent successfully",
  EMAIL_FAILED = "Email Failed",

  // Token-related errors
  TOKEN_NOT_FOUND = "Token not found",
  INVALID_TOKEN = "Invalid token",

  // Access-related errors
  ACCESS_DENIED = "Access denied",

  // Photo-related errors
  PHOTO_NOT_FOUND = "Photo not found",
  SEND_PHOTO = "Please send the photo with key 'photo'",

  // ID-related errors
  ID_NOT_FOUND = "ID not found",

  // Address-related errors
  ADDRESS_NOT_EXIST = "Address does not exist",

  // Category-related errors
  CATEGORY_NOT_EXIST = "Category does not exist",

  // Product-related errors
  PRODUCT_NOT_EXIST = "Product does not exist",

  // Cart-related errors
  CART_NOT_FOUND = "Cart not found",
  CART_CLEARED = "Cart was cleared or product not found",
}
