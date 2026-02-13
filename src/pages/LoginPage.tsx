import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Role } from '@/types';
import { Label } from '@/components/ui/label';
import { Building2, Quote, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState<Role>('APPLICANT');

    const handleLogin = async () => {
        setLoading(true);
        try {
            await login(role);
            navigate('/dashboard');
        } catch (error) {
            console.error("Login failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
            {/* Left Side - Branding & Testimonial */}
            <div className="hidden bg-primary lg:flex flex-col justify-between p-10 text-primary-foreground relative overflow-hidden">
                <div className="relative z-10 flex items-center gap-2 text-lg font-medium">
                    <Building2 className="h-6 w-6" />
                    ApexCredit
                </div>
                <div className="relative z-10 space-y-6 max-w-lg">
                    <blockquote className="space-y-2">
                        <div className="flex gap-1 text-primary-foreground/50">
                            <Quote className="h-8 w-8 rotate-180" />
                        </div>
                        <p className="text-2xl font-medium leading-relaxed">
                            "ApexCredit successfully streamlined our entire loan processing workflow. The speed and transparency are unmatched in the industry."
                        </p>
                        <footer className="text-sm text-primary-foreground/80 pt-4">
                            — Sofia Davis, Financial Director
                        </footer>
                    </blockquote>
                </div>
                <div className="relative z-10 text-sm opacity-50">
                    &copy; 2024 ApexCredit Inc. All rights reserved.
                </div>

                {/* Decorative Background Pattern */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2629&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex items-center justify-center py-12 px-6 lg:px-8 bg-muted/20">
                <div className="mx-auto grid w-full max-w-[400px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
                        <p className="text-muted-foreground">
                            Enter your credentials to access your account
                        </p>
                    </div>

                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="role">Select your Role</Label>
                            <Select onValueChange={(val) => setRole(val as Role)} defaultValue={role}>
                                <SelectTrigger id="role" className="h-11">
                                    <SelectValue placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="APPLICANT">Applicant (Borrower)</SelectItem>
                                    <SelectItem value="OFFICER">Loan Officer</SelectItem>
                                    <SelectItem value="UNDERWRITER">Underwriter</SelectItem>
                                    <SelectItem value="MANAGER">Manager</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start gap-3 border border-blue-100 dark:border-blue-900/50">
                            <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                            <div className="text-sm text-blue-800 dark:text-blue-300">
                                <p className="font-semibold mb-1">Demo Mode Enabled</p>
                                <p>No password required. Authentication is simulated based on the selected role.</p>
                            </div>
                        </div>

                        <Button onClick={handleLogin} disabled={loading} className="w-full h-11 text-base" size="lg">
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </div>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        By clicking continue, you agree to our{" "}
                        <a href="#" className="underline underline-offset-4 hover:text-primary">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="underline underline-offset-4 hover:text-primary">
                            Privacy Policy
                        </a>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}
