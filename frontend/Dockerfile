FROM node:22.10-slim as builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM tomcat:10.1.39-jre17-temurin-noble
COPY --from=builder /app/dist /usr/local/tomcat/webapps/ROOT
COPY WEB-INF /usr/local/tomcat/webapps/ROOT/WEB-INF
EXPOSE 8080
CMD ["catalina.sh", "run"]