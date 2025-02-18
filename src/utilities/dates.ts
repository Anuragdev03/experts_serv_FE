
import dayjs from "dayjs";

// Load the necessary plugin for AM/PM formatting
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export function formatDate(val: string) {
    try {
        const date = dayjs(val);
        const formattedDate = date.format("YYYY-MMM-DD h:mm a");
        return formattedDate;
    } catch (err) {
        return val
    }
}