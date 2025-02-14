import http from "./Client";

export async function getAccessToken() {
    try {
        const res = await http.get("/refresh-token", {withCredentials: true});
        let token = res?.data?.token;
        if(token) {
            sessionStorage.setItem("token", token);
        }
        return true
    } catch(err) {
        console.log(err)
        return false
    }
}