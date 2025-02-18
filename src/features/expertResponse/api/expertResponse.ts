import { DateValue } from "@mantine/dates";
import http from "../../../api/Client";

interface Data {
    tracking_link: string;
    status: string;
    available_date: DateValue,
    message: string
}

export async function addResponse(data: Data) {
    try {
        const res = await http.post("/expert-response/create", data, { withCredentials: true })
        return res.data;
    } catch (err: any) {
        return err?.response?.data?.message
    }
}

export async function responseIsExists(url: string) {
    try {
        const res = await http.get(`/expert-response/view?url=${url}`);
        return res.data
    } catch (err: any) {
        return err?.response?.data?.message
    }
}

export async function updateResponse(data: Partial<Data>) {
    try {
        const res = await http.patch("/expert-response/update", data, { withCredentials: true });
        return res.data
    } catch (err: any) {
        return err?.response?.data?.message
    }
}