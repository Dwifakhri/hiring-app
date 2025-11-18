import { email, z } from 'zod';

export const statusJobEnum = z.enum(['active', 'inactive', 'draft']);
export const jobTypeEnum = z.enum([
  'full_time',
  'contract',
  'part_time',
  'internship',
  'freelance',
]);

export const jobsBackendSchema = z
  .object({
    status: statusJobEnum.default('active'),

    salary_min: z
      .number({ error: 'Salary min must be a number' })
      .min(0, 'Salary min cannot be negative'),

    salary_max: z
      .number({ error: 'Salary max must be a number' })
      .min(0, 'Salary max cannot be negative'),

    job_name: z
      .string()
      .nonempty('Job name is required')
      .min(3, 'Job name must be at least 3 characters'),

    job_type: jobTypeEnum,
    job_description: z
      .string()
      .nonempty('Job description is required')
      .min(10, 'Description must be at least 10 characters'),

    number_candidates: z
      .number({ error: 'Number of candidates must be a number' })
      .int('Must be an integer')
      .min(1, 'At least one candidate is required'),

    company: z.string().nonempty('Company name is required'),
    location: z.string().nonempty('Location is required'),
  })
  .refine((data) => data.salary_max >= data.salary_min, {
    path: ['salary_max'],
    message: 'Salary max must be greater than or equal to salary min',
  });

export type JobsBackendSchemaType = z.infer<typeof jobsBackendSchema>;

export const applyJobBackendSchema = z.object({
  full_name: z.string().nonempty('Full name is required'),
  email: email({ message: 'Invalid email' }).nonempty('Email is required'),
  photo_profile: z.string().nonempty('Photo profile is required'),
  domicile: z.string(),
  gender: z.string(),
  birth: z.string(),
  phone: z.string(),
  country_code: z.string(),
  linkedin: z.url({ message: 'Invalid linkedin' }),
});

export type applyJobBackendSchemaType = z.infer<typeof applyJobBackendSchema>;
