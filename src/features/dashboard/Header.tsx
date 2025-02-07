import { ActionIcon, Box, Group, Menu } from "@mantine/core";
import { FaUserGear } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { IoMdNotificationsOutline } from "react-icons/io";
import { PiUserListLight } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";
import { RiLogoutCircleLine } from "react-icons/ri";
import { logoutFromDevice } from "./api/logout";

export default function ExpertHeader() {
    const navigate = useNavigate();

    function gotoProfile() {
        navigate("/expert-profile")
    }
    const goHome = () => navigate("/");

    async function logout() {
        const res = await logoutFromDevice();
        console.log(res);
        localStorage.removeItem("token");
        navigate("/login")
    }
    return (
        <Box className="experts-header">
            <Box>
                <h5 onClick={goHome} className="logo">ExpertService</h5>
            </Box>
            <Box className="ex-header-item">
                <Group gap={4} >
                    <ActionIcon color="gray" variant="outline" mr={16} >
                        <IoMdNotificationsOutline  />
                    </ActionIcon>
                    <Menu shadow="md" width={200}>
                        <Menu.Target>
                            <Group gap={4} style={{ cursor: "pointer" }} className="profile-group-cus click-action">
                                <FaUserGear size={18} color="#000" />
                                <a style={{ cursor: "pointer", color: "#000" }}>Settings</a>
                            </Group>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item>
                                <Menu.Item onClick={gotoProfile} leftSection={<PiUserListLight size={18} alignmentBaseline="central" />}>
                                    Profile
                                </Menu.Item>

                                <Menu.Item leftSection={<IoSettingsOutline size={18} alignmentBaseline="central" />}>
                                    Settings
                                </Menu.Item>

                                <Menu.Item onClick={logout} color="red" leftSection={<RiLogoutCircleLine size={18} alignmentBaseline="central" />}>
                                    Logout
                                </Menu.Item>
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </Box>
        </Box>
    )
}