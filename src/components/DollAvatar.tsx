"use client";

/**
 * Stylized Y2K Doll Avatar - A fashion doll silhouette for the outfit builder.
 * Inspired by 2000s fashion dolls aesthetic.
 */
export function DollAvatar({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Hair - Big voluminous Y2K style */}
      <ellipse cx="100" cy="65" rx="55" ry="50" fill="url(#hairGradient)" />
      <ellipse cx="55" cy="85" rx="25" ry="40" fill="url(#hairGradient)" />
      <ellipse cx="145" cy="85" rx="25" ry="40" fill="url(#hairGradient)" />
      <ellipse cx="45" cy="130" rx="18" ry="35" fill="url(#hairGradient)" />
      <ellipse cx="155" cy="130" rx="18" ry="35" fill="url(#hairGradient)" />
      <ellipse cx="50" cy="175" rx="15" ry="30" fill="url(#hairGradient)" />
      <ellipse cx="150" cy="175" rx="15" ry="30" fill="url(#hairGradient)" />
      
      {/* Face */}
      <ellipse cx="100" cy="70" rx="38" ry="45" fill="url(#skinGradient)" />
      
      {/* Eyes - Big doll eyes */}
      <ellipse cx="82" cy="65" rx="12" ry="14" fill="white" />
      <ellipse cx="118" cy="65" rx="12" ry="14" fill="white" />
      <ellipse cx="82" cy="67" rx="8" ry="10" fill="#4A3728" />
      <ellipse cx="118" cy="67" rx="8" ry="10" fill="#4A3728" />
      <ellipse cx="84" cy="65" rx="3" ry="4" fill="white" />
      <ellipse cx="120" cy="65" rx="3" ry="4" fill="white" />
      
      {/* Eyebrows */}
      <path d="M70 52 Q82 48 94 52" stroke="#4A3728" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M106 52 Q118 48 130 52" stroke="#4A3728" strokeWidth="2" fill="none" strokeLinecap="round" />
      
      {/* Eyelashes */}
      <path d="M70 60 L65 55" stroke="#2D1810" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M73 57 L70 51" stroke="#2D1810" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M130 60 L135 55" stroke="#2D1810" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M127 57 L130 51" stroke="#2D1810" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Nose */}
      <path d="M100 72 L98 82 Q100 85 102 82 L100 72" fill="url(#skinGradient)" stroke="#D4A574" strokeWidth="0.5" />
      
      {/* Lips - Full glossy lips */}
      <path d="M88 95 Q100 88 112 95" fill="#E85A71" />
      <path d="M88 95 Q100 102 112 95" fill="#C94A5E" />
      <ellipse cx="100" cy="93" rx="8" ry="3" fill="#FFB6C1" opacity="0.5" />
      
      {/* Neck */}
      <path d="M85 110 L85 140 Q100 145 115 140 L115 110" fill="url(#skinGradient)" />
      
      {/* Body/Torso */}
      <path 
        d="M70 140 
           Q60 160 55 200 
           Q50 240 55 280
           L65 280
           Q70 250 75 220
           L75 280
           L125 280
           L125 220
           Q130 250 135 280
           L145 280
           Q150 240 145 200
           Q140 160 130 140
           Q115 145 100 145
           Q85 145 70 140"
        fill="url(#skinGradient)"
      />
      
      {/* Arms */}
      <path 
        d="M55 160 Q35 180 30 220 Q28 250 35 280 L45 278 Q42 250 45 225 Q50 195 65 175"
        fill="url(#skinGradient)"
      />
      <path 
        d="M145 160 Q165 180 170 220 Q172 250 165 280 L155 278 Q158 250 155 225 Q150 195 135 175"
        fill="url(#skinGradient)"
      />
      
      {/* Hands */}
      <ellipse cx="37" cy="285" rx="10" ry="12" fill="url(#skinGradient)" />
      <ellipse cx="163" cy="285" rx="10" ry="12" fill="url(#skinGradient)" />
      
      {/* Legs */}
      <path 
        d="M75 280 
           Q72 340 70 400
           Q68 440 72 480
           L88 480
           Q85 440 85 400
           Q87 340 90 290"
        fill="url(#skinGradient)"
      />
      <path 
        d="M125 280 
           Q128 340 130 400
           Q132 440 128 480
           L112 480
           Q115 440 115 400
           Q113 340 110 290"
        fill="url(#skinGradient)"
      />
      
      {/* Feet */}
      <ellipse cx="80" cy="488" rx="18" ry="8" fill="url(#skinGradient)" />
      <ellipse cx="120" cy="488" rx="18" ry="8" fill="url(#skinGradient)" />
      
      {/* Gradients */}
      <defs>
        <linearGradient id="hairGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2D1810" />
          <stop offset="50%" stopColor="#4A2C1A" />
          <stop offset="100%" stopColor="#1A0F0A" />
        </linearGradient>
        <linearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5D6C6" />
          <stop offset="50%" stopColor="#E8C4B0" />
          <stop offset="100%" stopColor="#D4A88C" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * Alternative blonde doll avatar
 */
export function DollAvatarBlonde({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Hair - Big voluminous Y2K style - Blonde */}
      <ellipse cx="100" cy="65" rx="55" ry="50" fill="url(#hairGradientBlonde)" />
      <ellipse cx="55" cy="85" rx="25" ry="40" fill="url(#hairGradientBlonde)" />
      <ellipse cx="145" cy="85" rx="25" ry="40" fill="url(#hairGradientBlonde)" />
      <ellipse cx="45" cy="130" rx="18" ry="35" fill="url(#hairGradientBlonde)" />
      <ellipse cx="155" cy="130" rx="18" ry="35" fill="url(#hairGradientBlonde)" />
      <ellipse cx="50" cy="175" rx="15" ry="30" fill="url(#hairGradientBlonde)" />
      <ellipse cx="150" cy="175" rx="15" ry="30" fill="url(#hairGradientBlonde)" />
      
      {/* Face */}
      <ellipse cx="100" cy="70" rx="38" ry="45" fill="url(#skinGradientLight)" />
      
      {/* Eyes - Big doll eyes - Blue */}
      <ellipse cx="82" cy="65" rx="12" ry="14" fill="white" />
      <ellipse cx="118" cy="65" rx="12" ry="14" fill="white" />
      <ellipse cx="82" cy="67" rx="8" ry="10" fill="#4A90D9" />
      <ellipse cx="118" cy="67" rx="8" ry="10" fill="#4A90D9" />
      <ellipse cx="84" cy="65" rx="3" ry="4" fill="white" />
      <ellipse cx="120" cy="65" rx="3" ry="4" fill="white" />
      
      {/* Eyebrows */}
      <path d="M70 52 Q82 48 94 52" stroke="#C4A35A" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M106 52 Q118 48 130 52" stroke="#C4A35A" strokeWidth="2" fill="none" strokeLinecap="round" />
      
      {/* Eyelashes */}
      <path d="M70 60 L65 55" stroke="#2D1810" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M73 57 L70 51" stroke="#2D1810" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M130 60 L135 55" stroke="#2D1810" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M127 57 L130 51" stroke="#2D1810" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Nose */}
      <path d="M100 72 L98 82 Q100 85 102 82 L100 72" fill="url(#skinGradientLight)" stroke="#E8C4B0" strokeWidth="0.5" />
      
      {/* Lips - Full glossy lips - Pink */}
      <path d="M88 95 Q100 88 112 95" fill="#FF69B4" />
      <path d="M88 95 Q100 102 112 95" fill="#DB4D8A" />
      <ellipse cx="100" cy="93" rx="8" ry="3" fill="#FFB6C1" opacity="0.6" />
      
      {/* Neck */}
      <path d="M85 110 L85 140 Q100 145 115 140 L115 110" fill="url(#skinGradientLight)" />
      
      {/* Body/Torso */}
      <path 
        d="M70 140 
           Q60 160 55 200 
           Q50 240 55 280
           L65 280
           Q70 250 75 220
           L75 280
           L125 280
           L125 220
           Q130 250 135 280
           L145 280
           Q150 240 145 200
           Q140 160 130 140
           Q115 145 100 145
           Q85 145 70 140"
        fill="url(#skinGradientLight)"
      />
      
      {/* Arms */}
      <path 
        d="M55 160 Q35 180 30 220 Q28 250 35 280 L45 278 Q42 250 45 225 Q50 195 65 175"
        fill="url(#skinGradientLight)"
      />
      <path 
        d="M145 160 Q165 180 170 220 Q172 250 165 280 L155 278 Q158 250 155 225 Q150 195 135 175"
        fill="url(#skinGradientLight)"
      />
      
      {/* Hands */}
      <ellipse cx="37" cy="285" rx="10" ry="12" fill="url(#skinGradientLight)" />
      <ellipse cx="163" cy="285" rx="10" ry="12" fill="url(#skinGradientLight)" />
      
      {/* Legs */}
      <path 
        d="M75 280 
           Q72 340 70 400
           Q68 440 72 480
           L88 480
           Q85 440 85 400
           Q87 340 90 290"
        fill="url(#skinGradientLight)"
      />
      <path 
        d="M125 280 
           Q128 340 130 400
           Q132 440 128 480
           L112 480
           Q115 440 115 400
           Q113 340 110 290"
        fill="url(#skinGradientLight)"
      />
      
      {/* Feet */}
      <ellipse cx="80" cy="488" rx="18" ry="8" fill="url(#skinGradientLight)" />
      <ellipse cx="120" cy="488" rx="18" ry="8" fill="url(#skinGradientLight)" />
      
      {/* Gradients */}
      <defs>
        <linearGradient id="hairGradientBlonde" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5E6A3" />
          <stop offset="50%" stopColor="#E8D48A" />
          <stop offset="100%" stopColor="#C4A35A" />
        </linearGradient>
        <linearGradient id="skinGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFEFE6" />
          <stop offset="50%" stopColor="#F5DDD0" />
          <stop offset="100%" stopColor="#E8C9B8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export type DollType = "brunette" | "blonde" | "none";

export function DollAvatarSelector({
  selected,
  onSelect,
}: {
  selected: DollType;
  onSelect: (type: DollType) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500">Avatar:</span>
      <button
        type="button"
        onClick={() => onSelect("none")}
        className={`h-8 px-3 rounded-full text-xs font-medium transition-all ${
          selected === "none"
            ? "bg-slate-800 text-white"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`}
      >
        Aus
      </button>
      <button
        type="button"
        onClick={() => onSelect("brunette")}
        className={`h-8 px-3 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
          selected === "brunette"
            ? "bg-amber-900 text-white"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`}
      >
        <span className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-900 to-amber-950" />
        Brunette
      </button>
      <button
        type="button"
        onClick={() => onSelect("blonde")}
        className={`h-8 px-3 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
          selected === "blonde"
            ? "bg-amber-400 text-amber-900"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`}
      >
        <span className="w-3 h-3 rounded-full bg-gradient-to-br from-yellow-300 to-amber-400" />
        Blonde
      </button>
    </div>
  );
}


