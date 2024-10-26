export function formatCurrency(amount: number, locale: string = 'de-DE', currency: string = 'EUR'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
}

export function parseAmount(value: string): number {
  // Remove currency symbols and spaces
  const cleaned = value.replace(/[^0-9.,]/g, '');
  // Convert German number format (1.234,56) to standard format (1234.56)
  const standardFormat = cleaned.replace(/\.(?=.*,)/g, '').replace(',', '.');
  return parseFloat(standardFormat);
}
