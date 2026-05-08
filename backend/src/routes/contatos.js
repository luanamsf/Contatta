const express = require('express');
const { v4: uuid } = require('uuid');
const { readSheet, writeSheet } = require('../services/workbookService');
const { sanitizeObject } = require('../utils/sanitize');

const router = express.Router();
router.get('/', async (req,res)=>{
  const contatos = await readSheet('contatos');
  const q = req.query;
  const filtered = contatos.filter(c =>
    (!q.search || Object.values(c).join(' ').toLowerCase().includes(q.search.toLowerCase())) &&
    (!q.categoria || c.categoria===q.categoria) &&
    (!q.empresa || c.empresa===q.empresa) &&
    (!q.cidade || c.cidade===q.cidade) &&
    (!q.status || c.status===q.status) &&
    (!q.tags || (c.tags||'').includes(q.tags))
  );
  res.json(filtered);
});
router.post('/', async (req,res)=>{ const contatos=await readSheet('contatos'); const now=new Date().toISOString(); const contato={id:uuid(),...sanitizeObject(req.body),status:req.body.status||'ativo',favorito:req.body.favorito||'nao',createdAt:now,updatedAt:now}; contatos.push(contato); await writeSheet('contatos',contatos); res.status(201).json(contato);});
router.put('/:id', async(req,res)=>{const contatos=await readSheet('contatos'); const i=contatos.findIndex(c=>c.id===req.params.id); if(i<0)return res.status(404).json({message:'Não encontrado'}); contatos[i]={...contatos[i],...sanitizeObject(req.body),updatedAt:new Date().toISOString()}; await writeSheet('contatos',contatos); res.json(contatos[i]);});
router.delete('/:id', async(req,res)=>{const contatos=await readSheet('contatos'); await writeSheet('contatos',contatos.filter(c=>c.id!==req.params.id)); res.status(204).end();});
module.exports = router;
