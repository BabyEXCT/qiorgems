/**
 * Utility functions for currency formatting
 */

/**
 * Format amount to Malaysian Ringgit (RM) currency
 * @param amount - The amount to format
 * @param showSymbol - Whether to show the RM symbol (default: true)
 * @returns Formatted currency string
 */
export function formatRM(amount: number, showSymbol: boolean = true): string {
  const formatted = new Intl.NumberFormat('ms-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
  
  return showSymbol ? `RM ${formatted}` : formatted
}

/**
 * Format amount to Malaysian Ringgit with compact notation for large numbers
 * @param amount - The amount to format
 * @param showSymbol - Whether to show the RM symbol (default: true)
 * @returns Formatted currency string with compact notation (e.g., RM 1.2K, RM 1.5M)
 */
export function formatRMCompact(amount: number, showSymbol: boolean = true): string {
  const formatted = new Intl.NumberFormat('ms-MY', {
    notation: 'compact',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(amount)
  
  return showSymbol ? `RM ${formatted}` : formatted
}

/**
 * Parse RM currency string to number
 * @param rmString - The RM currency string to parse
 * @returns Parsed number or 0 if invalid
 */
export function parseRM(rmString: string): number {
  // Remove RM symbol and any whitespace
  const cleanString = rmString.replace(/RM\s?/g, '').replace(/,/g, '')
  const parsed = parseFloat(cleanString)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Convert USD to RM (approximate conversion rate)
 * @param usdAmount - Amount in USD
 * @param exchangeRate - Exchange rate (default: 4.7, approximate rate)
 * @returns Amount in RM
 */
export function convertUSDToRM(usdAmount: number, exchangeRate: number = 4.7): number {
  return usdAmount * exchangeRate
}

/**
 * Convert RM to USD (approximate conversion rate)
 * @param rmAmount - Amount in RM
 * @param exchangeRate - Exchange rate (default: 4.7, approximate rate)
 * @returns Amount in USD
 */
export function convertRMToUSD(rmAmount: number, exchangeRate: number = 4.7): number {
  return rmAmount / exchangeRate
}