import { Box, Button, Group } from "@mantine/core";
import "./styles/style.css";
import newIcon from "../../assets/new.png";
import { formatDate } from "../../utilities/dates";
import { markAsRead } from "./api/notification";
import { getAccessToken } from "../../api/refreshToken";
import { notify } from "../../utilities/helpers";
import { useNavigate } from "react-router";

interface NotificationType {
    id: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

interface Props {
    data: NotificationType;
    fetchList?: () => void;
}

export default function NotificationCard(props: Props) {
    const { data, fetchList } = props;
    const navigate = useNavigate()

    async function updateMarkAsRead(id: string) {
        const res = await markAsRead(id);
        if (res === "Token has expired") {
            const token = await getAccessToken();
            if (token) updateMarkAsRead(id);
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
        <Box className="n-card">
            <Group justify="space-between" gap={16}>
                <p className="card-font">{data.message}</p>
                <Box display={"block"} w={30}>
                    {data?.is_read ? null : <img className="new-icon" src={newIcon} />}
                </Box>
            </Group>
            <Group justify="space-between">
                <p className="gray n-date">{formatDate(data.created_at).toString()}</p>
                <Button onClick={() => updateMarkAsRead(data?.id)} color="#000" size="xs" variant="subtle">Mark as Read</Button>
            </Group>
        </Box>
    )
}