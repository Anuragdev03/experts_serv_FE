import http from "../../../api/Client";

interface AddEventPayload {
    title: string;
    start_date: string | Date;
    end_date: string | Date;
    all_day?: boolean;
    link?: string;
    description?: string;
}

interface UpdateEventType {
    title?: string;
    start_date?: string | Date;
    end_date?: string | Date;
    all_day?: boolean;
    link?: string;
    description?: string;
    id: string | number
}

export async function getEventList(start: string | Date, end: string | Date) {
    try {
        const res = await http.get(`/events/list?start=${start}&end=${end}`, {withCredentials: true});
        return res.data;
    } catch(err:any) {
        return err.response.data.message
    }
}

export async function addEventReq(payload: AddEventPayload) {
    try {
        const res = await http.post("/events/create", payload, {withCredentials: true});
        return res.data;
    } catch(err:any) {
        return err.response?.data?.message
    }
}

export async function deleteEvent(id: string) {
    try {
        const res = await http.delete(`/events/delete/${id}`, {withCredentials: true});
        return res.data;
    } catch(err:any) {
        return err.response?.data?.message
    }
}

export async function updateEvent(payload: UpdateEventType) {
    try {
        const res = await http.patch("events/update", payload, {withCredentials: true});
        return res.data;
    } catch(err: any) {
        return err?.response?.data?.message;
    }
}