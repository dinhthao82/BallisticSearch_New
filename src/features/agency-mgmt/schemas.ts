import { z } from 'zod';

export const agencySchema = z.object({
  agencyId: z
    .string()
    .trim()
    .min(2)
    .max(40)
    .regex(/^[A-Z0-9-]+$/, 'Uppercase letters, digits, dashes only'),
  name: z.string().trim().min(2).max(120),
  contactEmail: z.string().trim().email(),
  contactPhone: z.string().trim().max(40).optional(),
  region: z.string().trim().max(60).optional(),
  active: z.boolean(),
});
export type AgencyInput = z.infer<typeof agencySchema>;

export const defaultAgencyValues: AgencyInput = {
  agencyId: '',
  name: '',
  contactEmail: '',
  contactPhone: '',
  region: '',
  active: true,
};

export const agencySettingSchema = z.object({
  agencyId: z.string().trim().min(1, 'Agency is required'),
  retentionDays: z.number().int().min(30).max(3650),
  autoApprove: z.boolean(),
  sharingEnabled: z.boolean(),
});
export type AgencySettingInput = z.infer<typeof agencySettingSchema>;

export const defaultAgencySettingValues: AgencySettingInput = {
  agencyId: '',
  retentionDays: 365,
  autoApprove: false,
  sharingEnabled: true,
};

export const contractSchema = z.object({
  contractId: z.string().trim().min(1, 'Contract ID is required'),
  agencyId: z.string().trim().min(1, 'Agency is required'),
  startDate: z.string().trim().min(1, 'Start date is required'),
  endDate: z.string().trim().min(1, 'End date is required'),
  usersLimit: z.number().int().min(1).max(10_000),
  storageLimitGB: z.number().int().min(1).max(100_000),
  status: z.enum(['Pending', 'In Process', 'Closed']),
});
export type ContractInput = z.infer<typeof contractSchema>;

export const defaultContractValues: ContractInput = {
  contractId: '',
  agencyId: '',
  startDate: '',
  endDate: '',
  usersLimit: 50,
  storageLimitGB: 500,
  status: 'Pending',
};
