// utils/parseFile.js
import xlsx from 'xlsx';
import csv from 'csvtojson';

export const parseExcelOrCsv = async (filePath,ext) => {
  // const ext = filePath.split('.').pop();

  if (ext === 'csv') {
    return await csv().fromFile(filePath);
  } else if (ext === 'xlsx') {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return xlsx.utils.sheet_to_json(sheet);
  }

  throw new Error('Unsupported file format');
};
