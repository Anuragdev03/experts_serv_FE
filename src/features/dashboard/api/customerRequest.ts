import http from "../../../api/Client";


export async function getCount() {
    try {
        const res = await http.get("/customer-request/count", {withCredentials: true});
        return res.data;
    } catch(err: any) {
        return err?.response?.data?.message
    }
}

export async function getTasksCount() {
    try {
        const res = await http.get("/tasks/count", {withCredentials: true});
        return res.data;
    } catch(err:any) {
        return err?.response?.data?.message
    }
}

export async function getTasksList(due_date: string | Date) {
    try {
        const res = await http.get(`/tasks/list?due_date=${due_date}`, {withCredentials: true});
        return res.data;
    } catch(err:any) {
        return err?.response?.data?.message
    }
}