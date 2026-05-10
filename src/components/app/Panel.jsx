import { cn } from "@/lib/utils";

function Panel({ title, children, className }) {
    return (
        <section
            className={cn(
                "border w-full rounded-xl bg-card text-card-foreground p-6 flex flex-col gap-6",
                className,
            )}
        >
            {title && (
                <h2 className="text-2xl font-semibold tracking-tight text-center">
                    {title}
                </h2>
            )}
            {children}
        </section>
    );
}
export default Panel;
