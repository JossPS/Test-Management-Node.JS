import { body } from 'express-validator';

export const registerValidation = [
  body('name')
    .notEmpty()
    .withMessage('El nombre es obligatorio'),

  body('email')
    .isEmail()
    .withMessage('Debe proporcionar un email válido'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres'),
];

export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Debe proporcionar un email válido'),

  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria'),
];

export const updateProfileValidation = [
  body('name')
    .notEmpty()
    .withMessage('El nombre es obligatorio'),
];