function generateRandomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function generateID(length = 12) {
  const timestamp = new Date().getTime().toString(36); // Get current timestamp and convert to base 36
  const randomString = generateRandomString(6); // Generate random string of length 6
  const roomID = (timestamp + randomString).substring(0, length); // Combine timestamp and random string and ensure length is 12
  return roomID;
}

export { generateID };
