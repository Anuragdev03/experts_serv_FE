import { Button, Group, Modal } from "@mantine/core";
import { deleteTask } from "../api/tasks";
import { getAccessToken } from "../../../api/refreshToken";
import { notify } from "../../../utilities/helpers";
import { useNavigate } from "react-router";

interface Props {
    id: string;
    opened: boolean;
    close: () => void;
    fetchTasks?: () => void
}

export function DeleteTaskModal(props: Props) {
    const { id, opened, close, fetchTasks } = props; 
    const navigate = useNavigate();

    async function confirmDelete() {
        const res = await deleteTask(id);
        if (res === "Token has expired") {
            const token = await getAccessToken();
            if (token) confirmDelete();
        }
        if (res === "Please login again") {
            notify("ERROR", res);
            navigate("/login")
        }
        if (res?.message === "Task deleted successfully") {
            notify("ERROR", res.message);
            fetchTasks && fetchTasks();
            navigate("/tasks")
        }
    }

    function cancelDelete() {
        close()
    }

    return (
        <Modal opened={opened} onClose={close} shadow="xs" centered title="Delete Task">
            <p>Are you sure to delete the task?</p>
            <Group>
                <Button color="#000" variant="outline" onClick={cancelDelete}>No</Button>
                <Button color="#FF0000" onClick={confirmDelete}>Yes</Button>
            </Group>
        </Modal>
    )
}