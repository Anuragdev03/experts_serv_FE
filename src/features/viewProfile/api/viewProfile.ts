import http from "../../../api/Client";

export async function getProfileDetails(url: string) {
    try {
        const res = await http.get(`/expert/view-profile?url=${url}`);
        return res.data;
    } catch (err: any) {
        return err?.response?.data?.message
    }
}