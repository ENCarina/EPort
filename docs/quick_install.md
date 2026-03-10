# Részletes telepítési útmutató (fejlesztőknek)

Ez az útmutató azt írja le, hogyan tud egy új fejlesztő nulláról elindítani egy működő fejlesztői környezetet.

## 1. Előfeltételek

- Git
- Node.js 18+ (ajánlott: 20 LTS)
- npm (Node-dzsel együtt települ)
- Windows / Linux / macOS (a példák Windows-kompatibilisek)

## 2. Projekt klónozása

```bash
git clone https://github.com/ENCarina/EPort.git
cd EPort
```

## 3. Backend telepítés és indítás

A backend a `backend` mappában található.

1. Menj a backend mappába:

```bash
cd backend
```

2. Függőségek telepítése:

```bash
npm install
```

3. Konfiguráció és kulcs generálása:

```bash
node op conf:generate
node op key:generate
```

4. Adatbázis migrációk és seed futtatása:

```bash
node op migrate
node op db:seed
```

5. Backend indítása:

```bash
npm run dev
```

Várható backend cím: `http://localhost:8000`

## 4. Frontend telepítés és indítás

A frontend Angular alkalmazás, külön mappában fut.

1. Menj a frontend mappába:

```bash
cd frontend
```

2. Függőségek telepítése:

```bash
npm install
```

3. Frontend indítása:

```bash
npm start
```

Várható frontend cím: `http://localhost:4200`

## 5. Napi fejlesztői indítás (röviden)

Két terminálban:

1. Terminál (backend):

```bash
cd backend
npm run dev
```

2. Terminál (frontend):

```bash
cd frontend
npm start
```

## 6. Adatbázis újraépítés (ha szükséges)

Ha hibás adatok vannak vagy tiszta indulás kell:

```bash
cd backend
node op migrate:fresh
node op db:seed
```

## 7. Tesztek futtatása (backend)

```bash
cd backend
npm test
```

## 8. Gyakori hibák

### Port ütközés

- Backend tipikusan: 8000
- Frontend tipikusan: 4200

Ha valamelyik foglalt, állítsd le a korábbi futó példányt.

### A frontend nem éri el az API-t

Ellenőrizd:

- fut-e a backend a `backend` mappában
- a frontend API URL-je `http://localhost:8000/api`-ra mutat

### Migration hiba

Futtasd újra tisztán:

```bash
cd backend
node op migrate:fresh
node op db:seed
```

## 9. Belépés demo felhasználókkal

A bejelentkezés oldalon elérhetők a demo belépési gombok:

- páciens (demo)
- orvos kiválasztással
- vezető asszisztens/admin kiválasztással