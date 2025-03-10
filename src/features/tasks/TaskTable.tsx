import { Table, Pill, Menu } from "@mantine/core";
import NoTasksFound from "./NoDataFound";
import { useNavigate } from "react-router";
import { formatDate } from "../../utilities/dates";
import { updateTask } from "./api/tasks";
import { getAccessToken } from "../../api/refreshToken";
import { notify } from "../../utilities/helpers";
import "./styles/style.css"

interface TasksType {
    id: string | number;
    title: string;
    description: string;
    status: string;
    priority: string;
    due_date: string;
}

interface Props {
    data: Array<TasksType> | null
    fetchTask: () => void;
}

export default function TaskTable(props: Props) {
    const { data, fetchTask } = props;
    const navigate = useNavigate();

    if (!data) {
        return (
            <NoTasksFound />
        )
    }

    function getPriorityColor(priority: string) {
        if (priority === "low") {
            return "#FACC15"
        }
        if (priority === "medium") {
            return "blue"
        }
        if (priority === "high") {
            return "red"
        }
    }

    function statusColor(status: string) {
        if(status === "pending") {
            return "yellow"
        }
        if(status === "inprogress") {
            return "blue"
        }
        if(status === "completed") {
            return "green"
        }
        if(status === "archived") {
            return "archived"
        }
    }

    function priorityList(val: string, id: string | number) {
        let arr = ["low", "medium", "high"];
        let filteredList = arr.filter(obj => obj != val);
        return filteredList.map(str => (
            <Menu.Item onClick={() => updatePriority(id, str)}>{str}</Menu.Item>
        ))
    }

    async function updatePriority(id: string | number, val: string) {
        const params = { id, priority: val };
        const res = await updateTask(params);
        if (res === "Token has expired") {
            const token = await getAccessToken();
            if (token) updatePriority(id, val);
        }
        if (res === "Please login again") {
            notify("ERROR", res);
            navigate("/login")
        }
        if(res?.message === "Task updated successfully") {
            notify("SUCCESS", res.message);
            fetchTask()
        }
    }

    function statusList(val: string, id: string | number) {
        let arr = ["pending", "inprogress", "completed", "archived"];
        let filteredList = arr.filter(obj => obj != val);
        return filteredList.map(str => (
            <Menu.Item onClick={() => updateStatus(id, str)}>{str}</Menu.Item>
        ))
    }

    async function updateStatus(id: string | number, val: string) {
        const params = { id, status: val };
        const res = await updateTask(params);
        if (res === "Token has expired") {
            const token = await getAccessToken();
            if (token) updateStatus(id, val);
        }
        if (res === "Please login again") {
            notify("ERROR", res);
            navigate("/login")
        }
        if(res?.message === "Task updated successfully") {
            notify("SUCCESS", res.message);
            fetchTask()
        }
    }

    const rows = data.map((obj, i) => ( 
        <Table.Tr key={i}>
            <Table.Td>{i + 1}</Table.Td>
            <Table.Td miw={200} onClick={() => navigate(`/edit-task/${obj.id}`, { state: obj })} className="customer_name">{obj?.title}</Table.Td>
            <Table.Td maw={200} className="task-desc">{obj?.description}</Table.Td>
            <Table.Td>
                <Menu shadow="md" width={200}>
                    <Menu.Target>
                        <Pill bg={getPriorityColor(obj.priority)} style={{ color: "#fff", cursor: "pointer" }}>{obj?.priority}</Pill>
                    </Menu.Target>
                    <Menu.Dropdown>
                        {priorityList(obj.priority, obj.id)}
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>
            <Table.Td miw={200}>{formatDate(obj?.due_date)?.toString()}</Table.Td>
            <Table.Td>
                <Menu shadow="md" width={200}>
                    <Menu.Target>
                        <Pill bg={statusColor(obj.status)} style={{ color: "#fff", cursor: "pointer" }}>{obj?.status}</Pill>
                    </Menu.Target>
                    <Menu.Dropdown>
                        {statusList(obj.status, obj.id)}
                    </Menu.Dropdown>
                </Menu>
            </Table.Td>

        </Table.Tr>
    ))
    return (
        <Table.ScrollContainer minWidth={400} my={24} mx={16}>
            <Table verticalSpacing="sm" striped highlightOnHover withColumnBorders withTableBorder>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>S.No</Table.Th>
                        <Table.Th>Title</Table.Th>
                        <Table.Th>Description</Table.Th>
                        <Table.Th>Priority</Table.Th>
                        <Table.Th>Due Date</Table.Th>
                        <Table.Th>Status</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}