import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { Header } from './components/Header';
import { TopBanner } from './components/TopBanner';
import { DashboardGrid, ModuleKey } from './components/DashboardGrid';
import { DrawerMenu } from './components/DrawerMenu';
import { FarmOverviewWidget } from './components/FarmOverviewWidget';
import { BottomNavBar } from './components/BottomNavBar';
import { SmartPoultryLogo } from './components/SmartPoultryLogo';
import { AuthPage } from './components/auth/AuthPage';
import { useAuth } from './context/AuthContext';
import { subscribeToFarmData, saveFarmDataToCloud } from './services/farmSyncService';

// Modals
import { ActiveBatchModal } from './components/modals/ActiveBatchModal';
import { BatchExpenseModal } from './components/modals/BatchExpenseModal';
import { ChickenSalesModal } from './components/modals/ChickenSalesModal';
import { EggStockModal } from './components/modals/EggStockModal';
import { EggSalesModal } from './components/modals/EggSalesModal';
import { OtherRevenueModal } from './components/modals/OtherRevenueModal';
import { DeadBirdsModal } from './components/modals/DeadBirdsModal';
import { DealerModal } from './components/modals/DealerModal';
import { BuyerModal } from './components/modals/BuyerModal';
import { VaccineModal } from './components/modals/VaccineModal';
import { OldBatchModal } from './components/modals/OldBatchModal';
import { HowToRenewModal } from './components/modals/HowToRenewModal';
import { RenewModal } from './components/modals/RenewModal';
import { ReportsModal } from './components/modals/ReportsModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { WebsiteModal } from './components/modals/WebsiteModal';
import { QuickAddModal } from './components/modals/QuickAddModal';
import { NotificationModal } from './components/modals/NotificationModal';

// Types & Data
import {
  Batch,
  WeightLogEntry,
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
  Language,
  FarmMode,
} from './types';
import {
  initialFarmSettings,
  initialBatches,
  initialExpenses,
  initialChickenSales,
  initialEggStock,
  initialEggSales,
  initialOtherRevenue,
  initialDeadBirds,
  initialDealers,
  initialBuyers,
  standardVaccines,
} from './data/mockData';

export default function App() {
  const { user, userProfile, loading, logout, syncStatus, setSyncStatus } = useAuth();
  const [isGuestMode, setIsGuestMode] = useState<boolean>(false);
  const isInitialCloudLoad = useRef(true);

  // --- Persistent States ---
  const [settings, setSettings] = useState<FarmSettings>(() => {
    const saved = localStorage.getItem('pk_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.phone === '01712-345678' || !parsed.phone) {
        parsed.phone = '01749660491';
      }
      return parsed;
    }
    return initialFarmSettings;
  });

  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('pk_lang') as Language) || 'en';
  });

  const [batches, setBatches] = useState<Batch[]>(() => {
    const saved = localStorage.getItem('pk_batches');
    if (saved) {
      const parsed: Batch[] = JSON.parse(saved);
      return parsed.map((b) => {
        if (!b.weightHistory || b.weightHistory.length === 0) {
          const matching = initialBatches.find((ib) => ib.id === b.id);
          if (matching?.weightHistory) {
            return { ...b, weightHistory: matching.weightHistory };
          }
        }
        return b;
      });
    }
    return initialBatches;
  });

  const [expenses, setExpenses] = useState<ExpenseRecord[]>(() => {
    const saved = localStorage.getItem('pk_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [chickenSales, setChickenSales] = useState<ChickenSaleRecord[]>(() => {
    const saved = localStorage.getItem('pk_chickenSales');
    return saved ? JSON.parse(saved) : initialChickenSales;
  });

  const [eggStock, setEggStock] = useState<EggStockEntry[]>(() => {
    const saved = localStorage.getItem('pk_eggStock');
    return saved ? JSON.parse(saved) : initialEggStock;
  });

  const [eggSales, setEggSales] = useState<EggSaleRecord[]>(() => {
    const saved = localStorage.getItem('pk_eggSales');
    return saved ? JSON.parse(saved) : initialEggSales;
  });

  const [otherRevenues, setOtherRevenues] = useState<OtherRevenueRecord[]>(() => {
    const saved = localStorage.getItem('pk_otherRevenues');
    return saved ? JSON.parse(saved) : initialOtherRevenue;
  });

  const [deadBirds, setDeadBirds] = useState<DeadBirdRecord[]>(() => {
    const saved = localStorage.getItem('pk_deadBirds');
    return saved ? JSON.parse(saved) : initialDeadBirds;
  });

  const [dealers, setDealers] = useState<Dealer[]>(() => {
    const saved = localStorage.getItem('pk_dealers');
    return saved ? JSON.parse(saved) : initialDealers;
  });

  const [buyers, setBuyers] = useState<Buyer[]>(() => {
    const saved = localStorage.getItem('pk_buyers');
    return saved ? JSON.parse(saved) : initialBuyers;
  });

  const [vaccines, setVaccines] = useState<VaccineScheduleItem[]>(() => {
    const saved = localStorage.getItem('pk_vaccines');
    return saved ? JSON.parse(saved) : standardVaccines;
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('pk_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('pk_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('pk_batches', JSON.stringify(batches));
  }, [batches]);

  useEffect(() => {
    localStorage.setItem('pk_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('pk_chickenSales', JSON.stringify(chickenSales));
  }, [chickenSales]);

  useEffect(() => {
    localStorage.setItem('pk_eggStock', JSON.stringify(eggStock));
  }, [eggStock]);

  useEffect(() => {
    localStorage.setItem('pk_eggSales', JSON.stringify(eggSales));
  }, [eggSales]);

  useEffect(() => {
    localStorage.setItem('pk_otherRevenues', JSON.stringify(otherRevenues));
  }, [otherRevenues]);

  useEffect(() => {
    localStorage.setItem('pk_deadBirds', JSON.stringify(deadBirds));
  }, [deadBirds]);

  useEffect(() => {
    localStorage.setItem('pk_dealers', JSON.stringify(dealers));
  }, [dealers]);

  useEffect(() => {
    localStorage.setItem('pk_buyers', JSON.stringify(buyers));
  }, [buyers]);

  useEffect(() => {
    localStorage.setItem('pk_vaccines', JSON.stringify(vaccines));
  }, [vaccines]);

  // --- Farm Mode (Broiler vs Layer) ---
  const [farmMode, setFarmMode] = useState<FarmMode>(() => {
    return (localStorage.getItem('pk_farm_mode') as FarmMode) || 'broiler';
  });

  useEffect(() => {
    localStorage.setItem('pk_farm_mode', farmMode);
  }, [farmMode]);

  // --- Active Batch Derivations ---
  const activeBatch = batches.find((b) => b.status === 'active') || batches[0];
  const totalSoldEggs = eggSales.reduce((sum, s) => sum + s.totalEggs, 0);

  // --- Modal Open States ---
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModuleKey | 'reports' | 'settings' | 'website' | null>(null);

  // Language toggle handler
  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'bn' ? 'en' : 'bn'));
  };

  // Drawer / Navigation Handlers
  const handleOpenModule = (key: ModuleKey) => {
    if (key === 'weightChart') {
      setActiveModal('activeBatch');
    } else {
      setActiveModal(key);
    }
  };

  // Social Links
  const handleOpenSocial = (platform: 'facebook' | 'whatsapp') => {
    if (platform === 'facebook') {
      window.open('https://facebook.com', '_blank');
    } else {
      window.open('https://wa.me/8801749660491', '_blank');
    }
  };

  // --- Handlers for Active Batch & End Batch ---
  const handleCreateBatch = (newBatchData: Omit<Batch, 'id'>) => {
    const initialWeight = newBatchData.breed === 'Broiler' ? 0.045 : 0.035;
    const initialTarget = newBatchData.breed === 'Broiler' ? 0.042 : 0.032;
    const newBatch: Batch = {
      ...newBatchData,
      id: `batch-${Date.now()}`,
      weightHistory: [
        {
          id: `w-${Date.now()}-1`,
          date: newBatchData.startDate,
          dayNumber: 1,
          avgWeightKg: newBatchData.currentAvgWeightKg || initialWeight,
          targetWeightKg: initialTarget,
          feedBags: newBatchData.totalFeedBagsConsumed || 1,
          notes: 'বাচ্চা খামারে প্রবেশের দিন',
        },
      ],
    };
    // mark old active batches as completed
    setBatches((prev) => [
      newBatch,
      ...prev.map((b) => (b.status === 'active' ? { ...b, status: 'completed' as const } : b)),
    ]);
  };

  const handleUpdateBatchMetrics = (
    batchId: string,
    avgWeightKg: number,
    feedBags: number,
    logDate?: string,
    notes?: string
  ) => {
    const targetDate = logDate || new Date().toISOString().split('T')[0];

    setBatches((prev) =>
      prev.map((b) => {
        if (b.id !== batchId) return b;

        // Calculate flock age in days at the time of this weighing
        const start = new Date(b.startDate);
        const log = new Date(targetDate);
        const diffDays = Math.max(
          1,
          Math.floor((log.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
        );

        // Standard growth target benchmark
        let targetWeightKg = 0;
        if (b.breed === 'Broiler') {
          targetWeightKg = parseFloat(
            Math.min(2.8, 0.042 + 0.0018 * Math.pow(diffDays, 1.85)).toFixed(3)
          );
        } else if (b.breed === 'Sonali') {
          targetWeightKg = parseFloat(
            Math.min(1.0, 0.032 + 0.013 * diffDays).toFixed(3)
          );
        } else {
          targetWeightKg = parseFloat((0.04 + 0.02 * diffDays).toFixed(3));
        }

        const existingHistory = b.weightHistory ? [...b.weightHistory] : [];
        const existingIndex = existingHistory.findIndex(
          (entry) => entry.date === targetDate || entry.dayNumber === diffDays
        );

        let updatedHistory: WeightLogEntry[];
        if (existingIndex >= 0) {
          updatedHistory = [...existingHistory];
          updatedHistory[existingIndex] = {
            ...updatedHistory[existingIndex],
            avgWeightKg,
            feedBags,
            targetWeightKg: updatedHistory[existingIndex].targetWeightKg || targetWeightKg,
            notes: notes !== undefined && notes !== '' ? notes : updatedHistory[existingIndex].notes,
          };
        } else {
          const newEntry: WeightLogEntry = {
            id: `w-${Date.now()}`,
            date: targetDate,
            dayNumber: diffDays,
            avgWeightKg,
            feedBags,
            targetWeightKg,
            notes: notes || undefined,
          };
          updatedHistory = [...existingHistory, newEntry].sort(
            (a, b) => a.dayNumber - b.dayNumber
          );
        }

        return {
          ...b,
          currentAvgWeightKg: avgWeightKg,
          totalFeedBagsConsumed: feedBags,
          weightHistory: updatedHistory,
        };
      })
    );
  };

  const handleDeleteWeightLog = (batchId: string, logId: string) => {
    setBatches((prev) =>
      prev.map((b) => {
        if (b.id !== batchId) return b;
        const filtered = (b.weightHistory || []).filter((item) => item.id !== logId);
        const latest = filtered[filtered.length - 1];
        return {
          ...b,
          currentAvgWeightKg: latest ? latest.avgWeightKg : b.currentAvgWeightKg,
          weightHistory: filtered,
        };
      })
    );
  };

  const handleEndBatch = (batchId: string, notes?: string) => {
    setBatches((prev) =>
      prev.map((b) =>
        b.id === batchId
          ? {
              ...b,
              status: 'completed',
              endDate: new Date().toISOString().split('T')[0],
              notes: notes || b.notes,
            }
          : b
      )
    );
  };

  // --- Handlers for Expenses ---
  const handleAddExpense = (expenseData: Omit<ExpenseRecord, 'id'>) => {
    const newExpense: ExpenseRecord = {
      ...expenseData,
      id: `exp-${Date.now()}`,
    };
    setExpenses((prev) => [newExpense, ...prev]);

    // If paymentType is 'due' and category is feed or medicine, update dealer dues
    if (newExpense.paymentType === 'due') {
      setDealers((prev) => {
        if (prev.length === 0) return prev;
        const targetDealer = prev[0];
        return prev.map((d, i) =>
          i === 0
            ? {
                ...d,
                totalBill: d.totalBill + newExpense.amount,
                dueAmount: d.dueAmount + newExpense.amount,
              }
            : d
        );
      });
    }
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // --- Handlers for Chicken Sales ---
  const handleAddChickenSale = (saleData: Omit<ChickenSaleRecord, 'id'>) => {
    const newSale: ChickenSaleRecord = {
      ...saleData,
      id: `sale-${Date.now()}`,
    };
    setChickenSales((prev) => [newSale, ...prev]);

    // Deduct sold bird count from active batch currentBirds
    if (activeBatch) {
      setBatches((prev) =>
        prev.map((b) =>
          b.id === activeBatch.id
            ? { ...b, currentBirds: Math.max(0, b.currentBirds - newSale.birdCount) }
            : b
        )
      );
    }

    // If there is a due amount, update buyer ledger
    if (newSale.dueAmount > 0) {
      setBuyers((prev) => {
        const existing = prev.find((b) => b.name.toLowerCase() === newSale.buyerName.toLowerCase());
        if (existing) {
          return prev.map((b) =>
            b.id === existing.id
              ? {
                  ...b,
                  totalPurchase: b.totalPurchase + newSale.totalAmount,
                  paidAmount: b.paidAmount + newSale.paidAmount,
                  dueAmount: b.dueAmount + newSale.dueAmount,
                }
              : b
          );
        } else {
          return [
            {
              id: `buyer-${Date.now()}`,
              name: newSale.buyerName,
              type: 'chicken',
              phone: newSale.buyerPhone || '01800-000000',
              address: 'স্থানীয় বাজার',
              totalPurchase: newSale.totalAmount,
              paidAmount: newSale.paidAmount,
              dueAmount: newSale.dueAmount,
            },
            ...prev,
          ];
        }
      });
    }
  };

  const handleDeleteChickenSale = (id: string) => {
    setChickenSales((prev) => prev.filter((s) => s.id !== id));
  };

  // --- Handlers for Egg Stock ---
  const handleAddEggStock = (entryData: Omit<EggStockEntry, 'id'>) => {
    const newEntry: EggStockEntry = {
      ...entryData,
      id: `egg-${Date.now()}`,
    };
    setEggStock((prev) => [newEntry, ...prev]);
  };

  const handleDeleteEggStock = (id: string) => {
    setEggStock((prev) => prev.filter((e) => e.id !== id));
  };

  // --- Handlers for Egg Sales ---
  const handleAddEggSale = (saleData: Omit<EggSaleRecord, 'id'>) => {
    const newSale: EggSaleRecord = {
      ...saleData,
      id: `eggsale-${Date.now()}`,
    };
    setEggSales((prev) => [newSale, ...prev]);

    if (newSale.dueAmount > 0) {
      setBuyers((prev) => {
        const existing = prev.find((b) => b.name.toLowerCase() === newSale.buyerName.toLowerCase());
        if (existing) {
          return prev.map((b) =>
            b.id === existing.id
              ? {
                  ...b,
                  totalPurchase: b.totalPurchase + newSale.totalAmount,
                  paidAmount: b.paidAmount + newSale.paidAmount,
                  dueAmount: b.dueAmount + newSale.dueAmount,
                }
              : b
          );
        } else {
          return [
            {
              id: `buyer-${Date.now()}`,
              name: newSale.buyerName,
              type: 'egg',
              phone: '01600-000000',
              address: 'ডিমের আড়ত',
              totalPurchase: newSale.totalAmount,
              paidAmount: newSale.paidAmount,
              dueAmount: newSale.dueAmount,
            },
            ...prev,
          ];
        }
      });
    }
  };

  const handleDeleteEggSale = (id: string) => {
    setEggSales((prev) => prev.filter((s) => s.id !== id));
  };

  // --- Handlers for Other Revenues ---
  const handleAddOtherRevenue = (revData: Omit<OtherRevenueRecord, 'id'>) => {
    const newRev: OtherRevenueRecord = {
      ...revData,
      id: `rev-${Date.now()}`,
    };
    setOtherRevenues((prev) => [newRev, ...prev]);
  };

  const handleDeleteOtherRevenue = (id: string) => {
    setOtherRevenues((prev) => prev.filter((r) => r.id !== id));
  };

  // --- Handlers for Dead Birds ---
  const handleAddDeadRecord = (recordData: Omit<DeadBirdRecord, 'id'>) => {
    const newRecord: DeadBirdRecord = {
      ...recordData,
      id: `dead-${Date.now()}`,
    };
    setDeadBirds((prev) => [newRecord, ...prev]);

    // Decrement active batch currentBirds and increment deadBirds
    if (activeBatch) {
      setBatches((prev) =>
        prev.map((b) =>
          b.id === activeBatch.id
            ? {
                ...b,
                currentBirds: Math.max(0, b.currentBirds - newRecord.count),
                deadBirds: b.deadBirds + newRecord.count,
              }
            : b
        )
      );
    }
  };

  const handleDeleteDeadRecord = (id: string) => {
    setDeadBirds((prev) => prev.filter((d) => d.id !== id));
  };

  // --- Handlers for Dealers ---
  const handleAddDealer = (dealerData: Omit<Dealer, 'id'>) => {
    const newDealer: Dealer = {
      ...dealerData,
      id: `dealer-${Date.now()}`,
    };
    setDealers((prev) => [newDealer, ...prev]);
  };

  const handlePayDealer = (dealerId: string, amount: number) => {
    setDealers((prev) =>
      prev.map((d) =>
        d.id === dealerId
          ? {
              ...d,
              paidAmount: d.paidAmount + amount,
              dueAmount: Math.max(0, d.dueAmount - amount),
            }
          : d
      )
    );
  };

  const handleDeleteDealer = (dealerId: string) => {
    setDealers((prev) => prev.filter((d) => d.id !== dealerId));
  };

  // --- Handlers for Buyers ---
  const handleAddBuyer = (buyerData: Omit<Buyer, 'id'>) => {
    const newBuyer: Buyer = {
      ...buyerData,
      id: `buyer-${Date.now()}`,
    };
    setBuyers((prev) => [newBuyer, ...prev]);
  };

  const handleCollectDue = (buyerId: string, amount: number) => {
    setBuyers((prev) =>
      prev.map((b) =>
        b.id === buyerId
          ? {
              ...b,
              paidAmount: b.paidAmount + amount,
              dueAmount: Math.max(0, b.dueAmount - amount),
            }
          : b
      )
    );
  };

  const handleDeleteBuyer = (buyerId: string) => {
    setBuyers((prev) => prev.filter((b) => b.id !== buyerId));
  };

  // --- Handlers for Vaccines ---
  const handleToggleVaccine = (vaccineId: string) => {
    setVaccines((prev) =>
      prev.map((v) =>
        v.id === vaccineId
          ? {
              ...v,
              isCompleted: !v.isCompleted,
              appliedDate: !v.isCompleted ? new Date().toISOString().split('T')[0] : undefined,
            }
          : v
      )
    );
  };

  // --- Handlers for Subscription Extend ---
  const handleExtendSubscription = (days: number) => {
    setSettings((prev) => ({
      ...prev,
      subscriptionDaysLeft: prev.subscriptionDaysLeft + days,
    }));
  };

  // --- Backup & Restore ---
  const handleExportData = () => {
    const dataToExport = {
      settings,
      batches,
      expenses,
      chickenSales,
      eggStock,
      eggSales,
      otherRevenues,
      deadBirds,
      dealers,
      buyers,
      vaccines,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poultry_khata_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.batches) setBatches(parsed.batches);
        if (parsed.expenses) setExpenses(parsed.expenses);
        if (parsed.chickenSales) setChickenSales(parsed.chickenSales);
        if (parsed.eggStock) setEggStock(parsed.eggStock);
        if (parsed.eggSales) setEggSales(parsed.eggSales);
        if (parsed.otherRevenues) setOtherRevenues(parsed.otherRevenues);
        if (parsed.deadBirds) setDeadBirds(parsed.deadBirds);
        if (parsed.dealers) setDealers(parsed.dealers);
        if (parsed.buyers) setBuyers(parsed.buyers);
        if (parsed.vaccines) setVaccines(parsed.vaccines);
        alert(language === 'bn' ? 'ডাটা সফলভাবে রিস্টোর করা হয়েছে!' : 'Data restored successfully!');
      } catch (err) {
        alert(language === 'bn' ? 'ত্রুটি: ব্যাকআপ ফাইলটি সঠিক নয়।' : 'Error: Invalid backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (
      window.confirm(
        language === 'bn'
          ? 'আপনি কি নিশ্চিত যে সকল তথ্য মুছে প্রাথমিক ডিফল্ট অবস্থায় ফিরে যেতে চান?'
          : 'Are you sure you want to reset all data to default mock records?'
      )
    ) {
      localStorage.clear();
      setSettings(initialFarmSettings);
      setBatches(initialBatches);
      setExpenses(initialExpenses);
      setChickenSales(initialChickenSales);
      setEggStock(initialEggStock);
      setEggSales(initialEggSales);
      setOtherRevenues(initialOtherRevenue);
      setDeadBirds(initialDeadBirds);
      setDealers(initialDealers);
      setBuyers(initialBuyers);
      setVaccines(standardVaccines);
    }
  };

  // --- Sync Profile to Local Settings ---
  useEffect(() => {
    if (userProfile) {
      setSettings((prev) => ({
        ...prev,
        farmName: userProfile.farmName || prev.farmName,
        ownerName: userProfile.displayName || prev.ownerName,
        phone: userProfile.phone || (userProfile.email && !userProfile.email.includes('@smartpoultry.app') ? userProfile.email : prev.phone),
      }));
    }
  }, [userProfile]);

  // --- Real-time Firestore Cloud Synchronization ---
  useEffect(() => {
    if (!user) {
      isInitialCloudLoad.current = false;
      return;
    }

    isInitialCloudLoad.current = true;
    setSyncStatus('syncing');

    const unsubscribe = subscribeToFarmData(
      user.uid,
      (cloudData) => {
        if (cloudData) {
          if (cloudData.settings) setSettings(cloudData.settings);
          if (cloudData.batches) setBatches(cloudData.batches);
          if (cloudData.expenses) setExpenses(cloudData.expenses);
          if (cloudData.chickenSales) setChickenSales(cloudData.chickenSales);
          if (cloudData.eggStock) setEggStock(cloudData.eggStock);
          if (cloudData.eggSales) setEggSales(cloudData.eggSales);
          if (cloudData.otherRevenues) setOtherRevenues(cloudData.otherRevenues);
          if (cloudData.deadBirds) setDeadBirds(cloudData.deadBirds);
          if (cloudData.dealers) setDealers(cloudData.dealers);
          if (cloudData.buyers) setBuyers(cloudData.buyers);
          if (cloudData.vaccines) setVaccines(cloudData.vaccines);
          if (cloudData.farmMode) setFarmMode(cloudData.farmMode);
          setSyncStatus('synced');
        } else {
          // New cloud user: upload initial dataset to their Firestore document
          saveFarmDataToCloud(user.uid, {
            settings,
            batches,
            expenses,
            chickenSales,
            eggStock,
            eggSales,
            otherRevenues,
            deadBirds,
            dealers,
            buyers,
            vaccines,
            farmMode,
          });
          setSyncStatus('synced');
        }

        setTimeout(() => {
          isInitialCloudLoad.current = false;
        }, 600);
      },
      (err) => {
        console.warn('Subscription warning:', err);
        setSyncStatus('offline');
        isInitialCloudLoad.current = false;
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  // Debounced auto-save to Cloud Firestore
  useEffect(() => {
    if (!user || isInitialCloudLoad.current) return;

    const timer = setTimeout(async () => {
      try {
        setSyncStatus('syncing');
        await saveFarmDataToCloud(user.uid, {
          settings,
          batches,
          expenses,
          chickenSales,
          eggStock,
          eggSales,
          otherRevenues,
          deadBirds,
          dealers,
          buyers,
          vaccines,
          farmMode,
        });
        setSyncStatus('synced');
      } catch (e) {
        console.error('Cloud auto-sync failed:', e);
        setSyncStatus('error');
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [
    user,
    settings,
    batches,
    expenses,
    chickenSales,
    eggStock,
    eggSales,
    otherRevenues,
    deadBirds,
    dealers,
    buyers,
    vaccines,
    farmMode,
  ]);

  // --- Logout Handler ---
  const handleLogout = async () => {
    const confirmed = window.confirm(
      language === 'bn'
        ? 'আপনি কি নিশ্চিত যে আপনার অ্যাকাউন্ট থেকে লগআউট করতে চান?'
        : 'Are you sure you want to log out from your account?'
    );
    if (confirmed) {
      setIsGuestMode(false);
      await logout();
    }
  };

  const userEmailOrPhone = user?.email || userProfile?.phone || '';

  // Auth Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0ECE1] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-full bg-[#FAF8F2] border-2 border-[#276F57] flex items-center justify-center shadow-lg p-1 mb-4 animate-pulse">
          <SmartPoultryLogo className="w-full h-full" showBackground={false} />
        </div>
        <div className="flex items-center gap-2 text-[#0E3D2F] font-bold text-sm">
          <Loader2 className="w-4 h-4 animate-spin text-[#0E3D2F]" />
          <span>{language === 'bn' ? 'স্মার্ট পোল্ট্রি লোড হচ্ছে...' : 'Loading Smart Poultry...'}</span>
        </div>
      </div>
    );
  }

  // If not logged in and not in guest exploration mode, show Auth Page
  if (!user && !isGuestMode) {
    return (
      <AuthPage
        language={language}
        onContinueAsGuest={() => setIsGuestMode(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#EFECE3] flex flex-col items-center justify-start text-slate-800 font-sans antialiased">
      {/* Mobile-Framed Container mirroring the Android App Interface & Screenshot 1 & 2 */}
      <div className="w-full max-w-md min-h-screen bg-[#F6F4ED] shadow-xl flex flex-col relative overflow-x-hidden border-x border-[#E2DDD0]">
        {/* Top Header */}
        <Header
          language={language}
          onOpenDrawer={() => setIsDrawerOpen(true)}
          onToggleLanguage={handleToggleLanguage}
          onOpenSocial={handleOpenSocial}
          onOpenNotifications={() => setIsNotificationOpen(true)}
          syncStatus={syncStatus}
          onLogout={handleLogout}
          userEmailOrPhone={userEmailOrPhone}
        />

        {/* Top Banner (Welcome + Expiry + Bengali/English Date) */}
        <TopBanner
          daysLeft={settings.subscriptionDaysLeft}
          language={language}
          onRenewClick={() => setActiveModal('renew')}
          activeBatch={activeBatch}
        />

        {/* Farm Mode Switcher & Season at a Glance / Live Widget */}
        <FarmOverviewWidget
          farmMode={farmMode}
          onSelectFarmMode={(mode) => setFarmMode(mode)}
          activeBatch={activeBatch}
          batches={batches}
          expenses={expenses}
          chickenSales={chickenSales}
          eggStock={eggStock}
          eggSales={eggSales}
          deadBirds={deadBirds}
          vaccines={vaccines}
          language={language}
          onOpenBatchModal={() => setActiveModal('activeBatch')}
          onOpenVaccineModal={() => setActiveModal('vaccine')}
        />

        {/* Dashboard Grid (Filtered by Broiler vs Layer Mode + Subtitles + Badges) */}
        <main className="flex-1 flex flex-col">
          <DashboardGrid
            language={language}
            farmMode={farmMode}
            activeBatch={activeBatch}
            onOpenModule={handleOpenModule}
            onOpenWebsite={() => setActiveModal('website')}
          />
        </main>

        {/* Fixed Bottom Navigation Bar matching Screenshot 1 & 2 */}
        <BottomNavBar
          language={language}
          farmMode={farmMode}
          onOpenHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          onOpenWeightOrBatch={() => setActiveModal('activeBatch')}
          onQuickAdd={() => setIsQuickAddOpen(true)}
          onOpenReports={() => setActiveModal('reports')}
          onOpenSettings={() => setActiveModal('settings')}
        />

        {/* Quick Add Bottom Sheet Modal */}
        <QuickAddModal
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
          language={language}
          farmMode={farmMode}
          onSelectAction={(actionKey) => {
            setActiveModal(actionKey as any);
          }}
        />

        {/* Notification Bell Alert Modal */}
        <NotificationModal
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
          language={language}
          daysLeft={settings.subscriptionDaysLeft}
          vaccines={vaccines}
          onOpenRenew={() => setActiveModal('renew')}
          onOpenVaccines={() => setActiveModal('vaccine')}
        />

        {/* Navigation Drawer Menu */}
        <DrawerMenu
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          settings={settings}
          language={language}
          onToggleLanguage={handleToggleLanguage}
          onOpenSettings={() => setActiveModal('settings')}
          onOpenReports={() => setActiveModal('reports')}
          onOpenHowToRenew={() => setActiveModal('howToRenew')}
          onExportData={handleExportData}
          onImportData={handleImportData}
          onResetData={handleResetData}
          onOpenWebsite={() => setActiveModal('website')}
          onLogout={handleLogout}
          userEmailOrPhone={userEmailOrPhone}
        />

        {/* Modals for each feature */}
        {/* 1. Active Batch */}
        <ActiveBatchModal
          isOpen={activeModal === 'activeBatch'}
          onClose={() => setActiveModal(null)}
          batches={batches}
          language={language}
          onAddBatch={handleCreateBatch}
          onCloseBatch={handleEndBatch}
          onUpdateBatchMetrics={handleUpdateBatchMetrics}
          onDeleteWeightLog={handleDeleteWeightLog}
        />

        {/* 2. Batch Expense */}
        <BatchExpenseModal
          isOpen={activeModal === 'batchExp'}
          onClose={() => setActiveModal(null)}
          expenses={expenses}
          dealers={dealers}
          language={language}
          onAddExpense={handleAddExpense}
          onDeleteExpense={handleDeleteExpense}
        />

        {/* 3. Chicken Sales */}
        <ChickenSalesModal
          isOpen={activeModal === 'chickenSales'}
          onClose={() => setActiveModal(null)}
          sales={chickenSales}
          language={language}
          onAddSale={handleAddChickenSale}
          onDeleteSale={handleDeleteChickenSale}
        />

        {/* 4. Egg Stock */}
        <EggStockModal
          isOpen={activeModal === 'eggStock'}
          onClose={() => setActiveModal(null)}
          eggEntries={eggStock}
          totalSoldEggs={totalSoldEggs}
          language={language}
          onAddEggEntry={handleAddEggStock}
          onDeleteEggEntry={handleDeleteEggStock}
        />

        {/* 5. Egg Sales */}
        <EggSalesModal
          isOpen={activeModal === 'eggSales'}
          onClose={() => setActiveModal(null)}
          eggSales={eggSales}
          currentStockEggs={Math.max(
            0,
            eggStock.reduce((s, e) => s + e.netGoodEggs, 0) - totalSoldEggs
          )}
          language={language}
          onAddEggSale={handleAddEggSale}
          onDeleteEggSale={handleDeleteEggSale}
        />

        {/* 6. Other Revenue */}
        <OtherRevenueModal
          isOpen={activeModal === 'otherRevenue'}
          onClose={() => setActiveModal(null)}
          revenues={otherRevenues}
          language={language}
          onAddRevenue={handleAddOtherRevenue}
          onDeleteRevenue={handleDeleteOtherRevenue}
        />

        {/* 7. Dead Birds */}
        <DeadBirdsModal
          isOpen={activeModal === 'deadBirds'}
          onClose={() => setActiveModal(null)}
          deadRecords={deadBirds}
          activeBatch={activeBatch}
          language={language}
          onAddDeadRecord={handleAddDeadRecord}
          onDeleteDeadRecord={handleDeleteDeadRecord}
        />

        {/* 8. Dealer Ledger */}
        <DealerModal
          isOpen={activeModal === 'dealer'}
          onClose={() => setActiveModal(null)}
          dealers={dealers}
          language={language}
          onAddDealer={handleAddDealer}
          onPayDealer={handlePayDealer}
          onDeleteDealer={handleDeleteDealer}
        />

        {/* 9. Buyer Ledger */}
        <BuyerModal
          isOpen={activeModal === 'buyer'}
          onClose={() => setActiveModal(null)}
          buyers={buyers}
          language={language}
          onAddBuyer={handleAddBuyer}
          onCollectDue={handleCollectDue}
          onDeleteBuyer={handleDeleteBuyer}
        />

        {/* 10. Vaccines */}
        <VaccineModal
          isOpen={activeModal === 'vaccine'}
          onClose={() => setActiveModal(null)}
          vaccines={vaccines}
          language={language}
          onToggleVaccine={handleToggleVaccine}
        />

        {/* 11. Old Batch */}
        <OldBatchModal
          isOpen={activeModal === 'oldBatch'}
          onClose={() => setActiveModal(null)}
          batches={batches}
          language={language}
        />

        {/* 12. How to Renew? */}
        <HowToRenewModal
          isOpen={activeModal === 'howToRenew'}
          onClose={() => setActiveModal(null)}
          language={language}
          onGoToRenew={() => setActiveModal('renew')}
        />

        {/* 13. Renew */}
        <RenewModal
          isOpen={activeModal === 'renew'}
          onClose={() => setActiveModal(null)}
          daysLeft={settings.subscriptionDaysLeft}
          language={language}
          onExtendSubscription={handleExtendSubscription}
        />

        {/* Reports / Statement */}
        <ReportsModal
          isOpen={activeModal === 'reports'}
          onClose={() => setActiveModal(null)}
          activeBatch={activeBatch}
          batches={batches}
          expenses={expenses}
          chickenSales={chickenSales}
          eggSales={eggSales}
          otherRevenues={otherRevenues}
          dealers={dealers}
          buyers={buyers}
          language={language}
          farmName={settings.farmName}
          farmSettings={settings}
        />

        {/* Settings */}
        <SettingsModal
          isOpen={activeModal === 'settings'}
          onClose={() => setActiveModal(null)}
          settings={settings}
          language={language}
          onUpdateSettings={(newSettings) => setSettings(newSettings)}
          onLanguageChange={(lang) => setLanguage(lang)}
        />

        {/* Website Cloud Sync Modal */}
        <WebsiteModal
          isOpen={activeModal === 'website'}
          onClose={() => setActiveModal(null)}
          language={language}
        />
      </div>
    </div>
  );
}
