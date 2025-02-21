import http from "../../../api/Client";


export async function getEventList(start: string | Date, end: string | Date) {
    try {
        const res = await http.get(`/events/list?start=${start}&end=${end}`, {withCredentials: true});
        return res.data;
    } catch(err:any) {
        return err.response.data.message
    }
}