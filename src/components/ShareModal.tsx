import React, { useState } from 'react';
import { Monk } from '../types/temple';
import { soundEngine } from '../audio/soundEngine';
import confetti from 'canvas-confetti';
import { X, Copy, Check, Download, Share2, Globe, ShieldAlert, Sparkles, Image as ImageIcon } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  userMonk: Monk;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, userMonk }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  // Shared Public Link in AI Studio
  const publicShareUrl =
    typeof window !== 'undefined' && window.location.origin.includes('ais-dev')
      ? window.location.origin.replace('ais-dev', 'ais-pre')
      : window.location.href;

  const handleCopyLink = () => {
    soundEngine.playSingingBowl();
    navigator.clipboard?.writeText(publicShareUrl);
    setCopiedLink(true);
    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    } catch {
      // Ignore
    }
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Download high-resolution temple image
  const handleDownloadTempleImage = async () => {
    try {
      setIsDownloading(true);
      soundEngine.playBell();

      // Fetch the asset
      const response = await fetch('/assets/aistudio/image_4eb58d9f.png');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chua-online-${userMonk.dharmaName.toLowerCase().replace(/\s+/g, '-')}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setIsDownloading(false);
    } catch {
      setIsDownloading(false);
      // Fallback direct link
      window.open('/assets/aistudio/image_4eb58d9f.png', '_blank');
    }
  };

  // Generate & Download Zen Certificate Canvas
  const handleDownloadCertificate = () => {
    soundEngine.playBell();
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dark wood and gold gradient background
    const bgGradient = ctx.createLinearGradient(0, 0, 800, 600);
    bgGradient.addColorStop(0, '#1c1917');
    bgGradient.addColorStop(0.5, '#451a03');
    bgGradient.addColorStop(1, '#0c0a09');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 800, 600);

    // Golden ornate borders
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, 740, 540);

    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.strokeRect(42, 42, 716, 516);

    // Temple Header
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 28px serif';
    ctx.textAlign = 'center';
    ctx.fillText('CHỨNG NHẬN CÔNG ĐỨC TU TẬP ONLINE', 400, 110);

    ctx.fillStyle = '#fbbf24';
    ctx.font = '16px sans-serif';
    ctx.fillText('ĐẠO TRÀNG CHÁNH ĐIỆN — CHÙA ONLINE', 400, 145);

    // Decorative line
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(250, 165);
    ctx.lineTo(550, 165);
    ctx.stroke();

    // Dharma Name
    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 36px serif';
    ctx.fillText(userMonk.dharmaName, 400, 240);

    // Motto
    ctx.fillStyle = '#e7e5e4';
    ctx.font = 'italic 18px serif';
    ctx.fillText(`"${userMonk.motto}"`, 400, 290);

    // Stats Box
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(150, 330, 500, 100);
    ctx.strokeStyle = '#78350f';
    ctx.strokeRect(150, 330, 500, 100);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 22px monospace';
    ctx.fillText(`+${userMonk.meritPoints.toLocaleString()} CÔNG ĐỨC`, 270, 390);

    ctx.fillStyle = '#a8a29e';
    ctx.font = '14px sans-serif';
    ctx.fillText('TÍCH LŨY TU TẬP', 270, 415);

    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 22px monospace';
    ctx.fillText(`${userMonk.meditationMinutes} PHÚT`, 530, 390);

    ctx.fillStyle = '#a8a29e';
    ctx.font = '14px sans-serif';
    ctx.fillText('TỌA THIỀN TỊNH TÂM', 530, 415);

    // Footer decree
    ctx.fillStyle = '#d6d3d1';
    ctx.font = '15px serif';
    ctx.fillText('Tâm an thì vạn sự an — Tinh tấn tu dưỡng, phước lành lưu truyền.', 400, 480);

    ctx.fillStyle = '#78716c';
    ctx.font = '12px sans-serif';
    ctx.fillText(`Ngày chứng nhận: ${new Date().toLocaleDateString('vi-VN')}`, 400, 520);

    // Download canvas image
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `chung-nhan-${userMonk.dharmaName.toLowerCase().replace(/\s+/g, '-')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-gradient-to-b from-stone-900 via-amber-950/40 to-stone-950 border-2 border-amber-500/80 shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-850 hover:bg-stone-800 text-stone-400 hover:text-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 flex items-center justify-center mx-auto mb-2">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-amber-300">
            Xuất Bản & Chia Sẻ Chùa Online
          </h3>
          <p className="text-xs text-stone-300 mt-1">
            Cách chia sẻ ứng dụng công khai (Public) hoặc xuất ảnh lưu về máy.
          </p>
        </div>

        {/* Section 1: Public URL explanation */}
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-600/50 mb-5 text-xs text-stone-200">
          <div className="flex items-start gap-2.5">
            <Globe className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 font-semibold block text-sm mb-1">
                Đường Link Chia Sẻ Công Khai (Public URL):
              </strong>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  readOnly
                  value={publicShareUrl}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-stone-950 border border-amber-900/60 text-amber-200 font-mono text-[11px] select-all focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1 shadow cursor-pointer transition-colors shrink-0"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Đã Chép' : 'Sao Chép'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions on how to set Public in AI Studio */}
        <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 mb-6 text-xs text-stone-300 space-y-2.5">
          <div className="font-semibold text-amber-400 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            Lưu ý để người khác mở được link không bị chặn đăng nhập:
          </div>
          <ol className="list-decimal pl-5 space-y-1.5 text-stone-300 text-[11px] leading-relaxed">
            <li>
              Ở góc trên bên phải giao diện <strong>Google AI Studio</strong>, bấm vào nút <strong>"Share"</strong> (Chia sẻ).
            </li>
            <li>
              Tại mục quyền truy cập, chuyển từ <strong>"Restricted"</strong> (hoặc nội bộ tổ chức) sang <strong>"Anyone with the link" (Public - Bất kỳ ai có đường liên kết)</strong>.
            </li>
            <li>
              Gửi link có tiền tố <code>https://ais-pre-...</code> (link xem trước/chia sẻ), <strong>không gửi</strong> link có tiền tố <code>ais-dev-...</code> (vì link dev chỉ mở được từ trình duyệt của bạn).
            </li>
          </ol>
        </div>

        {/* Section 2: Export / Download Images */}
        <div className="pt-4 border-t border-stone-800">
          <span className="text-xs font-semibold text-stone-300 block mb-3">
            Xuất Ảnh Tải Về Máy (Để đăng Facebook, Zalo, Story):
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleDownloadTempleImage}
              disabled={isDownloading}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-850 border border-amber-600/40 text-amber-200 text-xs font-semibold shadow cursor-pointer active:scale-95 transition-all"
            >
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>{isDownloading ? 'Đang Tải...' : 'Tải Ảnh Chánh Điện (PNG)'}</span>
            </button>

            <button
              onClick={handleDownloadCertificate}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-stone-950 text-xs font-bold shadow cursor-pointer active:scale-95 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Xuất Sớ Chứng Nhận Tu Tập</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
