INSERT INTO organizations (organization_id, name, description, limits_type, is_editable)
VALUES (1, 'Без организации', 'Объединение пользователей, которым не назначено ни одной организации. Назначается при регистрации пользователей', 'ORGANIZATION_LIMITS', false),
       (2, 'Отдел разработки', 'Организация для разработчиков моделей', 'MODEL_LIMITS', true),
       (3, 'Отдел администрирования', 'Администраторы приложения', 'ORGANIZATION_LIMITS', true),
       (4, 'Управленческий отдел', 'Организация для отдела управленцов', 'MODEL_LIMITS', true),
       (5, 'Пользовательский отдел', 'Работа с пользователями', 'USER_LIMITS', true);