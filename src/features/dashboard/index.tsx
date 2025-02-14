import { Box, Card, Group, Paper } from "@mantine/core";
import "./styles/style.css";
import { getCount } from "./api/customerRequest";
import { useEffect, useState } from "react";
import { getAccessToken } from "../../api/refreshToken";
import { RiArrowRightWideLine } from "react-icons/ri";
import { useNavigate } from "react-router";


export default function Dashboard() {
    const [reqCount, setReqCount] = useState("");
    const navigate = useNavigate()

    useEffect(() => {
        fetchReqCount();
    }, [])

    async function fetchReqCount() {
        let flag = 1;
        const res = await getCount();
        if (res === "Token has expired") {
            if (flag > 3) return;
            const token = await getAccessToken();
            if (token) fetchReqCount();
            flag++;
        }
        if (res?.count) {
            setReqCount(res.count)
        }
    }

    function gotoCusReq() {
        navigate("/customer-request")
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
                    </Card>
                    <Card className="d-card" bg={"orange"}>
                        <p>Pending Projects</p>
                    </Card>
                    <Card className="d-card" bg={"orange"}>
                        <p>Pending Tasks</p>
                    </Card>
                </Group>
            </Paper>
        </Box>
    )
}