INSERT INTO roles (role_id, name) VALUES (1, 'ADMIN'), (2, 'USER'), (3, 'ORGANIZATION_HEAD');

INSERT INTO users (user_id, login, password, first_name, last_name, email, organization_id)
VALUES (1, 'admin', '$2a$12$6KB.ORbCJV/655Mso0YO0OtXiygTTKcVpW/cPtcPjiMC1TO9geLDq', 'Админ', 'Админов', 'admin@example.com', 3),
       (2, 'user', '$2a$12$G0rJlsDW5ngdlv4NxZgz4OqhS48ue4lPbdyy1hTaDomjMJbEHH8xK', 'Иван', 'Иванов', 'user@example.com', 2),
       (3, 'director', '$2a$12$w3lt4S/p.HKujZFUlBKpfOTUlraarBUG0Z2e7lE.5mKJmWDjdOQPC', 'Сергей', 'Сергеев', 'director@example.com', 4);

INSERT INTO users_roles (user_id, role_id) VALUES (1, 1), (1, 3), (2, 2), (3, 2), (3, 3);