export type Language = 'bn' | 'en';

export type FarmMode = 'broiler' | 'layer';

export type BirdBreed = 'Broiler' | 'Layer' | 'Sonali' | 'Deshi' | 'Cock' | 'Turkey';

export interface WeightLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  dayNumber: number;
  avgWeightKg: number;
  feedBags?: number;
  targetWeightKg?: number;
  notes?: string;
}

export interface Batch {
  id: string;
  batchNumber: string;
  breed: BirdBreed;
  startDate: string; // YYYY-MM-DD
  initialBirds: number;
  currentBirds: number;
  deadBirds: number;
  chickPricePerUnit: number;
  shedNumber?: string;
  status: 'active' | 'completed';
  notes?: string;
  endDate?: string;
  targetWeightKg?: number;
  currentAvgWeightKg?: number;
  totalFeedBagsConsumed?: number;
  weightHistory?: WeightLogEntry[];
}

export interface ExpenseRecord {
  id: string;
  batchId: string;
  date: string;
  category: 'feed' | 'medicine' | 'chicks' | 'litter' | 'electricity' | 'gas_heat' | 'labor' | 'transport' | 'other';
  title: string;
  amount: number;
  quantity?: number;
  unit?: string;
  dealerId?: string;
  paymentType: 'cash' | 'due';
  notes?: string;
}

export interface ChickenSaleRecord {
  id: string;
  batchId: string;
  date: string;
  buyerId?: string;
  buyerName: string;
  buyerPhone?: string;
  birdCount: number;
  totalWeightKg: number;
  ratePerKg: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  vehicleNo?: string;
  notes?: string;
}

export interface EggStockEntry {
  id: string;
  date: string;
  batchId?: string;
  morningEggs: number;
  eveningEggs: number;
  brokenEggs: number;
  netGoodEggs: number;
  notes?: string;
}

export interface EggSaleRecord {
  id: string;
  date: string;
  buyerId?: string;
  buyerName: string;
  saleType: 'piece' | 'crate'; // 1 crate = 30 eggs
  quantity: number;
  totalEggs: number;
  rate: number; // rate per piece or rate per crate
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  notes?: string;
}

export interface OtherRevenueRecord {
  id: string;
  batchId?: string;
  date: string;
  source: 'manure' | 'feed_sacks' | 'equipment_rent' | 'subsidy' | 'other';
  title: string;
  amount: number;
  buyerName?: string;
  notes?: string;
}

export interface DeadBirdRecord {
  id: string;
  batchId: string;
  date: string;
  count: number;
  cause: 'heat_stroke' | 'gumboro' | 'coccidiosis' | 'respiratory' | 'accident' | 'unknown' | 'other';
  notes?: string;
}

export interface Dealer {
  id: string;
  name: string;
  companyName: string;
  phone: string;
  address: string;
  suppliedItems: string; // e.g. "Feed, Medicine, Day Old Chicks"
  totalBill: number;
  paidAmount: number;
  dueAmount: number;
}

export interface Buyer {
  id: string;
  name: string;
  type: 'chicken' | 'egg' | 'both';
  phone: string;
  address: string;
  totalPurchase: number;
  paidAmount: number;
  dueAmount: number;
}

export interface VaccineScheduleItem {
  id: string;
  dayNumber: number;
  vaccineName: string;
  disease: string;
  route: 'Eye Drop' | 'Drinking Water' | 'Subcutaneous Injection' | 'Wing Web' | 'Spray';
  breedSuitability: ('Broiler' | 'Layer' | 'Sonali')[];
  isCompleted?: boolean;
  appliedDate?: string;
  notes?: string;
}

export interface FarmSettings {
  farmName: string;
  ownerName: string;
  phone: string;
  address: string;
  subscriptionDaysLeft: number;
  subscriptionExpiryDate: string;
  language: Language;
}
