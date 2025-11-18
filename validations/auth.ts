import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email({ message: 'Invalid email' }).nonempty('Email is required'),
  password: z.string().nonempty('Password is required'),
});

export type loginSchemaType = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    full_name: z
      .string()
      .nonempty('Full name is required')
      .min(3, 'Full name must be at least 3 characters'),
    email: z.email({ message: 'Invalid email' }).nonempty('Email is required'),
    password: z.string().nonempty('Password is required'),
    confirm_password: z.string().nonempty('Confirm password is required'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Confirm password does not match',
    path: ['confirm_password'],
  });

export type registerSchemaType = z.infer<typeof registerSchema>;

export const registerBackendSchema = z.object({
  full_name: z
    .string()
    .nonempty('Full name is required')
    .min(3, 'Full name must be at least 3 characters'),
  email: z.email({ message: 'Invalid email' }).nonempty('Email is required'),
  password: z.string().nonempty('Password is required'),
});

export type registerBackendSchemaType = z.infer<typeof registerBackendSchema>;
