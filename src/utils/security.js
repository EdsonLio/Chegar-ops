import DOMPurify from 'dompurify';

export function sanitizeHTML(value) {
  return DOMPurify.sanitize(String(value ?? ''));
}

export function sanitizeText(value) {
  return String(value ?? '')
    .replace(/[<>]/g, '')
    .trim();
}

export function validateFile(file, maxSizeMb = 50) {
  if (!file) {
    throw new Error('Nenhum ficheiro seleccionado');
  }

  if (!file.name.match(/\.(xlsx|xls)$/i)) {
    throw new Error('Formato de ficheiro inválido');
  }

  if (file.size > maxSizeMb * 1024 * 1024) {
    throw new Error('Ficheiro demasiado grande');
  }

  return true;
}
