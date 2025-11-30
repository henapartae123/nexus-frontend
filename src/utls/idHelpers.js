export const getNumericId = (id) => {
  if (!id) return null;
  if (typeof id === "number") return id;

  const idStr = String(id);

  // Plain number
  if (/^\d+$/.test(idStr)) {
    return parseInt(idStr, 10);
  }

  // Contains colon
  if (idStr.includes(":")) {
    const parts = idStr.split(":");
    const numericPart = parts[parts.length - 1];
    if (/^\d+$/.test(numericPart)) {
      return parseInt(numericPart, 10);
    }
  }

  return null;
};
