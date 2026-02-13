import type { LoanApplication, ApplicationStatus } from '@/types';

const MOCK_LOANS: LoanApplication[] = [
    {
        id: 'L-1001',
        applicantId: 'u-1',
        applicantName: 'John Doe',
        status: 'SUBMITTED',
        personalDetails: {
            fullName: 'John Doe',
            email: 'john@example.com',
            phone: '1234567890',
            dob: '1990-01-01',
            address: '123 Main St',
            pan: 'ABCDE1234F',
            aadhaar: '123456789012'
        },
        employmentDetails: {
            employmentType: 'SALARIED',
            employerName: 'Tech Corp',
            monthlyIncome: 5000,
            experienceYears: 5
        },
        loanDetails: {
            amount: 50000,
            tenureMonths: 24,
            purpose: 'Home Renovation',
            calculatedEmi: 2500
        },
        documents: [],
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

export const loanService = {
    getAllLoans: async (): Promise<LoanApplication[]> => {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_LOANS), 800));
    },

    getLoansByApplicant: async (applicantId: string): Promise<LoanApplication[]> => {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_LOANS.filter(l => l.applicantId === applicantId)), 800));
    },

    getLoanById: async (id: string): Promise<LoanApplication | null> => {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_LOANS.find(l => l.id === id) || null), 500));
    },

    createLoan: async (application: Omit<LoanApplication, 'id' | 'status' | 'updatedAt' | 'submittedAt'>): Promise<LoanApplication> => {
        const newLoan: LoanApplication = {
            id: `L-${1000 + MOCK_LOANS.length + 1}`,
            status: 'SUBMITTED',
            submittedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...application
        };
        MOCK_LOANS.push(newLoan);
        return new Promise(resolve => setTimeout(() => resolve(newLoan), 1000));
    },

    updateLoanStatus: async (id: string, status: ApplicationStatus): Promise<LoanApplication> => {
        const loan = MOCK_LOANS.find(l => l.id === id);
        if (!loan) throw new Error("Loan not found");

        loan.status = status;
        loan.updatedAt = new Date().toISOString();
        return new Promise(resolve => setTimeout(() => resolve({ ...loan }), 500));
    }
};
