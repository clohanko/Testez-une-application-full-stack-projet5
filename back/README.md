# Yoga App – Backend API

Ce projet est une API REST construite avec **Spring Boot**. Elle gère l’authentification via JWT, les utilisateurs, les enseignants et les sessions de yoga.

## Technologies utilisées

- Java 11+
- Spring Boot
- Spring Security (JWT)
- Spring Data JPA
- Hibernate
- MySQL (prod) / H2 (test)
- Maven 17
- JUnit 5 & MockMvc
- JaCoCo (couverture de tests)
-
---

## Installation

### Prérequis

- Java 11+
- Maven 3.6+
- MySQL (en production)
- IDE (IntelliJ / Eclipse / VS Code...)

### Étapes

1. Cloner le projet :
   ```bash
   git clone https://github.com/votre-utilisateur/yoga-app.git
   cd yoga-app/back
   ```

2. Créer un fichier `application.properties` pour la prod, ou utiliser `application-test.properties` pour les tests.

3. Lancer l'application :
   ```bash
   mvn spring-boot:run
   ```

---

## Authentification

L'authentification se fait via **JWT Token**, obtenu via `/api/auth/login`.

Endpoints :
- `POST /api/auth/register` : créer un nouvel utilisateur
- `POST /api/auth/login` : se connecter et recevoir un token JWT

---

## Tests

Les tests sont situés dans `src/test/java/com/openclassrooms/starterjwt`.

### Couverture de tests

Utilisation de **JUnit 5** et **MockMvc** pour tester :

#### Tests d’intégration effectués :

- `AuthIntegrationTest`
- `SessionIntegrationTest`
- `TeacherIntegrationTest`
- `UserIntegrationTest`

### Générer le rapport de couverture

```bash
mvn clean test jacoco:report
```

Le rapport se trouve ici :  
`target/site/jacoco/index.html`

---

## Structure du projet

```plaintext
├── controller/         # Contrôleurs REST
├── service/            # Logique métier
├── repository/         # Accès base de données
├── security/           # JWT, filtre de sécurité
├── models/             # Entités JPA
├── payload/            # Requêtes & réponses JSON
├── mapper/             # MapStruct DTO ↔ Entity
├── test/               # Tests unitaires & intégration
└── resources/
    ├── application.properties
    └── application-test.properties
```

---

## Configuration test

Le profil `test` utilise une base H2 en mémoire avec création automatique des tables.

Fichier : `src/test/resources/application-test.properties`

```properties
spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=MySQL
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=create
spring.sql.init.mode=always
spring.sql.init.data-locations=classpath:data.sql
```

---


## 📄 Licence

Projet réalisé dans le cadre de la formation OpenClassrooms - Développeur Java.
