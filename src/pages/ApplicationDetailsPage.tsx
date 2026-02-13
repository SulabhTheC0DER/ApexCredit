import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loanService } from '@/services/loanService';
import type { LoanApplication, ApplicationStatus } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    User,
    Briefcase,
    DollarSign,
    FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ApplicationDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loan, setLoan] = useState<LoanApplication | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLoan = async () => {
            if (!id) return;
            try {
                const data = await loanService.getLoanById(id);
                setLoan(data);
            } catch (error) {
                toast({ title: "Error", description: "Could not fetch loan details.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };
        fetchLoan();
    }, [id]);

    const handleStatusUpdate = async (status: ApplicationStatus) => {
        if (!id || !user) return;
        try {
            const updated = await loanService.updateLoanStatus(id, status);
            setLoan(updated);
            toast({
                title: status === 'APPROVED' ? "Application Approved" : "Application Rejected",
                description: `Loan ${id} has been ${status.toLowerCase()}.`,
                variant: status === 'APPROVED' ? "default" : "destructive"
            });
        } catch (error) {
            toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!loan) return <div>Loan not found</div>;

    const canApprove = user?.role === 'OFFICER' || user?.role === 'UNDERWRITER' || user?.role === 'MANAGER';
    const isPending = ['SUBMITTED', 'UNDER_REVIEW'].includes(loan.status);

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="h-10 w-10">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">Application #{loan.id.slice(-6).toUpperCase()}</h1>
                            <StatusBadge status={loan.status} />
                        </div>
                        <p className="text-sm text-muted-foreground">Submitted on {new Date(loan.submittedAt || loan.updatedAt).toLocaleDateString()}</p>
                    </div>
                </div>
                {canApprove && isPending && (
                    <div className="flex gap-2">
                        <Button variant="destructive" onClick={() => handleStatusUpdate('REJECTED')}>
                            <XCircle className="mr-2 h-4 w-4" /> Reject
                        </Button>
                        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleStatusUpdate('APPROVED')}>
                            <CheckCircle className="mr-2 h-4 w-4" /> Approve
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Loan Summary Card */}
                    <Card className="border-l-4 border-l-primary shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-primary" />
                                Loan Request
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Amount</p>
                                    <p className="text-3xl font-bold tracking-tight">${loan.loanDetails?.amount?.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Tenure</p>
                                    <p className="text-2xl font-semibold">{loan.loanDetails?.tenureMonths} <span className="text-sm font-normal text-muted-foreground">Months</span></p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Purpose</p>
                                    <p className="text-lg font-medium">{loan.loanDetails?.purpose}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Personal & Employment Info */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    Applicant Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <DetailItem label="Full Name" value={loan.personalDetails?.fullName} />
                                <DetailItem label="Email" value={loan.personalDetails?.email} />
                                <DetailItem label="Phone" value={loan.personalDetails?.phone} />
                                <DetailItem label="Address" value={loan.personalDetails?.address} />
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    Employment
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <DetailItem label="Type" value={loan.employmentDetails?.employmentType} />
                                <DetailItem label="Monthly Income" value={`$${loan.employmentDetails?.monthlyIncome?.toLocaleString()}`} />
                                <DetailItem label="Employer" value={loan.employmentDetails?.employerName || 'N/A'} />
                                <DetailItem label="Experience" value={`${loan.employmentDetails?.experienceYears} Years`} />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Documents Section */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                Documents
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {(!loan.documents || loan.documents.length === 0) ? (
                                <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
                                    No documents uploaded
                                </div>
                            ) : (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {loan.documents.map((doc, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 transition-colors hover:bg-muted/50 cursor-pointer group">
                                            <div className="h-10 w-10 rounded bg-background border flex items-center justify-center text-primary">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{doc.name}</p>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span className="uppercase">{doc.type.replace('proof_', '')}</span>
                                                    <span>•</span>
                                                    <Badge variant={doc.status === 'VERIFIED' ? 'default' : 'secondary'} className="text-[10px] h-4 px-1">
                                                        {doc.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Status & Notes */}
                <div className="space-y-6">
                    {/* Status Card (Simulated Timeline) */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-base">Application Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative border-l border-muted ml-2 space-y-6 pl-6 pb-2">
                                <TimelineItem
                                    title="Application Submitted"
                                    date={loan.submittedAt}
                                    active={true}
                                    icon={CheckCircle}
                                />
                                <TimelineItem
                                    title="Under Review"
                                    date={loan.status === 'UNDER_REVIEW' || loan.status === 'APPROVED' ? loan.updatedAt : undefined}
                                    active={['UNDER_REVIEW', 'APPROVED', 'VERIFIED'].includes(loan.status)}
                                    current={loan.status === 'UNDER_REVIEW'}
                                />
                                <TimelineItem
                                    title="Final Decision"
                                    date={loan.status === 'APPROVED' || loan.status === 'REJECTED' ? loan.updatedAt : undefined}
                                    active={['APPROVED', 'REJECTED'].includes(loan.status)}
                                    color={loan.status === 'REJECTED' ? 'text-red-600' : 'text-green-600'}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Credit Score Card */}
                    <Card className="shadow-sm bg-gradient-to-br from-card to-muted/50">
                        <CardHeader>
                            <CardTitle className="text-base">Risk Assessment</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center py-4">
                                <div className="relative h-24 w-24 flex items-center justify-center">
                                    <svg className="h-full w-full -rotate-90 text-muted" viewBox="0 0 36 36">
                                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray={`${(loan.riskScore || 750) / 10}, 100`} className="text-primary transition-all duration-1000 ease-out" />
                                    </svg>
                                    <div className="absolute flex flex-col items-center">
                                        <span className="text-2xl font-bold">{loan.riskScore || 750}</span>
                                        <span className="text-[10px] uppercase text-muted-foreground">Credit Score</span>
                                    </div>
                                </div>
                                <div className="mt-4 w-full grid grid-cols-2 gap-2 text-center text-xs">
                                    <div className="p-2 bg-background rounded border">
                                        <p className="text-muted-foreground">Debt Ratio</p>
                                        <p className="font-semibold">24%</p>
                                    </div>
                                    <div className="p-2 bg-background rounded border">
                                        <p className="text-muted-foreground">Payment History</p>
                                        <p className="font-semibold text-green-600">100%</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {(loan.status === 'APPROVED') && (
                        <Card className="bg-green-50 border-green-100 dark:bg-green-900/10 dark:border-green-900/30">
                            <CardContent className="pt-6">
                                <p className="mb-4 text-green-700 dark:text-green-400 font-medium text-center">Approved & Sanctioned</p>
                                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => navigate(`/applications/${loan.id}/offer`)}>
                                    View Digital Offer
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

function DetailItem({ label, value }: { label: string, value?: string | number }) {
    return (
        <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className="text-sm font-medium mt-0.5">{value || 'N/A'}</p>
        </div>
    );
}

function TimelineItem({ title, date, active, current, color, icon: Icon }: any) {
    return (
        <div className="relative">
            <span className={cn(
                "absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full border text-xs bg-background transition-colors font-medium",
                active ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30 text-muted-foreground"
            )}>
                {Icon ? <Icon className="h-3 w-3" /> : (active ? <CheckCircle className="h-3 w-3 " /> : <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />)}
            </span>
            <div className={cn("flex flex-col", color)}>
                <p className={cn("text-sm font-medium", active ? "text-foreground" : "text-muted-foreground")}>{title}</p>
                {date && <p className="text-xs text-muted-foreground">{new Date(date).toLocaleDateString()}</p>}
                {current && <Badge className="w-fit mt-1 text-[10px] h-5" variant="secondary">Current Stage</Badge>}
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        APPROVED: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50",
        REJECTED: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/50",
        PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900/50",
        SUBMITTED: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900/50",
        UNDER_REVIEW: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-900/50",
    };
    return (
        <Badge variant="outline" className={cn("font-medium border shadow-sm", styles[status] || "")}>
            {status.replace('_', ' ')}
        </Badge>
    );
}
