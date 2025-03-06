import { Button, Modal } from "@mantine/core";
import TextInput from "./TextInput";
import DateTimeInput from "./DateTimeInput";
import { useRef, useState } from "react";
import { DateValue } from "@mantine/dates";
import { addEventReq } from "../features/events/api/events";
import { getAccessToken } from "../api/refreshToken";
import { notify } from "../utilities/helpers";


interface Props {
    opened: boolean;
    close: () => void;
}

export default function AddToCalendarModal(props: Props) {
    const { opened, close } = props;
    const [startDate, setStartDate] = useState<Date | undefined | DateValue>();
    const [endDate, setEndDate] = useState<Date | undefined | DateValue>();
    const titleRef = useRef<HTMLInputElement>(null);

    function handleStartDate(date: DateValue) {
        setStartDate(date)
    }

    function handleEndDate(date: DateValue) {
        setEndDate(date)
    }

    async function submitForm() {
            const title = titleRef.current?.value;
    
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
            }
           
    
            // Api call
            let flag = 0;
            const res = await addEventReq(payload);
            if (res === "Token has expired") {
                if (flag > 3) return;
                const token = await getAccessToken();
                if (token) submitForm();
                flag++;
            }
    
            if(res?.message === "Event created successfully") {
                notify("SUCCESS", "Event created successfully")
            }
            close();
        }

    return (
        <Modal shadow="xs" opened={opened} onClose={close} title="Add To Calendar" centered>
            <TextInput
                label="Event Title"
                placeholder="Title"
                required
                ref={titleRef}
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