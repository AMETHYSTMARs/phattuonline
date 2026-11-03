import React, { useState, useEffect } from 'react';
import { Monk, FloatingText } from '../types/temple';
import { MonkAvatar } from './MonkAvatar';
import { soundEngine } from '../audio/soundEngine';
import { Bell, Sparkles, UserCheck, MessageSquare, Flame, Heart, Info, Eye } from 'lucide-react';

interface ChanhDienViewProps {
  monks: Monk[];
  userMonk: Monk;
  onSelectMonk: (monk: Monk) => void;
  onFastTapWoodenFish: (e: React.MouseEvent) => void;
  floatingTexts: FloatingText[];
  onOpenUserModal: () => void;
  onOpenLeBaiTab: () => void;
  onOpenShareModal: () => void;
  meditationSeconds: number;
}

export const ChanhDienView: React.FC<ChanhDienViewProps> = ({
  monks,
  userMonk,
  onSelectMonk,
  onFastTapWoodenFish,
  floatingTexts,
  onOpenUserModal,
  onOpenLeBaiTab,
  onOpenShareModal,
  meditationSeconds,
}) => {
  const [activeSpeechBubble, setActiveSpeechBubble] = useState<{
    monkName: string;
    text: string;
    x: number;
    y: number;
  } | null>(null);

  const [viewMode, setViewMode] = useState<'hall' | 'grid'>('hall');
  const [isIncenseSmoking, setIsIncenseSmoking] = useState(true);

  // Format meditation time (mm:ss)
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Predefined coordinates mapped to cushions in the temple photo
  const cushionHotspots = [
    // Front Row
    { id: 'monk-front-center', label: 'Thích Lắp Cam', top: '88%', left: '43%', isFront: true },
    { id: 'monk-1', label: 'Thích Chốt Đơn', top: '84%', left: '18%' },
    { id: 'monk-user', label: userMonk.dharmaName, top: '85%', left: '58%', isUser: true },
    { id: 'monk-3', label: 'Thích Báo Giá', top: '73%', left: '58%' },
    { id: 'monk-4', label: 'Thích Ép Giá', top: '74%', left: '85%' },
    { id: 'monk-2', label: 'Thích Chiết Khấu', top: '70%', left: '41%' },

    // Middle Rows
    { id: 'monk-5', label: 'Thích Công Nợ', top: '70%', left: '23%' },
    { id: 'monk-6', label: 'Thích Tồn Kho', top: '67%', left: '6%' },
    { id: 'monk-7', label: 'Thích Đòi Nợ', top: '62%', left: '43%' },
    { id: 'monk-8', label: 'Thích Bảo Hành', top: '62%', left: '57%' },
    { id: 'monk-9', label: 'Thích Chuyển Khoản', top: '64%', left: '32%' },
    { id: 'monk-10', label: 'Thích Tiền Cọc', top: '56%', left: '33%' },
    { id: 'monk-11', label: 'Thích Tiền Mặt', top: '56%', left: '44%' },
    { id: 'monk-12', label: 'Thích Hỏi Giá', top: '60%', left: '89%' },
    { id: 'monk-13', label: 'Thích Quét Mã', top: '65%', left: '86%' },
    { id: 'monk-14', label: 'Thích Leo Thang', top: '64%', left: '69%' },

    // Back Rows
    { id: 'monk-15', label: 'Thích Mọi Thứ', top: '57%', left: '66%' },
    { id: 'monk-16', label: 'Thích Dự Án', top: '56%', left: '54%' },
    { id: 'monk-17', label: 'Thích Nhập Sỉ', top: '53%', left: '63%' },
    { id: 'monk-18', label: 'Thích Nhập Lẻ', top: '50%', left: '43%' },
    { id: 'monk-19', label: 'Thích Chia Vlan', top: '54%', left: '82%' },
    { id: 'monk-20', label: 'Thích Đi Dây', top: '57%', left: '94%' },
    { id: 'monk-21', label: 'Thích Cài Khách', top: '52%', left: '35%' },
    { id: 'monk-22', label: 'Thích Solar', top: '53%', left: '29%' },
    { id: 'monk-23', label: 'Thích Cam Wifi', top: '55%', left: '23%' },
    { id: 'monk-24', label: 'Thích Ôm Hàng', top: '61%', left: '18%' },
    { id: 'monk-25', label: 'Thích DSS', top: '53%', left: '16%' },
    { id: 'monk-26', label: 'Thích Phá Giá', top: '53%', left: '3%' },
    { id: 'monk-27', label: 'Thích Lắp Mạng', top: '58%', left: '9%' },
    { id: 'monk-28', label: 'Thích Tiểu Thư', top: '45%', left: '20%' },
  ];

  // Random speech bubbles every few seconds for living temple atmosphere
  useEffect(() => {
    const quotes = [
      { name: 'Thích Chốt Đơn', text: 'Vừa chốt xong 5 combo mõ gỗ! 🙏' },
      { name: 'Thích Lắp Cam', text: 'Camera soi thấy lòng ai còn vương vấn deadline...' },
      { name: 'Thích Công Nợ', text: 'Tu tâm dưỡng tính, nợ nần qua tháng sau tính tiếp.' },
      { name: 'Thích Chiết Khấu', text: 'Giảm giá 50% phiền muộn trần gian.' },
      { name: 'Thích Tan Ca', text: 'Sắp đến giờ chuông điểm tan ca rồi các đồng tu ơi!' },
      { name: 'Thích Tăng Lương', text: 'Nam Mô A Di Đà Phật, cầu tháng này sếp duyệt review lương.' },
      { name: 'Thích Hết Deadline', text: 'Buông bỏ task gấp, tâm an vạn sự an.' },
      { name: 'Thích Chuyển Khoản', text: 'Ting ting một tiếng tan biến ngàn nỗi sầu.' },
      { name: 'Thích Fix Bug', text: 'Code không bug như tâm không vướng nghiệp.' },
      { name: 'Thích Đòi Nợ', text: 'Nhắn nhẹ nhàng thôi kẻo mất phước...' },
    ];

    const interval = setInterval(() => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      const randomX = 25 + Math.random() * 50;
      const randomY = 55 + Math.random() * 25;

      setActiveSpeechBubble({
        monkName: randomQuote.name,
        text: randomQuote.text,
        x: randomX,
        y: randomY,
      });

      // Clear after 4 seconds
      setTimeout(() => {
        setActiveSpeechBubble((prev) => (prev?.text === randomQuote.text ? null : prev));
      }, 4000);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleRingBell = () => {
    soundEngine.playBell();
  };

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Top Context Sub-Bar */}
      <div className="w-full max-w-7xl px-4 py-2 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-300">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-amber-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
            Đạo Tràng Chánh Điện
          </span>
          <span className="text-stone-500">|</span>
          <span>
            Đồng tu đang tọa thiền:{' '}
            <strong className="text-amber-200 font-mono tabular-nums">{monks.length + 128}</strong>
          </span>
          <span className="text-stone-500">|</span>
          <span>
            Thời gian tịnh tâm: <strong className="text-amber-300 font-mono tabular-nums">{formatTime(meditationSeconds)}</strong>
          </span>
        </div>

        {/* View Mode Switch & Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'hall' ? 'grid' : 'hall')}
            className="flex items-center gap-1.5 px-3 py-1 bg-stone-900 hover:bg-stone-800 text-stone-200 rounded border border-stone-700/80 cursor-pointer transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>{viewMode === 'hall' ? 'Danh Sách Bồ Đoàn' : 'Góc Nhìn Toàn Cảnh'}</span>
          </button>

          <button
            onClick={onOpenShareModal}
            className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-amber-100 rounded border border-amber-500/60 cursor-pointer transition-colors shadow-sm font-medium"
          >
            <span>📤</span>
            <span>Xuất Ảnh & Link</span>
          </button>
        </div>
      </div>

      {/* Main Temple Canvas / Stage */}
      <div className="relative w-full max-w-7xl mx-auto rounded-2xl overflow-hidden border border-amber-900/40 shadow-2xl bg-stone-950 aspect-[16/10] sm:aspect-[16/9.2]">
        {viewMode === 'hall' ? (
          /* Real Image Canvas replicating the exact user screenshot */
          <div className="relative w-full h-full select-none">
            {/* The Authentic Temple Photo as Background */}
            <img
              src="/assets/aistudio/image_4eb58d9f.png"
              alt="Chánh Điện Chùa Online - Đạo Tràng Tu Online"
              className="w-full h-full object-cover object-center pointer-events-none"
              referrerPolicy="no-referrer"
            />

            {/* Subtle Vignette & Atmospheric Candle Glow Overlay */}
            <div className="absolute inset-0 bg-radial from-transparent via-stone-950/10 to-stone-950/60 pointer-events-none" />

            {/* Rising Incense Smoke Animation at Altar (Center top) */}
            {isIncenseSmoking && (
              <div className="absolute top-[38%] left-1/2 -translate-x-1/2 flex items-center justify-center gap-4 pointer-events-none opacity-70">
                <div className="w-1 h-12 bg-gradient-to-t from-red-500/80 via-amber-300/40 to-transparent blur-[1px] animate-[pulse_2s_ease-in-out_infinite]" />
                <div className="w-1 h-14 bg-gradient-to-t from-orange-500/80 via-amber-300/50 to-transparent blur-[1px] animate-[pulse_2.5s_ease-in-out_infinite]" />
                <div className="w-1 h-12 bg-gradient-to-t from-red-500/80 via-amber-300/40 to-transparent blur-[1px] animate-[pulse_2.2s_ease-in-out_infinite]" />
              </div>
            )}

            {/* Interactive Hotspots for Monks */}
            {cushionHotspots.map((spot) => {
              const monkData =
                spot.id === 'monk-user'
                  ? userMonk
                  : monks.find((m) => m.id === spot.id || m.dharmaName.toLowerCase() === spot.label.toLowerCase()) || {
                      id: spot.id,
                      dharmaName: spot.label,
                      avatarRobe: 'saffron',
                      expression: 'calm',
                      cushionIndex: 1,
                      meritPoints: 1200,
                      meditationMinutes: 45,
                      motto: 'Tâm an vạn sự tự nhiên an.',
                      blessingsReceived: 150,
                    };

              const isUser = spot.isUser;

              return (
                <div
                  key={spot.id}
                  style={{ top: spot.top, left: spot.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
                  onClick={() => onSelectMonk(monkData as Monk)}
                >
                  {/* Glowing Aura if User's monk */}
                  {isUser && (
                    <div className="absolute -inset-4 rounded-full bg-radial from-amber-400/50 via-yellow-300/20 to-transparent blur-md animate-pulse pointer-events-none" />
                  )}

                  {/* Monk Name Label Badge (Exact Style from photo) */}
                  <div
                    className={`px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-all transform group-hover:scale-110 shadow-lg ${
                      isUser
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 ring-2 ring-amber-300 font-bold scale-105'
                        : 'bg-stone-900/80 text-amber-100 backdrop-blur-xs border border-white/20 hover:border-amber-400/80 hover:bg-stone-900 hover:text-amber-300'
                    }`}
                  >
                    {isUser ? `★ ${spot.label} (Bạn)` : spot.label}
                  </div>

                  {/* Interactive Hotspot Indicator Dot */}
                  <div className="w-3 h-3 mx-auto mt-1 rounded-full bg-amber-400/40 border border-amber-300 group-hover:bg-amber-300 transition-colors shadow-sm" />
                </div>
              );
            })}

            {/* Active Speech Bubble */}
            {activeSpeechBubble && (
              <div
                style={{ top: `${activeSpeechBubble.y}%`, left: `${activeSpeechBubble.x}%` }}
                className="absolute z-30 -translate-x-1/2 -translate-y-full mb-2 max-w-xs animate-bounce"
              >
                <div className="bg-stone-950/95 text-amber-200 border border-amber-500/60 rounded-xl px-3 py-2 shadow-2xl backdrop-blur-md text-xs relative">
                  <div className="font-bold text-[11px] text-amber-400 mb-0.5 flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {activeSpeechBubble.monkName}:
                  </div>
                  <div>"{activeSpeechBubble.text}"</div>
                  {/* Pointer triangle */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-950" />
                </div>
              </div>
            )}

            {/* Floating Merits (+1 Công Đức) Canvas Overlay */}
            {floatingTexts.map((item) => (
              <div
                key={item.id}
                style={{ left: `${item.x}px`, top: `${item.y}px` }}
                className="pointer-events-none absolute z-50 text-amber-300 font-bold text-sm sm:text-base font-serif drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] animate-[floatUp_1.2s_ease-out_forwards]"
              >
                {item.text}
              </div>
            ))}
          </div>
        ) : (
          /* Grid View of Cushions & Monks for Easy Navigation */
          <div className="w-full h-full overflow-y-auto p-4 sm:p-6 bg-gradient-to-b from-stone-900 via-stone-950 to-stone-950">
            <div className="text-center mb-6">
              <h3 className="text-lg font-serif font-bold text-amber-300 mb-1">
                Danh Sách 48 Bồ Đoàn Đạo Tràng
              </h3>
              <p className="text-xs text-stone-400 max-w-md mx-auto">
                Bấm vào từng vị đồng tu để trò chuyện, xem châm ngôn tu tập hoặc tùy hỷ công đức.
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4 pb-12">
              {/* User Monk Cushion */}
              <div
                onClick={onOpenUserModal}
                className="flex flex-col items-center justify-between p-2 rounded-xl bg-gradient-to-b from-amber-900/40 to-stone-900/80 border-2 border-amber-400 shadow-lg cursor-pointer hover:scale-105 transition-transform relative group"
              >
                <span className="absolute -top-2 px-1.5 py-0.5 rounded-full bg-amber-500 text-stone-950 font-bold text-[9px] uppercase tracking-wider">
                  Bồ Đoàn Bạn
                </span>
                <MonkAvatar robeColor={userMonk.avatarRobe} expression={userMonk.expression} size="md" hasHalo={true} />
                <span className="text-[11px] font-bold text-amber-300 mt-2 text-center truncate max-w-full">
                  {userMonk.dharmaName}
                </span>
                <span className="text-[10px] text-amber-400 font-mono">+{userMonk.meritPoints} Đ</span>
              </div>

              {/* Fellow Monks */}
              {monks.map((monk) => (
                <div
                  key={monk.id}
                  onClick={() => onSelectMonk(monk)}
                  className="flex flex-col items-center justify-between p-2 rounded-xl bg-stone-900/60 border border-stone-800 hover:border-amber-500/60 shadow-md cursor-pointer hover:scale-105 transition-all group"
                >
                  <MonkAvatar robeColor={monk.avatarRobe} expression={monk.expression} size="md" />
                  <span className="text-[11px] font-semibold text-stone-200 mt-2 text-center group-hover:text-amber-300 transition-colors truncate max-w-full">
                    {monk.dharmaName}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">+{monk.meritPoints} Đ</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Floating Quick Action Overlay Bar at bottom of temple */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-2 rounded-full bg-stone-950/85 backdrop-blur-md border border-amber-800/60 shadow-2xl">
          {/* Quick Tap Wooden Fish Button */}
          <button
            onClick={onFastTapWoodenFish}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-medium text-xs shadow-md border border-amber-400/50 cursor-pointer active:scale-95 transition-all whitespace-nowrap"
          >
            <span>🐟</span>
            <span>Gõ Mõ (+1)</span>
          </button>

          {/* Light Incense Quick Action */}
          <button
            onClick={onOpenLeBaiTab}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-amber-200 text-xs border border-stone-700/80 cursor-pointer active:scale-95 transition-all whitespace-nowrap"
          >
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">Dâng Hương</span>
          </button>

          {/* User Dharma Info / Customize seat */}
          <button
            onClick={onOpenUserModal}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs border border-amber-600/40 cursor-pointer active:scale-95 transition-all whitespace-nowrap"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Đổi Bồ Đoàn</span>
          </button>
        </div>
      </div>

      {/* Guide text under the canvas */}
      <div className="w-full max-w-7xl px-4 py-3 flex items-center justify-between text-xs text-stone-400">
        <p className="flex items-center gap-1.5">
          <Info className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            Chạm vào bất kỳ vị đồng tu nào trên bồ đoàn để xem châm ngôn tu tập, gửi lời chúc an lành hoặc gõ phím{' '}
            <kbd className="px-1.5 py-0.5 rounded bg-stone-800 text-amber-300 font-mono text-[10px] border border-stone-700">
              Space
            </kbd>{' '}
            để gõ mõ tích đức.
          </span>
        </p>

        <div className="hidden sm:flex items-center gap-3 text-stone-500">
          <span>Khẩu hiệu: "Tâm an thì vạn sự an"</span>
          <span>·</span>
          <span>Pháp giới tịnh độ</span>
        </div>
      </div>
    </div>
  );
};
