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

    return (
        <section className="target-card">
            <h3 className={targetCardClass}>{title}</h3>
            <p>
                {current} / {target} {unit}
            </p>
            <p className={targetCardClass}>{statusText}</p>
        </section>
    );
}

export default TargetCard;
