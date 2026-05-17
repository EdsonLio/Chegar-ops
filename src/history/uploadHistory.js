const STORAGE_KEY = 'chegar_upload_history';

export function saveUploadHistory(fileName, metrics = {}) {
  const history = getUploadHistory();

  history.unshift({
    id: crypto.randomUUID(),
    fileName,
    uploadedAt: new Date().toISOString(),
    metrics
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 50)));
}

export function getUploadHistory() {
  const data = localStorage.getItem(STORAGE_KEY);

  return data ? JSON.parse(data) : [];
}
