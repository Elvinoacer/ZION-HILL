import { unparse } from 'papaparse';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType } from 'docx';
import { saveAs } from 'file-saver';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const exportToCsv = (data: any[], fileName: string) => {
  const csvData = data.map(item => ({
    Date: formatDate(item.date),
    Amount: `KES ${item.amount.toLocaleString()}`,
    Type: item.type,
    Method: item.method,
    Status: item.status,
  }));
  const csv = unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${fileName}.csv`);
};

export const exportToPdf = (data: any[], fileName: string) => {
  const doc = new jsPDF();
  const tableColumn = ["Date", "Amount", "Type", "Method", "Status"];
  const tableRows: any[][] = [];

  data.forEach(item => {
    const ticketData = [
      formatDate(item.date),
      `KES ${item.amount.toLocaleString()}`,
      item.type,
      item.method,
      item.status,
    ];
    tableRows.push(ticketData);
  });

  autoTable(doc, { head: [tableColumn], body: tableRows, startY: 20 });
  doc.text("Giving History", 14, 15);
  doc.save(`${fileName}.pdf`);
};

export const exportToXlsx = (data: any[], fileName: string) => {
  const wsData = data.map(item => ({
    Date: formatDate(item.date),
    Amount: `KES ${item.amount.toLocaleString()}`,
    Type: item.type,
    Method: item.method,
    Status: item.status,
  }));
  const ws = XLSX.utils.json_to_sheet(wsData);
  const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  saveAs(blob, `${fileName}.xlsx`);
};

export const exportToDocx = (data: any[], fileName: string) => {
    const tableHeader = new TableRow({
        children: [
            new TableCell({ children: [new Paragraph("Date")], width: { size: 20, type: WidthType.PERCENT } }),
            new TableCell({ children: [new Paragraph("Amount")], width: { size: 20, type: WidthType.PERCENT } }),
            new TableCell({ children: [new Paragraph("Type")], width: { size: 20, type: WidthType.PERCENT } }),
            new TableCell({ children: [new Paragraph("Method")], width: { size: 20, type: WidthType.PERCENT } }),
            new TableCell({ children: [new Paragraph("Status")], width: { size: 20, type: WidthType.PERCENT } }),
        ],
    });

    const tableRows = data.map(item => new TableRow({
        children: [
            new TableCell({ children: [new Paragraph(formatDate(item.date))] }),
            new TableCell({ children: [new Paragraph(`KES ${item.amount.toLocaleString()}`)] }),
            new TableCell({ children: [new Paragraph(item.type)] }),
            new TableCell({ children: [new Paragraph(item.method)] }),
            new TableCell({ children: [new Paragraph(item.status)] }),
        ],
    }));

    const table = new Table({
        rows: [tableHeader, ...tableRows],
        width: {
            size: 100,
            type: WidthType.PERCENT,
        },
    });

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({ text: "Giving History", heading: 'Heading1' }),
        table,
      ],
    }]
  });

  Packer.toBlob(doc).then(blob => {
    saveAs(blob, `${fileName}.docx`);
  });
};
