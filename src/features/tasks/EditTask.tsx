import { Box, Button, Group, Modal, Paper, SegmentedControl } from "@mantine/core";
import "./styles/editTask.css";
import TextInput from "../../components/TextInput";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import TextArea from "../../components/TextArea";
import DateTimeInput from "../../components/DateTimeInput";
import { DateValue } from "@mantine/dates";
import { deleteTask, updateTask } from "./api/tasks";
import { getAccessToken } from "../../api/refreshToken";
import { notify } from "../../utilities/helpers";
import { useDisclosure } from "@mantine/hooks";
import { DeleteTaskModal } from "./modals/DeleteTask";

export default function EditTask() {
    const location = useLocation();
    const taskData = location.state;
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("");
    const [status, setStatus] = useState("");
    const [dueDate, setDueDate] = useState<Date | undefined | DateValue>();
    const navigate = useNavigate();
    const [opened, { open, close }] = useDisclosure(false);


    function handleTitle(e: React.ChangeEvent<HTMLInputElement>) {
        setTitle(e.target.value)
    }

    function handleDescription(e: React.ChangeEvent<HTMLTextAreaElement>) {
        setDescription(e.target.value)
    }


    function prefillData() {
        if (taskData?.title) {
            setTitle(taskData?.title)
        }
        if (taskData?.description) {
            setDescription(taskData?.description)
        }
        if (taskData?.priority) {
            setPriority(taskData.priority)
        }
        if (taskData?.status) {
            setStatus(taskData.status)
        }
        if (taskData?.due_date) {
            setDueDate(new Date(taskData?.due_date));
        }
    }

    useEffect(() => {
        prefillData();
    }, [])

    function handleDueDate(val: DateValue) {
        setDueDate(val)
    }

    async function handleSubmit() {
        if (!taskData?.id) return;

        let params: any = { id: taskData?.id };

        if (title) {
            params = { ...params, title }
        }
        if (description) {
            params = { ...params, description }
        }
        if (priority) {
            params = { ...params, priority }
        }
        if (status) {
            params = { ...params, status }
        }
        if (dueDate) {
            params = { ...params, due_date: dueDate }
        }

        const res = await updateTask(params);
        let flag = 0;
        if (res === "Token has expired") {
            if (flag > 3) return;
            const token = await getAccessToken();
            if (token) handleSubmit();
            flag++;
        }
        if (res === "Please login again") {
            notify("ERROR", res);
            navigate("/login")
        }
        if (res?.message === "Task updated successfully") {
            notify("SUCCESS", res.message);
            navigate("/tasks")
        }
    }


    return (
        <Box className="et-wrapper">
            <Paper shadow="sm" radius={8}>
                <h6 className="page-head">Edit Task</h6>
                <Box className="task-from">
                    <TextInput
                        label="Title"
                        value={title}
                        onChange={handleTitle}
                        my={8}
                    />
                    <TextArea
                        value={description}
                        label="Description"
                        placeholder="Description"
                        resize="vertical"
                        mb={8}
                        onChange={handleDescription}
                    />

                    <p className="label">Priority</p>
                    <SegmentedControl
                        value={priority}
                        onChange={setPriority}
                        data={[
                            { label: 'Low', value: 'low' },
                            { label: 'Medium', value: 'medium' },
                            { label: 'High', value: 'high' },
                        ]}
                        color="#000"
                        my={8}
                    />

                    <p className="label">Status</p>
                    <SegmentedControl
                        value={status}
                        onChange={setStatus}
                        data={[
                            { label: 'Pending', value: 'pending' },
                            { label: 'In Progress', value: 'inprogress' },
                            { label: 'Completed', value: 'completed' },
                            { label: 'Archived', value: 'archived' },
                        ]}
                        color="#000"
                        my={8}
                    />

                    <DateTimeInput
                        value={dueDate}
                        label="Due Date"
                        placeholder="22/02/1998 10:10"
                        onChange={handleDueDate}
                        my={8}
                    />
                    <Group align="center" mt={16}>
                        <Button color="red" onClick={open}>Delete</Button>
                        <Button color="#000" onClick={handleSubmit}>Update</Button>
                    </Group>

                    <DeleteTaskModal
                        opened={opened}
                        close={close}
                        id={taskData?.id}
                    />
                </Box>
            </Paper>
        </Box>
    )
}