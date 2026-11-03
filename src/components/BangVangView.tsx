import React, { useState } from 'react';
import { Monk } from '../types/temple';
import { MonkAvatar } from './MonkAvatar';
import { Award, Search, Trophy, Sparkles, Heart, Clock } from 'lucide-react';

interface BangVangViewProps {
  monks: Monk[];
  userMonk: Monk;
  onSelectMonk: (monk: Monk) => void;
}

export const BangVangView: React.FC<BangVangViewProps> = ({ monks, userMonk, onSelectMonk }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Combine user monk with other monks and sort by merits
  const allMonks = [userMonk, ...monks].sort((a, b) => b.meritPoints - a.meritPoints);

  const filteredMonks = allMonks.filter(
    (m) =>
      m.dharmaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.motto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const top3 = allMonks.slice(0, 3);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col items-center">
      {/* Title */}
      <div className="text-center mb-8">
        <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold">
          Tinh Tấn Tu Tập
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-amber-300 mt-1">
          Bảng Vàng Công Đức & Đạo Hữu Đồng Tu
        </h2>
        <p className="text-xs text-stone-300 mt-2 max-w-md mx-auto">
          Tuyên dương các vị Phật tử tinh tấn ngày đêm gõ mõ, tích phước đức sâu dày cho tự thân và tha nhân.
        </p>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 items-end">
        {/* Rank 2 (Silver) */}
        {top3[1] && (
          <div
            onClick={() => onSelectMonk(top3[1])}
            className="order-2 md:order-1 flex flex-col items-center p-5 rounded-2xl bg-gradient-to-b from-stone-900 to-stone-950 border border-slate-400/40 shadow-xl cursor-pointer hover:scale-102 transition-transform relative"
          >
            <div className="w-7 h-7 rounded-full bg-slate-300 text-stone-950 font-bold text-xs flex items-center justify-center mb-2 shadow">
              2
            </div>
            <MonkAvatar robeColor={top3[1].avatarRobe} expression={top3[1].expression} size="lg" />
            <h4 className="text-sm font-bold text-amber-200 mt-3 truncate max-w-full">
              {top3[1].dharmaName}
            </h4>
            <span className="text-xs text-amber-400 font-mono font-semibold tabular-nums mt-0.5">
              +{top3[1].meritPoints.toLocaleString()} Công Đức
            </span>
            <p className="text-[11px] text-stone-400 text-center italic mt-2 line-clamp-2">
              "{top3[1].motto}"
            </p>
          </div>
        )}

        {/* Rank 1 (Gold - Center & Elevated) */}
        {top3[0] && (
          <div
            onClick={() => onSelectMonk(top3[0])}
            className="order-1 md:order-2 flex flex-col items-center p-6 rounded-2xl bg-gradient-to-b from-amber-950/60 via-stone-900 to-stone-950 border-2 border-amber-400 shadow-2xl cursor-pointer hover:scale-105 transition-transform relative z-10"
          >
            <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-stone-950 font-bold text-xs uppercase tracking-wider shadow flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 fill-current" /> Quán Quân Tinh Tấn
            </div>
            <MonkAvatar
              robeColor={top3[0].avatarRobe}
              expression={top3[0].expression}
              size="xl"
              hasHalo={true}
            />
            <h4 className="text-base font-bold text-amber-300 mt-3 truncate max-w-full">
              {top3[0].dharmaName}
            </h4>
            <span className="text-sm text-yellow-300 font-mono font-bold tabular-nums mt-0.5">
              +{top3[0].meritPoints.toLocaleString()} Công Đức
            </span>
            <p className="text-xs text-amber-100/90 text-center italic mt-2 line-clamp-2">
              "{top3[0].motto}"
            </p>
          </div>
        )}

        {/* Rank 3 (Bronze) */}
        {top3[2] && (
          <div
            onClick={() => onSelectMonk(top3[2])}
            className="order-3 flex flex-col items-center p-5 rounded-2xl bg-gradient-to-b from-stone-900 to-stone-950 border border-amber-700/40 shadow-xl cursor-pointer hover:scale-102 transition-transform relative"
          >
            <div className="w-7 h-7 rounded-full bg-amber-700 text-white font-bold text-xs flex items-center justify-center mb-2 shadow">
              3
            </div>
            <MonkAvatar robeColor={top3[2].avatarRobe} expression={top3[2].expression} size="lg" />
            <h4 className="text-sm font-bold text-amber-200 mt-3 truncate max-w-full">
              {top3[2].dharmaName}
            </h4>
            <span className="text-xs text-amber-400 font-mono font-semibold tabular-nums mt-0.5">
              +{top3[2].meritPoints.toLocaleString()} Công Đức
            </span>
            <p className="text-[11px] text-stone-400 text-center italic mt-2 line-clamp-2">
              "{top3[2].motto}"
            </p>
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="w-full flex items-center justify-between gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm pháp danh (vd: chốt đơn, deadline, cam, nợ...)"
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-400"
          />
        </div>

        <span className="text-xs text-stone-400 hidden sm:inline">
          Tổng cộng: <strong className="text-amber-300 font-mono">{filteredMonks.length}</strong> đồng tu
        </span>
      </div>

      {/* Table of Monks */}
      <div className="w-full rounded-2xl bg-stone-900/80 border border-stone-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950/80 text-stone-400 uppercase tracking-wider text-[10px] border-b border-stone-800">
              <tr>
                <th className="py-3 px-4">Hạng</th>
                <th className="py-3 px-4">Đồng Tu</th>
                <th className="py-3 px-4 hidden sm:table-cell">Châm Ngôn Tu Tập</th>
                <th className="py-3 px-4 text-right">Công Đức</th>
                <th className="py-3 px-4 text-right">Tọa Thiền</th>
                <th className="py-3 px-4 text-center">Tùy Hỷ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {filteredMonks.map((monk, idx) => {
                const isUser = monk.id === userMonk.id;
                return (
                  <tr
                    key={monk.id}
                    onClick={() => onSelectMonk(monk)}
                    className={`transition-colors cursor-pointer ${
                      isUser
                        ? 'bg-amber-950/40 hover:bg-amber-900/50 font-bold'
                        : 'hover:bg-stone-850/80'
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold">
                      {idx === 0 ? '🥇 1' : idx === 1 ? '🥈 2' : idx === 2 ? '🥉 3' : `#${idx + 1}`}
                    </td>

                    <td className="py-3 px-4 flex items-center gap-2">
                      <MonkAvatar robeColor={monk.avatarRobe} expression={monk.expression} size="sm" />
                      <div>
                        <div className="font-semibold text-stone-200 flex items-center gap-1">
                          {monk.dharmaName}
                          {isUser && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-500 text-stone-950 text-[9px] font-bold">
                              Bạn
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-stone-500">{monk.statusText || 'Đang thiền tịnh'}</div>
                      </div>
                    </td>

                    <td className="py-3 px-4 hidden sm:table-cell text-stone-400 italic max-w-xs truncate">
                      "{monk.motto}"
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-semibold text-amber-300 tabular-nums">
                      +{monk.meritPoints.toLocaleString()}
                    </td>

                    <td className="py-3 px-4 text-right text-stone-400 font-mono tabular-nums">
                      {monk.meditationMinutes}p
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] text-rose-300 bg-rose-950/40 px-2 py-0.5 rounded-full border border-rose-500/30">
                        <Heart className="w-3 h-3 text-rose-400" />
                        {monk.blessingsReceived}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
