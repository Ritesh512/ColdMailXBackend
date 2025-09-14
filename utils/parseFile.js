// utils/parseFile.js
import xlsx from "xlsx";
import csv from "csvtojson";

export const parseExcelOrCsv = async (fileBuffer, ext) => {
  if (ext === " ") {
    // Buffer → string → parse
    return await csv().fromString(fileBuffer.toString());
  } else if (ext === "xlsx" || ext === "xls") {
    // Read directly from buffer
    const workbook = xlsx.read(fileBuffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return xlsx.utils.sheet_to_json(sheet);
  }

  throw new Error("Unsupported file format");
};
