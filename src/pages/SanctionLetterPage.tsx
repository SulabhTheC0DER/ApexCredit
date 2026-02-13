import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loanService } from '@/services/loanService';
import type { LoanApplication } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function SanctionLetterPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loan, setLoan] = useState<LoanApplication | null>(null);

    useEffect(() => {
        const fetchLoan = async () => {
            if (id) {
                const data = await loanService.getLoanById(id);
                setLoan(data);
            }
        };
        fetchLoan();
    }, [id]);

    if (!loan) return <div>Loading...</div>;
    if (loan.status !== 'APPROVED' && loan.status !== 'VERIFIED') {
        return <div>Loan not approved yet.</div>;
    }

    const handleAction = async (action: 'ACCEPTED' | 'REJECTED') => {
        // In a real app, this would be a separate status or endpoint
        toast({
            title: action === 'ACCEPTED' ? "Offer Accepted" : "Offer Rejected",
            description: `You have ${action.toLowerCase()} the loan offer.`
        });
        navigate('/dashboard');
    };

    return (
        <div className="max-w-2xl mx-auto py-10 space-y-6">
            <Card className="border-2 border-primary/20 shadow-xl">
                <CardHeader className="text-center border-b bg-muted/20">
                    <div className="mx-auto h-12 w-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground mb-4 font-bold text-xl">
                        A
                    </div>
                    <CardTitle className="text-2xl">Loan Sanction Letter</CardTitle>
                    <p className="text-muted-foreground">Reference: {loan.id}</p>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <p>Dear <strong>{loan.personalDetails?.fullName}</strong>,</p>
                    <p>
                        We are pleased to inform you that your loan application has been approved based on the following terms and conditions:
                    </p>

                    <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                        <div>
                            <p className="text-sm text-muted-foreground">Sanctioned Amount</p>
                            <p className="text-xl font-bold text-primary">${loan.loanDetails?.amount?.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Tenure</p>
                            <p className="text-xl font-bold">{loan.loanDetails?.tenureMonths} Months</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Interest Rate</p>
                            <p className="text-xl font-bold">10.5% p.a.</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Monthly EMI</p>
                            <p className="text-xl font-bold">${loan.loanDetails?.calculatedEmi?.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="text-sm text-muted-foreground space-y-2">
                        <p>By accepting this offer, you agree to the Terms and Conditions of ApexCredit Retail Loans.</p>
                        <p>This offer is valid for 30 days from the date of issuance.</p>
                    </div>
                </CardContent>
                <CardFooter className="flex gap-4 justify-center pb-8">
                    <Button variant="outline" className="w-32 border-red-200 hover:bg-red-50 hover:text-red-600" onClick={() => handleAction('REJECTED')}>
                        <X className="mr-2 h-4 w-4" /> Reject
                    </Button>
                    <Button className="w-32" onClick={() => handleAction('ACCEPTED')}>
                        <Check className="mr-2 h-4 w-4" /> Accept
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
