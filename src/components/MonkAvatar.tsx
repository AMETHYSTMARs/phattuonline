import React from 'react';

interface MonkAvatarProps {
  robeColor?: 'gold' | 'saffron' | 'brown' | 'indigo' | 'crimson';
  expression?: 'calm' | 'smile' | 'focused' | 'peaceful';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  hasHalo?: boolean;
  isMeditating?: boolean;
  className?: string;
}

export const MonkAvatar: React.FC<MonkAvatarProps> = ({
  robeColor = 'saffron',
  expression = 'calm',
  size = 'md',
  hasHalo = false,
  isMeditating = true,
  className = '',
}) => {
  // Robe gradient & color styles
  const robeStyles = {
    gold: {
      body: 'from-amber-400 via-yellow-500 to-amber-600',
      collar: 'border-yellow-200 bg-amber-500',
      sash: 'bg-amber-700',
    },
    saffron: {
      body: 'from-orange-400 via-amber-500 to-orange-600',
      collar: 'border-amber-200 bg-orange-500',
      sash: 'bg-amber-800',
    },
    brown: {
      body: 'from-stone-500 via-amber-800 to-stone-700',
      collar: 'border-stone-300 bg-stone-600',
      sash: 'bg-stone-900',
    },
    indigo: {
      body: 'from-sky-500 via-blue-600 to-indigo-800',
      collar: 'border-sky-200 bg-blue-500',
      sash: 'bg-indigo-900',
    },
    crimson: {
      body: 'from-rose-500 via-red-600 to-amber-900',
      collar: 'border-rose-200 bg-rose-500',
      sash: 'bg-red-950',
    },
  }[robeColor];

  const sizeClasses = {
    sm: 'w-10 h-11 text-[9px]',
    md: 'w-16 h-18 text-xs',
    lg: 'w-24 h-28 text-sm',
    xl: 'w-32 h-36 text-base',
  }[size];

  return (
    <div className={`relative flex flex-col items-center justify-end select-none ${sizeClasses} ${className}`}>
      {/* Golden Aura / Halo if enabled */}
      {hasHalo && (
        <div className="absolute -inset-2 rounded-full bg-radial from-amber-300/40 via-yellow-400/20 to-transparent blur-md animate-pulse" />
      )}

      {/* Little Monk Head (Smooth round bald head, cute novice monk) */}
      <div
        className={`relative z-10 w-3/5 aspect-square rounded-full bg-gradient-to-b from-amber-100 via-orange-100 to-amber-200 shadow-md border border-amber-300/40 flex flex-col items-center justify-center ${
          isMeditating ? 'animate-[bounce_4s_ease-in-out_infinite]' : ''
        }`}
      >
        {/* Subtle forehead dot / Urna */}
        <div className="w-1 h-1 rounded-full bg-red-500/80 mb-0.5 shadow-sm" />

        {/* Serene Eyes */}
        <div className="w-full flex items-center justify-center gap-2 px-1">
          {expression === 'calm' && (
            <>
              {/* Closed curved peaceful meditation eyes */}
              <div className="w-2.5 h-1 border-b-2 border-stone-700 rounded-full" />
              <div className="w-2.5 h-1 border-b-2 border-stone-700 rounded-full" />
            </>
          )}
          {expression === 'smile' && (
            <>
              {/* Smiling crescent eyes */}
              <div className="w-2.5 h-1 border-b-2 border-stone-800 rounded-full rotate-3" />
              <div className="w-2.5 h-1 border-b-2 border-stone-800 rounded-full -rotate-3" />
            </>
          )}
          {expression === 'focused' && (
            <>
              {/* Deep meditation gentle slits */}
              <div className="w-2.5 h-0.5 bg-stone-700 rounded-full" />
              <div className="w-2.5 h-0.5 bg-stone-700 rounded-full" />
            </>
          )}
          {expression === 'peaceful' && (
            <>
              <div className="w-2.5 h-1 border-b-2 border-stone-700 rounded-full" />
              <div className="w-2.5 h-1 border-b-2 border-stone-700 rounded-full" />
            </>
          )}
        </div>

        {/* Rosy cheeks */}
        <div className="w-full flex items-center justify-between px-2 mt-0.5 opacity-60">
          <div className="w-1.5 h-1 rounded-full bg-rose-400 blur-[0.5px]" />
          <div className="w-1.5 h-1 rounded-full bg-rose-400 blur-[0.5px]" />
        </div>

        {/* Gentle smiling mouth */}
        <div className="w-1.5 h-0.5 border-b border-stone-700 rounded-full mt-0.5" />
      </div>

      {/* Robe / Body sitting in meditation lotus posture */}
      <div
        className={`relative z-0 w-full h-[52%] -mt-1.5 rounded-t-2xl rounded-b-xl bg-gradient-to-b ${robeStyles.body} shadow-lg border border-white/20 flex flex-col items-center justify-between px-1 py-0.5`}
      >
        {/* Collar diagonal fold (traditional monk robe crossover) */}
        <div className="w-full flex justify-center -mt-0.5">
          <div className={`w-3/4 h-2 rounded-t-sm border-t ${robeStyles.collar} opacity-80`} />
        </div>

        {/* Prayer Mala beads or folded hands */}
        <div className="flex items-center justify-center my-auto">
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-stone-900/30 backdrop-blur-xs border border-white/10 shadow-inner">
            <span className="text-[10px] leading-none">📿</span>
            <div className="w-1.5 h-1.5 rounded-full bg-amber-200/90" />
            <div className="w-1.5 h-1.5 rounded-full bg-amber-300/90" />
          </div>
        </div>

        {/* Meditation cushion base shadow */}
        <div className="w-11/12 h-1 rounded-full bg-stone-900/40 blur-[0.5px] -mb-0.5" />
      </div>

      {/* Meditation Cushion (Bồ Đoàn) */}
      <div className="w-[115%] h-2.5 rounded-full bg-gradient-to-r from-stone-700 via-stone-600 to-stone-800 shadow-md border border-stone-500/50 -mt-1" />
    </div>
  );
};
