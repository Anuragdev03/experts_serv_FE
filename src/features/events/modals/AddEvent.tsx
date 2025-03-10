import { Button, Modal } from "@mantine/core";
import TextInput from "../../../components/TextInput";
import DateTimeInput from "../../../components/DateTimeInput";
import { useEffect, useRef, useState } from "react";
import { notify } from "../../../utilities/helpers";
import { addEventReq } from "../api/events";
import { getAccessToken } from "../../../api/refreshToken";
import { DateValue } from "@mantine/dates";

interface EventData {
    allDay?: boolean;
    start?: Date;
    end?: Date
}

interface Props {
    opened: boolean;
    close: () => void;
    data?: EventData | null;
    fetchEvents?: () => void;
}

export default function AddEvent(props: Props) {
    const { opened, close, data, fetchEvents } = props;
    const [startDate, setStartDate] = useState<Date | undefined | DateValue>();
    const [endDate, setEndDate] = useState<Date | undefined | DateValue>();
    const titleRef = useRef<HTMLInputElement>(null);
    const desRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        prefillData()
    }, [data])

    function prefillData() {
        if (data?.start) {
            setStartDate(data?.start)
        }
        if (data?.end) {
            setEndDate(data?.end)
        }
    }

    async function submitForm() {
        const title = titleRef.current?.value;
        const description = desRef.current?.value;
        const link = linkRef.current?.value;
        const all_day = data?.allDay ?? false;

        // Validation
        if (!title) {
            notify("ERROR", "Title is required");
            return
        }
        if (!startDate) {
            notify("ERROR", "Start date is required");
            return
        }
        if (!endDate) {
            notify("ERROR", "End date is required");
            return;
        }

        let payload: any = {
            title,
            start_date: startDate,
            end_date: endDate,
            all_day: all_day
        }
        if (link) {
            payload = { ...payload, link: link }
        }
        if (description) {
            payload = { ...payload, description }
        }

        // Api call
        const res = await addEventReq(payload);
        if (res === "Token has expired") {
            const token = await getAccessToken();
            if (token) submitForm();
        }

        if(res?.message === "Event created successfully") {
            notify("SUCCESS", "Event created successfully")
        }
        fetchEvents && fetchEvents()
        close();
    }

    function handleStartDate(date: DateValue) {
        setStartDate(date)
    }

    function handleEndDate(date: DateValue) {
        setEndDate(date)
    }

    return (
        <Modal shadow="xs" opened={opened} onClose={close} title="Add Event" centered>
            <TextInput
                label="Event Title"
                placeholder="Title"
                required
                ref={titleRef}
            />

            <TextInput
                label="Description"
                ref={desRef}
            />

            <TextInput
                label="Website/URL"
                placeholder="https://localhost.com"
                ref={linkRef}
            />

            <DateTimeInput
                label="Start Time"
                placeholder="18/02/2025 10:10"
                required
                value={startDate}
                onChange={handleStartDate}
            />

            <DateTimeInput
                label="End Time"
                placeholder="18/02/2025 10:10"
                required
                value={endDate}
                onChange={handleEndDate}
            />

            <Button onClick={submitForm} color="#000" mt={16}>Add Event</Button>
        </Modal>
    )
}