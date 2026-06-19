export interface EtaParams {
  partiesAhead: number;
  avgServiceRate: number;
  avgTableCapacity: number;
  partySize: number;
  avgTableSize?: number;
}

const DEFAULT_AVG_TABLE_SIZE = 4;

export function calculateEta(params: EtaParams): number {
  const {
    partiesAhead,
    avgServiceRate,
    avgTableCapacity,
    partySize,
    avgTableSize = DEFAULT_AVG_TABLE_SIZE,
  } = params;

  if(partiesAhead <= 0) return 0;
  if(avgServiceRate <= 0 || avgTableCapacity <= 0 || partySize <= 0 || avgTableSize <= 0){
    return 0;
  }

  const tablesNeeded = Math.ceil(partySize / avgTableSize);
  const etaMinutes = ((partiesAhead * avgServiceRate) / avgTableCapacity) * tablesNeeded;

  return Math.round(etaMinutes);
 }

