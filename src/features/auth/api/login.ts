import http from "../../../api/Client";

interface Data {
    email: string;
    password: string;
}
export async function loginToAccount(data: Data) {
    try {
        const res = await http.post("/login", data);

        return res.data;
    } catch(err) {
        return err;
    }
}