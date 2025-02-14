import http from "../../../api/Client";

interface Data {
    user_name: string;
    customer_email: string;
    customer_phone: string;
    customer_name: string;
    message: string;
}

export async function sendCustomerRequest(data:Data) {
    try {
        const res = await http.post("/customer-request", data);
        return res.data;
    } catch(err:any) {
        return err?.response?.data?.message
    }
}