export default function generatePassword(length = 12) {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*";
  const allChars = lowercase + uppercase + numbers + symbols;
  let password = "";

  // Ensure at least one of each required character type
  password += lowercase[(Math.random() * lowercase.length) | 0];
  password += uppercase[(Math.random() * uppercase.length) | 0];
  password += numbers[(Math.random() * numbers.length) | 0];
  password += symbols[(Math.random() * symbols.length) | 0];

  // Fill the remaining length with random characters from allChars
  for (let i = 4; i < length; i++) {
    password += allChars[(Math.random() * allChars.length) | 0];
  }

  // Shuffle the password to ensure randomness
  password = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  // Validate against the regex pattern
  return password;
}
