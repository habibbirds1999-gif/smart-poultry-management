import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  Batch,
  ExpenseRecord,
  ChickenSaleRecord,
  EggStockEntry,
  EggSaleRecord,
  OtherRevenueRecord,
  DeadBirdRecord,
  Dealer,
  Buyer,
  VaccineScheduleItem,
  FarmSettings,
  FarmMode,
} from '../types';

export interface FullFarmData {
  userId: string;
  settings: FarmSettings;
  batches: Batch[];
  expenses: ExpenseRecord[];
  chickenSales: ChickenSaleRecord[];
  eggStock: EggStockEntry[];
  eggSales: EggSaleRecord[];
  otherRevenues: OtherRevenueRecord[];
  deadBirds: DeadBirdRecord[];
  dealers: Dealer[];
  buyers: Buyer[];
  vaccines: VaccineScheduleItem[];
  farmMode: FarmMode;
  lastSyncedAt: string;
}

/**
 * Subscribe to cloud farm data for a specific authenticated user.
 * Provides real-time synchronization across multiple mobile devices.
 */
export function subscribeToFarmData(
  userId: string,
  onData: (data: FullFarmData | null) => void,
  onError?: (err: Error) => void
) {
  const docPath = `farms/${userId}`;
  const farmDocRef = doc(db, 'farms', userId);

  const unsubscribe = onSnapshot(
    farmDocRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as FullFarmData;
        onData(data);
      } else {
        onData(null);
      }
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, docPath);
      } catch (e) {
        if (onError) onError(e as Error);
      }
    }
  );

  return unsubscribe;
}

/**
 * Save complete or incremental farm data to Cloud Firestore.
 */
export async function saveFarmDataToCloud(
  userId: string,
  data: Partial<FullFarmData>
): Promise<void> {
  const docPath = `farms/${userId}`;
  try {
    const farmDocRef = doc(db, 'farms', userId);
    const payload = {
      ...data,
      userId,
      lastSyncedAt: new Date().toISOString(),
    };
    await setDoc(farmDocRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

/**
 * Check if the user already has cloud data
 */
export async function getExistingCloudData(userId: string): Promise<FullFarmData | null> {
  const docPath = `farms/${userId}`;
  try {
    const farmDocRef = doc(db, 'farms', userId);
    const snap = await getDoc(farmDocRef);
    if (snap.exists()) {
      return snap.data() as FullFarmData;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, docPath);
    return null;
  }
}
