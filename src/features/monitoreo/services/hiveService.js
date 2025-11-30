// src/app/services/hiveService.js
// Ejemplo con datos mock (reemplaza con tus llamadas a la API)

const MOCK_HIVES_DATA = [
  { id: 1, area: 'A5', type: 'Längstroth' },
  { id: 2, area: 'A1', type: 'Dadant' },
  { id: 3, area: 'A10', type: 'Layens' },
  { id: 4, area: 'A2', type: 'Warré' },
];

const MOCK_MONITOR_DATA = {
  1: { temperature: [25, 26, 25.5, 27, 26], humidity: [70, 72, 71, 75, 73], sound: [10, 12, 11, 15, 13], weight: [30, 30.5, 30.2, 31, 30.8] },
  2: { temperature: [24, 25, 24.5, 26, 25], humidity: [65, 68, 67, 70, 69], sound: [8, 10, 9, 12, 11], weight: [28, 28.5, 28.2, 29, 28.8] },
  3: { temperature: [23, 24, 23.5, 25, 24], humidity: [60, 63, 62, 65, 64], sound: [12, 14, 13, 16, 15], weight: [32, 32.5, 32.2, 33, 32.8] },
  4: { temperature: [26, 27, 26.5, 28, 27], humidity: [75, 78, 77, 80, 79], sound: [9, 11, 10, 13, 12], weight: [29, 29.5, 29.2, 30, 29.8] },
};

export const getHivesForMonitoring = async () => {
  return new Promise(resolve => setTimeout(() => resolve(MOCK_HIVES_DATA), 300));
};

export const getHiveMonitorData = async (hiveId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = MOCK_MONITOR_DATA[hiveId];
      if (data) {
        resolve(data);
      } else {
        reject(new Error(`No monitor data found for hive ID: ${hiveId}`));
      }
    }, 500);
  });
};