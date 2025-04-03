INSERT INTO roles (role_id, name) VALUES (1, 'ADMIN'), (2, 'USER'), (3, 'ORGANIZATION_HEAD');

INSERT INTO organizations (organization_id, name, description, limits_type, is_editable)
VALUES (1, 'Без организации', 'Объединение пользователей, которым не назначено ни одной организации. Назначается при регистрации пользователей', 'ORGANIZATION_LIMITS', false),
       (2, 'Отдел разработки', 'Организация для разработчиков моделей', 'MODEL_LIMITS', true),
       (3, 'Отдел администрирования', 'Администраторы приложения', 'ORGANIZATION_LIMITS', true),
       (4, 'Управленческий отдел', 'Организация для отдела управленцов', 'MODEL_LIMITS', true),
       (5, 'Пользовательский отдел', 'Работа с пользователями', 'USER_LIMITS', true);

INSERT INTO users (user_id, login, password, first_name, last_name, email, organization_id, active)
VALUES (1, 'admin', '$2a$12$6KB.ORbCJV/655Mso0YO0OtXiygTTKcVpW/cPtcPjiMC1TO9geLDq', 'Админ', 'Админов', 'admin@example.com', 3, true),
       (2, 'user', '$2a$12$G0rJlsDW5ngdlv4NxZgz4OqhS48ue4lPbdyy1hTaDomjMJbEHH8xK', 'Иван', 'Иванов', 'user@example.com', 2, false),
       (3, 'director', '$2a$12$w3lt4S/p.HKujZFUlBKpfOTUlraarBUG0Z2e7lE.5mKJmWDjdOQPC', 'Сергей', 'Сергеев', 'director@example.com', 4, true);


INSERT INTO users_roles (user_id, role_id) VALUES (1, 1), (1, 3), (2, 2), (3, 2), (3, 3);

INSERT INTO limits (limit_id, requests_per_week_limit, rps_limit)
VALUES (1, 100, 5), (2, 1000, 10), (3, 10, 1), (4, 20, 2), (5, 30, 5), (6, 100, 25), (7, 1000, 3), (8, 250, 3);


INSERT INTO models (model_id, name, limit_id)
VALUES (1, 'DenseNet', 1), (2, 'ALBERT', 2);

INSERT INTO model_info (model_id, runtime, problem_type)
VALUES (1, 'TRITON_INFERENCE_SERVER', 'IMAGE_CLASSIFICATION'), (2, 'MONAI_DEPLOY', 'NLP');

INSERT INTO model_versions (model_version_id, model_id, version_name, uri, description)
VALUES (1, 1, '121', 'http://localhost:4000/densenet/121', 'A DenseNet convolutional neural network. Version with 121 layers'),
       (2, 1, '169', 'http://localhost:4001/densenet/169', 'A DenseNet convolutional neural network. Version with 169 layers'),
       (3, 2, '#1', 'http://localhost:4002/ALBERT', 'The TF-NLP library provides a collection of scripts for training and evaluating transformer-based models, on various tasks such as sentence classification, question answering, and translation.');

INSERT INTO models_users_limits (model_id, user_id, limit_id) VALUES (1, 2, 3), (1, 3, 4), (2, 3, 5);

INSERT INTO models_organizations_limits (model_id, organization_id, limit_id) VALUES (1, 2, 6), (1, 4, 7), (2, 4, 8);
