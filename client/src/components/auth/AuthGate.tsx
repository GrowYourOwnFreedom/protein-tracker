import { useEffect, useState } from "react";
import { getMe, login, logout } from "@/api/authApi";
import type { AuthUser, LoginRequestBody } from "@/types";
import  LoginPage  from "@/components/auth/LoginPage";
import TrackerApp  from "@/components/app/TrackerApp";

type AuthStatus = "checking" | "logged-out" | "logged-in";

export function AuthGate() {
    const [authStatus, setAuthStatus] = useState<AuthStatus>("checking");
    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        async function checkLoggedInUser() {
            try {
                const user = await getMe();

                setUser(user);
                setAuthStatus("logged-in");
            } catch {
                setUser(null);
                setAuthStatus("logged-out");
            }
        }

        checkLoggedInUser();
    }, []);

    async function handleLogin(loginData: LoginRequestBody) {
        const user = await login(loginData);

        setUser(user);
        setAuthStatus("logged-in");
    }

    async function handleLogout() {
        await logout();

        setUser(null);
        setAuthStatus("logged-out");
    }

    if (authStatus === "checking") {
        return <p>Checking login...</p>;
    }

    if (authStatus === "logged-out") {
        return <LoginPage onLogin={handleLogin} />;
    }

    return <TrackerApp user={user} onLogout={handleLogout} />;
}