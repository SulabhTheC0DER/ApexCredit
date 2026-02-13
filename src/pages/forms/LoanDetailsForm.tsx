import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loanDetailsSchema } from '@/lib/schemas';
import type { LoanDetails } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
    defaultValues?: Partial<LoanDetails>;
    onSave: (data: LoanDetails) => void;
    onBack: () => void;
}

export default function LoanDetailsForm({ defaultValues, onSave, onBack }: Props) {
    const form = useForm<LoanDetails>({
        resolver: zodResolver(loanDetailsSchema),
        defaultValues: {
            amount: 50000,
            tenureMonths: 12,
            purpose: '',
            ...defaultValues
        } as LoanDetails,
    });

    const amount = form.watch('amount');
    const tenure = form.watch('tenureMonths');
    const interestRate = 10.5; // Demo rate: 10.5% p.a.

    const calculateEMI = (p: number, n: number, r: number) => {
        if (!p || !n) return 0;
        const rMon = r / 12 / 100;
        const emi = p * rMon * Math.pow(1 + rMon, n) / (Math.pow(1 + rMon, n) - 1);
        return Math.round(emi);
    };

    const emi = calculateEMI(amount, tenure, interestRate);

    useEffect(() => {
        // Optional: update something if needed on change
    }, [amount, tenure]);


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Loan Amount</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="tenureMonths"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tenure (Months)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="purpose"
                        render={({ field }) => (
                            <FormItem className="col-span-2">
                                <FormLabel>Purpose of Loan</FormLabel>
                                <FormControl>
                                    <Input placeholder="Home Renovation, Education, etc." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Estimated Monthly EMI</p>
                                <p className="text-xs text-muted-foreground">@ {interestRate}% p.a.</p>
                            </div>
                            <p className="text-3xl font-bold text-primary">${emi.toLocaleString()}</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={onBack}>Back</Button>
                    <Button type="submit">Next Step</Button>
                </div>
            </form>
        </Form>
    );
}
