import React, { useState } from 'react';
import { Monk } from '../types/temple';
import { MonkAvatar } from './MonkAvatar';
import { FUN_DHARMA_NAME_SUGGESTIONS } from '../data/monksData';
import { soundEngine } from '../audio/soundEngine';
import confetti from 'canvas-confetti';
import { X, Heart, Sparkles, Dices, Check, MessageSquare, Award } from 'lucide-react';

interface MonkModalProps {
  monk: Monk | null;
  onClose: () => void;
  isUser: boolean;
  onUpdateUserMonk?: (updated: Partial<Monk>) => void;
  onBlessMonk?: (monkId: string) => void;
}

export const MonkModal: React.FC<MonkModalProps> = ({
  monk,
  onClose,
  isUser,
  onUpdateUserMonk,
  onBlessMonk,
}) => {
  if (!monk) return null;

  // Edit states for user
  const [dharmaName, setDharmaName] = useState(monk.dharmaName);
  const [avatarRobe, setAvatarRobe] = useState<Monk['avatarRobe']>(monk.avatarRobe);
  const [expression, setExpression] = useState<Monk['expression']>(monk.expression);
  const [motto, setMotto] = useState(monk.motto);

  // Random Dharma name picker
  const handleRandomName = () => {
    soundEngine.playBambooShake();
    const filtered = FUN_DHARMA_NAME_SUGGESTIONS.filter((n) => n !== dharmaName);
    const chosen = filtered[Math.floor(Math.random() * filtered.length)];
    setDharmaName(chosen);
  };

  const handleSave = () => {
    if (!onUpdateUserMonk) return;
    soundEngine.playBell();
    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
    } catch {
      // Ignore
    }
    onUpdateUserMonk({
      dharmaName: dharmaName.trim() || 'Thích Bình An',
      avatarRobe,
      expression,
      motto: motto.trim() || 'Tâm an thì vạn sự an.',
    });
    onClose();
  };

  const handleBlessClick = () => {
    soundEngine.playSingingBowl();
    try {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#fb7185', '#fda4af', '#f59e0b'],
      });
    } catch {
      // Ignore
    }
    if (onBlessMonk) {
      onBlessMonk(monk.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-stone-900 via-amber-950/40 to-stone-950 border-2 border-amber-500/70 shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-850 hover:bg-stone-800 text-stone-400 hover:text-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {isUser ? (
          /* User Customization View */
          <div>
            <div className="text-center mb-6">
              <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold">
                Quy Y Tam Bảo
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-amber-300 mt-1">
                Thiết Lập Pháp Danh & Bồ Đoàn
              </h3>
            </div>

            {/* Avatar Preview */}
            <div className="flex flex-col items-center justify-center my-4">
              <MonkAvatar robeColor={avatarRobe} expression={expression} size="xl" hasHalo={true} />
              <div className="mt-3 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-sm font-serif">
                {dharmaName || 'Thích Vô Danh'}
              </div>
            </div>

            {/* Dharma Name Input with Random button */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-stone-300 block mb-1">Pháp Danh Của Bạn:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={dharmaName}
                    onChange={(e) => setDharmaName(e.target.value)}
                    placeholder="Ví dụ: Thích Tan Ca, Thích Tăng Lương, Thích Chốt Đơn..."
                    className="flex-1 px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 font-semibold focus:outline-none focus:border-amber-400"
                    maxLength={30}
                  />
                  <button
                    type="button"
                    onClick={handleRandomName}
                    title="Bốc ngẫu nhiên pháp danh độc lạ"
                    className="px-3 py-2 rounded-lg bg-stone-850 hover:bg-stone-800 text-amber-300 border border-amber-600/40 flex items-center gap-1 font-medium cursor-pointer transition-colors"
                  >
                    <Dices className="w-4 h-4" />
                    <span>Ngẫu Nhiên</span>
                  </button>
                </div>
              </div>

              {/* Robe Color Selector */}
              <div>
                <label className="font-semibold text-stone-300 block mb-1.5">Màu Sắc Pháp Phục:</label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: 'gold', label: 'Vàng Nghệ', bg: 'bg-amber-500' },
                    { id: 'saffron', label: 'Cam Sa Môn', bg: 'bg-orange-600' },
                    { id: 'brown', label: 'Nâu Sòng', bg: 'bg-stone-700' },
                    { id: 'indigo', label: 'Lam Thiền', bg: 'bg-blue-700' },
                    { id: 'crimson', label: 'Thanh Y', bg: 'bg-rose-700' },
                  ].map((r) => (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => setAvatarRobe(r.id as Monk['avatarRobe'])}
                      className={`flex flex-col items-center p-2 rounded-lg border transition-all cursor-pointer ${
                        avatarRobe === r.id
                          ? 'border-amber-400 bg-amber-950/40 shadow ring-1 ring-amber-400'
                          : 'border-stone-800 bg-stone-900/60 hover:bg-stone-850'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full ${r.bg} shadow-sm mb-1`} />
                      <span className="text-[10px] text-stone-300 truncate w-full text-center">
                        {r.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Expression Selector */}
              <div>
                <label className="font-semibold text-stone-300 block mb-1.5">Biểu Cảm Thiền Tịnh:</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'calm', label: 'Tịnh Tâm', icon: '😌' },
                    { id: 'smile', label: 'Mỉm Cười', icon: '😊' },
                    { id: 'focused', label: 'Chuyên Chú', icon: '🧘' },
                    { id: 'peaceful', label: 'An Lạc', icon: '🌸' },
                  ].map((exp) => (
                    <button
                      type="button"
                      key={exp.id}
                      onClick={() => setExpression(exp.id as Monk['expression'])}
                      className={`py-2 px-2 rounded-lg border text-center transition-all cursor-pointer ${
                        expression === exp.id
                          ? 'border-amber-400 bg-amber-950/40 text-amber-300 font-bold'
                          : 'border-stone-800 bg-stone-900/60 text-stone-300 hover:bg-stone-850'
                      }`}
                    >
                      <span className="text-sm block">{exp.icon}</span>
                      <span className="text-[10px]">{exp.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Motto / Status */}
              <div>
                <label className="font-semibold text-stone-300 block mb-1">
                  Châm Ngôn Tu Tập / Tâm Niệm:
                </label>
                <input
                  type="text"
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  placeholder="Ví dụ: Vạn sự tùy duyên, hoa hồng phải đều."
                  className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 text-xs focus:outline-none focus:border-amber-400"
                  maxLength={100}
                />
              </div>

              {/* Save Button */}
              <button
                type="button"
                onClick={handleSave}
                className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-stone-950 font-bold text-xs shadow-lg transition-all cursor-pointer"
              >
                Lưu Thay Đổi & Tọa Thiền
              </button>
            </div>
          </div>
        ) : (
          /* Viewing Another Fellow Monk */
          <div className="flex flex-col items-center text-center">
            <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold mb-1">
              Đạo Hữu Đồng Tu
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-amber-300">
              {monk.dharmaName}
            </h3>

            {/* Avatar */}
            <div className="my-5">
              <MonkAvatar robeColor={monk.avatarRobe} expression={monk.expression} size="xl" />
            </div>

            {/* Status / Motto */}
            <div className="p-4 rounded-xl bg-stone-950/80 border border-amber-900/50 max-w-sm mb-5 text-xs text-stone-300 italic font-serif leading-relaxed">
              "{monk.motto}"
            </div>

            {/* Stats row */}
            <div className="w-full grid grid-cols-3 gap-2 py-3 border-y border-stone-800 text-xs mb-6">
              <div>
                <span className="text-[10px] text-stone-400 block uppercase">Công Đức</span>
                <span className="text-sm font-bold font-mono text-amber-300">
                  +{monk.meritPoints}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block uppercase">Tọa Thiền</span>
                <span className="text-sm font-bold font-mono text-stone-200">
                  {monk.meditationMinutes} phút
                </span>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block uppercase">Được Tùy Hỷ</span>
                <span className="text-sm font-bold font-mono text-rose-300">
                  {monk.blessingsReceived} ❤️
                </span>
              </div>
            </div>

            {/* Bless / Cheering Button */}
            <button
              onClick={handleBlessClick}
              className="w-full py-2.5 rounded-xl bg-rose-600/30 hover:bg-rose-600/40 border border-rose-500 text-rose-200 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <Heart className="w-4 h-4 text-rose-400 fill-current" />
              <span>Gửi Lời Chúc An Lành & Tùy Hỷ (+1 Công Đức)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
