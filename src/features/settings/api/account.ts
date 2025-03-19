import http from "../../../api/Client"


export async function deleteAccount(password: string) {
    try {
        const res = await http.post("/expert/delete-account", {password}, {withCredentials: true});
        return res?.data;
    } catch(err:any) {
        return err?.response?.data?.message
    }
}