import { formatNumber } from "./numberUtils";

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
    const percentage = current/target * 100
    const barPercentage = Math.min(percentage,100)
    const displayPercentage = Math.round(percentage)

    return (
        <section className="card">
            <div className="card-main">
                <p className={"card-label",targetCardClass}>{title}</p>
                <p className="card-value">
                    {current} / {target} {unit}
                </p>
            </div>
            <div className="card-side">
                <div className="progress-row">
                    <div className="progress-track">
                        <div
                        className="progress-fill"
                        style={{ width: `${barPercentage}%` }}
                        />
                    </div>
                    <span className="progress-percent">
                        {displayPercentage}%
                    </span>
                </div>
                <p className={"card-status",targetCardClass}>{statusText}</p>
            </div>
        </section>
    );
}

export default TargetCard;
