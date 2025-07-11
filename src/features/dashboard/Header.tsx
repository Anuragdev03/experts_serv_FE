import { ActionIcon, Anchor, Box, Divider, Group, Indicator, Menu } from "@mantine/core";
import { FaUserGear } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { IoMdNotificationsOutline } from "react-icons/io";
import { PiUserListLight } from "react-icons/pi";
import { IoSettingsOutline } from "react-icons/io5";
import { RiLogoutCircleLine } from "react-icons/ri";
import { logoutFromDevice } from "./api/logout";
import { Burger, Drawer, CloseButton } from '@mantine/core';
import { useDisclosure, useViewportSize } from "@mantine/hooks";

//icons
import { MdOutlineDashboard } from "react-icons/md";
import { AiOutlineUserSwitch } from "react-icons/ai";
import { LiaTasksSolid } from "react-icons/lia";
import { RiCalendarEventLine } from "react-icons/ri";

import { getNotificationCount } from "./api/notification";
import { useEffect, useState } from "react";
import { getAccessToken } from "../../api/refreshToken";


export default function ExpertHeader() {
    const navigate = useNavigate();
    const [opened, { toggle, close }] = useDisclosure(false);
    const [notificationStatus, setNotificationStatus] = useState(false);
    const { width } = useViewportSize();

    function gotoProfile() {
        navigate("/expert-profile")
    }
    const goHome = () => navigate("/dashboard");

    async function logout() {
        await logoutFromDevice();
        sessionStorage.removeItem("token");
        navigate("/login")
    }

    function gotoDashBoard() {
        navigate("/dashboard");
        close()
    }

    function gotoCusReq() {
        navigate("/customer-request");
        close()
    }

    function gotoEvents() {
        navigate("/events");
        close()
    }

    function gotoTasks() {
        navigate("/tasks");
        close()
    }

    async function getNotificationStatus() {
        const res = await getNotificationCount();
        if (res === "Token has expired") {
            const token = await getAccessToken();
            if (token) getNotificationStatus();
        }
        if(Number(res?.count) > 0) {
            setNotificationStatus(true)
        }
    }

    useEffect(() => {
        getNotificationStatus()
    }, [])

    function gotoNotificationPage() {
        navigate("/notifications")
    }

    function gotoSettings() {
        navigate("/settings")
    }
    return (
        <Box className="experts-header">
            <Box>
                <Group>
                    <Burger opened={opened} onClick={toggle} aria-label="Toggle navigation" />
                    <h5 onClick={goHome} className="logo">ExpertService</h5>
                </Group>
            </Box>

            <Box className="ex-header-item">
                <Group gap={4} >
                    <ActionIcon color="gray" variant="outline" mr={16} onClick={gotoNotificationPage}>
                        <Indicator size={8} inline processing position="top-end" disabled={!notificationStatus} color="#000">
                            <IoMdNotificationsOutline />
                        </Indicator>
                    </ActionIcon>
                    <Menu shadow="md" width={200}>
                        <Menu.Target>
                            <Group gap={4} style={{ cursor: "pointer" }} className="profile-group-cus click-action">
                                <FaUserGear size={18} color="#000" />
                                <a style={{ cursor: "pointer", color: "#000" }}>{width > 720 ? "Settings" : ""}</a>
                            </Group>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item>
                                <Menu.Item onClick={gotoProfile} leftSection={<PiUserListLight size={18} alignmentBaseline="central" />}>
                                    Profile
                                </Menu.Item>

                                <Menu.Item onClick={gotoSettings} leftSection={<IoSettingsOutline size={18} alignmentBaseline="central" />}>
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


            <Drawer opened={opened} onClose={close} size={"xs"} withCloseButton={false}>
                <Drawer.Header>
                    <h5 onClick={goHome} className="logo">ExpertService</h5>
                    <CloseButton onClick={close} />
                </Drawer.Header>
                <Divider />
                <Box className="nav-items">
                    <Group>
                        <MdOutlineDashboard size={18} />
                        <Anchor onClick={gotoDashBoard} className="nav-item">Dashboard</Anchor>
                    </Group>
                    <Group>
                        <AiOutlineUserSwitch size={18} />
                        <Anchor onClick={gotoCusReq} className="nav-item">Customer Requests</Anchor>
                    </Group>
                    <Group>
                        <LiaTasksSolid size={18} />
                        <Anchor className="nav-item" onClick={gotoTasks}>Tasks</Anchor>
                    </Group>
                    <Group>
                        <RiCalendarEventLine size={18} />
                        <Anchor onClick={gotoEvents} className="nav-item">Events</Anchor>
                    </Group>
                    {/* <Group>
                        <MdOutlineWorkOutline size={18} />
                        <Anchor className="nav-item">Projects</Anchor>
                    </Group> */}

                </Box>
            </Drawer>
        </Box>
    )
}