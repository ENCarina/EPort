# EPort

EPort egészségügyi időpontfoglaló rendszer (Express + Angular).

## Gyors indítás

Backend (`backend` mappa):

```bash
cd backend
npm install
node op conf:generate
node op key:generate
node op migrate
node op db:seed
npm run dev
```

Frontend (külön terminál):

```bash
cd frontend
npm install
npm start
```

## Dokumentáció

- Részletes telepítés: `docs/quick_install.md`
- Fejlesztői dokumentáció: `docs/dev_doc.md`
- API végpontok: `docs/endpoints.md`
