import { Button, Modal, SegmentedControl } from "@mantine/core";
import TextInput from "../../../components/TextInput";
import TextArea from "../../../components/TextArea";
import { useRef, useState } from "react";
import DateTimeInput from "../../../components/DateTimeInput";
import { DateValue } from "@mantine/dates";
import { notify } from "../../../utilities/helpers";
import { createTask } from "../api/tasks";
import { getAccessToken } from "../../../api/refreshToken";
import { useNavigate } from "react-router";


interface Props {
    opened: boolean;
    close: () => void;
    fetchTasks: () => void;
}

export default function AddTaskModal(props: Props) {
    const { opened, close, fetchTasks } = props;
    const [priority, setPriority] = useState("");
    const titleRef = useRef<HTMLInputElement>(null);
    const desRef = useRef<HTMLTextAreaElement>(null);
    const [dueDate, setDueDate] = useState<Date | undefined | DateValue>();
    const navigate = useNavigate();

    async function handleSubmit() {
        const title = titleRef.current?.value;
        const description = desRef.current?.value;

        // Validation
        if (!title) {
            notify("ERROR", "Title is required");
            return
        }
        if (!dueDate) {
            notify("ERROR", "Due date is required");
            return
        }
        if (!priority) {
            notify("ERROR", "Priority is required");
            return
        }

        const params = {
            title,
            description,
            due_date: dueDate,
            status: "pending",
            priority
        }

        const res = await createTask(params);
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

        if(res?.message === "Task Created Successfully") {
            notify("SUCCESS", res?.message);
            fetchTasks();
            close();
        }
    }

    function handleDueDate(val: DateValue) {
        setDueDate(val)
    }
    return (
        <Modal shadow="xs" opened={opened} onClose={close} title="Add Event" centered>
            <form>
                <TextInput
                    label="Title"
                    placeholder="Title"
                    ref={titleRef}
                    required
                />

                <TextArea
                    label="Description"
                    placeholder="Description"
                    resize="vertical"
                    mb={4}
                    ref={desRef}
                />

                <p className="label">Priority <span style={{ color: "red" }}>*</span></p>
                <SegmentedControl
                    value={priority}
                    onChange={setPriority}
                    data={[
                        { label: 'Low', value: 'low' },
                        { label: 'Medium', value: 'medium' },
                        { label: 'High', value: 'high' },
                    ]}
                    color="#000"
                    my={4}
                />

                <DateTimeInput
                    label="Due Date"
                    required
                    placeholder="22/02/1998 10:10"
                    onChange={handleDueDate}
                />

                <Button onClick={handleSubmit} color="#000" w={100} mt={16}>Add</Button>
            </form>
        </Modal>
    )
}