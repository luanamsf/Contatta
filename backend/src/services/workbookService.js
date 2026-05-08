const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const bcrypt = require('bcrypt');

const dataDir = path.join(__dirname, '../../data');
const workbookPath = path.join(dataDir, 'contatos.xlsx');
const sheets = ['contatos', 'categorias', 'usuarios', 'logs_email', 'alertas'];

const headers = {
  contatos: ['id','nome','cargo','empresa','categoria','telefone','celular','email','endereco','cidade','estado','observacoes','aniversario','tags','status','favorito','createdAt','updatedAt'],
  categorias: ['id','nome','createdAt'],
  usuarios: ['id','nome','email','passwordHash','createdAt'],
  logs_email: ['id','contatoId','email','assunto','status','erro','createdAt'],
  alertas: ['id','tipo','mensagem','createdAt']
};

async function initializeWorkbook() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(workbookPath)) {
    const wb = new ExcelJS.Workbook();
    sheets.forEach((sheet) => {
      const ws = wb.addWorksheet(sheet);
      ws.addRow(headers[sheet]);
    });

    const now = new Date().toISOString();
    const categories = ['Autoridades','Fornecedores','Clientes','Imprensa','Parceiros','Jurídico','Governo','Eventos'];
    const wsCategories = wb.getWorksheet('categorias');
    categories.forEach((nome, idx) => wsCategories.addRow([String(idx + 1), nome, now]));

    const wsUsers = wb.getWorksheet('usuarios');
    const hash = await bcrypt.hash('admin123', 10);
    wsUsers.addRow(['1', 'Administrador', 'admin@agenda.com', hash, now]);

    await wb.xlsx.writeFile(workbookPath);
  }
}

async function openWorkbook() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(workbookPath);
  return wb;
}

function worksheetToObjects(ws) {
  const [headerRow, ...rows] = ws.getSheetValues().filter(Boolean);
  const headersList = headerRow.slice(1);
  return rows.map((r) => Object.fromEntries(headersList.map((h, i) => [h, r[i + 1] ?? ''])));
}

async function readSheet(sheetName) {
  const wb = await openWorkbook();
  return worksheetToObjects(wb.getWorksheet(sheetName));
}

async function writeSheet(sheetName, items) {
  const wb = await openWorkbook();
  const ws = wb.getWorksheet(sheetName);
  ws.spliceRows(2, ws.rowCount - 1);
  items.forEach((it) => ws.addRow(headers[sheetName].map((h) => it[h] ?? '')));
  await wb.xlsx.writeFile(workbookPath);
}

module.exports = { workbookPath, initializeWorkbook, readSheet, writeSheet };
