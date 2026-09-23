export enum LaborOrderStatus {
  DRAFT = 'DRAFT',
  CONFIRMED = 'CONFIRMED',
  RECRUITING = 'RECRUITING',
  PARTIALLY_FILLED = 'PARTIALLY_FILLED',
  FULFILLED = 'FULFILLED',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
  CLOSED = 'CLOSED',
}

/**
 * Allowed manual transitions. FULFILLED / PARTIALLY_FILLED are also
 * derived automatically from labor_order_workers counts, but admin can
 * still force CLOSE / CANCEL / PAUSE / RESUME within these rules.
 */
export const LABOR_ORDER_TRANSITIONS: Record<LaborOrderStatus, LaborOrderStatus[]> = {
  [LaborOrderStatus.DRAFT]: [LaborOrderStatus.CONFIRMED, LaborOrderStatus.CANCELLED],
  [LaborOrderStatus.CONFIRMED]: [LaborOrderStatus.RECRUITING, LaborOrderStatus.CANCELLED],
  [LaborOrderStatus.RECRUITING]: [
    LaborOrderStatus.PAUSED,
    LaborOrderStatus.PARTIALLY_FILLED,
    LaborOrderStatus.FULFILLED,
    LaborOrderStatus.CANCELLED,
    LaborOrderStatus.CLOSED,
  ],
  [LaborOrderStatus.PARTIALLY_FILLED]: [
    LaborOrderStatus.RECRUITING,
    LaborOrderStatus.PAUSED,
    LaborOrderStatus.FULFILLED,
    LaborOrderStatus.CANCELLED,
    LaborOrderStatus.CLOSED,
  ],
  [LaborOrderStatus.FULFILLED]: [LaborOrderStatus.CLOSED, LaborOrderStatus.RECRUITING],
  [LaborOrderStatus.PAUSED]: [LaborOrderStatus.RECRUITING, LaborOrderStatus.CANCELLED],
  [LaborOrderStatus.CANCELLED]: [],
  [LaborOrderStatus.CLOSED]: [],
};
