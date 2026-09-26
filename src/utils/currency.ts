import { db } from '../services/db';

/**
 * Format a number into the studio's configured currency (defaults to NPR, symbol 'Rs.')
 */
export const formatCurrency = (amount: number | undefined | null, customSymbol?: string): string => {
  const numericAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  const config = db.getSnapshot().config;
  const symbol = customSymbol ?? config.currencySymbol ?? 'Rs.';

  // Format with clean thousands separators (e.g., 50,000 or 1,20,000)
  return `${symbol} ${numericAmount.toLocaleString('en-IN')}`;
};

export const getCurrencySymbol = (): string => {
  return db.getSnapshot().config.currencySymbol || 'Rs.';
};

export const getCurrencyCode = (): string => {
  return db.getSnapshot().config.currency || 'NPR';
};
