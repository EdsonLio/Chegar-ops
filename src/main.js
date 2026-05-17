import DOMPurify from 'dompurify';
import { APP_NAME, REQUIRED_SHEETS, KPI_RULES } from './config.js';
import { validateFile } from './utils/security.js';
import { calculateKPIs } from './analytics/kpis.js';
import './styles.css';

const app = document.getElementById('app');

app.innerHTML = DOMPurify.sanitize(`
  <main class="container">
    <section class="hero">
      <h1>${APP_NAME}</h1>
      <p>Enterprise logistics analytics platform.</p>
      <input id="fileInput" type="file" accept=".xlsx,.xls" />
      <div id="status"></div>
      <section id="dashboard"></section>
    </section>
  </main>
`);

const status = document.getElementById('status');
const dashboard = document.getElementById('dashboard');

function setStatus(message, type = 'info') {
  status.className = type;
  status.textContent = message;
}

async function parseWorkbook(file) {
  return new Promise(async (resolve, reject) => {
    const worker = new Worker(new URL('./workers/excelWorker.js', import.meta.url), {
      type: 'module'
    });

    worker.onmessage = event => {
      const { success, workbook, error } = event.data;

      if (!success) {
        reject(new Error(error));
        return;
      }

      resolve(workbook);
    };

    const buffer = await file.arrayBuffer();

    worker.postMessage({ fileBuffer: buffer });
  });
}

function validateWorkbookStructure(workbook) {
  const missing = REQUIRED_SHEETS.filter(sheet => !workbook[sheet]);

  if (missing.length) {
    throw new Error(`Sheets obrigatórias em falta: ${missing.join(', ')}`);
  }
}

function renderKPIs(kpis) {
  dashboard.innerHTML = `
    <div class="kpis">
      <div class="card"><h3>Shipments</h3><p>${kpis.totalShipments}</p></div>
      <div class="card"><h3>Facilities</h3><p>${kpis.totalFacilities}</p></div>
      <div class="card"><h3>3PL</h3><p>${kpis.totalTransporters}</p></div>
      <div class="card"><h3>Invoice</h3><p>${kpis.totalInvoice.toFixed(2)}</p></div>
      <div class="card"><h3>KM</h3><p>${kpis.totalKm.toFixed(2)}</p></div>
    </div>
  `;
}

document.getElementById('fileInput').addEventListener('change', async event => {
  try {
    const file = event.target.files[0];

    validateFile(file, KPI_RULES.maxFileSizeMb);

    setStatus('A processar workbook...', 'info');

    const workbook = await parseWorkbook(file);

    validateWorkbookStructure(workbook);

    const items = workbook.Items || [];
    const tours = workbook.Tour || [];

    const kpis = calculateKPIs(items, tours);

    renderKPIs(kpis);

    setStatus(`Workbook processado com sucesso: ${file.name}`, 'success');
  } catch (error) {
    console.error(error);
    setStatus(error.message, 'error');
  }
});
