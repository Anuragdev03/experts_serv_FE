import { Box, Group } from "@mantine/core";
import { FaUserGear } from "react-icons/fa6";
import { useNavigate } from "react-router";

export default function ExpertHeader() {
    const navigate = useNavigate();

    function gotoProfile() {
        navigate("/customer-profile")
    }
    return (
        <Box className="experts-header">
            <Box>
                <h5 className="logo">ExpertService</h5>
            </Box>
            <Box className="ex-header-item">
                <Group gap={4} style={{ cursor: "pointer"}} className="profile-group-cus" onClick={gotoProfile}>
                    <FaUserGear size={18} />
                    <a style={{cursor: "pointer"}}>Profile</a>
                </Group>
            </Box>
        </Box>
    )
}