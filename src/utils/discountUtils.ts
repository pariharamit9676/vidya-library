export interface MultiMonthDiscount {
  id: string;
  months: number;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  label?: string;
  isActive: boolean;
}

export const DEFAULT_DISCOUNTS: MultiMonthDiscount[] = [
  {
    id: 'disc_3',
    months: 3,
    discountType: 'percentage',
    discountValue: 5,
    label: '3 Months Advance (5% OFF)',
    isActive: true
  },
  {
    id: 'disc_6',
    months: 6,
    discountType: 'percentage',
    discountValue: 10,
    label: '6 Months Advance (10% OFF)',
    isActive: true
  },
  {
    id: 'disc_12',
    months: 12,
    discountType: 'percentage',
    discountValue: 15,
    label: '12 Months Advance (15% OFF)',
    isActive: true
  }
];

export interface DiscountCalculationResult {
  discountItem: MultiMonthDiscount | null;
  discountAmount: number;
  finalTotal: number;
  originalTotal: number;
  hasDiscount: boolean;
  savingsText: string;
}

/**
 * Calculates fee with applicable multi-month discount
 * @param months Number of months paying in advance
 * @param monthlyRate Rate per month for the chosen seat/shift
 * @param discounts List of configured discounts from settings
 */
export const calculateMultiMonthFee = (
  months: number,
  monthlyRate: number,
  discounts: MultiMonthDiscount[] = DEFAULT_DISCOUNTS
): DiscountCalculationResult => {
  const safeMonths = Math.max(1, Number(months) || 1);
  const safeRate = Math.max(0, Number(monthlyRate) || 0);
  const originalTotal = safeMonths * safeRate;

  const activeDiscounts = Array.isArray(discounts) && discounts.length > 0 ? discounts : DEFAULT_DISCOUNTS;
  const match = activeDiscounts.find(
    (d) => Number(d.months) === safeMonths && d.isActive !== false
  );

  if (!match || Number(match.discountValue) <= 0) {
    return {
      discountItem: null,
      discountAmount: 0,
      finalTotal: originalTotal,
      originalTotal,
      hasDiscount: false,
      savingsText: ''
    };
  }

  let discountAmount = 0;
  if (match.discountType === 'percentage') {
    discountAmount = Math.round((originalTotal * Number(match.discountValue)) / 100);
  } else {
    // flat amount
    discountAmount = Math.round(Number(match.discountValue));
  }

  // Cap discount at original total
  discountAmount = Math.min(discountAmount, originalTotal);
  const finalTotal = Math.max(0, originalTotal - discountAmount);

  const savingsText =
    match.discountType === 'percentage'
      ? `${match.discountValue}% OFF (Save ₹${discountAmount.toLocaleString('en-IN')})`
      : `₹${discountAmount.toLocaleString('en-IN')} OFF`;

  return {
    discountItem: match,
    discountAmount,
    finalTotal,
    originalTotal,
    hasDiscount: discountAmount > 0,
    savingsText
  };
};
