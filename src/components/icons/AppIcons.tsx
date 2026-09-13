import React from 'react';

// 1. Active Batch: Cute yellow chick / baby bird with pinkish-orange accents
export const ActiveBatchIcon: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Soft glow circle background */}
    <circle cx="32" cy="32" r="26" fill="#FFF3D6" />
    {/* Body */}
    <circle cx="32" cy="36" r="16" fill="#FACC15" stroke="#EAB308" strokeWidth="1.5" />
    {/* Head */}
    <circle cx="32" cy="23" r="12" fill="#FDE047" stroke="#EAB308" strokeWidth="1.5" />
    {/* Comb / Crest */}
    <circle cx="32" cy="11" r="3" fill="#F87171" />
    <circle cx="28" cy="13" r="2.5" fill="#FB7185" />
    <circle cx="36" cy="13" r="2.5" fill="#FB7185" />
    {/* Eyes */}
    <circle cx="27" cy="21" r="2" fill="#1F2937" />
    <circle cx="37" cy="21" r="2" fill="#1F2937" />
    <circle cx="26.5" cy="20.5" r="0.7" fill="#FFFFFF" />
    <circle cx="36.5" cy="20.5" r="0.7" fill="#FFFFFF" />
    {/* Beak */}
    <path d="M29 25L32 28L35 25Z" fill="#F97316" stroke="#EA580C" strokeWidth="0.8" />
    {/* Cheeks */}
    <ellipse cx="24" cy="24" rx="2.5" ry="1.5" fill="#FDA4AF" opacity="0.8" />
    <ellipse cx="40" cy="24" rx="2.5" ry="1.5" fill="#FDA4AF" opacity="0.8" />
    {/* Wings */}
    <path d="M17 34C17 30 21 34 23 37C21 40 17 38 17 34Z" fill="#EAB308" />
    <path d="M47 34C47 30 43 34 41 37C43 40 47 38 47 34Z" fill="#EAB308" />
    {/* Feet */}
    <path d="M27 49L25 54M37 49L39 54" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// 2. Batch Exp: Brown leather wallet with money/cards sticking out
export const BatchExpIcon: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Cash poking out */}
    <rect x="22" y="16" width="24" height="14" rx="2" fill="#4ADE80" stroke="#16A34A" strokeWidth="1.2" />
    <line x1="26" y1="23" x2="42" y2="23" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="34" cy="23" r="2" fill="#86EFAC" />
    {/* Second money sheet */}
    <rect x="25" y="13" width="18" height="12" rx="1.5" fill="#86EFAC" stroke="#22C55E" strokeWidth="1" />
    {/* Wallet main body */}
    <rect x="15" y="24" width="34" height="24" rx="6" fill="#8D5B4C" stroke="#5D3A2A" strokeWidth="1.5" />
    <path d="M15 30C23 30 41 28 49 31" stroke="#5D3A2A" strokeWidth="1.5" />
    {/* Flap with gold button */}
    <rect x="37" y="32" width="14" height="10" rx="3" fill="#6B4226" stroke="#4A2810" strokeWidth="1.2" />
    <circle cx="44" cy="37" r="2.5" fill="#FBBF24" stroke="#D97706" strokeWidth="0.8" />
    {/* Stitching effect */}
    <line x1="18" y1="45" x2="46" y2="45" stroke="#A97155" strokeWidth="1" strokeDasharray="2 2" />
  </svg>
);

// 3. Chicken Sales: Rising green bar chart with money bag and arrow
export const ChickenSalesIcon: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Rising Bars */}
    <rect x="14" y="38" width="8" height="16" rx="2" fill="#93C5FD" stroke="#3B82F6" strokeWidth="1" />
    <rect x="25" y="28" width="8" height="26" rx="2" fill="#60A5FA" stroke="#2563EB" strokeWidth="1" />
    <rect x="36" y="18" width="8" height="36" rx="2" fill="#34D399" stroke="#059669" strokeWidth="1" />
    {/* Arrow */}
    <path d="M16 34L28 24L38 14L46 14M46 14L42 18M46 14L46 18" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    {/* Money Sack overlay on right */}
    <path d="M42 42C42 38 45 35 48 35C49 35 50 33 51 31C52 33 53 35 54 35C57 35 60 38 60 42C60 49 57 53 51 53C45 53 42 49 42 42Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.2" />
    <path d="M47 35L55 35" stroke="#B45309" strokeWidth="1.5" />
    <text x="51" y="47" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#854D0E">৳</text>
  </svg>
);

// 4. Egg Stock: Wooden basket/crate stacked with fresh brown eggs
export const EggStockIcon: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Eggs in back */}
    <ellipse cx="24" cy="28" rx="6" ry="8" fill="#F59E0B" stroke="#D97706" strokeWidth="1" transform="rotate(-10 24 28)" />
    <ellipse cx="32" cy="25" rx="6" ry="8" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
    <ellipse cx="40" cy="28" rx="6" ry="8" fill="#F59E0B" stroke="#D97706" strokeWidth="1" transform="rotate(10 40 28)" />
    {/* Eggs in front row */}
    <ellipse cx="20" cy="34" rx="5.5" ry="7.5" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
    <ellipse cx="28" cy="33" rx="5.5" ry="7.5" fill="#FCD34D" stroke="#D97706" strokeWidth="1" />
    <ellipse cx="36" cy="33" rx="5.5" ry="7.5" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
    <ellipse cx="44" cy="34" rx="5.5" ry="7.5" fill="#FCD34D" stroke="#D97706" strokeWidth="1" />
    {/* Wooden crate / basket */}
    <rect x="12" y="38" width="40" height="17" rx="3" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
    <line x1="12" y1="46" x2="52" y2="46" stroke="#92400E" strokeWidth="1.5" />
    {/* Vertical slats */}
    <line x1="22" y1="38" x2="22" y2="55" stroke="#B45309" strokeWidth="1.5" />
    <line x1="32" y1="38" x2="32" y2="55" stroke="#B45309" strokeWidth="1.5" />
    <line x1="42" y1="38" x2="42" y2="55" stroke="#B45309" strokeWidth="1.5" />
  </svg>
);

// 5. Egg Sales: Golden egg with coin and currency sign
export const EggSalesIcon: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Large Egg */}
    <path d="M32 14C23 14 18 26 18 36C18 45 24 51 32 51C40 51 46 45 46 36C46 26 41 14 32 14Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
    {/* Inner shade */}
    <path d="M30 18C25 21 21 28 21 37C21 42 23 46 26 48" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" />
    {/* Money / Coin Badge in middle */}
    <circle cx="32" cy="36" r="10" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
    <circle cx="32" cy="36" r="8" fill="#FACC15" />
    <text x="32" y="41" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#854D0E">৳</text>
  </svg>
);

// 6. Other Revenue: Hands holding money bag or profit sack
export const OtherRevenueIcon: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Sparkles */}
    <circle cx="20" cy="18" r="1.5" fill="#F59E0B" />
    <circle cx="45" cy="16" r="2" fill="#F59E0B" />
    {/* Big money sack */}
    <path d="M22 44C20 38 23 30 28 29C29 27 30 23 32 23C34 23 35 27 36 29C41 30 44 38 42 44C40 51 24 51 22 44Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
    {/* Tied top ribbon */}
    <path d="M28 29L36 29" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
    {/* Taka symbol */}
    <text x="32" y="42" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#78350F">৳</text>
    {/* Hand holding it from below */}
    <path d="M14 47C20 46 26 49 32 50C38 49 44 46 50 47C50 51 45 54 32 55C19 54 14 51 14 47Z" fill="#FDE68A" stroke="#D97706" strokeWidth="1.2" />
  </svg>
);

// 7. Dead Birds: Cartoon injured/dead chicken with little wings and smoke
export const DeadBirdsIcon: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Cloud / puff of dust/smoke */}
    <ellipse cx="23" cy="22" rx="5" ry="3" fill="#E2E8F0" opacity="0.9" />
    <ellipse cx="30" cy="18" rx="6" ry="4" fill="#CBD5E1" opacity="0.8" />
    <ellipse cx="39" cy="21" rx="5" ry="3.5" fill="#E2E8F0" opacity="0.9" />
    {/* Chicken lying down on back/side */}
    <path d="M18 42C18 34 26 31 36 32C44 33 48 38 48 43C48 48 42 50 32 50C22 50 18 47 18 42Z" fill="#F87171" stroke="#DC2626" strokeWidth="1.5" />
    {/* Beak pointing up */}
    <path d="M18 36L13 38L18 40Z" fill="#F97316" />
    {/* X eye */}
    <line x1="22" y1="34" x2="26" y2="38" stroke="#7F1D1D" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="26" y1="34" x2="22" y2="38" stroke="#7F1D1D" strokeWidth="1.8" strokeLinecap="round" />
    {/* Limp feet sticking up */}
    <path d="M37 32L39 26M42 33L45 28" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
    {/* Wing flap */}
    <path d="M28 44C32 40 37 40 39 45" stroke="#991B1B" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 8. Dealer: Businessman/Supplier with DEALER text banner
export const DealerIcon: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Head and hair */}
    <path d="M26 18C26 14 30 13 32 13C34 13 38 14 38 18V21H26V18Z" fill="#78350F" />
    <circle cx="32" cy="23" r="8" fill="#FCD34D" stroke="#D97706" strokeWidth="1" />
    {/* Eyes & smile */}
    <circle cx="29.5" cy="22" r="1" fill="#1F2937" />
    <circle cx="34.5" cy="22" r="1" fill="#1F2937" />
    <path d="M30 26C31 27.5 33 27.5 34 26" stroke="#92400E" strokeWidth="1" strokeLinecap="round" />
    {/* Shirt and suit collar */}
    <path d="M20 42C20 34 25 32 32 32C39 32 44 34 44 42V45H20V42Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="1" />
    <path d="M28 32L32 38L36 32" fill="#FFFFFF" />
    <path d="M31 38L33 38L32.5 44L31.5 44Z" fill="#1E3A8A" />
    {/* Dealer Badge / Tag */}
    <rect x="18" y="44" width="28" height="8" rx="2" fill="#0D9488" stroke="#042F2E" strokeWidth="0.8" />
    <text x="32" y="50" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#FFFFFF" letterSpacing="0.5">DEALER</text>
  </svg>
);

// 9. Buyer: Customer / Wholesale Trader with BUYER banner and money
export const BuyerIcon: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Cap / hair */}
    <path d="M24 19C24 14 30 12 32 12C34 12 40 14 40 19H24Z" fill="#059669" />
    <circle cx="32" cy="23" r="8" fill="#FED7AA" stroke="#EA580C" strokeWidth="1" />
    {/* Eyes & smile */}
    <circle cx="29.5" cy="22" r="1" fill="#1F2937" />
    <circle cx="34.5" cy="22" r="1" fill="#1F2937" />
    <path d="M30 26C31 27.5 33 27.5 34 26" stroke="#C2410C" strokeWidth="1" strokeLinecap="round" />
    {/* Shirt */}
    <path d="M20 42C20 34 25 32 32 32C39 32 44 34 44 42V45H20V42Z" fill="#10B981" stroke="#047857" strokeWidth="1" />
    {/* Cash in hand on right */}
    <circle cx="45" cy="38" r="5" fill="#FBBF24" stroke="#B45309" strokeWidth="0.8" />
    <text x="45" y="41" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#78350F">৳</text>
    {/* Buyer Badge */}
    <rect x="20" y="44" width="24" height="8" rx="2" fill="#D97706" stroke="#78350F" strokeWidth="0.8" />
    <text x="32" y="50" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#FFFFFF" letterSpacing="0.5">BUYER</text>
  </svg>
);

// 10. Vaccine: Medical card / syringe with vaccine drops
export const VaccineIcon: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Background cyan medical card */}
    <rect x="18" y="16" width="28" height="34" rx="4" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="1.5" />
    {/* Cross / shield */}
    <path d="M29 23H35V27H39V33H35V37H29V33H25V27H29V23Z" fill="#0284C7" />
    <path d="M30.5 25H33.5V28.5H37V31.5H33.5V35H30.5V31.5H27V28.5H30.5V25Z" fill="#BAE6FD" />
    {/* Syringe angled */}
    <line x1="42" y1="18" x2="33" y2="29" stroke="#0369A1" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="44" cy="16" r="2.5" fill="#38BDF8" />
    {/* Drop */}
    <path d="M30 33C30 33 28 36 28 37C28 38.1 28.9 39 30 39C31.1 39 32 38.1 32 37C32 36 30 33 30 33Z" fill="#0EA5E9" />
  </svg>
);

// 11. Old Batch: Mature adult hen with orange/yellow feathers
export const OldBatchIcon: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Tail feathers */}
    <path d="M42 32C49 26 53 30 48 38C52 35 54 40 48 43C45 45 42 44 42 42" fill="#EA580C" />
    {/* Body */}
    <ellipse cx="32" cy="38" rx="14" ry="11" fill="#FBBF24" stroke="#D97706" strokeWidth="1.2" />
    {/* Wing */}
    <path d="M28 35C33 34 38 37 36 43C31 45 27 42 28 35Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
    {/* Neck and Head */}
    <path d="M24 38C22 35 22 26 23 23C24 20 28 20 28 24C28 28 27 34 26 38" fill="#FBBF24" />
    <circle cx="25" cy="22" r="5" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
    {/* Comb (Red) */}
    <path d="M23 18C23 15 25 15 25 17C26 14 28 14 27 17C28 15 30 16 29 19" fill="#EF4444" />
    {/* Beak & wattle */}
    <path d="M21 22L17 23L21 25Z" fill="#EA580C" />
    <path d="M23 25C22 27 24 29 25 27Z" fill="#EF4444" />
    {/* Eye */}
    <circle cx="23.5" cy="21.5" r="0.9" fill="#1F2937" />
    {/* Legs */}
    <line x1="28" y1="49" x2="26" y2="55" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
    <line x1="34" y1="49" x2="33" y2="55" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 12. How to Renew?: YouTube Red Play Button
export const HowToRenewIcon: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* YouTube red rounded box */}
    <rect x="14" y="20" width="36" height="25" rx="7" fill="#FF0000" />
    {/* Play triangle */}
    <path d="M29 27L39 32.5L29 38V27Z" fill="#FFFFFF" />
  </svg>
);

// 13. Renew: Blue card with "SUBS" and sync/refresh circular arrows
export const RenewIcon: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Card */}
    <rect x="15" y="19" width="30" height="23" rx="3" fill="#0284C7" stroke="#0369A1" strokeWidth="1.2" />
    <rect x="15" y="24" width="30" height="4" fill="#0369A1" />
    {/* Header dots */}
    <circle cx="19" cy="21.5" r="1" fill="#BAE6FD" />
    <circle cx="22" cy="21.5" r="1" fill="#BAE6FD" />
    <circle cx="25" cy="21.5" r="1" fill="#BAE6FD" />
    {/* Text "SUBS" */}
    <text x="30" y="36" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#FFFFFF" letterSpacing="0.8">SUBS</text>
    {/* Circular arrows icon in bottom right */}
    <circle cx="44" cy="41" r="7.5" fill="#0369A1" stroke="#FFFFFF" strokeWidth="1" />
    <path d="M41 39C42 37.5 44 37 45.5 37.5M47 43C46 44.5 44 45 42.5 44.5" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M45.5 36.5L46.5 38.5L44.5 39M42.5 45.5L41.5 43.5L43.5 43" fill="#38BDF8" stroke="#38BDF8" strokeWidth="0.8" />
  </svg>
);

// 14. Weight Progression Chart Icon
export const WeightChartIcon: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="26" fill="#ECFDF5" />
    <rect x="16" y="18" width="32" height="28" rx="4" fill="#FFFFFF" stroke="#059669" strokeWidth="1.5" />
    {/* Scales and graph */}
    <path d="M20 38L28 32L34 35L44 24" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="44" cy="24" r="2.5" fill="#059669" />
    <circle cx="28" cy="32" r="2" fill="#059669" />
    <circle cx="34" cy="35" r="2" fill="#059669" />
    <text x="32" y="44" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#065F46">WEIGHT KG</text>
  </svg>
);

// 15. Reports Icon
export const ReportIcon: React.FC<{ className?: string }> = ({ className = 'w-14 h-14' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="26" fill="#F0FDF4" />
    <rect x="18" y="16" width="28" height="34" rx="3" fill="#FFFFFF" stroke="#15803D" strokeWidth="1.5" />
    <line x1="24" y1="24" x2="38" y2="24" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
    <line x1="24" y1="30" x2="34" y2="30" stroke="#86EFAC" strokeWidth="2" strokeLinecap="round" />
    <rect x="23" y="36" width="4" height="8" rx="1" fill="#86EFAC" />
    <rect x="29" y="33" width="4" height="11" rx="1" fill="#4ADE80" />
    <rect x="35" y="30" width="4" height="14" rx="1" fill="#16A34A" />
  </svg>
);
