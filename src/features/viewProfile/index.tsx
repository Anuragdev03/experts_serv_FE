import { Box, Button, Group, Paper, Pill } from "@mantine/core"
import { useNavigate, useParams } from "react-router"
import Header from "./Header"
import "./styles/styles.css";
import { getProfileDetails } from "./api/viewProfile";
import { useEffect, useState } from "react";
import { notify } from "../../utilities/helpers";
import Loader from "../../components/Loader";

interface ProfileData {
    city: string;
    state: string;
    country: string;
    job_names: string[];
    name: string;
    website: string;
    description: string;
    user_name: string;
    lat: string;
    lng: string
}
export default function ViewProfile() {
    const [profileData, setProfileData] = useState<ProfileData | null>(null)
    const [loading, setLoading] = useState(false)
    const params = useParams();
    const navigate = useNavigate();
    const url = params.url;

    async function getData() {
        setLoading(true);
        if(!url) return;
        const res = await getProfileDetails(url);
        if(res?.data) {
            setProfileData(res.data)
        } else {
            notify("ERROR", "No data found");
        }
        setLoading(false);
    }
    useEffect(() => {
        getData()
    }, [])

    const goBack = () => navigate(-1);

    const goToRequestScreen = () => navigate(`/request-screen/${profileData?.user_name}`);
    return (
        <Box>
            <Header />
            <Box className="vp-wrapper">
                <Loader loading={loading} />
                <Paper shadow="xs" radius={8} className="paper-1">
                    <h5 className="black">{profileData?.name}</h5>
                    {Array.isArray(profileData?.job_names) && profileData.job_names.map(str => (
                        <Pill my={8}>{str}</Pill>
                    ))}
                    <p className="gray location">City: {profileData?.city}, state: {profileData?.state}, Country: {profileData?.country}</p>
                    {profileData?.lat ? <a href={`https://www.google.com/maps/place/${profileData.lat},${profileData.lng}`} target="_blank" rel="noopener noreferrer" className="location">Google Map Link</a> : null}
                </Paper>
                <Paper shadow="xs" radius={8} className="paper-2">
                    {profileData?.website ? <a href={profileData?.website} target="_blank" rel="noopener noreferrer">Social media link/Website</a> : null}

                    <p className="other-detail gray">Other Details</p>
                    {profileData?.description ? <div dangerouslySetInnerHTML={{__html: profileData?.description}} /> : null}
                    <Group my={16} className="button-grp">
                        <Button w={"100%"} variant="outline" color="#000" onClick={goBack}>Back</Button>
                        <Button w={"100%"} onClick={goToRequestScreen} color="#000">Request Service</Button>
                    </Group>
                </Paper>
            </Box>
        </Box>
    )
}