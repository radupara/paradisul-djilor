# Paradisul DJilor

Platformă pentru DJ-ii români - Frontend Angular

## Descriere

Această aplicație este destinată exclusiv DJ-ilor români, oferind o platformă pentru gestionarea profilurilor, rezervărilor și abonamentelor.

## Tehnologii

- Angular 18+
- TypeScript
- SCSS
- Standalone Components

## Instalare

```bash
npm install
```

## Rulare Development Server

```bash
npm start
```

Aplicația va fi disponibilă la `http://localhost:4200`

## Build pentru Production

```bash
npm run build
```

## Structura Proiectului

```
src/
├── app/
│   ├── components/      # Componente reutilizabile
│   ├── pages/          # Pagini (landing, dashboard, etc.)
│   │   └── landing/    # Pagina de landing
│   ├── services/       # Servicii (API calls)
│   ├── models/         # Modele TypeScript
│   └── shared/         # Utilități și componente partajate
├── assets/             # Resurse statice
└── environments/       # Configurări de mediu
```

## Builder.io Integration

Designul paginii de landing va fi creat folosind Builder.io. După ce designul este gata, va trebui implementat manual în componentele Angular.

## Backend

Backend-ul va fi dezvoltat ulterior folosind Spring Boot Java. Pentru moment, backend-ul este mock-uit folosind JSON-uri.

## Funcționalități Viitoare

- Autentificare utilizatori
- Gestionare profiluri DJ
- Sistem de rezervări
- Abonamente lunare (Stripe)
- Integrare Stripe pentru plăți în România

