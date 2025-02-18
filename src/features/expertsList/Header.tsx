import { Box, Group, Menu } from "@mantine/core";
import { FaUserGear } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { CiLink } from "react-icons/ci";

export default function ExpertHeader() {
    const navigate = useNavigate();

    function gotoProfile() {
        navigate("/customer-profile")
    }
    const goHome = () => navigate("/");

    function trackRequest() {
        navigate("/track")
    }

    return (
        <Box className="experts-header">
            <Box>
                <h5 onClick={goHome} className="logo">ExpertService</h5>
            </Box>

            <Box className="ex-header-item">
                <Group gap={4} >
                    <Menu shadow="md" width={200}>
                        <Menu.Target>
                            <Group gap={4} style={{ cursor: "pointer" }} className="profile-group-cus click-action">
                                <FaUserGear size={18} color="#000" />
                                <a style={{ cursor: "pointer", color: "#000" }}>Settings</a>
                            </Group>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item>
                                <Menu.Item onClick={gotoProfile} leftSection={<FaUserGear size={18} />}>
                                    Profile
                                </Menu.Item>

                                <Menu.Item onClick={trackRequest} leftSection={<CiLink size={18} alignmentBaseline="central" />}>
                                    Track Request
                                </Menu.Item>
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </Box>
        </Box>
    )
}