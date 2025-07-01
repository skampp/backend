const XLSX = require('xlsx');
const fs = require('fs');

const workbook = XLSX.readFile('OT.xlsx'); // your Excel file
const sheetName = workbook.SheetNames[0];        // pick the first sheet
const sheet = workbook.Sheets[sheetName];

// Convert to JSON rows
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // raw arrays

// Convert to CSV manually
const csvLines = data.map(row =>
  row.map(cell =>
    `"${String(cell).replace(/"/g, '""')}"` // escape quotes for CSV
  ).join(',')
).join('\n');

fs.writeFileSync('cleaned_from_excel.csv', csvLines);
console.log('Clean CSV written.');
