import React from 'react';

interface SmartPoultryLogoProps {
  className?: string;
  size?: number | string;
  showBackground?: boolean;
}

export const SmartPoultryLogo: React.FC<SmartPoultryLogoProps> = ({
  className = 'w-9 h-9',
  showBackground = true,
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      title="স্মার্ট পোল্ট্রি (Smart Poultry)"
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
      >
        {/* Optional warm cream badge background */}
        {showBackground && (
          <circle cx="100" cy="100" r="98" fill="#F8F6EE" />
        )}

        {/* Outer Circular Ring with break for rooster comb */}
        <path
          d="M 64 68 A 66 66 0 1 0 148 64"
          stroke="#0E3D2F"
          strokeWidth="7.5"
          strokeLinecap="round"
        />

        {/* Rooster Comb (3 dynamic crest feathers) */}
        <path
          d="M 52 70 C 48 55 58 45 68 52 C 72 44 82 45 88 53 C 94 48 100 52 101 62"
          fill="#0E3D2F"
        />

        {/* Rooster Head & Body Outline */}
        <path
          d="M 58 72 C 45 92 48 126 70 148 C 82 160 98 165 116 161"
          stroke="#0E3D2F"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Rooster Face & Crown Flow */}
        <path
          d="M 64 68 C 76 66 92 68 98 76"
          stroke="#0E3D2F"
          strokeWidth="7"
          strokeLinecap="round"
        />

        {/* Beak */}
        <path
          d="M 98 76 L 111 81 L 97 86 Z"
          fill="#0E3D2F"
        />

        {/* Wattle under beak */}
        <path
          d="M 94 85 C 96 95 90 102 85 99 C 81 96 82 88 90 85"
          fill="#0E3D2F"
        />

        {/* Eye */}
        <circle cx="82" cy="74" r="4.5" fill="#0E3D2F" />

        {/* Inner Neck / Chest Curve connecting to egg area */}
        <path
          d="M 87 96 C 82 110 82 124 86 136"
          stroke="#0E3D2F"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Egg (standing upright in center-lower curve) */}
        <g id="egg-group">
          {/* Egg Shadow / Backing */}
          <ellipse
            cx="106"
            cy="126"
            rx="24"
            ry="31"
            fill="#F6EBD4"
            stroke="#0E3D2F"
            strokeWidth="6.5"
          />
          {/* Egg Soft Highlight Curve */}
          <path
            d="M 94 116 C 92 124 93 132 96 138"
            stroke="#FFF9EB"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>

        {/* Golden Lightning Bolt (Smart / Energy symbol) */}
        <path
          d="M 119 128 L 138 88 L 123 88 L 148 48 L 131 82 L 144 82 Z"
          fill="#E5A638"
          stroke="#D49428"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Sparkles / Stars (Matching Screenshot) */}
        {/* 1. Large Top-Right Golden 4-pointed Star */}
        <path
          d="M 156 38 Q 156 46 164 46 Q 156 46 156 54 Q 156 46 148 46 Q 156 46 156 38 Z"
          fill="#E5A638"
        />

        {/* 2. Small Mid-Top Golden 4-pointed Star */}
        <path
          d="M 120 54 Q 120 58 124 58 Q 120 58 120 62 Q 120 58 116 58 Q 120 58 120 54 Z"
          fill="#E5A638"
        />

        {/* 3. Small Teal Circular Accent Dot */}
        <circle cx="134" cy="42" r="3.2" fill="#0E3D2F" />

        {/* 4. Small Teal 4-pointed Star on Right */}
        <path
          d="M 168 70 Q 168 74 172 74 Q 168 74 168 78 Q 168 74 164 74 Q 168 74 168 70 Z"
          fill="#0E3D2F"
        />
      </svg>
    </div>
  );
};
