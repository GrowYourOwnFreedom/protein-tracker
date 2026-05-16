import { Progress } from "@/components/ui/progress";
import { formatNumber } from "@/lib/formatNumber";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    CardAction,
} from "@/components/ui/card";
import { TargetCardProps } from "@/types";

function TargetCard({ title, current, target, unit, type }: TargetCardProps) {
    const remaining = target - current;
    const formattedRemaining = Number(formatNumber(remaining));
    let statusText = `${remaining} ${unit} remaining`;
    if (remaining < 0) {
        statusText = `${Math.abs(formattedRemaining)} ${unit} over ${type}`;
    }
    const percentage = (current / target) * 100;
    const barPercentage = Math.min(percentage, 100);
    const displayPercentage = Math.round(percentage);

    function getTargetStatus(target: number, currTotal: number): string {
        if (currTotal < target * 0.8) {
            return "low";
        }
        if (currTotal < target) {
            return "near";
        }
        return "reached";
    }
    const status = getTargetStatus(target, current);

    function targetSuccessStatus(type: string, status: string): string {
        if (type === "goal") {
            if (status === "low") return "fail";
            if (status === "near") return "okay";
            return "success";
        }
        if (type === "limit") {
            if (status === "reached") return "fail";
            if (status === "near") return "okay";
            return "success";
        }
    }
    const successStatus = targetSuccessStatus(type, status);

    const statusClasses = {
        fail: " bg-destructive/40",

        okay: " bg-warning/40",

        success: " bg-success/40",
    };

    return (
        <Card className="w-full bg-card ring-1 ring-foreground/10 max-w-md rounded-lg gap-6 shadow-sm shrink-0">
            <CardHeader>
                <div className="flex items-center">
                    <CardTitle>
                        {" "}
                        <p>{title} consumed:</p>
                    </CardTitle>
                    <p className="ml-auto inline-block text-xl">
                        {current} {unit}
                    </p>
                </div>
                <CardDescription>
                    {title} {type} summary
                </CardDescription>
            </CardHeader>
            <CardContent className="gap-6">
                <div className="flex items-center gap-6">
                    <p>
                        {current} / {target} {unit}
                    </p>
                    <div className="flex items-center gap-3 w-1/2 ml-auto">
                        <Progress
                            value={barPercentage}
                            indicatorClassName={statusClasses[successStatus]}
                        />
                        <span>{displayPercentage}%</span>
                    </div>
                </div>
                <div className="flex pt-3">
                    <p className="ml-auto mr-auto text-muted-foreground">
                        {status} - {statusText}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export default TargetCard;
