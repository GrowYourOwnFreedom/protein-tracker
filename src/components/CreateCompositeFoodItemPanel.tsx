import FoodItemCategorySelectField from "@/components/app/FoodItemCategorySelectField";
import FoodItemNameField from "@/components/app/FoodItemNameField";
import Panel from "@/components/app/Panel";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { defaultFoodItemCategories } from "@/data/defaultFoodItemCategories";
import { useState } from "react";
type CreateCompositeFoodItemPanelProps = {
    className?: string;
};

export default function CreateCompositeFoodItemPanel({
    className,
}: CreateCompositeFoodItemPanelProps) {
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categoryError, setCategoryError] = useState("");

    function handleNameValueChange(
        event: React.ChangeEvent<HTMLInputElement>,
    ): void {
        setName(event.target.value);
        setNameError("");
    }
    function handleCategoryValueChange(value: string): void {
        setCategoryId(value);
        setCategoryError("");
    }

    function handleSubmit(event) {
        event.preventDefault();
        console.log({ name, categoryId });
    }
    return (
        //  Add New Component

        // selectCompositeFoodItem
        // selectFoodItemToAdd
        // enter amount
        // create new component

        // Add New Composite Item Popover
        <Panel title="Create Food Item" className={className}>
            <form onSubmit={handleSubmit}>
                <FieldGroup>
                    <FoodItemNameField
                        name={name}
                        nameError={nameError}
                        onValueChange={handleNameValueChange}
                    />
                    <FoodItemCategorySelectField
                        value={categoryId}
                        onValueChange={handleCategoryValueChange}
                        categoryError={categoryError}
                        categories={defaultFoodItemCategories}
                    />
                </FieldGroup>
                <Button className="rounded-full" type="submit">
                    {" "}
                    Create Food Item
                </Button>
            </form>
        </Panel>
        // select category
        // create new composite item
    );
}
