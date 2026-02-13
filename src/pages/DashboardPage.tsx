import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { loanService } from '@/services/loanService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { LoanApplication } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    Plus,
    FileText,
    CheckCircle2,
    Clock,
    TrendingUp,
    DollarSign,
    ArrowRight,
    Calendar
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loans, setLoans] = useState<LoanApplication[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLoans = async () => {
            if (!user) return;
            const data = user.role === 'APPLICANT'
                ? await loanService.getLoansByApplicant(user.id)
                : await loanService.getAllLoans();
            setLoans(data);
            setLoading(false);
        };

        fetchLoans();
    }, [user]);

    if (loading) {
        return <DashboardSkeleton />;
    }

    const totalLoans = loans.length;
    const approvedLoans = loans.filter(l => l.status === 'APPROVED').length;
    const pendingLoans = loans.filter(l => ['SUBMITTED', 'UNDER_REVIEW', 'VERIFIED'].includes(l.status)).length;

    // Calculate total amount requested (mock logic)
    const totalAmount = loans.reduce((acc, curr) => acc + (curr.loanDetails?.amount || 0), 0);
    const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalAmount);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Welcome back, {user?.name}. Here's what's happening today.</p>
                </div>
                {user?.role === 'APPLICANT' && (
                    <Button onClick={() => navigate('/applications/new')} className="shadow-lg shadow-primary/20 transition-all hover:scale-105">
                        <Plus className="mr-2 h-4 w-4" /> New Application
                    </Button>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Applications"
                    value={totalLoans}
                    icon={FileText}
                    trend="+12% from last month"
                    trendUp={true}
                />
                <StatCard
                    title="Approved"
                    value={approvedLoans}
                    icon={CheckCircle2}
                    className="text-green-600"
                    iconClassName="bg-green-100 text-green-600 dark:bg-green-900/20"
                />
                <StatCard
                    title="Pending Review"
                    value={pendingLoans}
                    icon={Clock}
                    className="text-orange-600"
                    iconClassName="bg-orange-100 text-orange-600 dark:bg-orange-900/20"
                />
                <StatCard
                    title="Total Requested"
                    value={formattedAmount}
                    icon={DollarSign}
                    description="Across all applications"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-7">
                {/* Recent Applications List */}
                <Card className="col-span-4 md:col-span-5 shadow-sm border-border/50">
                    <CardHeader>
                        <CardTitle>Recent Applications</CardTitle>
                        <CardDescription>
                            Review the status of your recent loan applications.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loans.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                                <FileText className="h-12 w-12 mb-4 opacity-20" />
                                <p>No applications found.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {loans.slice(0, 5).map((loan) => (
                                    <div
                                        key={loan.id}
                                        className="group flex items-center justify-between p-4 rounded-xl border border-transparent hover:bg-muted/50 hover:border-border transition-all cursor-pointer"
                                        onClick={() => navigate(`/applications/${loan.id}`)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{loan.applicantName}</p>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <span>{loan.loanDetails?.purpose}</span>
                                                    <span>•</span>
                                                    <span>${loan.loanDetails?.amount?.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <StatusBadge status={loan.status} />
                                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick Action / Mini Profile Card */}
                <Card className="col-span-3 md:col-span-2 shadow-sm border-border/50">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                        <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/applications')}>
                            <FileText className="mr-2 h-4 w-4" /> View All
                        </Button>
                        <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/profile')}>
                            <TrendingUp className="mr-2 h-4 w-4" /> Update Profile
                        </Button>
                        <div className="mt-4 pt-4 border-t">
                            <h4 className="text-sm font-medium mb-2">Upcoming EMI</h4>
                            <div className="p-3 bg-muted/50 rounded-lg flex items-center gap-3">
                                <Calendar className="h-8 w-8 text-primary" />
                                <div>
                                    <p className="text-sm font-bold">$450.00</p>
                                    <p className="text-xs text-muted-foreground">Due Oct 15, 2026</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, trend, trendUp, className, iconClassName, description }: any) {
    return (
        <Card className="overflow-hidden shadow-sm border-border/50 transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center bg-primary/10 text-primary", iconClassName)}>
                    <Icon className="h-4 w-4" />
                </div>
            </CardHeader>
            <CardContent>
                <div className={cn("text-2xl font-bold", className)}>{value}</div>
                {(trend || description) && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        {trend && (
                            <span className={cn(trendUp ? "text-green-600" : "text-red-600", "flex items-center")}>
                                {trendUp ? <TrendingUp className="h-3 w-3 mr-1" /> : null}
                                {trend}
                            </span>
                        )}
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        APPROVED: "bg-green-100 text-green-700 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-400",
        REJECTED: "bg-red-100 text-red-700 hover:bg-red-100/80 dark:bg-red-900/30 dark:text-red-400",
        PENDING: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80 dark:bg-yellow-900/30 dark:text-yellow-400",
        SUBMITTED: "bg-blue-100 text-blue-700 hover:bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-400",
        UNDER_REVIEW: "bg-orange-100 text-orange-700 hover:bg-orange-100/80 dark:bg-orange-900/30 dark:text-orange-400",
    };

    const defaultStyle = "bg-gray-100 text-gray-700 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-400";

    return (
        <Badge className={cn("font-medium", styles[status] || defaultStyle)}>
            {status.replace('_', ' ')}
        </Badge>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-32" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-40" />
            </div>
            <div className="grid gap-4 md:grid-cols-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
            </div>
            <div className="grid gap-4 md:grid-cols-7">
                <Skeleton className="col-span-5 h-[400px] rounded-xl" />
                <Skeleton className="col-span-2 h-[400px] rounded-xl" />
            </div>
        </div>
    )
}
