import http from "../../../api/Client";

export async function logoutFromDevice() {
    try {
        const res = await http.get("/logout", { withCredentials: true });

        return res.data;
    } catch (err) {
        return null
    }
}