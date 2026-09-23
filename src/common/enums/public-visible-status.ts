import { LaborOrderStatus } from './labor-order-status.enum';

/**
 * Only labor orders in these statuses (and with is_public = true) are ever
 * exposed on the public job website - see spec item 20.
 */
export const PUBLIC_VISIBLE_LABOR_ORDER_STATUSES: LaborOrderStatus[] = [
  LaborOrderStatus.RECRUITING,
  LaborOrderStatus.PARTIALLY_FILLED,
];
