const express = require('express');
const XLSX = require('xlsx');
const PDFDocument = require('pdfkit');
const { readSheet } = require('../services/workbookService');
const router = express.Router();

function filter(contatos,q){return contatos.filter(c=>(!q.categoria||c.categoria===q.categoria)&&(!q.cidade||c.cidade===q.cidade)&&(!q.empresa||c.empresa===q.empresa)&&(!q.tags||(c.tags||'').includes(q.tags)));}
router.get('/', async(req,res)=>{
  const format = req.query.formato || 'xlsx';
  const contatos = filter(await readSheet('contatos'), req.query);
  if(format==='csv'||format==='xlsx'){
    const wb=XLSX.utils.book_new(); const ws=XLSX.utils.json_to_sheet(contatos); XLSX.utils.book_append_sheet(wb,ws,'contatos');
    const type = format==='csv'?'text/csv':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const buf = format==='csv'?Buffer.from(XLSX.utils.sheet_to_csv(ws)):XLSX.write(wb,{type:'buffer',bookType:'xlsx'});
    res.setHeader('Content-Type',type); return res.send(buf);
  }
  const doc = new PDFDocument();
  res.setHeader('Content-Type','application/pdf'); doc.pipe(res); doc.fontSize(16).text('Relatório de Contatos'); contatos.forEach(c=>doc.fontSize(10).text(`${c.nome} - ${c.empresa} - ${c.email}`)); doc.end();
});
module.exports=router;
