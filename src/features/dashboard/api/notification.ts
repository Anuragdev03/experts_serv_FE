import http from "../../../api/Client";

export async function getNotificationCount() {
    try {
        const res = await http.get("/notification/count", {withCredentials: true});
        return res.data;
    } catch(err: any) {
        return err?.response?.data?.message
    }
}