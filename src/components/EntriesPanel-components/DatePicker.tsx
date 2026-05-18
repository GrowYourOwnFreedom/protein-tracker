import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useState } from "react";

function makeDateObject(selectedDate: string): Date {
        const [year, month, day] = selectedDate.split("-").map(Number);
        const dateObject = new Date(year, month - 1, day);
        return dateObject;
    }

export default function DatePicker({selectedDate, onSelectedDateChange}) {
        const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);


    function handleDateSelect(dateObject: Date | undefined): void {
            if (!dateObject) return;
            const date = format(dateObject, "yyyy-MM-dd");
            onSelectedDateChange(date);
            setDatePickerOpen(false);
        }

    return(
        <Field className="mx-auto w-44">
                <div className="flex flex-col items-center gap-2">
                    <FieldLabel htmlFor="date-picker">
                        <p>Select Date To Display:</p>
                    </FieldLabel>
                    <Popover
                        open={datePickerOpen}
                        onOpenChange={setDatePickerOpen}
                    >
                        <PopoverTrigger asChild>
                            <Button
                                id="date-picker"
                                className="rounded-full px-6"
                            >
                                {format(makeDateObject(selectedDate), "PPP")}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-0">
                            <Calendar
                                selected={makeDateObject(selectedDate)}
                                onSelect={handleDateSelect}
                                mode="single"
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </Field>
    )
}