// Currency utility functions for Malaysian Ringgit (RM)

/**
 * Format price in Malaysian Ringgit (RM)
 * @param price - Price in RM
 * @param showCurrency - Whether to show currency symbol
 * @returns Formatted price string
 */
export function formatPrice(price: number, showCurrency: boolean = true): string {
  const formatted = new Intl.NumberFormat('ms-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
  
  return showCurrency ? `RM ${formatted}` : formatted;
}

/**
 * Convert USD to RM (Malaysian Ringgit)
 * Using approximate exchange rate: 1 USD = 4.70 RM
 * @param usdPrice - Price in USD
 * @returns Price in RM
 */
export function convertUSDToRM(usdPrice: number): number {
  const exchangeRate = 4.70; // 1 USD = 4.70 RM (approximate)
  return Math.round(usdPrice * exchangeRate * 100) / 100; // Round to 2 decimal places
}

/**
 * Format USD price to RM
 * @param usdPrice - Price in USD
 * @param showCurrency - Whether to show currency symbol
 * @returns Formatted RM price string
 */
export function formatUSDToRM(usdPrice: number, showCurrency: boolean = true): string {
  const rmPrice = convertUSDToRM(usdPrice);
  return formatPrice(rmPrice, showCurrency);
}

/**
 * Parse price string and return number
 * @param priceString - Price string (e.g., "RM 150.00" or "150.00")
 * @returns Price as number
 */
export function parsePrice(priceString: string): number {
  const cleanPrice = priceString.replace(/[^0-9.]/g, '');
  return parseFloat(cleanPrice) || 0;
}

/**
 * Calculate total with tax (6% SST in Malaysia)
 * @param subtotal - Subtotal amount
 * @param taxRate - Tax rate (default 0.06 for 6% SST)
 * @returns Object with subtotal, tax, and total
 */
export function calculateTotal(subtotal: number, taxRate: number = 0.06) {
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
  
  return {
    subtotal,
    tax,
    total,
    formattedSubtotal: formatPrice(subtotal),
    formattedTax: formatPrice(tax),
    formattedTotal: formatPrice(total),
  };
}

/**
 * Format discount amount
 * @param discount - Discount amount or percentage
 * @param isPercentage - Whether the discount is a percentage
 * @returns Formatted discount string
 */
export function formatDiscount(discount: number, isPercentage: boolean = false): string {
  if (isPercentage) {
    return `${discount}%`;
  }
  return formatPrice(discount);
}

/**
 * Calculate discounted price
 * @param originalPrice - Original price
 * @param discount - Discount amount or percentage
 * @param isPercentage - Whether the discount is a percentage
 * @returns Discounted price
 */
export function calculateDiscountedPrice(
  originalPrice: number,
  discount: number,
  isPercentage: boolean = false
): number {
  if (isPercentage) {
    const discountAmount = (originalPrice * discount) / 100;
    return Math.round((originalPrice - discountAmount) * 100) / 100;
  }
  return Math.round((originalPrice - discount) * 100) / 100;
}