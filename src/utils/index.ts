export const shortCodeGenerator = () => {
  const charsNum = 6;
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let shortCode = "";

  for (let i = 0; i < charsNum; i++) {
    shortCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return shortCode;
};
