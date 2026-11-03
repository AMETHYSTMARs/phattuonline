import React, { useState } from 'react';
import { FORTUNE_STICKS } from '../data/fortuneSticks';
import { FortuneStick } from '../types/temple';
import { soundEngine } from '../audio/soundEngine';
import confetti from 'canvas-confetti';
import { Sparkles, RefreshCw, Share2, Check, BookOpen, Heart, Shield, TrendingUp } from 'lucide-react';

interface GieoQueViewProps {
  onAddMerit: (amount: number) => void;
  userDharmaName: string;
}

export const GieoQueView: React.FC<GieoQueViewProps> = ({ onAddMerit, userDharmaName }) => {
  const [isShaking, setIsShaking] = useState(false);
  const [selectedStick, setSelectedStick] = useState<FortuneStick | null>(null);
  const [copied, setCopied] = useState(false);

  // Trigger fortune drawing
  const handleShake = () => {
    if (isShaking) return;
    setIsShaking(true);
    setSelectedStick(null);
    setCopied(false);

    soundEngine.playBambooShake();

    // Secondary shake sound
    setTimeout(() => {
      soundEngine.playBambooShake();
    }, 600);

    // Pick random stick after 1.4s
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * FORTUNE_STICKS.length);
      const stick = FORTUNE_STICKS[randomIndex];
      setSelectedStick(stick);
      setIsShaking(false);
      soundEngine.playBell();
      onAddMerit(25);

      // Confetti for good grade
      if (stick.grade === 'Đại Cát' || stick.grade === 'Thượng Thượng' || stick.grade === 'Thượng Cát') {
        try {
          confetti({
            particleCount: 70,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#eab308', '#f59e0b', '#fbbf24', '#ffffff'],
          });
        } catch {
          // Ignore
        }
      }
    }, 1400);
  };

  const handleCopyFortune = () => {
    if (!selectedStick) return;
    const text = `📜 ${selectedStick.name} (${selectedStick.grade})\n\n${selectedStick.poem}\n\nÝ nghĩa: ${selectedStick.meaning}\n\nLời Phật dạy: "${selectedStick.buddhaWisdom}"\n\n— Gieo quẻ tại Chùa Online (Phật tử: ${userDharmaName})`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* Title */}
      <div className="text-center mb-8">
        <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold">
          Chiêm Bái & Tầm Đạo
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-amber-300 mt-1">
          Gieo Quẻ Đầu Ngày - Xin Xăm Linh Ứng
        </h2>
        <p className="text-xs text-stone-300 mt-2 max-w-md mx-auto">
          Lắng đọng tâm tư, chắp tay thành kính niệm hồng danh Phật rồi chạm vào ống xăm để xin lời chỉ dẫn hanh thông.
        </p>
      </div>

      {/* Interactive Bamboo Fortune Tube */}
      {!selectedStick && (
        <div className="flex flex-col items-center justify-center my-6">
          <div
            onClick={handleShake}
            className={`relative w-44 h-72 cursor-pointer select-none transition-transform flex flex-col items-center justify-end ${
              isShaking ? 'animate-[wiggle_0.2s_ease-in-out_infinite]' : 'hover:scale-105'
            }`}
          >
            {/* Sticks protruding from top of canister */}
            <div className="relative w-28 h-20 -mb-2 flex justify-center items-end gap-1 overflow-hidden z-0">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: `${45 + (i % 4) * 8}px`,
                    transform: `rotate(${(i - 4) * 4}deg)`,
                  }}
                  className="w-2 rounded-t-sm bg-gradient-to-t from-amber-700 to-amber-200 border-t border-amber-100 shadow-xs"
                />
              ))}
            </div>

            {/* Bamboo / Wood Cylindrical Canister */}
            <div className="relative z-10 w-full h-52 rounded-2xl bg-gradient-to-r from-amber-800 via-yellow-900 to-amber-950 border-2 border-amber-500/80 shadow-2xl flex flex-col items-center justify-between p-4">
              {/* Golden rim top */}
              <div className="w-11/12 h-3 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 shadow-sm" />

              {/* Chinese / Vietnamese Characters on Canister */}
              <div className="w-12 h-24 rounded-lg bg-stone-950/70 border border-amber-400/50 flex flex-col items-center justify-around py-1 shadow-inner">
                <span className="text-xs font-serif font-bold text-amber-300">靈</span>
                <span className="text-xs font-serif font-bold text-amber-300">籤</span>
                <span className="text-[10px] text-amber-400/90 font-medium">Linh Xăm</span>
              </div>

              {/* Golden base ring */}
              <div className="w-11/12 h-3 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 shadow-sm" />
            </div>
          </div>

          {/* Shake Action Button */}
          <button
            onClick={handleShake}
            disabled={isShaking}
            className={`mt-6 px-8 py-3 rounded-full font-serif font-bold text-sm shadow-xl transition-all cursor-pointer flex items-center gap-2 ${
              isShaking
                ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:from-amber-500 hover:to-yellow-500 text-stone-950 ring-2 ring-amber-300 active:scale-95'
            }`}
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>{isShaking ? 'Đang Lắc Ống Xăm...' : 'Chạm Để Lắc Ống Xăm'}</span>
          </button>
        </div>
      )}

      {/* Drawn Fortune Card Result */}
      {selectedStick && (
        <div className="w-full max-w-2xl rounded-2xl bg-gradient-to-b from-stone-900 via-amber-950/50 to-stone-950 border-2 border-amber-400 p-6 sm:p-8 shadow-2xl animate-fade-in relative">
          {/* Header Grade Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-amber-900/60">
            <div>
              <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                Quẻ Xăm Đã Ứng
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-amber-300">
                {selectedStick.name}
              </h3>
            </div>

            <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-md">
              {selectedStick.grade}
            </div>
          </div>

          {/* Poem (Thơ Chữ Hán & Thơ Việt) */}
          <div className="my-6 p-4 rounded-xl bg-stone-950/80 border border-amber-900/50 text-center">
            <div className="text-xs text-stone-400 font-serif mb-2 italic whitespace-pre-line opacity-75">
              {selectedStick.poemHuan}
            </div>
            <div className="text-sm sm:text-base font-serif font-semibold text-amber-200 whitespace-pre-line leading-relaxed">
              "{selectedStick.poem}"
            </div>
          </div>

          {/* Detailed Meaning */}
          <div className="space-y-4 text-xs sm:text-sm text-stone-300">
            <div>
              <strong className="text-amber-400 block font-semibold mb-1">Ý Nghĩa Tổng Quát:</strong>
              <p className="leading-relaxed">{selectedStick.meaning}</p>
            </div>

            {/* Category breakdown grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-stone-900/80 border border-stone-800">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Công Danh & Sự Nghiệp:
                </span>
                <p className="text-stone-300 text-xs">{selectedStick.career}</p>
              </div>

              <div className="p-3 rounded-lg bg-stone-900/80 border border-stone-800">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                  <span>💰</span>
                  Tài Lộc & Tiền Bạc:
                </span>
                <p className="text-stone-300 text-xs">{selectedStick.wealth}</p>
              </div>

              <div className="p-3 rounded-lg bg-stone-900/80 border border-stone-800">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  Tình Duyên & Gia Đạo:
                </span>
                <p className="text-stone-300 text-xs">{selectedStick.love}</p>
              </div>

              <div className="p-3 rounded-lg bg-stone-900/80 border border-stone-800">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  Sức Khỏe & Tinh Thần:
                </span>
                <p className="text-stone-300 text-xs">{selectedStick.health}</p>
              </div>
            </div>

            {/* Buddha Wisdom */}
            <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-900/60 mt-3">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                <BookOpen className="w-3.5 h-3.5" />
                Lời Phật Dạy Soi Đường:
              </span>
              <p className="text-amber-100/90 italic text-xs leading-relaxed">
                "{selectedStick.buddhaWisdom}"
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-8 pt-4 border-t border-stone-800">
            <button
              onClick={handleShake}
              className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Gieo Quẻ Khác</span>
            </button>

            <button
              onClick={handleCopyFortune}
              className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã Sao Chép Lời Quẻ' : 'Sao Chép & Chia Sẻ'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
