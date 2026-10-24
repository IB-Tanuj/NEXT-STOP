import supabase from "../config/supabase"

export const getAccessToken = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token || null
}

export const authFetch = async (input, options = {}) => {
  const token = await getAccessToken()
  const headers = new Headers(options.headers || {})

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  return fetch(input, { ...options, headers })
}
