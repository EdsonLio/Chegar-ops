self.onmessage = async event => {
  const { fileBuffer } = event.data;

  try {
    const XLSX = await import('xlsx');

    const workbook = XLSX.read(fileBuffer, {
      type: 'array'
    });

    const result = {};

    workbook.SheetNames.forEach(sheetName => {
      result[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        defval: null
      });
    });

    self.postMessage({ success: true, workbook: result });
  } catch (error) {
    self.postMessage({
      success: false,
      error: error.message
    });
  }
};
