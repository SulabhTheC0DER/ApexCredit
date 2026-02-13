import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { applicationSchema } from '@/lib/schemas';
import type { PersonalDetails, EmploymentDetails, LoanDetails } from '@/lib/schemas';
import type { Document } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { loanService } from '@/services/loanService';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

// Steps components
import PersonalDetailsForm from './forms/PersonalDetailsForm';
import EmploymentDetailsForm from './forms/EmploymentDetailsForm';
import LoanDetailsForm from './forms/LoanDetailsForm';
import DocumentUploadForm from './forms/DocumentUploadForm';
import ReviewSubmitForm from './forms/ReviewSubmitForm';

const STEPS = [
    'Personal Details',
    'Employment & Income',
    'Loan Details',
    'Documents',
    'Review'
];

interface ApplicationData {
    personal: Partial<PersonalDetails>;
    employment: Partial<EmploymentDetails>;
    loan: Partial<LoanDetails>;
    documents: Document[];
}

export default function NewApplicationPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<ApplicationData>({
        personal: {},
        employment: {},
        loan: {},
        documents: []
    });

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    const updateFormData = <K extends keyof ApplicationData>(section: K, data: ApplicationData[K]) => {
        setFormData(prev => ({ ...prev, [section]: data }));
    };

    const handleSubmitApplication = async () => {
        if (!user) return;
        try {
            // Validate full schema before submitting if needed, or rely on step validation
            await loanService.createLoan({
                applicantId: user.id,
                applicantName: user.name,
                personalDetails: formData.personal as PersonalDetails,
                employmentDetails: formData.employment as EmploymentDetails,
                loanDetails: formData.loan as LoanDetails,
                documents: formData.documents,
            });
            toast({
                title: "Application Submitted",
                description: "Your loan application has been submitted successfully.",
            });
            navigate('/dashboard');
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to submit application.",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-2">New Loan Application</h1>
                <p className="text-muted-foreground">Complete the steps below to apply for a new loan.</p>
            </div>

            <div className="mb-12">
                <Stepper steps={STEPS} currentStep={currentStep} />
            </div>

            <Card className="border-border/50 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary"></div>
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                            {currentStep + 1}
                        </span>
                        {STEPS[currentStep]}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                    {currentStep === 0 && (
                        <PersonalDetailsForm
                            defaultValues={formData.personal as PersonalDetails}
                            onSave={(data) => { updateFormData('personal', data); nextStep(); }}
                        />
                    )}
                    {currentStep === 1 && (
                        <EmploymentDetailsForm
                            defaultValues={formData.employment as EmploymentDetails}
                            onSave={(data) => { updateFormData('employment', data); nextStep(); }}
                            onBack={prevStep}
                        />
                    )}
                    {currentStep === 2 && (
                        <LoanDetailsForm
                            defaultValues={formData.loan as LoanDetails}
                            onSave={(data) => { updateFormData('loan', data); nextStep(); }}
                            onBack={prevStep}
                        />
                    )}
                    {currentStep === 3 && (
                        <DocumentUploadForm
                            documents={formData.documents}
                            onSave={(docs) => { updateFormData('documents', docs); nextStep(); }}
                            onBack={prevStep}
                        />
                    )}
                    {currentStep === 4 && (
                        <ReviewSubmitForm
                            data={formData}
                            onSubmit={handleSubmitApplication}
                            onBack={prevStep}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function Stepper({ steps, currentStep }: { steps: string[], currentStep: number }) {
    return (
        <div className="relative w-full">
            {/* Background Line */}
            <div className="absolute top-[15px] left-0 w-full h-[2px] bg-muted -z-10" />

            {/* Active Progress Line */}
            <div
                className="absolute top-[15px] left-0 h-[2px] bg-primary -z-10 transition-all duration-500 ease-in-out"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />

            <div className="flex justify-between w-full">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;

                    return (
                        <div key={step} className="flex flex-col items-center group cursor-default">
                            <div
                                className={cn(
                                    "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 z-10",
                                    isCompleted
                                        ? "bg-primary border-primary text-primary-foreground scale-100"
                                        : isCurrent
                                            ? "bg-background border-primary text-primary ring-4 ring-primary/20 scale-110"
                                            : "bg-background border-muted text-muted-foreground"
                                )}
                            >
                                {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : <span className="text-xs font-semibold">{index + 1}</span>}
                            </div>
                            <span
                                className={cn(
                                    "text-xs mt-3 font-medium transition-colors duration-300 absolute pt-8 w-24 text-center hidden md:block",
                                    isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                                )}
                            >
                                {step}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Mobile Step Label - visible only on nice spacing */}
            <div className="md:hidden text-center mt-6">
                <p className="text-sm font-medium text-primary">Step {currentStep + 1}: {steps[currentStep]}</p>
            </div>
        </div>
    );
}
