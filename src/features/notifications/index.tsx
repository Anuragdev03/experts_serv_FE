import { Box, Button, Divider, Group, Pagination, Paper } from "@mantine/core";
import "./styles/style.css";
import NotificationCard from "./Card";
import { useEffect, useState } from "react";
import { getNotificationList, markAllAsRead } from "./api/notification";
import { getAccessToken } from "../../api/refreshToken";
import { notify } from "../../utilities/helpers";
import { useNavigate } from "react-router";

interface NotificationType {
    id: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

export default function Notifications() {
    const navigate = useNavigate()
    const [list, setList] = useState<Array<NotificationType> | null>(null);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        fetchList()
    }, [page]);

    async function fetchList() {
        const res = await getNotificationList(page);
        if (res === "Token has expired") {
            const token = await getAccessToken();
            if (token) fetchList();
        }
        if (res === "Please login again") {
            notify("ERROR", res);
            navigate("/login")
        }

        if (res?.totalCount) {
            let count = Math.ceil(res.totalCount / 15)
            setTotalCount(count);
            setList(res?.data)
        }
    }

    async function updateAllAsRead() {
        const res = await markAllAsRead();
        if (res === "Token has expired") {
            const token = await getAccessToken();
            if (token) updateAllAsRead();
        }
        if (res === "Please login again") {
            notify("ERROR", res);
            navigate("/login")
        }
        if(res?.message === "Notification status updated") {
            fetchList && fetchList()
        }
    }

    return (
        <Box className="n-wrapper">
            <Paper className="notification">
                <h6 className="page-head">Notifications</h6>
                <Divider />
                <Box display={"flex"}>
                    <Button onClick={updateAllAsRead} color="#000" style={{ marginLeft: "auto" }} variant="subtle">Mark All As Read</Button>
                </Box>
                {Array.isArray(list) && list.length && list.map((obj, i) => (
                    <NotificationCard data={obj} key={i} fetchList={fetchList} />
                ))}

                <Group justify="center" py={24}>
                    <Pagination color="#000" total={totalCount} value={page} onChange={setPage} />
                </Group>
            </Paper>
        </Box>
    )
}