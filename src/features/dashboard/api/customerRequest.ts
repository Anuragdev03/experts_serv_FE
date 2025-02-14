import http from "../../../api/Client";


export async function getCount() {
    try {
        const res = await http.get("/customer-request/count", {withCredentials: true});
        return res.data;
    } catch(err: any) {
        return err?.response?.data?.message
    }
}