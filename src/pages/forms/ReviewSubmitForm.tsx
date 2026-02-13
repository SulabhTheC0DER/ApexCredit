import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
import { CheckCircle } from 'lucide-react';
import type { PersonalDetails, EmploymentDetails, LoanDetails } from '@/lib/schemas';
import type { Document } from '@/types';

interface ApplicationData {
    personal: Partial<PersonalDetails>;
    employment: Partial<EmploymentDetails>;
    loan: Partial<LoanDetails>;
    documents: Document[];
}

interface Props {
    data: ApplicationData;
    onSubmit: () => void;
    onBack: () => void;
}

export default function ReviewSubmitForm({ data, onSubmit, onBack }: Props) {
    const { personal, employment, loan, documents } = data;

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <Section title="Personal Details">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <p className="text-muted-foreground">Full Name:</p> <p className="font-medium">{personal.fullName}</p>
                        <p className="text-muted-foreground">Email:</p> <p className="font-medium">{personal.email}</p>
                        <p className="text-muted-foreground">Phone:</p> <p className="font-medium">{personal.phone}</p>
                        <p className="text-muted-foreground">DOB:</p> <p className="font-medium">{personal.dob}</p>
                        <p className="text-muted-foreground">Address:</p> <p className="font-medium">{personal.address}</p>
                    </div>
                </Section>

                <Section title="Employment Details">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <p className="text-muted-foreground">Type:</p> <p className="font-medium">{employment.employmentType}</p>
                        <p className="text-muted-foreground">Employer:</p> <p className="font-medium">{employment.employerName || '-'}</p>
                        <p className="text-muted-foreground">Income:</p> <p className="font-medium">${employment.monthlyIncome}</p>
                        <p className="text-muted-foreground">Experience:</p> <p className="font-medium">{employment.experienceYears} Years</p>
                    </div>
                </Section>

                <Section title="Loan Details">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <p className="text-muted-foreground">Amount:</p> <p className="font-medium text-primary">${loan.amount}</p>
                        <p className="text-muted-foreground">Tenure:</p> <p className="font-medium">{loan.tenureMonths} Months</p>
                        <p className="text-muted-foreground">Purpose:</p> <p className="font-medium">{loan.purpose}</p>
                    </div>
                </Section>

                <Section title="Documents Uploaded">
                    <div className="flex gap-2 flex-wrap">
                        {documents.map((doc) => (
                            <div key={doc.id} className="bg-muted px-3 py-1 rounded-full text-xs flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                {doc.name}
                            </div>
                        ))}
                    </div>
                </Section>
            </div>

            <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={onBack}>Back</Button>
                <Button onClick={onSubmit} className="w-40 relative group">
                    <span className="group-hover:scale-105 transition-transform">Submit Application</span>
                </Button>
            </div>
        </div>
    );
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <Card>
            <CardHeader className="py-3 bg-muted/30">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent className="py-3">
                {children}
            </CardContent>
        </Card>
    )
}
