
import dayjs from "dayjs";

// Load the necessary plugin for AM/PM formatting
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export function formatDate(val: string | Date) {
    try {
        const date = dayjs(val);
        const formattedDate = date.format("YYYY-MMM-DD h:mm a");
        return formattedDate;
    } catch (err) {
        return val
    }
}

export function formatTime(val: string | Date) {
    try {
        const date = dayjs(val);
        const formattedDate = date.format("h:mm a");
        return formattedDate;
    } catch (err) {
        return val
    }
}

export function eventDate(val: string | Date) {
    try {
        const date = dayjs(val);
        const formattedDate = date.format("YYYY-MM-DD");
        return formattedDate;
    } catch(err) {
        return val
    }
}

export function monthAndYear(val: string | Date) {
    try {
        const date = dayjs(val);
        const formattedDate = date.format("YYYY-MM");
        return formattedDate;
    } catch(err) {
        return val
    }
}