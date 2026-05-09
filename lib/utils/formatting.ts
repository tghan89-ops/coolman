/**
 * Format a number as Malaysian Ringgit currency
 */
export function formatPrice(amount: number): string {
  return `RM ${amount.toFixed(2)}`
}

/**
 * Format a date string to a readable format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format a date string to include time
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-MY', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format hours as a readable duration
 */
export function formatHours(hours: number): string {
  if (hours < 1) {
    return '< 1 hour'
  }
  if (hours < 24) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`
  }
  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24
  if (remainingHours === 0) {
    return `${days} ${days === 1 ? 'day' : 'days'}`
  }
  return `${days}d ${remainingHours}h`
}

/**
 * Format a percentage for display (e.g., 0.10 -> "10%")
 */
export function formatPercentage(decimal: number): string {
  return `${Math.round(decimal * 100)}%`
}

/**
 * Format response time with urgency indicator
 */
export function formatResponseTime(hours: number | null): { text: string; isUrgent: boolean } {
  if (hours === null) {
    return { text: 'N/A', isUrgent: false }
  }
  return {
    text: formatHours(hours),
    isUrgent: hours > 24,
  }
}
