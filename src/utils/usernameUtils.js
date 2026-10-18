export const containsUsernameWhitespace = (value) => /\s/u.test(value || "")

export const removeUsernameWhitespace = (value) => String(value || "").replace(/\s/gu, "")
