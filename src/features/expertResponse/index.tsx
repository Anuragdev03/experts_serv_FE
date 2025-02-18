import { Box, Button, Group, Paper } from "@mantine/core";
import { useParams, useLocation, useNavigate } from "react-router"
import "./styles/style.css";
import TextArea from "../../components/TextArea";
import DateTimeInput from "../../components/DateTimeInput";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { DateValue } from "@mantine/dates";
import { addResponse, responseIsExists, updateResponse } from "./api/expertResponse";
import { notify } from "../../utilities/helpers";
import { getAccessToken } from "../../api/refreshToken";
import dayjs from "dayjs";

type Status = "accepted" | "declined";

export default function ExpertResponse() {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate()
    const customerData = location.state;
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState<DateValue>(new Date());
    const [response, setResponse] = useState("");
    const [isEdit, setIsEdit] = useState(false);
    const goBack = () => navigate(-1);

    function handleDate(date: DateValue) {
        setDate(date)
    }

    function handleResponseChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setResponse(event.currentTarget.value)
    }

    async function submitResponse(status: Status) {
        setLoading(true)
        let flag = 1;
        const tracking_link = params.url;
        if (!tracking_link) return;

        const payload = {
            tracking_link,
            status: "accepted",
            available_date: date,
            message: response
        }

        const res = await addResponse(payload);
        if (res === "Token has expired") {
            if (flag > 3) return;
            const token = await getAccessToken();
            if (token) submitResponse(status);
            flag++;
        }

        if (res.message === "Success") {
            notify("SUCCESS", "Response sent successfully");
            navigate("/customer-request")
        } else {
            notify("ERROR", res)
        }
        setLoading(false);
    }

    async function updateExpertResponse(status: Status) {
        setLoading(true)
        let flag = 1;
        const tracking_link = params.url;
        if (!tracking_link) return;

        let payload: any = { tracking_link };

        if(status) {
            payload = {...payload, status}
        }
        if(date) {
            payload = {...payload, available_date: date}
        }
        if(response) {
            payload = {...payload, message: response}
        }

        const res = await updateResponse(payload);
        if (res === "Token has expired") {
            if (flag > 3) return;
            const token = await getAccessToken();
            if (token) updateExpertResponse(status);
            flag++;
        }

        if (res.message === "Success") {
            notify("SUCCESS", "Response sent successfully");
            navigate("/customer-request")
        } else {
            notify("ERROR", res)
        }
        setLoading(false);
    }

    async function checkTheResponseExists() {
        if (!params.url) return;

        const res = await responseIsExists(params.url);
        if (res?.data) {
            setDate(new Date(res.data?.available_date));
            setResponse(res.data?.response_message);
            setIsEdit(true);
        }
    }

    useEffect(() => {
        checkTheResponseExists()
    }, [])

    const createButtons = () => (
        <Group align="center">
            <Button variant="light" color="#000" onClick={goBack}>Cancel</Button>
            <Button color="green" onClick={() => submitResponse("accepted")}>Accept</Button>
            <Button color="red" onClick={() => submitResponse("declined")}>Decline</Button>
        </Group>
    );

    const updateButtons = () => (
        <Group align="center">
            <Button variant="light" color="#000" onClick={goBack}>Cancel</Button>
            <Button color="green" onClick={() => updateExpertResponse("accepted")}>Accept</Button>
            <Button color="red" onClick={() => updateExpertResponse("declined")}>Decline</Button>
        </Group>
    )
    return (
        <Box className="er-wrapper">
            <Paper shadow="sm" radius={8}>
                <h6 className="page-head">Expert Response</h6>

                <Box className="er-customer-details">
                    <p style={{ fontWeight: 500 }}>Customer Details</p>

                    <Box mt={16} style={{ fontSize: "14px", opacity: .8 }}>
                        <p>Name: {customerData?.customer_name}</p>
                        <p>Phone: {customerData?.customer_phone}</p>
                        <p>Email: {customerData?.customer_email}</p>
                        <p>Description/Message: {customerData?.message}</p>
                    </Box>
                </Box>
            </Paper>
            <Paper shadow="sm" radius={8} mt={24} p={8} pos={"relative"}>
                <h5>Review and Send Your Response</h5>

                <Box style={{ maxWidth: "400px", padding: "8px" }} >
                    {isEdit ? <p style={{ fontSize: "12px", marginBottom: "8px", color: "gray" }}>Update your response</p> : null}
                    <Loader loading={loading} />
                    <TextArea
                        label="Response Message"
                        resize="vertical"
                        placeholder="Type your response to the customer here..."
                        required
                        onChange={handleResponseChange}
                        value={response}
                    />

                    <DateTimeInput
                        label="Visit Date/Consultation Date"
                        required
                        onChange={handleDate}
                        my={12}
                        value={date}
                    />

                    {isEdit ? updateButtons() : createButtons()}
                </Box>
            </Paper>
        </Box>
    )
}