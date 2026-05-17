import DOMPurify from 'dompurify';
import './styles.css';

const app = document.getElementById('app');

app.innerHTML = DOMPurify.sanitize(`
  <main class="container">
    <section class="hero">
      <h1>CHEGAR Ops Intelligence</h1>
      <p>Secure enterprise rebuild in progress.</p>
      <input id="fileInput" type="file" accept=".xlsx,.xls" />
      <div id="status"></div>
    </section>
  </main>
`);

const status = document.getElementById('status');

function setStatus(message, type = 'info') {
  status.className = type;
  status.textContent = message;
}

async function validateWorkbook(file) {
  if (!file) {
    throw new Error('Nenhum ficheiro seleccionado');
  }

  if (!file.name.match(/\.(xlsx|xls)$/i)) {
    throw new Error('Formato inválido');
  }

  if (file.size > 50 * 1024 * 1024) {
    throw new Error('Ficheiro demasiado grande');
  }

  return true;
}

document.getElementById('fileInput').addEventListener('change', async event => {
  try {
    const file = event.target.files[0];
    await validateWorkbook(file);
    setStatus(`Ficheiro validado: ${file.name}`, 'success');
  } catch (error) {
    setStatus(error.message, 'error');
  }
});
