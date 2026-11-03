import React from 'react';
import { TempleTab } from '../types/temple';
import { Volume2, VolumeX, Sparkles, Music } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface NavbarProps {
  activeTab: TempleTab;
  onTabChange: (tab: TempleTab) => void;
  userDharmaName: string;
  userMerits: number;
  onOpenUserModal: () => void;
  onOpenShareModal: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isAmbientOn: boolean;
  onToggleAmbient: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  userDharmaName,
  userMerits,
  onOpenUserModal,
  onOpenShareModal,
  isMuted,
  onToggleMute,
  isAmbientOn,
  onToggleAmbient,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-900/40 bg-stone-950/90 backdrop-blur-md px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onTabChange('chanh-dien')}
            className="text-left group flex items-center gap-2 cursor-pointer focus:outline-none"
          >
            <span className="text-xl font-bold tracking-tight text-amber-300 font-serif whitespace-nowrap shrink-0 group-hover:text-amber-200 transition-colors">
              Chùa Online
            </span>
            <span className="hidden sm:inline-block text-[11px] uppercase tracking-wider text-amber-500/80 font-medium whitespace-nowrap">
              Tịnh Độ Trực Tuyến
            </span>
          </button>
        </div>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onTabChange('chanh-dien')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer border-b-2 ${
              activeTab === 'chanh-dien'
                ? 'text-amber-400 border-amber-400 font-semibold'
                : 'text-stone-300 border-transparent hover:text-amber-200'
            }`}
          >
            Chánh Điện
          </button>

          <button
            onClick={() => onTabChange('go-mo')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer border-b-2 ${
              activeTab === 'go-mo'
                ? 'text-amber-400 border-amber-400 font-semibold'
                : 'text-stone-300 border-transparent hover:text-amber-200'
            }`}
          >
            Gõ Mõ Tích Đức
          </button>

          <button
            onClick={() => onTabChange('le-bai')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer border-b-2 ${
              activeTab === 'le-bai'
                ? 'text-amber-400 border-amber-400 font-semibold'
                : 'text-stone-300 border-transparent hover:text-amber-200'
            }`}
          >
            Dâng Hương & Lễ Phật
          </button>

          <button
            onClick={() => onTabChange('gieo-que')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer border-b-2 ${
              activeTab === 'gieo-que'
                ? 'text-amber-400 border-amber-400 font-semibold'
                : 'text-stone-300 border-transparent hover:text-amber-200'
            }`}
          >
            Gieo Quẻ Đầu Ngày
          </button>

          <button
            onClick={() => onTabChange('nguyen-uoc')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer border-b-2 ${
              activeTab === 'nguyen-uoc'
                ? 'text-amber-400 border-amber-400 font-semibold'
                : 'text-stone-300 border-transparent hover:text-amber-200'
            }`}
          >
            Tường Nguyện Ước
          </button>

          <button
            onClick={() => onTabChange('bang-vang')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer border-b-2 ${
              activeTab === 'bang-vang'
                ? 'text-amber-400 border-amber-400 font-semibold'
                : 'text-stone-300 border-transparent hover:text-amber-200'
            }`}
          >
            Bảng Vàng Đồng Tu
          </button>
        </nav>

        {/* Zone 3: 1 primary action & sound controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Zen Ambient music toggle */}
          <button
            onClick={onToggleAmbient}
            title={isAmbientOn ? 'Tắt nhạc thiền' : 'Bật nhạc thiền thư giãn'}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              isAmbientOn
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-xs">{isAmbientOn ? 'Nhạc Thiền: Bật' : 'Nhạc Thiền'}</span>
          </button>

          {/* Share & Public Export button */}
          <button
            onClick={onOpenShareModal}
            title="Xuất bản & Chia sẻ link công khai"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-850 text-amber-300 border border-amber-600/40 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>📤</span>
            <span className="hidden sm:inline">Xuất Bản & Chia Sẻ</span>
          </button>

          {/* Sound mute toggle */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              isMuted
                ? 'bg-stone-900 border-stone-800 text-stone-500'
                : 'bg-amber-950/60 border-amber-800/80 text-amber-300 hover:text-amber-200'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Primary Action Button: User Dharma Profile */}
          <button
            onClick={onOpenUserModal}
            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-50 font-medium text-xs rounded-lg shadow-md border border-amber-400/40 transition-all cursor-pointer whitespace-nowrap shrink-0 group"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="font-semibold">{userDharmaName}</span>
            <span className="text-amber-200 font-mono text-[11px] tabular-nums bg-amber-900/60 px-1.5 py-0.5 rounded border border-amber-500/30">
              +{userMerits}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex items-center justify-between gap-1 overflow-x-auto pt-2 mt-2 border-t border-amber-950/60 text-xs scrollbar-none">
        <button
          onClick={() => onTabChange('chanh-dien')}
          className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 ${
            activeTab === 'chanh-dien' ? 'bg-amber-600/30 text-amber-300 font-semibold' : 'text-stone-400'
          }`}
        >
          Chánh Điện
        </button>
        <button
          onClick={() => onTabChange('go-mo')}
          className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 ${
            activeTab === 'go-mo' ? 'bg-amber-600/30 text-amber-300 font-semibold' : 'text-stone-400'
          }`}
        >
          Gõ Mõ
        </button>
        <button
          onClick={() => onTabChange('le-bai')}
          className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 ${
            activeTab === 'le-bai' ? 'bg-amber-600/30 text-amber-300 font-semibold' : 'text-stone-400'
          }`}
        >
          Lễ Bái
        </button>
        <button
          onClick={() => onTabChange('gieo-que')}
          className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 ${
            activeTab === 'gieo-que' ? 'bg-amber-600/30 text-amber-300 font-semibold' : 'text-stone-400'
          }`}
        >
          Gieo Quẻ
        </button>
        <button
          onClick={() => onTabChange('nguyen-uoc')}
          className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 ${
            activeTab === 'nguyen-uoc' ? 'bg-amber-600/30 text-amber-300 font-semibold' : 'text-stone-400'
          }`}
        >
          Nguyện Ước
        </button>
        <button
          onClick={() => onTabChange('bang-vang')}
          className={`px-2.5 py-1 rounded whitespace-nowrap shrink-0 ${
            activeTab === 'bang-vang' ? 'bg-amber-600/30 text-amber-300 font-semibold' : 'text-stone-400'
          }`}
        >
          Bảng Vàng
        </button>
      </div>
    </header>
  );
};
