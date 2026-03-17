export const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  return date.toLocaleDateString();
};

export const formatTime = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
};

export const findTimestampField = (obj) =>
  Object.keys(obj).find(
    (key) => key.includes('time') || key.includes('date') || key === 'created_at'
  );