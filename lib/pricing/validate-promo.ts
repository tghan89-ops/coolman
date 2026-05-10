import { getPayload } from 'payload'
import config from '@payload-config'

export type PromoValidationResult =
  | { valid: true; promo_discount_pct: number; promoId: string }
  | { valid: false; reason: 'not_found' | 'inactive' | 'not_yet_active' | 'expired' | 'usage_cap_reached' }

/**
 * Validates a promo code against the live DB.
 * Must be called server-side. Client-supplied discount values are ignored.
 */
export async function validatePromoCode(
  code: string,
): Promise<PromoValidationResult> {
  const payload = await getPayload({ config })
  const now = new Date()

  const result = await payload.find({
    collection: 'promoCodes',
    where: { code: { equals: code.trim().toUpperCase() } },
    limit: 1,
  })

  if (!result.docs.length) return { valid: false, reason: 'not_found' }

  const promo = result.docs[0]

  if (!promo.active) return { valid: false, reason: 'inactive' }
  if (new Date(promo.valid_from as string) > now) return { valid: false, reason: 'not_yet_active' }
  if (new Date(promo.valid_until as string) < now) return { valid: false, reason: 'expired' }
  if ((promo.usage_count as number) >= (promo.usage_cap as number)) return { valid: false, reason: 'usage_cap_reached' }

  return {
    valid: true,
    promo_discount_pct: promo.promo_discount_pct as number,
    promoId: promo.id as unknown as string,
  }
}
