import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    CardAction,
} from "@/components/ui/card";

function EntryCard({
    entry,
    calorieLimit,
    proteinTarget,
    handleDeleteEntryClick,
    index,
}) {
    const { weight, calories, protein, name } = entry;
    const percentOfCalorieLimit = (entry.calories / calorieLimit) * 100 || 0;
    const percentOfProteinTarget = (entry.protein / proteinTarget) * 100 || 0;
    return (
        <Card className="w-full shrink-0 max-w-md rounded-xl outline shadow-lg">
            <CardHeader>
                <CardTitle>
                    <div className="flex gap-3">
                        <p>{name}</p>
                        <p>{weight}g</p>
                    </div>
                </CardTitle>
                <CardAction>
                    <button
                        className="delete-entry-button"
                        onClick={() => {
                            handleDeleteEntryClick(index);
                        }}
                    >
                        x
                    </button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <p>
                    Energy: {calories.toFixed(0)}kcal (
                    {percentOfCalorieLimit.toFixed(1)}%)
                </p>
                <p>
                    Protein: {protein.toFixed(1)}g (
                    {percentOfProteinTarget.toFixed(1)}%)
                </p>
            </CardContent>
        </Card>
    );
}
export default EntryCard;
