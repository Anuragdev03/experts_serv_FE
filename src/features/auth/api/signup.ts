import http from "../../../api/Client";

interface Data {
    name: string,
    user_name: string,
    email: string,
    password: string,
    mobile_number: string,
    role: string;
}

export async function createAccount(data: Data) {
    try {
        const res = await http.post("/expert-signup", data);

        return res.data;
    } catch (err) {
        return err;
    }
}