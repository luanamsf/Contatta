const express = require('express');
const { v4: uuid } = require('uuid');
const { readSheet, writeSheet } = require('../services/workbookService');
const { sendMail } = require('../services/emailService');
const router = express.Router();

router.post('/', async(req,res)=>{
  const { filtros = {}, assunto, mensagem } = req.body;
  const contatos = (await readSheet('contatos')).filter(c => (!filtros.categoria || c.categoria===filtros.categoria));
  const logs = await readSheet('logs_email');
  for (const c of contatos) {
    const html = mensagem.replace('{{nome}}', c.nome||'').replace('{{empresa}}', c.empresa||'').replace('{{cargo}}', c.cargo||'');
    let status='enviado', erro='';
    try { await sendMail(c.email, assunto, html); } catch(e){ status='erro'; erro=e.message; }
    logs.push({id:uuid(),contatoId:c.id,email:c.email,assunto,status,erro,createdAt:new Date().toISOString()});
  }
  await writeSheet('logs_email', logs);
  res.json({ total: contatos.length });
});

module.exports=router;
