function TargetCard({ title, current, target, unit, type }) {
    function formatNumber(number) {
        const roundedNumber = Math.round(number * 10) / 10;
        if (Number.isInteger(roundedNumber)) {
            return roundedNumber;
        }
        return roundedNumber.toFixed(1);
    }
    const remaining = formatNumber(target - current);
    let statusText = `${remaining} ${unit} remaining`;
    if (remaining < 0) {
        statusText = `${Math.abs(remaining)} ${unit} over ${type}`;
    }
    if (
        (remaining > 0 && type === "limit") ||
        (remaining <= 0 && type === "goal")
    )
        return (
            <section>
                <h3 className="target-success">{title}</h3>
                <p>
                    {current} / {target} {unit}
                </p>
                <p className="target-success">{statusText}</p>
            </section>
        );

    return (
        <section>
            <h3 className="target-warning">{title}</h3>
            <p>
                {current} / {target} {unit}
            </p>
            <p className="target-warning">{statusText}</p>
        </section>
    );
}

export default TargetCard;
