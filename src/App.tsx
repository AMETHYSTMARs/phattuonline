import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { ChanhDienView } from './components/ChanhDienView';
import { GoMoView } from './components/GoMoView';
import { LeBaiView } from './components/LeBaiView';
import { GieoQueView } from './components/GieoQueView';
import { TuongNguyenUocView } from './components/TuongNguyenUocView';
import { BangVangView } from './components/BangVangView';
import { MonkModal } from './components/MonkModal';
import { ShareModal } from './components/ShareModal';
import { TempleTab, Monk, FloatingText, AltarOfferings, Prayer } from './types/temple';
import { INITIAL_MONKS } from './data/monksData';
import { soundEngine } from './audio/soundEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<TempleTab>('chanh-dien');

  // User monk state
  const [userMonk, setUserMonk] = useState<Monk>(() => {
    const saved = localStorage.getItem('chua_online_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return {
      id: 'user-monk-current',
      dharmaName: 'Thích Tan Ca',
      avatarRobe: 'gold',
      expression: 'calm',
      cushionIndex: 20,
      meritPoints: 68,
      meditationMinutes: 8,
      motto: 'Tâm an thì vạn sự an. Đúng giờ tan ca lòng không vướng bận.',
      blessingsReceived: 36,
      isUser: true,
      statusText: 'Đang tọa thiền Chánh Điện',
    };
  });

  // Fellow monks
  const [monks, setMonks] = useState<Monk[]>(INITIAL_MONKS);

  // Floating merit particles
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  // Meditation time counter in seconds
  const [meditationSeconds, setMeditationSeconds] = useState(0);

  // Audio status
  const [isMuted, setIsMuted] = useState(false);
  const [isAmbientOn, setIsAmbientOn] = useState(false);

  // Altar offerings state
  const [offerings, setOfferings] = useState<AltarOfferings>({
    incenseLit: true,
    incenseSticks: 3,
    incenseTimeRemaining: 300,
    flowersOffered: true,
    fruitOffered: true,
    lampLit: true,
    waterOffered: true,
    totalMeritOffered: 150,
  });

  // Modal states
  const [inspectingMonk, setInspectingMonk] = useState<Monk | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Community prayers
  const [prayers, setPrayers] = useState<Prayer[]>([
    {
      id: 'p-1',
      authorName: 'Thích Tan Ca',
      category: 'giai-nghiep',
      content: 'Cầu 17h30 chuông reo là dắt xe về, tối ngủ ngon giấc không mơ thấy deadline hay sếp gọi nhỡ!',
      blessingsCount: 142,
      createdAt: '10 phút trước',
    },
    {
      id: 'p-2',
      authorName: 'Thích Chốt Đơn',
      category: 'tai-loc',
      content: 'Cầu cho ngày hôm nay khách ghé inbox là chốt, không ai hoàn hàng, tiền về tài khoản rủng rỉnh.',
      blessingsCount: 98,
      createdAt: '25 phút trước',
    },
    {
      id: 'p-3',
      authorName: 'Thích Tăng Lương',
      category: 'cong-danh',
      content: 'Nam Mô A Di Đà Phật, cầu mong sếp thấu hiểu công sức cống hiến, đợt này duyệt tăng 30% lương.',
      blessingsCount: 215,
      createdAt: '45 phút trước',
    },
    {
      id: 'p-4',
      authorName: 'Thích Bình An',
      category: 'binh-an',
      content: 'Cầu chúc cha mẹ hai bên mạnh khỏe sống lâu, con cháu thuận hòa, tai ương tật ách đều tiêu tan.',
      blessingsCount: 380,
      createdAt: '1 giờ trước',
    },
    {
      id: 'p-5',
      authorName: 'Thích Thoát Ế',
      category: 'tinh-duyen',
      content: 'Đi chùa cầu mong gặp được người bạn đời tâm đầu ý hợp, cùng nhau tu dưỡng thiện tâm và chia sẻ ngọt bùi.',
      blessingsCount: 175,
      createdAt: '2 giờ trước',
    },
  ]);

  // Persist user monk to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('chua_online_user', JSON.stringify(userMonk));
    } catch {
      // Ignore
    }
  }, [userMonk]);

  // Meditation timer
  useEffect(() => {
    const timer = setInterval(() => {
      setMeditationSeconds((prev) => {
        const nextSec = prev + 1;
        if (nextSec % 60 === 0) {
          // Increment meditation minute
          setUserMonk((curr) => ({
            ...curr,
            meditationMinutes: curr.meditationMinutes + 1,
          }));
        }
        return nextSec;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Incense burning countdown timer
  useEffect(() => {
    if (!offerings.incenseLit) return;
    const interval = setInterval(() => {
      setOfferings((prev) => {
        if (prev.incenseTimeRemaining <= 1) {
          return { ...prev, incenseLit: false, incenseTimeRemaining: 0 };
        }
        return { ...prev, incenseTimeRemaining: prev.incenseTimeRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [offerings.incenseLit]);

  // Add merits with floating particle
  const handleAddMerit = useCallback(
    (amount = 1, e?: React.MouseEvent | KeyboardEvent) => {
      setUserMonk((prev) => ({
        ...prev,
        meritPoints: prev.meritPoints + amount,
      }));

      // Calculate particle position
      const posX = e && 'clientX' in e && e.clientX ? e.clientX : window.innerWidth / 2 + (Math.random() - 0.5) * 80;
      const posY = e && 'clientY' in e && e.clientY ? e.clientY : window.innerHeight / 2 + (Math.random() - 0.5) * 60;

      const meritWords = [
        `+${amount} Công Đức`,
        `+${amount} Tịnh Tâm`,
        `+${amount} Nghiệp Lành`,
        `+${amount} May Mắn`,
        `+${amount} Tiêu Nghiệp`,
      ];
      const randomText = meritWords[Math.floor(Math.random() * meritWords.length)];

      const newId = `${Date.now()}-${Math.random()}`;
      setFloatingTexts((prev) => [...prev.slice(-15), { id: newId, text: randomText, x: posX, y: posY }]);

      // Auto clear after 1.4s
      setTimeout(() => {
        setFloatingTexts((prev) => prev.filter((item) => item.id !== newId));
      }, 1400);
    },
    []
  );

  // Fast tap from bottom bar in Chanh Dien
  const handleFastTapWoodenFish = (e: React.MouseEvent) => {
    soundEngine.playWoodenFish();
    handleAddMerit(1, e);
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMute(nextMuted);
  };

  // Toggle Ambient
  const handleToggleAmbient = () => {
    const active = soundEngine.toggleAmbient();
    setIsAmbientOn(active);
  };

  // Select a fellow monk
  const handleSelectMonk = (monk: Monk) => {
    if (monk.id === userMonk.id || monk.isUser) {
      setIsUserModalOpen(true);
    } else {
      setInspectingMonk(monk);
    }
  };

  // Bless a fellow monk
  const handleBlessMonk = (monkId: string) => {
    setMonks((prev) =>
      prev.map((m) =>
        m.id === monkId
          ? {
              ...m,
              blessingsReceived: m.blessingsReceived + 1,
              meritPoints: m.meritPoints + 1,
            }
          : m
      )
    );
    // User also earns merit by rejoicing in others' merit (Tùy Hỷ Công Đức)
    handleAddMerit(2);
  };

  // Add prayer
  const handleAddPrayer = (newPrayer: Omit<Prayer, 'id' | 'blessingsCount' | 'createdAt'>) => {
    const prayerItem: Prayer = {
      ...newPrayer,
      id: Date.now().toString(),
      blessingsCount: 1,
      createdAt: 'Vừa xong',
    };
    setPrayers((prev) => [prayerItem, ...prev]);
    handleAddMerit(10);
  };

  // Bless prayer
  const handleBlessPrayer = (prayerId: string) => {
    setPrayers((prev) =>
      prev.map((p) => (p.id === prayerId ? { ...p, blessingsCount: p.blessingsCount + 1 } : p))
    );
    handleAddMerit(1);
  };

  // Update user monk
  const handleUpdateUserMonk = (updated: Partial<Monk>) => {
    setUserMonk((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-600 selection:text-white">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userDharmaName={userMonk.dharmaName}
        userMerits={userMonk.meritPoints}
        onOpenUserModal={() => setIsUserModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isAmbientOn={isAmbientOn}
        onToggleAmbient={handleToggleAmbient}
      />

      {/* Main Body View */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6 flex flex-col items-center">
        {activeTab === 'chanh-dien' && (
          <ChanhDienView
            monks={monks}
            userMonk={userMonk}
            onSelectMonk={handleSelectMonk}
            onFastTapWoodenFish={handleFastTapWoodenFish}
            floatingTexts={floatingTexts}
            onOpenUserModal={() => setIsUserModalOpen(true)}
            onOpenLeBaiTab={() => setActiveTab('le-bai')}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            meditationSeconds={meditationSeconds}
          />
        )}

        {activeTab === 'go-mo' && (
          <GoMoView
            userMerits={userMonk.meritPoints}
            onAddMerit={handleAddMerit}
            floatingTexts={floatingTexts}
          />
        )}

        {activeTab === 'le-bai' && (
          <LeBaiView
            offerings={offerings}
            onUpdateOfferings={setOfferings}
            onAddMerit={handleAddMerit}
            userDharmaName={userMonk.dharmaName}
          />
        )}

        {activeTab === 'gieo-que' && (
          <GieoQueView onAddMerit={handleAddMerit} userDharmaName={userMonk.dharmaName} />
        )}

        {activeTab === 'nguyen-uoc' && (
          <TuongNguyenUocView
            prayers={prayers}
            onAddPrayer={handleAddPrayer}
            onBlessPrayer={handleBlessPrayer}
            userDharmaName={userMonk.dharmaName}
          />
        )}

        {activeTab === 'bang-vang' && (
          <BangVangView monks={monks} userMonk={userMonk} onSelectMonk={handleSelectMonk} />
        )}
      </main>

      {/* Fellow Monk Inspect Modal */}
      {inspectingMonk && (
        <MonkModal
          monk={inspectingMonk}
          onClose={() => setInspectingMonk(null)}
          isUser={false}
          onBlessMonk={handleBlessMonk}
        />
      )}

      {/* User Monk Edit Profile Modal */}
      {isUserModalOpen && (
        <MonkModal
          monk={userMonk}
          onClose={() => setIsUserModalOpen(false)}
          isUser={true}
          onUpdateUserMonk={handleUpdateUserMonk}
        />
      )}

      {/* Share / Export Public Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        userMonk={userMonk}
      />

      {/* Footer */}
      <footer className="w-full border-t border-amber-950/60 bg-stone-950/80 px-4 py-6 mt-12 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-amber-400">Chùa Online</span>
            <span>·</span>
            <span>Tịnh tâm tích đức mỗi ngày</span>
            <span>·</span>
            <span className="italic">Nam Mô A Di Đà Phật</span>
          </div>

          <div className="text-[11px] text-stone-500">
            Ứng dụng đi chùa trực tuyến & giải tỏa áp lực đời sống. Thân tâm an lạc, vạn sự hanh thông.
          </div>
        </div>
      </footer>
    </div>
  );
}
