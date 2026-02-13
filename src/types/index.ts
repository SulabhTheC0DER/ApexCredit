export type Role = 'APPLICANT' | 'OFFICER' | 'UNDERWRITER' | 'MANAGER';

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    avatarUrl?: string;
}

export interface LoginCredentials {
    email: string;
    password?: string;
}

export type ApplicationStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'VERIFIED' | 'APPROVED' | 'REJECTED';

export interface LoanApplication {
    id: string;
    applicantId: string;
    applicantName: string; // Denormalized for easier display
    status: ApplicationStatus;
    submittedAt?: string;
    updatedAt: string;

    // Step 1: Personal
    personalDetails?: {
        fullName: string;
        dob: string;
        pan?: string;
        aadhaar?: string;
        email: string;
        phone: string;
        address: string;
    };

    // Step 2: Employment
    employmentDetails?: {
        employmentType: 'SALARIED' | 'SELF_EMPLOYED';
        employerName?: string;
        monthlyIncome: number;
        experienceYears: number;
    };

    // Step 3: Loan
    loanDetails?: {
        amount: number;
        tenureMonths: number;
        purpose: string;
        calculatedEmi?: number;
    };

    // Step 4: Documents (Keys/URLs)
    documents?: Document[];

    // Processing
    riskScore?: number;
    creditScore?: number;
    officerNotes?: string; // Internal notes
}

export interface Document {
    id: string;
    name: string;
    type: string; // 'proof_id', 'proof_income', etc.
    url: string; // Mock URL
    status: 'PENDING' | 'VERIFIED' | 'REJECTED';
    uploadedAt: string;
}

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    read: boolean;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
    createdAt: string;
    link?: string;
}
