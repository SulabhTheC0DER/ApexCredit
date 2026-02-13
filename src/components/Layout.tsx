import { Outlet } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Toaster } from '@/components/ui/toaster';

export function Layout() {
    return (
        <div className="flex min-h-screen bg-muted/20 font-sans antialiased">
            <div className="hidden md:block">
                <Sidebar />
            </div>
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                <Navbar />
                <main className="flex-1 p-6 md:p-8 overflow-auto">
                    <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>
            <Toaster />
        </div>
    );
}
