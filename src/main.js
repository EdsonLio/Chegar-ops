import DOMPurify from 'dompurify';
import Chart from 'chart.js/auto';
import { APP_NAME, REQUIRED_SHEETS, KPI_RULES } from './config.js';
import { validateFile } from './utils/security.js';
import { calculateKPIs } from './analytics/kpis.js';
import { normalizeItems, normalizeTours } from './analytics/normalizer.js';
import { detectAnomalies } from './analytics/anomalies.js';
import { exportCsv } from './export/exportCsv.js';
import './styles.css';

const app = document.getElementById('app');

app.innerHTML = DOMPurify.sanitize(`
<main class="container">
<section class="hero">
<h1>${APP_NAME}</h1>
<p>Operational intelligence dashboard</p>
<div class="toolbar">
<input id="fileInput" type="file" accept=".xlsx,.xls" />
<button id="exportBtn">Export CSV</button>
</div>
<div id="status"></div>
<div id="kpis" class="kpis"></div>
<div class="grid">
<div class="panel">
<h3>Invoice by Province</h3>
<canvas id="provinceChart"></canvas>
</div>
<div class="panel">
<h3>Anomalies</h3>
<div id="anomalies"></div>
</div>
</div>
<div class="panel">
<h3>Recent Shipments</h3>
<div class="tableWrap">
<table>
<thead>
<tr>
<th>Shipment</th>
<th>Province</th>
<th>Facility</th>
<th>Invoice</th>
</tr>
</thead>
<tbody id="shipmentRows"></tbody>
</table>
</div>
</div>
</section>
</main>
`);

const status = document.getElementById('status');
const shipmentRows = document.getElementById('shipmentRows');
const anomaliesContainer = document.getElementById('anomalies');
const kpiContainer = document.getElementById('kpis');

let latestItems = [];

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
kpiContainer.innerHTML = `
<div class="card"><h3>Shipments</h3><p>${kpis.totalShipments}</p></div>
<div class="card"><h3>Facilities</h3><p>${kpis.totalFacilities}</p></div>
<div class="card"><h3>3PL</h3><p>${kpis.totalTransporters}</p></div>
<div class="card"><h3>Total Invoice</h3><p>${kpis.totalInvoice.toFixed(2)}</p></div>
<div class="card"><h3>Total KM</h3><p>${kpis.totalKm.toFixed(2)}</p></div>
`;
}

function renderShipments(items) {
shipmentRows.innerHTML = items.slice(0, 50).map(item => `
<tr>
<td>${item.shipment}</td>
<td>${item.province}</td>
<td>${item.facility}</td>
<td>${item.invoiceAmount.toFixed(2)}</td>
</tr>
`).join('');
}

function renderAnomalies(anomalies) {
anomaliesContainer.innerHTML = anomalies.length
? anomalies.map(item => `<div class="alert">${item.message}</div>`).join('')
: '<div class="ok">Sem anomalias críticas</div>';
}

function renderProvinceChart(items) {
const provinceMap = {};

items.forEach(item => {
provinceMap[item.province] = (provinceMap[item.province] || 0) + item.invoiceAmount;
});

new Chart(document.getElementById('provinceChart'), {
type: 'bar',
data: {
labels: Object.keys(provinceMap),
datasets: [{
label: 'Invoice Amount',
data: Object.values(provinceMap)
}]
},
options: {
responsive: true,
maintainAspectRatio: false
}
});
}

document.getElementById('exportBtn').addEventListener('click', () => {
exportCsv('chegar_shipments.csv', latestItems);
});

document.getElementById('fileInput').addEventListener('change', async event => {
try {
const file = event.target.files[0];
validateFile(file, KPI_RULES.maxFileSizeMb);
setStatus('A processar workbook...', 'info');

const workbook = await parseWorkbook(file);
validateWorkbookStructure(workbook);

const items = normalizeItems(workbook.Items || []);
const tours = normalizeTours(workbook.Tour || []);

latestItems = items;

const kpis = calculateKPIs(items, tours);
const anomalies = detectAnomalies(items, tours);

renderKPIs(kpis);
renderShipments(items);
renderAnomalies(anomalies);
renderProvinceChart(items);

setStatus(`Workbook processado com sucesso: ${file.name}`, 'success');
} catch (error) {
console.error(error);
setStatus(error.message, 'error');
}
});
