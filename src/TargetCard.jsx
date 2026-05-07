import { Progress } from "./components/ui/progress";
import { formatNumber } from "./numberUtils";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    CardAction,
} from "@/components/ui/card";

function TargetCard({ title, current, target, unit, type }) {
    const remaining = formatNumber(target - current);
    let statusText = `${remaining} ${unit} remaining`;
    if (remaining < 0) {
        statusText = `${Math.abs(remaining)} ${unit} over ${type}`;
    }
    const percentage = (current / target) * 100;
    const barPercentage = Math.min(percentage, 100);
    const displayPercentage = Math.round(percentage);

    return (
        <Card className="w-full max-w-md rounded-lg gap-6">
            <CardHeader>
                <div className="flex items-center">
                    <CardTitle>
                        {" "}
                        <p>{title} consumed:</p>
                    </CardTitle>
                    <p className="ml-auto inline-block text-xl">
                        {current}
                        {unit}
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
                       
                    <Progress value={barPercentage}/>
                    <span>{displayPercentage}%</span>
                    </div>
                </div>
                <div className="flex pt-3">
                    <p className="ml-auto mr-auto text-muted-foreground">
                        {statusText}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export default TargetCard;
