import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    FileText,
    PlusCircle,
    User,
    LogOut,
    ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function Sidebar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    const links = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['APPLICANT', 'OFFICER', 'MANAGER', 'UNDERWRITER'] },
        { href: '/applications', label: 'Applications', icon: FileText, roles: ['APPLICANT', 'OFFICER', 'MANAGER', 'UNDERWRITER'] },
        { href: '/applications/new', label: 'New Application', icon: PlusCircle, roles: ['APPLICANT'] },
        { href: '/profile', label: 'Profile', icon: User, roles: ['APPLICANT', 'OFFICER', 'MANAGER', 'UNDERWRITER'] },
    ];

    const filteredLinks = links.filter(link => user && link.roles.includes(user.role));

    return (
        <aside
            className={cn(
                "sticky top-0 h-screen border-r bg-card transition-all duration-300 flex flex-col z-40",
                collapsed ? "w-16" : "w-64"
            )}
        >
            <div className="h-16 flex items-center justify-between px-4 border-b">
                {!collapsed && (
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                            A
                        </div>
                        <span>ApexCredit</span>
                    </Link>
                )}
                {collapsed && (
                    <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground mx-auto">
                        A
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("hidden md:flex", collapsed && "hidden")}
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex-1 py-4 flex flex-col gap-2 overflow-y-auto">
                <nav className="grid gap-1 px-2">
                    {filteredLinks.map((link, index) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.href;
                        return (
                            <NavLink
                                key={index}
                                to={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                                    isActive ? "bg-primary/10 text-primary hover:bg-primary/15" : "text-muted-foreground",
                                    collapsed && "justify-center px-2"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {!collapsed && <span>{link.label}</span>}
                            </NavLink>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t">
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10",
                        collapsed && "justify-center px-0"
                    )}
                    onClick={() => logout()}
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    {!collapsed && "Log out"}
                </Button>
            </div>
            <div className="absolute -right-3 top-20 md:hidden">
                {/* Mobile toggle logic usually managed by parent layout or separate mobile nav */}
            </div>
        </aside>
    );
}
