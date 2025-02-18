import { Box, Button, Paper, Pill } from "@mantine/core";
import ExpertHeader from "../expertsList/Header";
import { useParams } from "react-router";
import "./styles/style.css"
import TextInput from "../../components/TextInput";
import { useEffect, useRef, useState } from "react";
import { getResponse } from "./api/getResponse";
import { notify } from "../../utilities/helpers";
import { formatDate } from "../../utilities/dates";

interface Data {
    available_date: string;
    response_message: string;
    status: string;
}

export default function TrackRequest() {
    const params = useParams();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [data, setData] = useState<Data | null>();
    const [loading, setLoading] = useState(false);

    async function handleTrack() {
        setLoading(true);
        if (inputRef.current) {
            let value = inputRef.current.value;
            if (value) {
                const res = await getResponse(value);
                console.log(res);
                if (res?.data) {
                    setData(res?.data);
                } else {
                    notify("ERROR", "The expert has not yet accepted or declined the request. It may still be in a pending state.")
                }
            }
        }
        setLoading(false);
    }

    async function fetchData() {
        let url = params?.link;
        setLoading(true);

        if (url) {
            const res = await getResponse(url);
            console.log(res);
            if (res?.data) {
                setData(res?.data);
            } else {
                notify("ERROR", "The expert has not yet accepted or declined the request. It may still be in a pending state.")
            }
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <Box>
            <ExpertHeader />

            <Box className="tr-wrapper">
                <Paper shadow="xs" my={16} radius={8} p={16} className="tr-paper">
                    <TextInput
                        ref={inputRef}
                        label="Track Request"
                        placeholder="Enter Tracking Id"
                    />
                    <Button loading={loading} color="#000" mt={16} onClick={handleTrack}>Track</Button>
                </Paper>

                {data ? <Paper shadow="xs" my={16} radius={8} p={16} className="tr-paper">
                    <h3 className="tr-subtitle">Details</h3>
                    <Box my={16} className="tr-details">
                        {data?.status && <p><span className="gray">Status:</span> <Pill size="sm" bg={data?.status === "accepted" ? "green" : "red"}>{data.status}</Pill></p>}
                        {data?.available_date && <p><span className="gray">Appointment Date:</span> {formatDate(data?.available_date)}</p>}
                        {data?.response_message && <p><span className="gray">Message from Expert:</span> {data.response_message}</p>}
                    </Box>
                </Paper> : null}
            </Box>
        </Box>
    )
}