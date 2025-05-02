export interface AvailablePairsParams {
  selectedAssetId: string
  selectedAssetType: 'crypto' | 'fiat'
  direction: 'from' | 'to'
}

export interface QuoteParams {
  fromAssetId: string
  fromAssetType: 'crypto' | 'fiat'
  toAssetId: string
  toAssetType: 'crypto' | 'fiat'
}

export interface RateInfo {
  fromAssetShortname: string
  fromAssetAmount: string
  toAssetShortname: string
  toAssetAmount: string
  timestamp: number
}

export interface QuoteResponse {
  rate: RateInfo
  minAmount: string
  maxAmount: string
}
