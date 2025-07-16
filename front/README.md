# Yoga

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.0.

## Start the project

Git clone:

> git clone https://github.com/OpenClassrooms-Student-Center/P5-Full-Stack-testing

Go inside folder:

> cd yoga

Install dependencies:

> npm install

Launch Front-end:

> npm run start;


## Ressources

### Mockoon env 

### Postman collection

For Postman import the collection

> ressources/postman/yoga.postman_collection.json 

by following the documentation: 

https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman


### MySQL

SQL script for creating the schema is available `ressources/sql/script.sql`

By default the admin account is:
- login: yoga@studio.com
- password: test!1234


### Test

#### E2E

Launching e2e test:

> npm run e2e

Generate coverage report (you should launch e2e test before):

> npm run e2e:coverage

Report is available here:

> front/coverage/lcov-report/index.html

#### Unitary test

Launching test:

> npm run test

for following change:

> npm run test:watch

---

# Yoga App - Frontend Angular

Ce projet est le front-end d’une application de gestion de sessions de yoga. Il a été développé avec **Angular**, testé avec **Jest** (unitaires) et **Cypress** (E2E), et utilise **nyc** pour la couverture de code.

---

## Lancer l’application

### En mode développement
```bash
npm install
npx ng serve
```
Accès : `http://localhost:4200`  
Connexion à l'API backend : proxifiée via `src/proxy.config.json`.

---

## Tests unitaires avec Jest

### Lancer les tests unitaires
```bash
npx ng test
```

### Générer un rapport de couverture (Jest uniquement)
```bash
npx ng test --codeCoverage
```

Le rapport sera généré dans :
```
coverage/index.html
```

>  Les tests unitaires sont dans `src/app/**/*.spec.ts`

---

## Tests end-to-end avec Cypress

###  Ouvrir Cypress (UI)
```bash
npx ng run yoga:cypress-open
```

### Lancer Cypress en mode headless
```bash
npx ng run yoga:cypress-run
```

---

##  Générer une **couverture de tests E2E avec Cypress**

### 1. Servir Angular instrumenté
```bash
npx ng serve --configuration=e2e
```

### 2. Dans un autre terminal, lancer les tests Cypress
```bash
npx cypress run --env coverage=true
```

### 3. Générer le rapport de couverture
```bash
npx nyc report --reporter=text-summary
npx nyc report --reporter=html
```

📂 Le rapport est dans `coverage/`  
📁 Les données brutes sont dans `.nyc_output/`

---


>  Cela permet de consulter le rapport en ligne via GitHub Pages par exemple

---

##  Structure du projet

```
src/
├── app/
│   ├── core/         # Services, guards, interceptors
│   ├── auth/         # Connexion, inscription
│   ├── sessions/     # Gestion des sessions
│   └── shared/       # Composants partagés
├── assets/
├── environments/
└── index.html
```

---

##  Configurations importantes

- `angular.json` → configuration `e2e` et `serve-coverage`
- `coverage.webpack.js` → instrumentation de code avec Istanbul
- `proxy.config.json` → redirection `/api` vers `http://localhost:8080`

---

