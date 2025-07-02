# Étape 1 : build avec Maven + JDK 17
FROM maven:3.8.7-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean install -DskipTests

# Étape 2 : runtime minimal, JDK 17 pour l'exécution
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=builder /app/target/yoga-app-0.0.1-SNAPSHOT.jar /app/yoga-app.jar
CMD ["java", "-jar", "/app/yoga-app.jar"]
