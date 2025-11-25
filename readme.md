# Simple Auth App: OAuth2 + Cookies + FastAPI + React

## Backend

1. Go to the `back` folder, place your real data in file `.env.example`, and rename it to `.env`.

2. Run `python -m venv venv` (or `python3 -m venv venv`).

3. Run `source venv/bin/activate`.

4. Run `pip install -r requirements.txt`.

5. Run `uvicorn main:app --reload --port 8001`.

## Frontend

1. Go to the `front` folder.

2. Run `npm i`.

3. Run `npm run dev`.

## How to use

Just open the URL printed by `npm run dev`.

## Technologies

### Backend

- `fastapi` — main web framework for building APIs
- `uvicorn` — ASGI server that runs FastAPI application
- `SQLAlchemy` — ORM over SQLite
- `python-jose`, `cryptography` — JWT creation and verification
- `passlib`, `bcrypt` — password hashing
- `python-dotenv` — load secrets from `.env`

### Frontend

- `React` — frontend framework
- `vite` — frontend build tool
- `tailwindcss 4+` — modern CSS framework
