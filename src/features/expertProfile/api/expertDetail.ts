import http from "../../../api/Client";
import { FormState } from "../PersonalProfile";

interface Data extends FormState {
    job_ids: string
}

interface PublicProfile {
    tags: string;
    website: string;
    description: string;
}

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

export async function updateExpertDetail(data:Partial<Data>) {
    try {
        const res = await http.patch("/expert/update", data, {withCredentials: true});
        return res.data.message;  
    } catch(err:any) {
        if(err?.response?.data?.message === "Token has expired") {
            return err?.response?.data?.message
        } else {
            return err?.response?.data?.message
        }
    }
}

export async function updatePublicProfile(data: Partial<PublicProfile>) {
    try {
        const res = await http.post("/public-profile/create", data, {withCredentials: true});
        return res.data.message;
    } catch(err:any) {
        if(err?.response?.data?.message === "Token has expired") {
            return err?.response?.data?.message
        } else {
            return err?.response?.data?.message
        }
    }
}

export async function getPublicProfileDetails() {
    try {
        const res = await http.get("/public-profile", {withCredentials: true})
        return res.data;
    } catch(err:any) {
        if(err?.response?.data?.message === "Token has expired") {
            return err?.response?.data?.message
        } else {
            return err?.response?.data?.message
        }
    }
}