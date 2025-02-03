import http from "../../../api/Client";


export async function getJobsApi() {
    try {
        const res = await http.get("/jobs-list");
        return res?.data;
    } catch(err) {
        return err
    }
}