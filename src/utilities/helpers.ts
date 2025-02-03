import { notifications } from '@mantine/notifications';

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