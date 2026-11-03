import React, { useState, useEffect, useRef } from 'react';
import { FloatingText } from '../types/temple';
import { soundEngine } from '../audio/soundEngine';
import { Play, Pause, Flame, Sparkles, Award, Zap, RefreshCw } from 'lucide-react';

interface GoMoViewProps {
  userMerits: number;
  onAddMerit: (amount: number, e?: React.MouseEvent | KeyboardEvent) => void;
  floatingTexts: FloatingText[];
}

export const GoMoView: React.FC<GoMoViewProps> = ({ userMerits, onAddMerit, floatingTexts }) => {
  const [combo, setCombo] = useState(0);
  const [isStriking, setIsStriking] = useState(false);
  const [isAutoTapping, setIsAutoTapping] = useState(false);
  const [autoSpeedBpm, setAutoSpeedBpm] = useState<number>(80);
  const comboTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Determine Zen Realm based on total merits
  const getZenRealm = (merits: number) => {
    if (merits >= 2500) return { name: 'Đại Giác Ngộ Viên Mãn', color: 'text-amber-300', level: 6 };
    if (merits >= 1000) return { name: 'Bồ Đề Tâm Khởi', color: 'text-yellow-400', level: 5 };
    if (merits >= 500) return { name: 'Chánh Niệm An Trú', color: 'text-orange-400', level: 4 };
    if (merits >= 200) return { name: 'Tịnh Thân Giải Nghiệp', color: 'text-sky-400', level: 3 };
    if (merits >= 50) return { name: 'Tinh Tấn Gõ Mõ', color: 'text-emerald-400', level: 2 };
    return { name: 'Sơ Tâm Nhập Môn', color: 'text-stone-300', level: 1 };
  };

  const realm = getZenRealm(userMerits);

  const handleStrike = (e?: React.MouseEvent) => {
    soundEngine.playWoodenFish();
    setIsStriking(true);
    setTimeout(() => setIsStriking(false), 120);

    onAddMerit(1, e);

    // Increase combo
    setCombo((prev) => prev + 1);
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => {
      setCombo(0);
    }, 2500);
  };

  // Keyboard shortcut: Spacebar to strike wooden fish
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        soundEngine.playWoodenFish();
        setIsStriking(true);
        setTimeout(() => setIsStriking(false), 120);
        onAddMerit(1, e);
        setCombo((prev) => prev + 1);
        if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
        comboTimerRef.current = setTimeout(() => {
          setCombo(0);
        }, 2500);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onAddMerit]);

  // Auto tap interval
  useEffect(() => {
    if (!isAutoTapping) return;
    const intervalMs = Math.round((60 / autoSpeedBpm) * 1000);

    const interval = setInterval(() => {
      soundEngine.playWoodenFish(0.03);
      setIsStriking(true);
      setTimeout(() => setIsStriking(false), 100);
      onAddMerit(1);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isAutoTapping, autoSpeedBpm, onAddMerit]);

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center px-4 py-6">
      {/* Zen Realm Banner */}
      <div className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 border border-amber-900/50 shadow-lg mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-stone-400 uppercase tracking-wider font-semibold">Cảnh Giới Tu Tập</div>
            <div className={`text-base font-bold font-serif ${realm.color}`}>{realm.name}</div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-stone-400 uppercase tracking-wider font-semibold">Tổng Công Đức</div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-amber-300">
            +{userMerits.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Floating Merits Particles */}
      <div className="relative w-full flex flex-col items-center justify-center min-h-[360px]">
        {/* Floating text elements */}
        {floatingTexts.map((item) => (
          <div
            key={item.id}
            style={{ left: `${item.x}px`, top: `${item.y}px` }}
            className="pointer-events-none fixed z-50 text-amber-300 font-bold text-lg font-serif drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] animate-[floatUp_1.4s_ease-out_forwards]"
          >
            {item.text}
          </div>
        ))}

        {/* Combo Badge */}
        {combo > 2 && (
          <div className="absolute top-2 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-xs shadow-lg animate-bounce">
            <Zap className="w-3.5 h-3.5 text-yellow-200 fill-current" />
            <span>Combo x{combo}</span>
            <span className="text-[10px] text-amber-200 font-normal">
              {combo > 50 ? 'Đại Tinh Tấn' : combo > 20 ? 'Nhất Tâm Bất Loạn' : 'Tâm Bình Khí Hòa'}
            </span>
          </div>
        )}

        {/* Ambient Halo behind wooden fish */}
        <div
          className={`absolute w-72 h-72 rounded-full bg-radial from-amber-500/20 via-orange-600/10 to-transparent blur-2xl pointer-events-none transition-all duration-300 ${
            isStriking ? 'scale-125 opacity-100' : 'scale-100 opacity-60'
          }`}
        />

        {/* Big Stylized 3D Wooden Fish (Mõ Gỗ) */}
        <div
          onClick={(e) => handleStrike(e)}
          className={`relative z-10 w-64 h-64 sm:w-80 sm:h-80 cursor-pointer select-none transition-all duration-100 transform active:scale-95 group ${
            isStriking ? 'scale-95 translate-y-1' : 'hover:scale-[1.02]'
          }`}
        >
          {/* Wooden Fish SVG Illustration */}
          <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)]">
            <defs>
              {/* Rich Wood Grain Gradient */}
              <radialGradient id="woodRadial" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="35%" stopColor="#b45309" />
                <stop offset="70%" stopColor="#78350f" />
                <stop offset="100%" stopColor="#451a03" />
              </radialGradient>

              {/* Gold Inlay Gradient */}
              <linearGradient id="goldInlay" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#a16207" />
              </linearGradient>

              <filter id="woodDepth">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.6" />
              </filter>
            </defs>

            {/* Cushion beneath the wooden fish */}
            <ellipse cx="200" cy="350" rx="160" ry="36" fill="#7f1d1d" />
            <ellipse cx="200" cy="345" rx="150" ry="30" fill="#991b1b" stroke="#f59e0b" strokeWidth="3" />
            {/* Cushion golden fringe knots */}
            <circle cx="70" cy="350" r="8" fill="#facc15" />
            <circle cx="200" cy="370" r="8" fill="#facc15" />
            <circle cx="330" cy="350" r="8" fill="#facc15" />

            {/* Main Fish Body (Traditional rounded bulbous shape) */}
            <path
              d="M 100,230 
                 C 70,160 110,80 200,80 
                 C 290,80 340,150 320,230 
                 C 300,300 230,320 200,320 
                 C 150,320 120,290 100,230 Z"
              fill="url(#woodRadial)"
              stroke="#92400e"
              strokeWidth="4"
              filter="url(#woodDepth)"
            />

            {/* Fish Cavity / Resonating Slit (Traditional acoustic mouth opening) */}
            <path
              d="M 120,225 
                 C 160,245 240,245 280,225 
                 C 260,260 140,260 120,225 Z"
              fill="#261005"
              stroke="#451a03"
              strokeWidth="3"
            />

            {/* Carved scales / Lotus petal inlays on sides */}
            <path
              d="M 140,150 Q 200,120 260,150"
              fill="none"
              stroke="url(#goldInlay)"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.85"
            />
            <path
              d="M 150,175 Q 200,150 250,175"
              fill="none"
              stroke="url(#goldInlay)"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.8"
            />
            <path
              d="M 165,200 Q 200,180 235,200"
              fill="none"
              stroke="url(#goldInlay)"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.75"
            />

            {/* Fish Eye & Mouth Inlay */}
            <circle cx="140" cy="120" r="7" fill="url(#goldInlay)" />
            <circle cx="260" cy="120" r="7" fill="url(#goldInlay)" />
            <circle cx="140" cy="120" r="3.5" fill="#1c1917" />
            <circle cx="260" cy="120" r="3.5" fill="#1c1917" />

            {/* Carved Buddhist Cloud Inscription on Head */}
            <path
              d="M 185,110 C 185,95 215,95 215,110 C 215,120 200,125 200,135"
              fill="none"
              stroke="url(#goldInlay)"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Top strike mallet hit point highlight */}
            <ellipse
              cx="200"
              cy="165"
              rx="40"
              ry="20"
              fill="#fbbf24"
              opacity={isStriking ? '0.4' : '0.15'}
              className="transition-opacity"
            />
          </svg>

          {/* Wooden Mallet (Dùi gõ) animated when striking */}
          <div
            className={`absolute top-0 right-2 w-12 h-36 origin-bottom-right transition-transform duration-100 pointer-events-none ${
              isStriking ? 'rotate-[-30deg] translate-y-3' : 'rotate-[-10deg]'
            }`}
          >
            <div className="w-5 h-8 rounded-full bg-stone-100 border-2 border-amber-800 shadow-md mx-auto" />
            <div className="w-2.5 h-28 bg-gradient-to-b from-amber-800 to-amber-950 rounded-b-md mx-auto shadow-inner" />
          </div>
        </div>

        {/* Tap Instruction */}
        <p className="mt-4 text-xs sm:text-sm text-stone-400 text-center font-medium">
          Chạm vào mõ hoặc bấm phím{' '}
          <kbd className="px-2 py-0.5 rounded bg-stone-800 text-amber-300 font-mono text-xs border border-stone-700 shadow">
            Space
          </kbd>{' '}
          để tích lũy công đức
        </p>
      </div>

      {/* Auto-Tap Mode Controls */}
      <div className="w-full mt-6 p-4 rounded-2xl bg-stone-900/80 border border-stone-800 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAutoTapping(!isAutoTapping)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs transition-all shadow cursor-pointer ${
              isAutoTapping
                ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 ring-2 ring-amber-300'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
            }`}
          >
            {isAutoTapping ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isAutoTapping ? 'Dừng Tự Động Gõ' : 'Bật Tự Động Gõ Mõ'}</span>
          </button>

          <span className="text-xs text-stone-400 hidden sm:inline">
            {isAutoTapping ? 'Đang tự động tụng niệm tinh tấn...' : 'Tự động gõ rảnh tay khi làm việc'}
          </span>
        </div>

        {/* Speed presets */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-stone-400 mr-1">Tốc độ:</span>
          {[
            { label: '60 BPM (Tịnh)', value: 60 },
            { label: '90 BPM (Chuẩn)', value: 90 },
            { label: '140 BPM (Cấp tốc)', value: 140 },
          ].map((spd) => (
            <button
              key={spd.value}
              onClick={() => setAutoSpeedBpm(spd.value)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                autoSpeedBpm === spd.value
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              {spd.label}
            </button>
          ))}
        </div>
      </div>

      {/* Meaningful Buddha Quote of the Day */}
      <div className="mt-8 text-center max-w-lg px-4 py-3 rounded-xl bg-amber-950/20 border border-amber-900/40">
        <p className="text-xs italic text-amber-200/90 font-serif">
          "Giọt nước nhỏ từng giọt lâu ngày sẽ đầy chum. Người tích tụ công đức từng chút một ắt phước báu vô lượng."
        </p>
        <span className="text-[10px] text-stone-500 mt-1 block">— Kinh Pháp Cú</span>
      </div>
    </div>
  );
};
