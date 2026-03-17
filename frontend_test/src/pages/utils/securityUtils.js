export const processAccessLogs = (logs) => {
  const groupedByDate = {};

  logs.forEach((log) => {
    const date = log.time.split(' ')[0];
    if (!groupedByDate[date]) {
      groupedByDate[date] = { date, granted: 0, denied: 0 };
    }
    if (log.status.toLowerCase().includes('granted')) {
      groupedByDate[date].granted += 1;
    } else if (log.status.toLowerCase().includes('denied')) {
      groupedByDate[date].denied += 1;
    }
  });

  return Object.values(groupedByDate).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
};

export const calculateSecurityScore = (logs) => {
  if (!logs || logs.length === 0) return 75;

  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  const recentLogs = logs.filter((log) => new Date(log.time) >= sevenDaysAgo);

  const successfulAccess = recentLogs.filter((l) =>
    l.status.toLowerCase().includes('granted')
  ).length;
  const properLogouts = recentLogs.filter(
    (l) =>
      l.status.includes('Proper Logout') || l.status.includes('Session Ended')
  ).length;
  const deniedAccess = recentLogs.filter((l) =>
    l.status.toLowerCase().includes('denied')
  ).length;
  const incorrectPasswords = recentLogs.filter((l) =>
    l.status.includes('Incorrect Password')
  ).length;
  const noPermission = recentLogs.filter((l) =>
    l.status.includes('No Permission')
  ).length;

  const score = Math.max(
    0,
    Math.min(
      100,
      90 +
        Math.min(15, successfulAccess * 0.5) +
        Math.min(10, properLogouts) -
        Math.min(15, deniedAccess) -
        Math.min(15, incorrectPasswords) -
        Math.min(15, noPermission)
    )
  );

  return Math.round(score);
};

export const adjustScoreWithSurveillance = (baseScore, recognized, unrecognized) => {
  let score = baseScore + Math.min(5, recognized * 0.5);
  if (unrecognized > 5) score -= 10;
  else if (unrecognized > 0) score -= unrecognized * 1.5;
  return Math.round(Math.min(100, Math.max(0, score)));
};

export const generateHeatmapData = (logs) => {
  const hourData = Array(24)
    .fill(null)
    .map((_, hour) => ({ hour, 'Gate 1': 0, 'Gate 2': 0, Vault: 0 }));

  logs.forEach((log) => {
    const time = log.time.split(' ')[1];
    const hour = parseInt(time.split(':')[0]);
    if (log.gate === 'Gate 1') hourData[hour]['Gate 1'] += 1;
    else if (log.gate === 'Gate 2') hourData[hour]['Gate 2'] += 1;
    else if (log.gate === 'Vault') hourData[hour]['Vault'] += 1;
  });

  return hourData;
};

export const getScoreColor = (score) => {
  if (score >= 85) return '#00c2b2';
  if (score >= 65) return '#ffc107';
  return '#ff6b6b';
};