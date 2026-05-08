const express = require('express');
const { v4: uuid } = require('uuid');
const { readSheet, writeSheet } = require('../services/workbookService');
const router = express.Router();
router.get('/', async (req,res)=>res.json(await readSheet('categorias')));
router.post('/', async (req,res)=>{const items=await readSheet('categorias'); const row={id:uuid(),nome:req.body.nome,createdAt:new Date().toISOString()}; items.push(row); await writeSheet('categorias',items); res.status(201).json(row);});
router.put('/:id', async (req,res)=>{const items=await readSheet('categorias'); const i=items.findIndex(x=>x.id===req.params.id); if(i<0)return res.status(404).end(); items[i].nome=req.body.nome; await writeSheet('categorias',items); res.json(items[i]);});
router.delete('/:id', async(req,res)=>{const items=await readSheet('categorias'); await writeSheet('categorias',items.filter(x=>x.id!==req.params.id)); res.status(204).end();});
module.exports=router;
