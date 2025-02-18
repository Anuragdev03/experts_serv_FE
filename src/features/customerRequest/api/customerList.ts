import http from "../../../api/Client";

interface Data {
    sort: string;
    status: string;
    page: number;
}
export async function getCustomerList(data: Data) {
    try {
        let url = `/customer-request/list`;

        if(data.page) {
            url += `?page=${data.page}`
        }
        if(data.sort) {
            url += `&sort=${data.sort}`
        }
        if(data.status) {
            url += `&status=${data.status}`
        }

        const res = await http.get(url, {withCredentials: true});
        return res.data;
    } catch(err:any) {
        return err?.response?.data?.message
    }
}