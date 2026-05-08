const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { port } = require('./config/env');
const auth = require('./middleware/auth');
const error = require('./middleware/error');
const { initializeWorkbook } = require('./services/workbookService');
const { startBirthdayJob } = require('./services/cronService');

const app = express();
app.use(cors()); app.use(helmet()); app.use(express.json({limit:'2mb'})); app.use(morgan('dev'));
app.use('/auth', require('./routes/auth'));
app.use('/contatos', auth, require('./routes/contatos'));
app.use('/categorias', auth, require('./routes/categorias'));
app.use('/dashboard', auth, require('./routes/dashboard'));
app.use('/exportar', auth, require('./routes/exportar'));
app.use('/maladireta', auth, require('./routes/maladireta'));
app.use(error);

initializeWorkbook().then(()=>{ startBirthdayJob(); app.listen(port, ()=>console.log(`API rodando na porta ${port}`));});
