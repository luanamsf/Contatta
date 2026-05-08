const nodemailer = require('nodemailer');
const { smtp } = require('../config/env');

let transporter;
function getTransport() {
  if (!smtp.host || !smtp.user || !smtp.pass) return null;
  if (!transporter) transporter = nodemailer.createTransport({ host: smtp.host, port: smtp.port, secure: false, auth: { user: smtp.user, pass: smtp.pass } });
  return transporter;
}

async function sendMail(to, subject, html) {
  const t = getTransport();
  if (!t) return { skipped: true };
  await t.sendMail({ from: smtp.from, to, subject, html });
  return { skipped: false };
}

module.exports = { sendMail };
