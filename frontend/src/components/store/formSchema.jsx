import * as yup from "yup";

export const signUpSchema = yup.object()
    .shape({
        login: yup.string()
            // .required('Логин обязателен')
            .matches(/^[\w_]*$/, `Неверный логин. Допустимые символы: буквы, цифры и нижнее подчёркивание`)
            .min(3, 'Неверный логин. Должно быть не меньше 3 символов')
            .max(50, 'Неверный логин. Должно быть не больше 50 символов'),

        email: yup.string()
            // .required('Email обязателен')
            .email('Некорректный формат Email'),

        firstName: yup.string()
            // .required('Имя обязательно')
            .max(255, 'Неверное имя. Должно быть не больше 255 символов'),

        lastName: yup.string()
            // .required('Фамилия обязательна')
            .max(255, 'Неверное имя. Должно быть не больше 255 символов'),

        patronymic: yup.string()
            .max(255, 'Неверное отчество. Должно быть не больше 255 символов'),

        password: yup.string()
            // .required('Пароль обязателен')
            .min(6, 'Неверный пароль. Должно быть не меньше 6 символов')
            .matches(/[\d]+/ui, 'Неверный пароль. Пароль должен содержать хотя бы одну цифру')
            .matches(/[a-zA-Z]/i, 'Неверный пароль. Пароль должен состоять из латинских букв')
            .max(255, 'Неверный пароль. Должно быть не больше 255 символов'),

        repeatPassword: yup.string()
            .oneOf([yup.ref('password'), null], 'Пароли должны совпадать')

    })

export const signInSchema = yup.object()
    .shape({
        login: yup.string()
            // .required('Логин обязателен')
            .matches(/^[\w_]*$/, 'Неверный логин. Допустимые символы: буквы, цифры и нижнее подчёркивание')
            .min(3, 'Неверный логин. Должно быть не меньше 3 символов')
            .max(50, 'Неверный логин. Должно быть не больше 50 символов'),

        password: yup.string()
            // .required('Пароль обязателен')
            .min(6, 'Неверный пароль. Должно быть не меньше 6 символов')
            .max(255, 'Неверный пароль. Должно быть не больше 255 символов'),

    })

export const changeModelDataSchema = yup.object()
    .shape({
        modelName: yup.string()
            .required('Поля должны быть заполнены'),

        versionName: yup.string()
            .required('Поля должны быть заполнены'),

        description: yup.string(),

        uri: yup.string()
            .required('Поля должны быть заполнены'),

        runtime: yup.string()
            .required('Поля должны быть заполнены'),

        problemType: yup.string()
            .required('Поля должны быть заполнены'),
    })

export const changeUserDataSchema = yup.object()
    .shape({
        lastName: yup.string()
            .required('Фамилия должна быть указана'),

        firstName: yup.string()
            .required('Имя должно быть указано'),

        selectRoles: yup
            .array(
                yup.object({value: yup.string(), label: yup.string()}) // Каждый элемент массива должен быть объектом
            )
            .min(1, "Выберите хотя бы одну роль")
    })

export const changeOrganisationsSchema = yup.object()
    .shape({
        name: yup.string()
            .required('Название организации должно быть указано')
            .min(4, 'Неверное название. Должно быть не меньше 4 символов')
    })

export const personalCabinetSchema = yup.object()
    .shape({
        lastName: yup.string()
            .required('Фамилия должна быть указана'),
    })

export const setNewPasswordSchema = yup.object()
    .shape({
        newPassword: yup.string()
            .min(6, 'Неверный пароль. Должно быть не меньше 6 символов')
            .matches(/[\d]+/ui, 'Неверный пароль. Пароль должен содержать хотя бы одну цифру')
            .matches(/[a-zA-Z]/i, 'Неверный пароль. Пароль должен состоять из латинских букв')
            .max(255, 'Неверный пароль. Должно быть не больше 255 символов'),

        repeatNewPassword: yup.string()
            .oneOf([yup.ref('newPassword'), null], 'Пароли должны совпадать')
    })

export const passwordRecoverSchema = yup.object()
    .shape({
        email: yup.string()
            // .required('Email обязателен')
            .email('Некорректный формат Email'),

        password: yup.string()
            .min(6, 'Неверный пароль. Должно быть не меньше 6 символов')
            .matches(/[\d]+/ui, 'Неверный пароль. Пароль должен содержать хотя бы одну цифру')
            .matches(/[a-zA-Z]/i, 'Неверный пароль. Пароль должен состоять из латинских букв')
            .max(255, 'Неверный пароль. Должно быть не больше 255 символов'),

        repeatPassword: yup.string()
            .oneOf([yup.ref('password'), null], 'Пароли должны совпадать')
    })

export const ChangeOrganisationModelsSchema = yup.object().strict().test(
    'all-integers',
    'Значения полей обязательны и должны быть целыми числами',
    (obj) => {
        return Object.entries(obj)
            .filter(([key]) => key.startsWith('rps') || key.startsWith('requestsPerWeek'))
            .every(([key, value]) => {
                if (value === undefined || value === null || value === "") return false; // Обязательность
                const val = Number(value);
                if (isNaN(val)) return false; // Число
                if (!Number.isInteger(val)) return false; // Целое число
                return true;
            });
    }
);
