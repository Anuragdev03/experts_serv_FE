import http from "../../../api/Client";

export async function getPersonalDetail() {
    try {
        const res = await http.get("/expert-detail", {withCredentials: true});
        return res.data.data
    } catch(err:any) {
        if(err?.response?.data?.message === "Token has expired") {
            return err?.response?.data?.message
        }
    }
}