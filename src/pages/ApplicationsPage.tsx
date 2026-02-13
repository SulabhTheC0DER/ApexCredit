import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { loanService } from '@/services/loanService';
import type { LoanApplication } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import {
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    FileText,
    Calendar
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

export default function ApplicationsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loans, setLoans] = useState<LoanApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredLoans = loans.filter(loan =>
        loan.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.loanDetails?.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-muted-foreground">Loading applications...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
                    <p className="text-muted-foreground">Manage and view all loan applications.</p>
                </div>
                {user?.role === 'APPLICANT' && (
                    <Button onClick={() => navigate('/applications/new')}>
                        New Application
                    </Button>
                )}
            </div>

            <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search applications..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="gap-2">
                            <Filter className="h-4 w-4" />
                            Filter
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 font-medium text-sm text-muted-foreground border-b">
                            <div className="col-span-3 md:col-span-3">Applicant</div>
                            <div className="col-span-3 md:col-span-2">Amount</div>
                            <div className="col-span-3 md:col-span-2">Purpose</div>
                            <div className="col-span-3 md:col-span-2">Date</div>
                            <div className="col-span-3 md:col-span-2">Status</div>
                            <div className="col-span-1 text-right">Actions</div>
                        </div>
                        <div className="divide-y">
                            {filteredLoans.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground">
                                    No applications matching your search.
                                </div>
                            ) : (
                                filteredLoans.map((loan) => (
                                    <div key={loan.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/30 transition-colors text-sm">
                                        <div className="col-span-3 md:col-span-3 font-medium flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
                                                {loan.applicantName.charAt(0)}
                                            </div>
                                            <div className="truncate">
                                                <p>{loan.applicantName}</p>
                                                <p className="text-xs text-muted-foreground truncate opacity-70">#{loan.id.slice(-6)}</p>
                                            </div>
                                        </div>
                                        <div className="col-span-3 md:col-span-2 font-semibold">
                                            ${loan.loanDetails?.amount?.toLocaleString()}
                                        </div>
                                        <div className="col-span-3 md:col-span-2 text-muted-foreground truncate">
                                            {loan.loanDetails?.purpose}
                                        </div>
                                        <div className="col-span-3 md:col-span-2 text-muted-foreground flex items-center gap-2">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(loan.updatedAt).toLocaleDateString()}
                                        </div>
                                        <div className="col-span-3 md:col-span-2">
                                            <StatusBadge status={loan.status} />
                                        </div>
                                        <div className="col-span-1 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => navigate(`/applications/${loan.id}`)}>
                                                        <Eye className="mr-2 h-4 w-4" /> View Details
                                                    </DropdownMenuItem>
                                                    {user?.role !== 'APPLICANT' && (
                                                        <DropdownMenuItem>
                                                            <FileText className="mr-2 h-4 w-4" /> Review Docs
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        APPROVED: "bg-green-100 text-green-700 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-400 border-green-200",
        REJECTED: "bg-red-100 text-red-700 hover:bg-red-100/80 dark:bg-red-900/30 dark:text-red-400 border-red-200",
        PENDING: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200",
        SUBMITTED: "bg-blue-100 text-blue-700 hover:bg-blue-100/80 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200",
        UNDER_REVIEW: "bg-orange-100 text-orange-700 hover:bg-orange-100/80 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200",
    };

    const defaultStyle = "bg-gray-100 text-gray-700 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-400 border-gray-200";

    return (
        <Badge variant="outline" className={cn("font-medium border", styles[status] || defaultStyle)}>
            {status.replace('_', ' ')}
        </Badge>
    );
}
