import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { useState } from 'react';
import { NotificationPanel } from '@/components/NotificationPanel';

export function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (!isAuthenticated) return null;

    if (!isAuthenticated) return null;

    return (
        <header className="sticky top-0 z-30 w-full border-b bg-background/50 backdrop-blur-md">
            <div className="flex h-16 items-center justify-between px-6">
                {/* Header Content - Now primarily for Actions, Title or Mobile Toggle */}
                <div className="flex items-center gap-4">
                    {/* Mobile logo or toggle could go here if needed, but for now we keep it clean */}
                    <span className="md:hidden font-bold text-lg text-primary">ApexCredit</span>
                </div>

                {/* Right Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <NotificationPanel />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                <Avatar className="h-9 w-9 border border-input">
                                    <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                                    <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user?.email}
                                    </p>
                                    <p className="text-xs font-semibold text-primary mt-1">
                                        {user?.role}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate('/profile')}>
                                <UserIcon className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu Content */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t p-4 space-y-4 bg-background">
                    <div className="flex flex-col gap-2">
                        <Link to="/" className="text-sm font-medium p-2 hover:bg-muted rounded" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                        <Link to="/dashboard" className="text-sm font-medium p-2 hover:bg-muted rounded" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                        <Link to="/applications" className="text-sm font-medium p-2 hover:bg-muted rounded" onClick={() => setIsMobileMenuOpen(false)}>Applications</Link>
                    </div>
                    <div className="border-t pt-4">
                        <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium">{user?.name}</p>
                                <p className="text-xs text-muted-foreground">{user?.role}</p>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full justify-start text-destructive" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Log out
                        </Button>
                    </div>
                </div>
            )}
        </header>
    );
}
