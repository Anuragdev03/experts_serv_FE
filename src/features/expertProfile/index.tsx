import { Box, Paper, Tabs } from "@mantine/core";
import ExpertHeader from "../dashboard/Header";
import "./styles/style.css";
import { useQueryState } from "nuqs";
import PersonalProfile from "./PersonalProfile";
import { getPersonalDetail } from "./api/expertDetail";
import { useEffect, useState } from "react";
import { getAccessToken } from "../../api/refreshToken";

export interface User {
    name: string;
    user_name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    lat: string;
    lng: string;
    mobile_number: string;
    whatsapp_number: string;
    job_names: string;
  }

export default function ExpertProfile() {
    const [activeTab, setActiveTab] = useQueryState("profile-tab", {defaultValue: "personal"});
    const [expertDetail, setExpertDetail] = useState<User | null>(null)

    useEffect(() => {
        fetchExpertDetails()
    }, [])

    async function fetchExpertDetails() {
        const data = await getPersonalDetail();
        setExpertDetail(data);

        if(data === "Token has expired") {
            const token = await getAccessToken();
            console.log(token)
            if(token) fetchExpertDetails()
        }
    }


    return (
        <Box>
            <ExpertHeader />

            <Box className="wrapper">
                <Box>
                <h3 className="expert-profile-title">Expert Profile</h3>
                <Paper shadow="sm" radius={8} className="profile-detail-1">
                    <p><span style={{opacity: 0.7}}>Name:</span> {expertDetail?.name}</p>
                    <p><span style={{opacity: 0.7}}>User Name:</span> {expertDetail?.user_name}</p>
                    <p><span style={{opacity: 0.7}}>Email:</span> {expertDetail?.email}</p>
                    <p><span style={{opacity: 0.7}}>Phone:</span> {expertDetail?.mobile_number}</p>
                    <p><span style={{opacity: 0.7}}>Expert In:</span> {expertDetail?.job_names}</p>
                </Paper>

                <Paper shadow="xs" radius={8}my={16} className="profile-detail-2">
                    <p className="desc-text">Make Your Profiles Work for You,<br /> 
                    Attract More Leads & Grow Your Business.</p>

                    <Tabs color="#000" value={activeTab} onChange={setActiveTab} my={16}>
                        <Tabs.List>
                            <Tabs.Tab value="personal">Personal Profile</Tabs.Tab>
                            <Tabs.Tab value="public">Public Profile</Tabs.Tab>
                        </Tabs.List>
                        <Tabs.Panel value="personal">
                            <PersonalProfile data={expertDetail} />
                        </Tabs.Panel>
                    </Tabs>
                </Paper>
                </Box>
            </Box>
        </Box>
    )
}