import { Box, Card, Divider, Group, Paper } from "@mantine/core";
import "./styles/style.css";
import { getCount, getTasksCount, getTasksList } from "./api/customerRequest";
import { useEffect, useState } from "react";
import { getAccessToken } from "../../api/refreshToken";
import { RiArrowRightWideLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import { eventDate, formatTime, monthAndYear } from "../../utilities/dates";
import { getEventList } from "../events/api/events";

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

    useEffect(() => {
        fetchReqCount();
        fetchTasksCount();
        fetchEventsList();
        fetchTasksList();
    }, [])

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

        if(res?.data) {
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
                        )): <p className="event-name">No Tasks Today!</p>}
                    </Box>
                </Paper>
            </Group>
        </Box>
    )
}