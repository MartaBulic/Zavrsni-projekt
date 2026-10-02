// Zajedničke formule za sve marketinške metrike koje se koriste po aplikaciji.
// Svaka funkcija prima objekt kampanje (ili prazan objekt) i vraća string s 2 decimale.

export function calculateCTR(campaign) {
  if (!campaign?.impressions) return 0
  return ((campaign.clicks / campaign.impressions) * 100).toFixed(2)
}

export function calculateROI(campaign) {
  if (!campaign?.budget) return 0
  return (((campaign.revenue - campaign.budget) / campaign.budget) * 100).toFixed(2)
}

export function calculateCPC(campaign) {
  if (!campaign?.clicks) return 0
  return (campaign.budget / campaign.clicks).toFixed(2)
}

export function calculateCPA(campaign) {
  if (!campaign?.conversions) return 0
  return (campaign.budget / campaign.conversions).toFixed(2)
}

export function calculateConversionRate(campaign) {
  if (!campaign?.clicks) return 0
  return ((campaign.conversions / campaign.clicks) * 100).toFixed(2)
}

export function formatCurrency(value) {
  return Number(value || 0).toLocaleString('hr-HR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}
