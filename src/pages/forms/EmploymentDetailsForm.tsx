import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employmentDetailsSchema } from '@/lib/schemas';
import type { EmploymentDetails } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface Props {
    defaultValues?: Partial<EmploymentDetails>;
    onSave: (data: EmploymentDetails) => void;
    onBack: () => void;
}

export default function EmploymentDetailsForm({ defaultValues, onSave, onBack }: Props) {
    const form = useForm<EmploymentDetails>({
        resolver: zodResolver(employmentDetailsSchema),
        defaultValues: {
            employmentType: 'SALARIED',
            employerName: '',
            monthlyIncome: 0,
            experienceYears: 0,
            ...defaultValues
        } as EmploymentDetails,
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="employmentType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Employment Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="SALARIED">Salaried</SelectItem>
                                        <SelectItem value="SELF_EMPLOYED">Self Employed</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="employerName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Employer / Business Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Company Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="monthlyIncome"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Monthly Income</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="5000" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="experienceYears"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Work Experience (Years)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="2" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={onBack}>Back</Button>
                    <Button type="submit">Next Step</Button>
                </div>
            </form>
        </Form>
    );
}
