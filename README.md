# Contatta - Agenda de Contatos Executiva

## Estrutura
- `frontend/`: React + TailwindCSS
- `backend/`: Node.js + Express + Excel/CSV

## Instalação
### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Recursos implementados
- Autenticação JWT com usuário admin inicial (`admin@agenda.com` / `admin123`).
- CRUD de contatos com filtros por categoria, empresa, cidade, tags e status.
- CRUD de categorias.
- Exportação para XLSX/CSV/PDF.
- Mala direta com variáveis `{{nome}}`, `{{empresa}}`, `{{cargo}}`.
- Dashboard com total, categorias e aniversariantes.
- Job diário de aniversários (node-cron) + alerta e e-mail ao admin.
- Persistência em `backend/data/contatos.xlsx` com abas:
  - contatos
  - categorias
  - usuarios
  - logs_email
  - alertas
- Preparado para migração futura para banco SQL por separação em serviços/rotas.

## API
- `POST /auth/login`
- `GET/POST/PUT/DELETE /contatos`
- `GET/POST/PUT/DELETE /categorias`
- `GET /exportar?formato=xlsx|csv|pdf`
- `POST /maladireta`
- `GET /dashboard`
