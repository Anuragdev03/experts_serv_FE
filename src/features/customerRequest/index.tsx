import { Box, Button, Group, Pagination, Paper, Tabs } from "@mantine/core";
import "./styles/style.css"
import { parseAsInteger, useQueryState } from "nuqs";
import CustomerTable from "./CustomerTable";
import { useEffect, useState } from "react";
import { getCustomerList } from "./api/customerList";
import { getAccessToken } from "../../api/refreshToken";
import TextInput from "../../components/TextInput";
import { notify } from "../../utilities/helpers";
import { useNavigate } from "react-router";
import Loader from "../../components/Loader";

interface Data {
    customer_phone: string;
    customer_name: string;
    customer_email: string;
    message: string;
    tracking_link: string;
    created_at: string;
}

export default function CustomerRequest() {
    const [activeTab, setActiveTab] = useQueryState("tab", { defaultValue: "pending" });
    const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))
    const [totalCount, setTotalCount] = useState(0);
    const [list, setList] = useState<Array<Data> | null>(null)
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);

    async function fetchList() {
        setLoading(true);
        let flag = 0;
        let params:any = {
            page,
            status: activeTab,
            sort: "DESC"
        }
        if(keyword) {
            params = {...params, keyword}
        }
        const res = await getCustomerList(params);
        setLoading(false);
        if (res === "Token has expired") {
            if (flag > 3) return;
            const token = await getAccessToken();
            if (token) fetchList();
            flag++;
        }
        if(res === "Please login again") {
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
    }

    useEffect(() => {
        fetchList();
    }, [page, activeTab]);

    function handleTextChange(e:React.ChangeEvent<HTMLInputElement>) {
        setKeyword(e.currentTarget.value)
    }

    function handleSearch() {
        fetchList();
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            fetchList()
        }
    };


    return (
        <Box className="cr-wrapper">
            <Paper shadow="sm" radius={8}>
                <h6 className="page-head">Customer Requests</h6>
                <Group w={"100%"}>
                    <TextInput
                        placeholder="Search"
                        w={350}
                        mx={8}
                        onChange={handleTextChange}
                        onKeyDown={handleKeyDown}
                    />
                    <Button mx={8} color="#000" onClick={handleSearch}>Search</Button>
                </Group>
                <Loader loading={loading} />
                <Tabs color="#000" value={activeTab} onChange={setActiveTab} my={16}>
                    <Tabs.List>
                        <Tabs.Tab color="yellow" value="pending">Pending</Tabs.Tab>
                        <Tabs.Tab color="green" value="accepted">Accepted</Tabs.Tab>
                        <Tabs.Tab color="red" value="declined">Declined</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value={activeTab}>
                        <CustomerTable data={list} />
                        <Group justify="center" py={24}>
                            <Pagination color="#000" total={totalCount} value={page} onChange={setPage} />
                        </Group>
                    </Tabs.Panel>
                </Tabs>
            </Paper>
        </Box>
    )
}