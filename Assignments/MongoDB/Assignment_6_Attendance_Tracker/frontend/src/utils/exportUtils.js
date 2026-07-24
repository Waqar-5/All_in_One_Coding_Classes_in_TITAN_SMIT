// utils/exportUtils.js
// Helper functions to export attendance records to PDF / Excel, and to
// trigger the browser print dialog for the attendance table.

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const formatDate = (isoDate) => {
  if (!isoDate) return '-';
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Exports the given attendance records to a nicely formatted PDF file.
 */
export const exportToPDF = (records = []) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.setTextColor(99, 102, 241);
  doc.text('Attendance Report', 14, 18);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

  const tableData = records.map((r) => [
    r.studentName,
    formatDate(r.date),
    r.status,
    formatDate(r.createdAt),
  ]);

  autoTable(doc, {
    startY: 32,
    head: [['Student Name', 'Date', 'Status', 'Created At']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 245, 255] },
    styles: { fontSize: 9, cellPadding: 3 },
  });

  doc.save(`attendance-report-${Date.now()}.pdf`);
};

/**
 * Exports the given attendance records to an Excel (.xlsx) file.
 */
export const exportToExcel = (records = []) => {
  const worksheetData = records.map((r) => ({
    'Student Name': r.studentName,
    Date: formatDate(r.date),
    Status: r.status,
    'Created At': formatDate(r.createdAt),
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');

  // Auto-size columns roughly
  worksheet['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 12 }, { wch: 20 }];

  XLSX.writeFile(workbook, `attendance-report-${Date.now()}.xlsx`);
};

/**
 * Triggers the browser's native print dialog. CSS `@media print` rules
 * in index.css hide non-essential UI so only the table is printed.
 */
export const printAttendance = () => {
  window.print();
};
