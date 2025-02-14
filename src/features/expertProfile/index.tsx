import { Box, Paper, Tabs } from "@mantine/core";
import ExpertHeader from "../dashboard/Header";
import "./styles/style.css";
import { useQueryState } from "nuqs";
import PersonalProfile from "./PersonalProfile";
import { getPersonalDetail } from "./api/expertDetail";
import { useEffect, useState } from "react";
import { getAccessToken } from "../../api/refreshToken";
import PublicProfileTab from "./PublicProfile";
import Loader from "../../components/Loader";

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
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchExpertDetails()
    }, [])

    async function fetchExpertDetails() {
        setLoading(true);
        let flag = 0;
        const data = await getPersonalDetail();
        setExpertDetail(data);

        if(data === "Token has expired") {
            if(flag > 3) return;
            const token = await getAccessToken();
            if(token) fetchExpertDetails();
            flag++;
        }
        setLoading(false)
    }


    return (
        <Box>
            {/* <ExpertHeader /> */}

            <Box className="wrapper" pos={"relative"}>
                <Box >
                <Loader loading={loading} />
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
                            <Tabs.Tab  value="personal">Personal</Tabs.Tab>
                            <Tabs.Tab value="public">Public</Tabs.Tab>
                        </Tabs.List>
                        <Tabs.Panel value="personal">
                            <PersonalProfile data={expertDetail} />
                        </Tabs.Panel>
                        <Tabs.Panel value="public">
                            <PublicProfileTab />
                        </Tabs.Panel>
                    </Tabs>
                </Paper>
                </Box>
            </Box>
        </Box>
    )
}