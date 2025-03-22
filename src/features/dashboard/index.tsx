import { Box, Button, Card, Divider, Group, Modal, Paper } from "@mantine/core";
import "./styles/style.css";
import { getCount, getTasksCount, getTasksList } from "./api/customerRequest";
import { useEffect, useState } from "react";
import { getAccessToken } from "../../api/refreshToken";
import { RiArrowRightWideLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import { eventDate, formatTime, monthAndYear } from "../../utilities/dates";
import { getEventList } from "../events/api/events";
import { useDisclosure } from "@mantine/hooks";

interface Event {
    title: string;
    start_date: string;
    end_date: string;
}

interface Tasks {
    title: string;
    id: string;
}

export default function Dashboard() {
    const [reqCount, setReqCount] = useState("");
    const navigate = useNavigate();
    const [successCount, setSuccessCount] = useState("");
    const [taskCount, setTaskCount] = useState("");
    const [events, setEvents] = useState<Array<Event>>([]);
    const [tasks, setTasks] = useState<Array<Tasks>>()
    const [opened, { open, close }] = useDisclosure(false);

    useEffect(() => {
        fetchReqCount();
        fetchTasksCount();
        fetchEventsList();
        fetchTasksList();
        checkUserUpdatedTheProfile()
    }, [])

    function checkUserUpdatedTheProfile() {
        const isProfileUpdated = localStorage.getItem("isProfileUpdated");
        console.log(isProfileUpdated)
        if (isProfileUpdated === "true") {
            return;
        }

        open();
    }

    async function fetchReqCount() {
        const res = await getCount();
        if (res === "Token has expired") {
            const token = await getAccessToken();
            if (token) fetchReqCount();
        }
        if (res?.count) {
            setReqCount(res.count);
            setSuccessCount(res.acceptCount)
        }
    }

    async function fetchTasksCount() {
        const res = await getTasksCount();
        if (res === "Token has expired") {
            const token = await getAccessToken();
            if (token) fetchTasksCount();
        }
        if (res?.count) {
            setTaskCount(res?.count)
        }
    }

    async function fetchTasksList() {
        const today = eventDate(new Date());
        const res = await getTasksList(today);
        if (res === "Token has expired") {
            const token = await getAccessToken();
            if (token) fetchTasksList();
        }

        if (res?.data) {
            setTasks(res?.data)
        }
    }

    function gotoCusReq() {
        navigate("/customer-request")
    }

    async function fetchEventsList() {
        const start = eventDate(new Date());
        const newDate = monthAndYear(new Date());
        const nextDate = new Date().getDate() + 1;
        const end = newDate + `-${nextDate}`;
        const res = await getEventList(start, end);

        if (res === "Token has expired") {
            const token = await getAccessToken();
            if (token) fetchEventsList();
        }
        if (res?.data) {
            setEvents(res?.data)
        }
    }

    function gotoProfile() {
        localStorage.setItem("isProfileUpdated", "true")
        navigate("/expert-profile")
    }
    return (
        <Box className="dash-wrapper">
            <Paper shadow="sm" radius={8} className="dashboard-cards">
                <h6 className="page-head">Dashboard</h6>

                <Group>
                    <Card className="d-card" bg={"orange"} onClick={gotoCusReq}>
                        <p>Pending customer request</p>
                        <Group justify="space-between" align="center" mt={20}>
                            <p className="card-count">{reqCount}</p>
                            <RiArrowRightWideLine size={28} color="#fff" />
                        </Group>
                    </Card>
                    <Card className="d-card" bg={"green"}>
                        <p>Successful leads</p>
                        <Group justify="space-between" align="center" mt={44}>
                            <p className="card-count">{successCount}</p>
                            <RiArrowRightWideLine size={28} color="#fff" />
                        </Group>
                    </Card>
                    <Card className="d-card" bg={"orange"}>
                        <p>Pending Tasks</p>
                        <Group justify="space-between" align="center" mt={44}>
                            <p className="card-count">{taskCount}</p>
                            <RiArrowRightWideLine size={28} color="#fff" />
                        </Group>
                    </Card>
                </Group>
            </Paper>

            <Group>
                <Paper shadow="sm" radius={8} mt={16} p={16} className="event-card">
                    <Box>
                        <h5 className="tasks-events">Events (Today)</h5>
                        <Divider my={2} />
                        {Array.isArray(events) && events?.length ? events.map((obj, i) => (
                            <p key={i} className="event-name">{i + 1} {obj?.title} - {formatTime(obj?.start_date).toString()}</p>
                        )) : <p className="event-name">No Events Today!</p>}
                    </Box>
                </Paper>

                <Paper shadow="sm" radius={8} mt={16} p={16} className="event-card">
                    <Box>
                        <h5 className="tasks-events">Tasks (Today)</h5>
                        <Divider my={2} />
                        {Array.isArray(tasks) && tasks?.length ? tasks.map((obj, i) => (
                            <p key={obj.id} className="event-name">{i + 1} {obj?.title}</p>
                        )) : <p className="event-name">No Tasks Today!</p>}
                    </Box>
                </Paper>
            </Group>

            {/* User Profile update modal */}
            <Modal opened={opened} onClose={close} title="Update Profile Required" centered>
                <p className="event-name">
                    To ensure visibility and access to search features, please update your <span className="highlight-text">personal</span> and <span className="highlight-text">public</span> profile.
                </p>

                <ul>
                    <li>
                        <p>
                            <span className="highlight-text">Visibility:</span> Your profile gets views only be visible to customers once updated.
                        </p>
                    </li>
                    <li>
                        <p>
                            <span className="highlight-text">Search Access: </span> The search filter works based on your profile. Update with relevant keywords.
                        </p>
                    </li>
                </ul>
                <Group wrap="nowrap" align="center" justify="center">
                    <Button color="#000" variant="light">Cancel</Button>
                    <Button color="#000" onClick={gotoProfile}>Goto Profile</Button>
                </Group>
            </Modal>
        </Box>
    )
}