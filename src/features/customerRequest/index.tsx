import { Box, Paper, Tabs } from "@mantine/core";
import "./styles/style.css"
import { useQueryState } from "nuqs";

export default function CustomerRequest() {
    const [activeTab, setActiveTab] = useQueryState("tab", { defaultValue: "pending" });

    return (
        <Box className="cr-wrapper">
            <Paper shadow="sm" radius={8}>
                <h6 className="page-head">Customer Requests</h6>


                <Tabs  color="#000" value={activeTab} onChange={setActiveTab} my={16}>
                    <Tabs.List>
                        <Tabs.Tab  color="yellow" value="pending">Pending</Tabs.Tab>
                        <Tabs.Tab color="green" value="accepted">Accepted</Tabs.Tab>
                        <Tabs.Tab color="red" value="declined">Declined</Tabs.Tab>
                    </Tabs.List>
                </Tabs>
            </Paper>
        </Box>
    )
}