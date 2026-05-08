const express = require('express');
const { readSheet } = require('../services/workbookService');
const router = express.Router();
router.get('/', async (req,res)=>{
  const contatos = await readSheet('contatos');
  const byCategory = contatos.reduce((a,c)=>{a[c.categoria]=(a[c.categoria]||0)+1;return a;},{});
  const month = String(new Date().getMonth()+1).padStart(2,'0');
  const aniversariantes = contatos.filter(c=>(c.aniversario||'').split('-')[1]===month);
  res.json({total: contatos.length, byCategory, aniversariantesMes: aniversariantes.length, ultimos: contatos.slice(-5).reverse()});
});
module.exports=router;
