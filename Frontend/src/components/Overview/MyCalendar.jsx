import { Calendar } from "@/components/ui/calendar"

import React from 'react';

const MyCalendar = () => {
    const [date, setDate] = React.useState(new Date());
    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col items-center justify-center min-w-[180px] max-w-xs">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="w-full text-lg font-sans"
                classNames={{
                  months: "flex flex-col gap-2 w-full",
                  month: "flex flex-col gap-4 w-full",
                  caption: "flex justify-center pt-1 relative items-center w-full text-2xl font-bold text-gray-800 mb-2",
                  head_row: "flex text-lg",
                  head_cell: "text-gray-500  rounded-md w-8 h-8 font-semibold text-base",
                  row: "flex w-full mt-2 gap-0.25",
                  cell: "relative p-0 text-center text-base focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-blue-100 [&:has([aria-selected].day-range-end)]:rounded-r-md",
                  day: "w-8 h-8 rounded-lg font-semibold text-base flex items-center justify-center transition-all duration-100 hover:bg-blue-200 aria-selected:bg-blue-500 aria-selected:text-white",
                  day_today: "border-2 border-blue-500 bg-blue-400 text-gray-50 font-bold !shadow-lg",
                  nav_button: "bg-black text-white rounded-full w-8 h-8 flex items-center justify-center p-0 hover:bg-gray-800 focus:bg-gray-900",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                }}
            />
        </div>
    );
}

export default MyCalendar;
