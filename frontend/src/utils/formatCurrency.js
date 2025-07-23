// Utility to format a number as INR currency
export function formatCurrency(amount) {
  if (typeof amount !== 'number') {
    amount = Number(amount);
  }
  if (isNaN(amount)) return '';
  return amount.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  });
}
