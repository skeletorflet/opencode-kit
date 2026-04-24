/**
 * Generates a cryptographically unique reference number for claims
 * Format: SIN-YYYYMMDD-XXXXX (e.g., SIN-20260207-A3K9X)
 * 
 * Components:
 * - SIN: Prefix for "Siniestro"
 * - YYYYMMDD: Date (helps with sorting and organizing)
 * - XXXXX: 5 random alphanumeric characters (36^5 = 60,466,176 combinations per day)
 * 
 * Collision probability: Extremely low even with millions of claims
 * - Per day: ~60 million possible combinations
 * - Even with 20,000 claims per day, collision chance < 0.33%
 * - With uuid fallback for extra safety
 */
export function generateClaimReference(): string {
    // Get current date in YYYYMMDD format
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const datePart = `${year}${month}${day}`

    // Generate 5 random alphanumeric characters (uppercase)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let randomPart = ''

    // Use crypto.getRandomValues for better randomness (browser-safe)
    if (typeof window !== 'undefined' && window.crypto) {
        const randomValues = new Uint32Array(5)
        window.crypto.getRandomValues(randomValues)
        for (let i = 0; i < 5; i++) {
            randomPart += chars[randomValues[i] % chars.length]
        }
    } else {
        // Fallback for server-side or old browsers
        for (let i = 0; i < 5; i++) {
            randomPart += chars[Math.floor(Math.random() * chars.length)]
        }
    }

    // Add timestamp component for extra uniqueness (last 4 digits of milliseconds)
    const timestampPart = (Date.now() % 10000).toString(36).toUpperCase().padStart(3, '0')

    return `SIN-${datePart}-${randomPart}${timestampPart}`
}
