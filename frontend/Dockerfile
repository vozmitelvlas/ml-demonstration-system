FROM node:22.10-slim as builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM tomcat:10.1.39-jre17-temurin-noble
COPY --from=builder /app/dist ${CATALINA_HOME}/webapps/ROOT
COPY tomcat/server.xml ${CATALINA_HOME}/conf/server.xml
COPY tomcat/web.xml ${CATALINA_HOME}/webapps/ROOT/WEB-INF/web.xml
EXPOSE 8080
CMD ["catalina.sh", "run"]