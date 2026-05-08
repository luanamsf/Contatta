const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { readSheet } = require('../services/workbookService');
const { jwtSecret } = require('../config/env');

const router = express.Router();

router.post('/login', [body('email').isEmail(), body('senha').isLength({ min: 6 })], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, senha } = req.body;
  const users = await readSheet('usuarios');
  const user = users.find((u) => u.email === email);
  if (!user) return res.status(401).json({ message: 'Credenciais inválidas' });

  const ok = await bcrypt.compare(senha, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Credenciais inválidas' });

  const token = jwt.sign({ id: user.id, email: user.email, nome: user.nome }, jwtSecret, { expiresIn: '8h' });
  res.json({ token, user: { id: user.id, nome: user.nome, email: user.email } });
});

module.exports = router;
