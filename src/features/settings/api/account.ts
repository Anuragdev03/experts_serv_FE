import http from "../../../api/Client"

export async function deleteAccount(password: string) {
    try {
        const res = await http.post("/expert/delete-account", {password}, {withCredentials: true});
        return res?.data;
    } catch(err:any) {
        return err?.response?.data?.message
    }
}

export async function updateExpertPassword(current_password: string, new_password: string) {
    try {
        const payload = {
            current_password,
            new_password
        }
        const res = await http.patch("/expert/change-password", payload, {withCredentials: true});
        return res?.data;
    } catch(err:any) {
        return err?.response?.data?.message
    }
}