import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { notificationService } from '@/services/notificationService';
import type { Notification } from '@/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Check, Info, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NotificationPanel() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchNotifs = async () => {
            if (!user) return;
            const data = await notificationService.getNotifications(user.id);
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length);
        };

        if (isOpen) {
            fetchNotifs();
        } else {
            // Initial fetch
            fetchNotifs();
        }
    }, [user, isOpen]);

    const handleMarkAsRead = async (id: string) => {
        await notificationService.markAsRead(id);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    if (!user) return null;

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive animate-pulse" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b">
                    <h4 className="font-semibold leading-none">Notifications</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                        You have {unreadCount} unread messages.
                    </p>
                </div>
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No notifications.
                        </div>
                    ) : (
                        <div className="grid">
                            {notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className={cn(
                                        "flex items-start gap-4 p-4 border-b last:border-0 hover:bg-muted/50 transition-colors",
                                        !notif.read && "bg-muted/20"
                                    )}
                                >
                                    <div className="mt-1">
                                        {notif.type === 'SUCCESS' && <Check className="h-4 w-4 text-green-500" />}
                                        {notif.type === 'INFO' && <Info className="h-4 w-4 text-blue-500" />}
                                        {notif.type === 'WARNING' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                                        {notif.type === 'ERROR' && <XCircle className="h-4 w-4 text-destructive" />}
                                    </div>
                                    <div className="grid gap-1 flex-1">
                                        <p className="text-sm font-medium leading-none">{notif.title}</p>
                                        <p className="text-xs text-muted-foreground">{notif.message}</p>
                                        <p className="text-[10px] text-muted-foreground mt-1">
                                            {new Date(notif.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {!notif.read && (
                                        <button
                                            onClick={() => handleMarkAsRead(notif.id)}
                                            className="h-2 w-2 rounded-full bg-primary mt-2"
                                            title="Mark as read"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
