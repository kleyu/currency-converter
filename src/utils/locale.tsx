export function getLocaleOptions(currency: string) {
  return {
    maximumFractionDigits: 2,
    currency,
    style: 'currency',
    currencyDisplay: 'narrowSymbol',
  };
}
