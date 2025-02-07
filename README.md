# ML-Demonstration-System

## Запуск
```shell
$ ./gradlew :main-service:bootJar
$ docker compose up -d
```

## Данные для авторизации
| Роли                         | Логин    | Пароль   |
|------------------------------|----------|----------|
| **ADMIN, ORGANIZATION_HEAD** | admin    | password |
| **USER**                     | user     | password |
| **USER, ORGANIZATION_HEAD**  | director | password |