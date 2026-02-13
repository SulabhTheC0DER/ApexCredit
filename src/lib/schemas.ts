import { z } from 'zod';

export const personalDetailsSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    dob: z.string().refine((val) => new Date(val).toString() !== 'Invalid Date', 'Invalid Date'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone must be at least 10 digits'),
    pan: z.string().min(10, 'PAN must be 10 characters').optional(),
    address: z.string().min(5, 'Address is too short'),
});

export const employmentDetailsSchema = z.object({
    employmentType: z.enum(['SALARIED', 'SELF_EMPLOYED']),
    employerName: z.string().optional(),
    monthlyIncome: z.coerce.number().min(1000, 'Income must be at least 1000'),
    experienceYears: z.coerce.number().min(0, 'Experience cannot be negative'),
});

export const loanDetailsSchema = z.object({
    amount: z.coerce.number().min(5000, 'Minimum loan amount is 5000'),
    tenureMonths: z.coerce.number().min(6, 'Minimum tenure is 6 months').max(360, 'Maximum tenure is 360 months'),
    purpose: z.string().min(3, 'Purpose is required'),
});

// Combined schema for form state (partial)
export const applicationSchema = z.object({
    personal: personalDetailsSchema,
    employment: employmentDetailsSchema,
    loan: loanDetailsSchema,
});

export type PersonalDetails = z.infer<typeof personalDetailsSchema>;
export type EmploymentDetails = z.infer<typeof employmentDetailsSchema>;
export type LoanDetails = z.infer<typeof loanDetailsSchema>;
