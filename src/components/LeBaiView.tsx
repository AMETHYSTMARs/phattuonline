import React, { useState } from 'react';
import { AltarOfferings } from '../types/temple';
import { soundEngine } from '../audio/soundEngine';
import confetti from 'canvas-confetti';
import { Flame, Sparkles, Check, Heart, Award, Gift, ArrowRight } from 'lucide-react';

interface LeBaiViewProps {
  offerings: AltarOfferings;
  onUpdateOfferings: (updater: (prev: AltarOfferings) => AltarOfferings) => void;
  onAddMerit: (amount: number) => void;
  userDharmaName: string;
}

export const LeBaiView: React.FC<LeBaiViewProps> = ({
  offerings,
  onUpdateOfferings,
  onAddMerit,
  userDharmaName,
}) => {
  const [selectedVowType, setSelectedVowType] = useState<string>('binh-an');
  const [customVowText, setCustomVowText] = useState<string>('');
  const [activeBlessingCertificate, setActiveBlessingCertificate] = useState<{
    id: string;
    vowName: string;
    prayer: string;
    time: string;
  } | null>(null);

  // Light 3 sticks of incense
  const handleLightIncense = () => {
    soundEngine.playBell();
    onUpdateOfferings((prev) => ({
      ...prev,
      incenseLit: true,
      incenseSticks: 3,
      incenseTimeRemaining: 180, // 3 minutes
    }));
    onAddMerit(20);
  };

  // Offer Lotus Flower
  const handleOfferFlowers = () => {
    soundEngine.playSingingBowl();
    onUpdateOfferings((prev) => ({
      ...prev,
      flowersOffered: true,
    }));
    onAddMerit(15);
  };

  // Offer Five-Fruit Tray
  const handleOfferFruit = () => {
    soundEngine.playSingingBowl();
    onUpdateOfferings((prev) => ({
      ...prev,
      fruitOffered: true,
    }));
    onAddMerit(15);
  };

  // Light Lotus Lamp
  const handleLightLamp = () => {
    soundEngine.playSingingBowl();
    onUpdateOfferings((prev) => ({
      ...prev,
      lampLit: true,
    }));
    onAddMerit(15);
  };

  // Drop Coin into Merit Box
  const handleDropMeritCoin = (amount: number, vowLabel: string) => {
    soundEngine.playCoinDrop();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f59e0b', '#fbbf24', '#d97706', '#ffffff'],
      });
    } catch {
      // Ignore
    }

    onAddMerit(amount);
    onUpdateOfferings((prev) => ({
      ...prev,
      totalMeritOffered: prev.totalMeritOffered + amount,
    }));

    const vowMap: Record<string, string> = {
      'binh-an': 'Gia đạo bình an, tâm hồn thanh thản, tai qua nạn khỏi, vạn sự cát tường như ý.',
      'tai-loc': 'Kinh doanh phát đạt, khách đến nườm nượp, công nợ thu hồi, tài lộc dồi dào sung túc.',
      'tinh-duyen': 'Gặp người tri kỷ tâm đầu ý hợp, trăm năm hòa thuận, sớm nên duyên lành.',
      'cong-danh': 'Công việc hanh thông, thi cử đỗ đạt, sếp thương đồng nghiệp quý, thăng tiến vững vàng.',
      'deadline': 'Deadline tan biến như bọt nước, task chạy mượt mà, không bug, tan ca đúng giờ!',
    };

    setActiveBlessingCertificate({
      id: Date.now().toString(),
      vowName: vowLabel,
      prayer: customVowText.trim() || vowMap[selectedVowType] || 'Vạn sự hanh thông, bồ đề tâm kiên cố.',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* Altar Presentation Card */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-amber-900/60 shadow-2xl bg-gradient-to-b from-stone-900 via-amber-950/40 to-stone-950 p-6 sm:p-10 mb-8">
        {/* Subtle decorative temple halo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-radial from-amber-400/15 via-yellow-500/5 to-transparent blur-3xl pointer-events-none" />

        {/* Sacred Altar Heading */}
        <div className="relative z-10 text-center mb-8">
          <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold">
            Trang Nghiêm Thanh Tịnh
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-amber-300 mt-1">
            Chánh Điện Dâng Hương & Lễ Bái
          </h2>
          <p className="text-xs text-stone-300 mt-2 max-w-lg mx-auto">
            "Hương giới, hương định, cùng hương huệ / Bừng sáng quang minh khắp mười phương."
          </p>
        </div>

        {/* Altar Visual Representation */}
        <div className="relative z-10 flex flex-col items-center justify-center my-6">
          {/* Golden Buddha Statue Figure */}
          <div className="relative w-40 h-44 sm:w-52 sm:h-56 flex flex-col items-center justify-center">
            {/* Halo ring */}
            <div className="absolute inset-0 rounded-full border-2 border-amber-400/40 shadow-[0_0_30px_rgba(245,158,11,0.3)] animate-pulse" />
            <div className="text-6xl sm:text-8xl select-none filter drop-shadow-[0_10px_20px_rgba(245,158,11,0.4)]">
              🧘‍♂️
            </div>
            <span className="text-xs font-serif font-bold text-amber-300 mt-2 bg-stone-950/80 px-3 py-0.5 rounded-full border border-amber-500/40">
              Đức Bổn Sư Thích Ca Mâu Ni
            </span>
          </div>

          {/* Offerings Placed on the Altar Table */}
          <div className="w-full max-w-xl mt-6 pt-4 border-t-2 border-amber-800/60 flex items-center justify-around gap-2 text-center bg-stone-900/60 rounded-xl p-3 backdrop-blur-xs">
            {/* Lotus Flowers */}
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl select-none">{offerings.flowersOffered ? '🪷' : '🪴'}</span>
              <span className="text-[11px] font-medium text-amber-200 mt-1">
                {offerings.flowersOffered ? 'Hoa Sen Tươi' : 'Bình Hoa Trống'}
              </span>
            </div>

            {/* Incense Burner (Lư Hương) with Smoke */}
            <div className="relative flex flex-col items-center">
              {offerings.incenseLit && (
                <div className="absolute -top-10 flex items-center justify-center gap-1.5 pointer-events-none">
                  <div className="w-0.5 h-10 bg-gradient-to-t from-red-500 via-amber-300 to-transparent blur-[0.5px] animate-[pulse_1.5s_infinite]" />
                  <div className="w-0.5 h-12 bg-gradient-to-t from-orange-500 via-amber-300 to-transparent blur-[0.5px] animate-[pulse_2s_infinite]" />
                  <div className="w-0.5 h-10 bg-gradient-to-t from-red-500 via-amber-300 to-transparent blur-[0.5px] animate-[pulse_1.8s_infinite]" />
                </div>
              )}
              <div className="w-12 h-9 rounded-b-xl rounded-t-sm bg-gradient-to-b from-amber-700 via-yellow-800 to-stone-900 border-2 border-amber-400 shadow-md flex items-center justify-center">
                <span className="text-xs font-bold text-amber-200">香</span>
              </div>
              <span className="text-[11px] font-medium text-amber-300 mt-1">
                {offerings.incenseLit ? 'Hương Đang Ngát' : 'Lư Trầm Hương'}
              </span>
            </div>

            {/* Five-Fruit Tray */}
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl select-none">{offerings.fruitOffered ? '🍇' : '🍽️'}</span>
              <span className="text-[11px] font-medium text-amber-200 mt-1">
                {offerings.fruitOffered ? 'Mâm Ngũ Quả' : 'Mâm Lễ'}
              </span>
            </div>

            {/* Lotus Oil Lamp */}
            <div className="flex flex-col items-center">
              <span className="text-2xl sm:text-3xl select-none">{offerings.lampLit ? '🪔' : '🕯️'}</span>
              <span className="text-[11px] font-medium text-amber-200 mt-1">
                {offerings.lampLit ? 'Đèn Tuệ Giác' : 'Đèn Sen'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Offerings Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
          <button
            onClick={handleLightIncense}
            className={`flex flex-col items-center p-3 rounded-xl border transition-all cursor-pointer ${
              offerings.incenseLit
                ? 'bg-amber-950/40 border-amber-500 text-amber-300 shadow-sm'
                : 'bg-stone-900 hover:bg-stone-850 border-stone-800 text-stone-300 hover:border-amber-600'
            }`}
          >
            <Flame className="w-5 h-5 text-orange-400 mb-1" />
            <span className="text-xs font-bold">{offerings.incenseLit ? 'Thắp Lại Hương' : 'Thắp 3 Nén Hương'}</span>
            <span className="text-[10px] text-amber-400 font-mono mt-0.5">+20 Công Đức</span>
          </button>

          <button
            onClick={handleOfferFlowers}
            className={`flex flex-col items-center p-3 rounded-xl border transition-all cursor-pointer ${
              offerings.flowersOffered
                ? 'bg-amber-950/40 border-amber-500 text-amber-300 shadow-sm'
                : 'bg-stone-900 hover:bg-stone-850 border-stone-800 text-stone-300 hover:border-amber-600'
            }`}
          >
            <span className="text-xl mb-1">🪷</span>
            <span className="text-xs font-bold">{offerings.flowersOffered ? 'Đã Dâng Hoa' : 'Dâng Hoa Sen'}</span>
            <span className="text-[10px] text-amber-400 font-mono mt-0.5">+15 Công Đức</span>
          </button>

          <button
            onClick={handleOfferFruit}
            className={`flex flex-col items-center p-3 rounded-xl border transition-all cursor-pointer ${
              offerings.fruitOffered
                ? 'bg-amber-950/40 border-amber-500 text-amber-300 shadow-sm'
                : 'bg-stone-900 hover:bg-stone-850 border-stone-800 text-stone-300 hover:border-amber-600'
            }`}
          >
            <span className="text-xl mb-1">🍇</span>
            <span className="text-xs font-bold">{offerings.fruitOffered ? 'Đã Dâng Trái Cây' : 'Dâng Mâm Ngũ Quả'}</span>
            <span className="text-[10px] text-amber-400 font-mono mt-0.5">+15 Công Đức</span>
          </button>

          <button
            onClick={handleLightLamp}
            className={`flex flex-col items-center p-3 rounded-xl border transition-all cursor-pointer ${
              offerings.lampLit
                ? 'bg-amber-950/40 border-amber-500 text-amber-300 shadow-sm'
                : 'bg-stone-900 hover:bg-stone-850 border-stone-800 text-stone-300 hover:border-amber-600'
            }`}
          >
            <Sparkles className="w-5 h-5 text-yellow-400 mb-1" />
            <span className="text-xs font-bold">{offerings.lampLit ? 'Đèn Đang Sáng' : 'Thắp Đèn Dầu Sen'}</span>
            <span className="text-[10px] text-amber-400 font-mono mt-0.5">+15 Công Đức</span>
          </button>
        </div>
      </div>

      {/* Virtual Merit Box (Hòm Công Đức Ảo & Khấn Nguyện) */}
      <div className="w-full rounded-2xl bg-stone-900/90 border border-stone-800 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
          <div>
            <h3 className="text-lg font-serif font-bold text-amber-300 flex items-center gap-2">
              <Gift className="w-5 h-5 text-amber-400" />
              Hòm Công Đức Tùy Tâm & Sớ Cầu An
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Gửi gắm tâm nguyện chí thành, hồi hướng công đức cho gia đạo và muôn loài chúng sanh.
            </p>
          </div>

          <div className="text-xs bg-amber-950/60 px-3 py-1.5 rounded-lg border border-amber-800/80 text-amber-200">
            Phật tử: <strong className="text-amber-300 font-serif">{userDharmaName}</strong>
          </div>
        </div>

        {/* Vow Category Selector */}
        <div className="mt-6">
          <label className="text-xs font-semibold text-stone-300 block mb-2">Chọn Tâm Nguyện Cầu Khấn:</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'binh-an', label: 'Cầu Bình An', icon: '🕊️' },
              { id: 'tai-loc', label: 'Cầu Tài Lộc', icon: '💰' },
              { id: 'tinh-duyen', label: 'Cầu Duyên Lành', icon: '❤️' },
              { id: 'cong-danh', label: 'Cầu Công Danh', icon: '📜' },
              { id: 'deadline', label: 'Cầu Xóa Deadline', icon: '⚡' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedVowType(cat.id)}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                  selectedVowType === cat.id
                    ? 'bg-amber-600/30 border-amber-400 text-amber-300 font-bold shadow'
                    : 'bg-stone-850 border-stone-800 text-stone-300 hover:bg-stone-800'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Prayer Input */}
        <div className="mt-4">
          <label className="text-xs font-semibold text-stone-300 block mb-1">
            Lời Khấn Nguyện Của Bạn (Tùy chọn):
          </label>
          <input
            type="text"
            value={customVowText}
            onChange={(e) => setCustomVowText(e.target.value)}
            placeholder="Ví dụ: Cầu cho cả nhà luôn mạnh khỏe, công việc hanh thông, sớm thăng chức tăng lương..."
            className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-200 text-xs focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Donation Coin Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-stone-800">
          <div className="text-xs text-stone-400">
            Thả xu công đức tích lũy: <strong className="text-amber-300 font-mono">+{offerings.totalMeritOffered}</strong>
          </div>

          <div className="flex items-center gap-2">
            {[
              { label: 'Thả 1 Đồng Xu', amount: 10 },
              { label: 'Thả 5 Đồng Xu', amount: 50 },
              { label: 'Thả 1 Thỏi Vàng', amount: 100 },
            ].map((btn) => (
              <button
                key={btn.amount}
                onClick={() => handleDropMeritCoin(btn.amount, btn.label)}
                className="px-3 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-xs shadow-md border border-amber-400/40 cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span>🪙</span>
                <span>{btn.label} (+{btn.amount})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sacred Blessing Certificate Modal / Card */}
      {activeBlessingCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-stone-900 via-amber-950/60 to-stone-950 border-2 border-amber-400 p-6 sm:p-8 shadow-2xl text-center">
            <span className="text-4xl block mb-2">📜</span>
            <span className="text-xs font-semibold text-amber-500 uppercase tracking-widest">
              Chứng Nhận Công Đức Linh Ứng
            </span>
            <h4 className="text-xl font-serif font-bold text-amber-300 mt-1">Sớ Khấn Cầu An Lạc</h4>

            <div className="my-5 p-4 rounded-xl bg-stone-950/80 border border-amber-900/60 text-left text-xs space-y-2 text-stone-300">
              <div>
                <span className="text-stone-400">Đồng tu:</span>{' '}
                <strong className="text-amber-300">{userDharmaName}</strong>
              </div>
              <div>
                <span className="text-stone-400">Tâm nguyện:</span>{' '}
                <span className="text-amber-200 font-semibold">{activeBlessingCertificate.vowName}</span>
              </div>
              <div className="pt-2 border-t border-stone-800 text-amber-100 italic">
                "{activeBlessingCertificate.prayer}"
              </div>
              <div className="text-[11px] text-stone-500 text-right pt-1">
                Thời khắc: {activeBlessingCertificate.time}
              </div>
            </div>

            <p className="text-xs text-amber-300/90 font-serif italic mb-6">
              "Phật chứng lòng thành, vạn sự hanh thông, tai ương tiêu tán, phước huệ trang nghiêm."
            </p>

            <button
              onClick={() => setActiveBlessingCertificate(null)}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow-lg cursor-pointer transition-colors"
            >
              Hoan Hỷ Tiếp Nhận
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
