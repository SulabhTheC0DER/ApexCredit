import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Profile</h1>
            <Card>
                <CardHeader>
                    <CardTitle>User Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={user.avatarUrl} />
                            <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-xl font-bold">{user.name}</h2>
                            <p className="text-muted-foreground">{user.email}</p>
                            <div className="mt-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
                                {user.role}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button variant="destructive" onClick={logout}>Log Out</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
