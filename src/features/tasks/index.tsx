import { Box, Button, Divider, Group, Pagination, Paper, Tabs } from "@mantine/core";
import { useEffect, useState } from "react";
import { IoAddSharp } from "react-icons/io5";
import Loader from "../../components/Loader";
import { parseAsInteger, useQueryState } from "nuqs";
import { getTasksList } from "./api/tasks";
import { getAccessToken } from "../../api/refreshToken";
import { notify } from "../../utilities/helpers";
import { useNavigate } from "react-router";
import TaskTable from "./TaskTable";
import { useDisclosure } from "@mantine/hooks";
import AddTaskModal from "./modals/AddTask";

interface TasksType {
    id: string | number;
    title: string;
    description: string;
    status: string;
    priority: string;
    due_date: string;
}

export default function Tasks() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useQueryState("tab", { defaultValue: "pending" });
    const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))
    const [totalCount, setTotalCount] = useState(0);
    const [list, setList] = useState<Array<TasksType> | null>(null)
    const [opened, { open, close }] = useDisclosure(false);

    async function fetchTasksList() {
        setLoading(true);

        let params = {
            page,
            status: activeTab,
            sort: "DESC"
        }
        const res = await getTasksList(params);
        let flag = 0;

        if (res === "Token has expired") {
            if (flag > 3) return;
            const token = await getAccessToken();
            if (token) fetchTasksList();
            flag++;
        }
        if (res === "Please login again") {
            notify("ERROR", res);
            navigate("/login")
        }

        if (res.totalCount) {
            setList(res.data);
            let count = Math.ceil(res.totalCount / 15)
            setTotalCount(count)
        }
        if (res === "No data found") {
            setList(null);
            setTotalCount(0)
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchTasksList()
    }, [page, activeTab]);

    return (
        <Box className="t-wrapper">
            <Paper shadow="sm" radius={8}>
                <h6 className="page-head">Tasks</h6>

                <Group mx={8}>
                    <Button onClick={open} leftSection={<IoAddSharp size={14} />} size="xs" variant="outline" className="e-links">Add Tasks</Button>
                </Group>
                <Divider my={8} />

                <Loader loading={loading} />
                <Tabs color="#000" value={activeTab} onChange={setActiveTab} my={16}>
                    <Tabs.List>
                        <Tabs.Tab color="yellow" value="pending">Pending</Tabs.Tab>
                        <Tabs.Tab color="blue" value="inprogress">In Progress</Tabs.Tab>
                        <Tabs.Tab color="green" value="completed">Completed</Tabs.Tab>
                        <Tabs.Tab color="gray" value="archived">Archived</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value={activeTab}>
                        <TaskTable data={list} fetchTask={fetchTasksList} />
                        <Group justify="center" py={24}>
                            <Pagination color="#000" total={totalCount} value={page} onChange={setPage} />
                        </Group>
                    </Tabs.Panel>
                </Tabs>

                <AddTaskModal
                    opened={opened}
                    close={close}
                    fetchTasks={fetchTasksList}
                />
            </Paper>
        </Box >
    )
} 