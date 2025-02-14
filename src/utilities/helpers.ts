import { notifications } from '@mantine/notifications';
import DOMPurify from "dompurify";

type Type = "ERROR" | "SUCCESS" | "INFO";

export function notify(type: Type, text: string, title?: string) {
    let color = "";

    switch (type) {
        case "SUCCESS":
            color = "teal";
            break;
        case "ERROR":
            color = "red";
            break;
        case "INFO":
            color = "blue";
            break;
    }
    notifications.show({
        message: text,
        title: title,
        autoClose: 4000,
        position: "top-right",
        color: color
    })
}

export const getLocation = (): Promise<{ lat: number; lon: number } | string> => {
    // https://www.google.com/maps/place/latitude,longitude
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                (err) => {
                    reject(err.message);
                }
            );
        } else {
            reject("Geolocation is not supported by your browser.");
        }
    });
};

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3; // Radius of the Earth in meters
    const toRadians = (degrees: number) => degrees * (Math.PI / 180);

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;

    return distance;
}

export function purifyHtml(html: string) {
    try {
        const cleanHtml = DOMPurify.sanitize(html);
        return cleanHtml;
    } catch (err) {
        return html;
    }
}

export const isValidWebsite = (url: string) => {
    const urlRegex = /^(https?:\/\/)[\w-]+(\.[\w-]+)+([\w-./?%&=]*)?$/i;
    return urlRegex.test(url);
};

export async function copyToClipboard(text: string): Promise<void> {
    try {
        await navigator.clipboard.writeText(text);
        console.log("Text copied to clipboard!");
    } catch (err) {
        console.error("Failed to copy:", err);
    }
}
