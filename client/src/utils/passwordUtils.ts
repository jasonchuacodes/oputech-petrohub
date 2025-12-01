export const generatePassword = (length = 8): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const allChars = uppercase + lowercase + digits;

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  const chars = [
    uppercase[array[0] % uppercase.length],
    lowercase[array[1] % lowercase.length],
    digits[array[2] % digits.length],
  ];

  for (let i = 4; i < length; i++) {
    chars.push(allChars[array[i] % allChars.length]);
  }

  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join('');
};
