/**
 * The design prints whole-dollar fees as "$49" and rates as "$39.95".
 * Prices are stored as numbers in Sanity so they stay editable and sortable.
 */
export function money(amount: number): string {
  return amount % 1 === 0 ? `$${amount}` : `$${amount.toFixed(2)}`
}
