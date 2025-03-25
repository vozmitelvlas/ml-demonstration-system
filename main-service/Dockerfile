FROM gradle:8.11.1-jdk17 AS build
WORKDIR /app
COPY --chown=gradle:gradle settings.gradle.kts build.gradle.kts /app/
RUN gradle clean dependencies --no-daemon
COPY --chown=gradle:gradle . /app
RUN gradle bootJar --no-daemon

FROM eclipse-temurin:17-jre-alpine AS builder
WORKDIR /app
COPY --from=build /app/build/libs/*.jar /app/app.jar
RUN java -Djarmode=layertools -jar app.jar extract

FROM eclipse-temurin:17-jre-alpine
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring
WORKDIR /app
COPY --from=builder /app/dependencies/ ./
COPY --from=builder /app/spring-boot-loader/ ./
COPY --from=builder /app/snapshot-dependencies/ ./
COPY --from=builder /app/application/ ./
EXPOSE 8080
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
