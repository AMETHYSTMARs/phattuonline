export interface Monk {
  id: string;
  dharmaName: string; // e.g. "Thích Chốt Đơn"
  realName?: string;
  avatarRobe: 'gold' | 'saffron' | 'brown' | 'indigo' | 'crimson';
  expression: 'calm' | 'smile' | 'focused' | 'peaceful';
  cushionIndex: number; // 0 to 47
  meritPoints: number;
  meditationMinutes: number;
  motto: string;
  vow?: string;
  blessingsReceived: number;
  isUser?: boolean;
  statusText?: string;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color?: string;
}

export interface FortuneStick {
  id: number;
  name: string;
  grade: 'Đại Cát' | 'Thượng Cát' | 'Thượng Thượng' | 'Trung Cát' | 'Bình An';
  poem: string;
  poemHuan: string;
  meaning: string;
  career: string;
  wealth: string;
  love: string;
  health: string;
  advice: string;
  buddhaWisdom: string;
}

export interface Prayer {
  id: string;
  authorName: string;
  category: 'binh-an' | 'tai-loc' | 'tinh-duyen' | 'cong-danh' | 'suc-khoe' | 'giai-nghiep';
  content: string;
  blessingsCount: number;
  createdAt: string;
  isUserPrayer?: boolean;
}

export type TempleTab = 'chanh-dien' | 'go-mo' | 'le-bai' | 'gieo-que' | 'nguyen-uoc' | 'bang-vang';

export interface AltarOfferings {
  incenseLit: boolean;
  incenseSticks: number;
  incenseTimeRemaining: number;
  flowersOffered: boolean;
  fruitOffered: boolean;
  lampLit: boolean;
  waterOffered: boolean;
  totalMeritOffered: number;
}
