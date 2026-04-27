function TargetCard({ title, current, target, unit }) {
    const remaining = target - current
    return (
        <section>
            <h3>{title}</h3>
            <p>{current} / {target} {unit}</p>
            <p>{remaining} {unit} remaining</p>
        </section>
    )
}

export default TargetCard
