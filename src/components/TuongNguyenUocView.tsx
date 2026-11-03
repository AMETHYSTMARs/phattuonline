import React, { useState } from 'react';
import { Prayer } from '../types/temple';
import { soundEngine } from '../audio/soundEngine';
import confetti from 'canvas-confetti';
import { Heart, Send, Sparkles, Filter, MessageCircle } from 'lucide-react';

interface TuongNguyenUocViewProps {
  prayers: Prayer[];
  onAddPrayer: (prayer: Omit<Prayer, 'id' | 'blessingsCount' | 'createdAt'>) => void;
  onBlessPrayer: (prayerId: string) => void;
  userDharmaName: string;
}

export const TuongNguyenUocView: React.FC<TuongNguyenUocViewProps> = ({
  prayers,
  onAddPrayer,
  onBlessPrayer,
  userDharmaName,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [inputContent, setInputContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Prayer['category']>('binh-an');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim()) return;

    setIsSubmitting(true);
    soundEngine.playBell();

    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 },
      });
    } catch {
      // Ignore
    }

    onAddPrayer({
      authorName: userDharmaName,
      category: selectedCategory,
      content: inputContent.trim(),
      isUserPrayer: true,
    });

    setInputContent('');
    setIsSubmitting(false);
  };

  const handleBless = (id: string) => {
    soundEngine.playSingingBowl();
    onBlessPrayer(id);
  };

  const filteredPrayers =
    activeCategory === 'all' ? prayers : prayers.filter((p) => p.category === activeCategory);

  const categoryLabels: Record<string, { label: string; icon: string; border: string }> = {
    'binh-an': { label: 'Bình An', icon: '🕊️', border: 'border-amber-500/40 bg-amber-950/20' },
    'tai-loc': { label: 'Tài Lộc', icon: '💰', border: 'border-yellow-500/40 bg-yellow-950/20' },
    'tinh-duyen': { label: 'Tình Duyên', icon: '❤️', border: 'border-rose-500/40 bg-rose-950/20' },
    'cong-danh': { label: 'Công Danh', icon: '📜', border: 'border-blue-500/40 bg-blue-950/20' },
    'suc-khoe': { label: 'Sức Khỏe', icon: '🌿', border: 'border-emerald-500/40 bg-emerald-950/20' },
    'giai-nghiep': { label: 'Giải Deadline', icon: '⚡', border: 'border-purple-500/40 bg-purple-950/20' },
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* Title */}
      <div className="text-center mb-8">
        <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold">
          Gửi Gắm Tâm Nguyện
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-amber-300 mt-1">
          Cây Bồ Đề Nguyện Ước & Thả Hoa Đăng
        </h2>
        <p className="text-xs text-stone-300 mt-2 max-w-lg mx-auto">
          Treo thẻ cầu an lên cây Bồ Đề thiêng hoặc thả hoa đăng trôi theo dòng suối tịnh. Mỗi lời chúc phúc đều là hạt mầm thiện lành.
        </p>
      </div>

      {/* New Prayer Form */}
      <div className="w-full rounded-2xl bg-gradient-to-b from-stone-900 via-amber-950/30 to-stone-950 border border-amber-900/60 p-5 sm:p-6 shadow-xl mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Viết Thẻ Cầu An (Dưới danh nghĩa: {userDharmaName})
            </span>

            {/* Category Selector */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'binh-an', label: 'Bình An' },
                { id: 'tai-loc', label: 'Tài Lộc' },
                { id: 'tinh-duyen', label: 'Tình Duyên' },
                { id: 'cong-danh', label: 'Công Danh' },
                { id: 'giai-nghiep', label: 'Giải Deadline' },
              ].map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id as Prayer['category'])}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                    selectedCategory === c.id
                      ? 'bg-amber-600 text-white font-bold'
                      : 'bg-stone-850 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={3}
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              placeholder="Ghi lời ước nguyện chí thành của bạn... (Ví dụ: Cầu cho gia đình vạn sự an khang, công việc suôn sẻ, không còn trễ deadline, tâm luôn hoan hỷ)"
              className="w-full p-3 rounded-xl bg-stone-950/90 border border-stone-700 text-stone-100 text-xs sm:text-sm placeholder:text-stone-500 focus:outline-none focus:border-amber-400"
              maxLength={250}
            />
            <span className="absolute bottom-2.5 right-3 text-[10px] text-stone-500 font-mono">
              {inputContent.length}/250
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[11px] text-stone-400 italic">
              "Tâm tưởng sự thành, phước lành lưu chuyển."
            </span>

            <button
              type="submit"
              disabled={!inputContent.trim() || isSubmitting}
              className={`px-5 py-2 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer ${
                inputContent.trim()
                  ? 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-stone-950 active:scale-95'
                  : 'bg-stone-800 text-stone-500 cursor-not-allowed'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Treo Thẻ Cầu An</span>
            </button>
          </div>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="w-full flex items-center justify-between gap-2 pb-4 overflow-x-auto scrollbar-none border-b border-stone-800 mb-6 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-stone-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Lọc:
          </span>
          {[
            { id: 'all', label: 'Tất Cả' },
            { id: 'binh-an', label: '🕊️ Bình An' },
            { id: 'tai-loc', label: '💰 Tài Lộc' },
            { id: 'tinh-duyen', label: '❤️ Tình Duyên' },
            { id: 'cong-danh', label: '📜 Công Danh' },
            { id: 'giai-nghiep', label: '⚡ Giải Nghiệp' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === tab.id
                  ? 'bg-amber-600/30 text-amber-300 font-bold border border-amber-500/50'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-stone-400 text-xs hidden sm:inline font-mono">
          {filteredPrayers.length} lời nguyện cầu
        </span>
      </div>

      {/* Grid of Wooden Prayer Plaques (Thẻ Cầu An) */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPrayers.map((prayer) => {
          const catInfo = categoryLabels[prayer.category] || categoryLabels['binh-an'];

          return (
            <div
              key={prayer.id}
              className={`relative flex flex-col justify-between p-4 rounded-xl border shadow-lg transition-transform hover:-translate-y-1 ${catInfo.border}`}
            >
              {/* Plaque Top Hole & Red Cord (Like traditional temple wishing plaque) */}
              <div className="w-full flex justify-center -mt-6 mb-2">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-stone-950 border border-stone-700 shadow-inner" />
                  <div className="w-0.5 h-3 bg-red-600" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-serif font-bold text-amber-300 truncate">
                    {prayer.authorName}
                  </span>
                  <span className="text-[10px] text-stone-400 px-2 py-0.5 rounded bg-stone-950/60 border border-stone-800">
                    {catInfo.icon} {catInfo.label}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-serif italic mb-4">
                  "{prayer.content}"
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
                <span className="text-[10px]">{prayer.createdAt}</span>

                <button
                  onClick={() => handleBless(prayer.id)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-900/80 hover:bg-stone-800 text-rose-300 border border-rose-500/30 cursor-pointer active:scale-95 transition-all group"
                  title="Tùy hỷ chúc phúc"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-500/30 group-hover:scale-125 transition-transform" />
                  <span className="text-[11px] font-semibold">{prayer.blessingsCount} Tùy Hỷ</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
