import { useState } from "react";
import type { LoginRequestBody } from "@/types";
import { Button } from "@/components/ui/button";
import {
    CardDescription,
    CardFooter,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Panel from "@/components/app/Panel";

type LoginPageProps = {
    onLogin: (loginData: LoginRequestBody) => Promise<void>;
};

export default function LoginPage({ onLogin }: LoginPageProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErrorMessage(null);
        setIsSubmitting(true);

        try {
            console.log({ email, password });

            await onLogin({ email, password });
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "Login failed",
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center gap-4">
            <Panel title="Protein Tracker" className="max-w-md p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_12px_30px_rgba(0,0,0,0.10)]">
                <form
                    className="space-y-6"
                    onSubmit={handleSubmit}
                    id="login-form"
                >
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <CardTitle>Login to your account</CardTitle>
                            <CardDescription>
                                Enter your email below to login to your account
                            </CardDescription>
                        </div>
                        {/* <CardAction>
          <Button variant="link">Sign Up</Button>
          </CardAction> */}
                        {/* </CardHeader>
                    <CardContent> */}
                        <div className="flex flex-col gap-6">
                            <div className="grid space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                />
                            </div>
                            <div className="grid space-y-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {/* <a
                                            href="#"
                                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                            >
                                            Forgot your password?
                                            </a> */}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                />
                            </div>
                        </div>
                            {errorMessage && <p>{errorMessage}</p>}
                            <Button
                                form="login-form"
                                type="submit"
                                className="w-full rounded-md"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Logging in..." : "Log in"}
                            </Button>
                    </div>
                </form>
            </Panel>
        </main>
    );
}
