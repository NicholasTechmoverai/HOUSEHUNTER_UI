
const { get } = useApi()
const endpoint = useEndpoints()

// ---------------- Load Genders ----------------
export const load_genders = async () => {
  try {
    const res = await get(endpoint.utilities.genders)
    if (res.success) {
      return res
    } else {
      console.warn("Failed to load genders", res)
      return res
    }
  } catch (err) {
    console.error("Error loading genders:", err)
    return { success: false, message: err.message, data: [] }
  }
}

// ---------------- Load Countries ----------------
export const load_country_codes = async () => {
  try {
    const res = await get(endpoint.utilities.countries)
    if (res.success) {
      return res
    } else {
      console.warn("Failed to load countries", res)
      return res
    }
  } catch (err) {
    console.error("Error loading countries:", err)
    return { success: false, message: err.message, data: [] }
  }
}

// ---------------- Load Currencies ----------------
export const load_currencies = async () => {
  try {
    const res = await get(endpoint.utilities.currencies)
    if (res.success) {
      return res
    } else {
      console.warn("Failed to load currencies", res)
      return res
    }
  } catch (err) {
    console.error("Error loading currencies:", err)
    return { success: false, message: err.message, data: [] }
  }
}

