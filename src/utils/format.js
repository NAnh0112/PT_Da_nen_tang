const pad = (n) => (n < 10 ? `0${n}` : `${n}`);

export function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function formatDateTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)} ${formatTime(ts)}`;
}

export function timeAgo(ts) {
  if (!ts) return 'Ngoại tuyến';
  const minutes = Math.floor((Date.now() - ts) / 60000);
  if (minutes < 1) return 'Hoạt động vừa xong';
  if (minutes < 60) return `Hoạt động ${minutes} phút trước`;
  return `Hoạt động ${Math.floor(minutes / 60)} giờ trước`;
}

export function previewOf(type, text) {
  if (type === 'image') return '📷 Hình ảnh';
  if (type === 'location') return '📍 Vị trí';
  if (type === 'recalled') return 'Tin nhắn đã được thu hồi';
  return text || '';
}