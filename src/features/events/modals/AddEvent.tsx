import { Button, Modal } from "@mantine/core";
import TextInput from "../../../components/TextInput";
import DateTimeInput from "../../../components/DateTimeInput";

interface EventData {
    allDay?: boolean;
    start?: Date;
    end?: Date
}

interface Props {
    opened: boolean;
    close: () => void;
    data?: EventData | null;
}

export default function AddEvent(props: Props) {
    const { opened, close, data} = props;
    return (
        <Modal shadow="xs" opened={opened} onClose={close} title="Add Event" centered>
            <TextInput
                label="Event Title"
                placeholder="Title"
                required
            />

            <TextInput
                label="Description"
            />

            <TextInput
                label="Website/URL"
                placeholder="https://localhost.com"
            />

            <DateTimeInput
                label="Start Time"
                placeholder="18/02/2025 10:10"
                required
                value={data?.start}
            />

            <DateTimeInput
                label="End Time"
                placeholder="18/02/2025 10:10"
                required
                value={data?.end}
            />

            <Button color="#000" mt={16}>Add Event</Button>
        </Modal>
    )
}