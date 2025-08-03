# Yoga App – Projet Full-Stack OpenClassrooms

Ce projet a été réalisé dans le cadre du parcours **Développeur Java** chez OpenClassrooms.

Il s'agit d'une application full-stack pour la gestion de sessions de yoga, avec un back-end en **Spring Boot** et un front-end en **Angular**.  
Le projet m’a permis de mettre en pratique l’ensemble du cycle de développement : architecture REST, sécurité JWT, base de données, tests unitaires et end-to-end, etc.

---

## Structure du projet

```
yoga-app/
├── back/      --> Back-end Java Spring Boot
├── front/     --> Front-end Angular
```

Chacun des dossiers contient son propre `README.md` pour le détail de l’installation, des tests et de la structure.

---

## Lancer l'application

### Prérequis communs

- Java 11+ ou 17
- Maven 3.6+
- Node.js 16+ (ou version compatible avec Angular 14)
- Angular CLI
- MySQL (pour la version de production)

---

## Lancer le back-end

### Mode standard (production)

```bash
cd back
mvn spring-boot:run
```

Cela utilise la configuration par défaut (`application.properties`) avec la base MySQL.

---

### Mode test (base H2 en mémoire)

> Dans le cadre des tests ou du développement isolé, il est important de ne pas affecter la base de données réelle.  
> Le profil `test` permet d’utiliser une base **H2 en mémoire**, qui s’efface à l’arrêt du serveur.

#### Configuration associée (`application-test.properties`) :

```properties
spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE;MODE=MySQL
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

spring.jpa.hibernate.ddl-auto=create
spring.jpa.defer-datasource-initialization=true
spring.sql.init.mode=always
spring.sql.init.data-locations=classpath:test-data.sql

spring.security.enabled=false
```

#### Commande à utiliser selon votre environnement :

| Environnement       | Commande |
|---------------------|----------|
| Windows (CMD / PowerShell) | `mvn spring-boot:run -D"spring-boot.run.arguments=--spring.profiles.active=test"` |
| Linux / Mac / Git Bash     | `mvn spring-boot:run -Dspring-boot.run.arguments=--spring.profiles.active=test` |

> Le backend utilise alors la configuration de test, avec création automatique des tables, injection de données fictives (`test-data.sql`) et logs SQL visibles en console.

---

## Tests back-end

```bash
cd back
mvn test
```

Générer le rapport de couverture avec JaCoCo :

```bash
mvn jacoco:report
```

Le rapport sera accessible ici :  
`back/target/site/jacoco/index.html`

---

## Lancer le front-end (Angular)

```bash
cd front
npm install
npm run start
```

- L'application Angular est disponible sur `http://localhost:4200`
- Le proxy est configuré pour rediriger les appels `/api` vers `http://localhost:8080`

---

## Tests front-end

### Tests unitaires (Jest)

```bash
npm run test
```

Rapport de couverture généré dans :  
`front/coverage/index.html`

---

### Tests E2E (Cypress)

```bash
npm run e2e
```

#### Couverture E2E (via Istanbul + nyc)

1. Servir Angular avec instrumentation :
```bash
npx ng serve --configuration=e2e
```

2. Lancer Cypress :
```bash
npx cypress run --env coverage=true
```

3. Générer le rapport :
```bash
npx nyc report --reporter=html
```

Le rapport est disponible dans `front/coverage/`

---

## Authentification

Le projet utilise un système JWT :

- `POST /api/auth/register` : inscription
- `POST /api/auth/login` : connexion + récupération du token

Un compte administrateur est préconfiguré :

- Email : `yoga@studio.com`
- Mot de passe : `test!1234`

---

## Ressources utiles

- `back/README.md` → Détails du backend Spring Boot
- `front/README.md` → Infos sur le front Angular
- `ressources/sql/script.sql` → Script SQL de création
- `ressources/postman/yoga.postman_collection.json` → Collection Postman

---

## Remarques personnelles

Ce projet m’a permis d’explorer de manière concrète l’ensemble du workflow d’une application web moderne.  
J’ai particulièrement apprécié travailler sur la sécurité, les tests, et la configuration multi-profil avec Spring Boot.

C’était à la fois formateur, challengeant et agréable à construire du début à la fin.
Notes : Dans les Readme, l'usage du npx est faculatif, il est utile si on veut utiliser une version Java différente de celle habituelement utilisé sur sa machine. 