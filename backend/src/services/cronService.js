const cron = require('node-cron');
const { v4: uuid } = require('uuid');
const { readSheet, writeSheet } = require('./workbookService');
const { sendMail } = require('./emailService');

function startBirthdayJob() {
  cron.schedule('0 7 * * *', async () => {
    const contatos = await readSheet('contatos');
    const today = new Date();
    const mmdd = `${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    const anivers = contatos.filter(c=>(c.aniversario||'').slice(5)===mmdd);
    if (!anivers.length) return;
    const alertas = await readSheet('alertas');
    anivers.forEach(c=>alertas.push({id:uuid(),tipo:'aniversario',mensagem:`${c.nome} (${c.empresa})`,createdAt:new Date().toISOString()}));
    await writeSheet('alertas', alertas);
    await sendMail('admin@agenda.com', 'Aniversariantes do dia', anivers.map(a=>`<p>${a.nome} - ${a.empresa} - ${a.telefone}</p>`).join(''));
  });
}
module.exports={ startBirthdayJob };
