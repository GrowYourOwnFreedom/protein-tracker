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
    const limitSuccess = remaining > 0 && type === "limit";
    const goalSuccess = remaining <= 0 && type === "goal";
    const targetCardClass =
        limitSuccess || goalSuccess ? "target-success" : "target-warning";
    const percentage = (current / target) * 100;
    const barPercentage = Math.min(percentage, 100);
    const displayPercentage = Math.round(percentage);

    return (
        // <section className={`card ${targetCardClass}`}>
        //     <div className="card-header">
        //         <p className={"card-label"}>{title}</p>
        //         <p className="card-value">
        //             {current}
        //             {unit}
        //         </p>
        //     </div>
        //     <p className={"card-detail"}>
        //         {current} / {target} {unit}
        //     </p>

        //     <div className="progress-row">
        //         <div className="progress-track">
        //             <div
        //                 className="progress-fill"
        //                 style={{ width: `${barPercentage}%` }}
        //             />
        //         </div>
        //         <span className="progress-percent">{displayPercentage}%</span>
        //     </div>
        //     <p className={"card-status"}>{statusText}</p>
        // </section>
        <Card>
            <CardHeader>
                <CardTitle>
                    {" "}
                    <p>{title}</p>
                    <p>
                        {current}
                        {unit}
                    </p>
                </CardTitle>
                <CardDescription>Card Description</CardDescription>
                <CardAction>Card Action</CardAction>
            </CardHeader>
            <CardContent>
                <p>
                    {current} / {target} {unit}
                </p>
                <div className="progress-row">
                    <div className="progress-track">
                        <div
                            className="progress-fill"
                            style={{ width: `${barPercentage}%` }}
                        />
                    </div>
                    <span>{displayPercentage}%</span>
                </div>
            </CardContent>
            <CardFooter>
                <p>{statusText}</p>
            </CardFooter>
        </Card>
    );
}

export default TargetCard;
