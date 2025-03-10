import http from "../../../api/Client";



export async function getNotificationList(page: number) {
    try {
        const res = await http.get(`/notification/list?page=${page}`, {withCredentials: true});
        return res.data;
    } catch(err:any) {
        return err?.response?.data?.message;
    }
}

export async function markAsRead(id: string) {
    try {
        const data = {id, type: "mark_as_read"}
        const res = await http.patch("/notification/update", data, {withCredentials: true});
        return res.data;
    } catch(err:any) {
        return err?.response?.data?.message;
    }
}

export async function markAllAsRead() {
    try {
        const data = { type: "mark_all_as_read"};
        const res = await http.patch("/notification/update", data, {withCredentials: true});
        return res.data;
    } catch(err:any) {
        return err?.response?.data?.message;
    }
}