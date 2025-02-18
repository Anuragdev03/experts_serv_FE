import http from "../../../api/Client";

export async function getResponse(url: string) {
    try {
        if(!url) return null;
        const res = await http.get(`/expert-response/view?url=${url}`);
        return res?.data
    } catch(err:any) {
        return err?.response?.data?.message
    }
}