import { Box, Button, Divider, Group, Modal, Switch } from "@mantine/core";
import { formatDate } from "../../../utilities/dates";
import { useEffect, useState } from "react";
import { deleteEvent, updateEvent } from "../api/events";
import { getAccessToken } from "../../../api/refreshToken";
import { notify } from "../../../utilities/helpers";
import { useNavigate } from "react-router";
import TextInput from "../../../components/TextInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { DateValue } from "@mantine/dates";
import DateTimeInput from "../../../components/DateTimeInput";

interface EventData {
    id: string;
    allDay?: boolean;
    start: Date  | DateValue;
    end: Date | DateValue;
    title: string;
    description?: string;
    link?: string;
}

interface Props {
    opened: boolean;
    close: () => void;
    data: EventData | null;
    fetchEvents?: () => void;
}

export interface FormState {
    title: string;
    description?: string;
    link?: string;
}

export default function EditEvent(props: Props) {
    const { opened, close, data, fetchEvents } = props;
    const navigate = useNavigate();
    const [modalState, setModalState] = useState({
        viewMode: true,
        deleteMode: false,
        editMode: false
    })
    const [startDate, setStartDate] = useState<Date | undefined | DateValue>();
    const [endDate, setEndDate] = useState<Date | undefined | DateValue>();
    const [isAllDayEvent, setIsAllDayEvent] = useState(false)
    const { handleSubmit, register, setValue } = useForm<FormState>();


    let startDateValue = data?.start ? formatDate(data?.start) : null
    let endDateValue = data?.end ? formatDate(data?.end) : null;

    function handleDeleteButtonClick() {
        setModalState({
            viewMode: false,
            deleteMode: true,
            editMode: false
        })
    }

    function cancelDelete() {
        setModalState({
            viewMode: true,
            deleteMode: false,
            editMode: false
        })
    }

    async function confirmDelete() {
        if (!data?.id) return;
        const res = await deleteEvent(data?.id);

        if (res === "Please login again") {
            navigate("/login");
            notify("INFO", "Please login again");
        }

        if (res === "Token has expired") {
            const token = await getAccessToken();
            if (token) confirmDelete();
        }
        if (res?.message === "Event deleted successfully") {
            notify("SUCCESS", res.message);
            fetchEvents && fetchEvents();
            close()
        }

    }

    function resetToDefault() {
        setModalState({
            viewMode: true,
            deleteMode: false,
            editMode: false
        })
        setValue("title", "");
        setValue("description", "");
        setValue("link", "");
    }

    useEffect(() => {
        resetToDefault();
    }, [opened]);

    useEffect(() => {
        if(data?.id) prefillData()
    }, [modalState.editMode])

    function handleEditClick() {
        setModalState({
            viewMode: false,
            deleteMode: false,
            editMode: true
        })
    }

    const confirmUpdate: SubmitHandler<FormState> = async (formData) => {
        if(!data?.id) {
            notify("INFO", "Something went wrong please try again");
            return
        }
        let payload: any = { id: data.id};
        if(formData.title) {
            payload = {...payload, title: formData.title}
        }
        if(formData.description) {
            payload = {...payload, description: formData.description}
        }
        if(formData.link) {
            payload = {...payload, link: formData.link}
        }
        if(startDate) {
            payload = {...payload, start_date: startDate}
        }
        if(endDate) {
            payload = {...payload, end_date: endDate }
        }
        payload={...payload, all_day: isAllDayEvent};

        const res = await updateEvent(payload);

        if (res === "Please login again") {
            navigate("/login");
            notify("INFO", "Please login again");
        }

        if (res === "Token has expired") {
            const token = await getAccessToken();
            if (token) confirmUpdate(formData);
        }

        if(res?.message === "Event updated successfully") {
            notify("SUCCESS", res?.message);
            close();
            fetchEvents && fetchEvents()
        }
    }

    function handleStartDate(date: DateValue) {
        setStartDate(date)
    }

    function handleEndDate(date: DateValue) {
        setEndDate(date)
    }

    function prefillData() {
        if(data?.id) {
            if(data?.title) {
                setValue("title", data.title)
            }
            if(data?.description) {
                setValue("description", data.description)
            }
            if(data?.link) {
                setValue("link", data.link)
            }
            if(data?.start) {
                setStartDate(data.start)
            }
            if(data?.end) {
                setEndDate(data.end)
            }
            if(data?.allDay === true) {
                setIsAllDayEvent(data.allDay)
            } else if(data?.allDay === false) {
                setIsAllDayEvent(data.allDay)
            }
        }
    }

    function handleSwitch() {
        setIsAllDayEvent(!isAllDayEvent)
    }

    const viewData = (
        <Box>
            <p className="view-event-details" style={{ fontWeight: 600 }}>{data?.title}</p>
            <p className="view-event-details">Start Time: {startDateValue?.toString()}</p>
            <p className="view-event-details">End Time: {endDateValue?.toString()}</p>
            {data?.description ? <p className="view-event-details">Description:{data?.description}</p> : null}
            {data?.link ? <p className="view-event-details">Link:{data?.link}</p> : null}
            <p className="view-event-details">All Day Event:{data?.allDay ? "Yes" : "No"}</p>

            <Group gap={16}>
                <Button color="#FF0000" onClick={handleDeleteButtonClick}>Delete</Button>
                <Button color="#000" onClick={handleEditClick}>Edit</Button>
            </Group>
        </Box >
    )

    const deleteMode = (
        <Box>
            <p color="black">Are you sure to delete the event?</p>
            <Group>
                <Button color="#000" variant="outline" onClick={cancelDelete}>No</Button>
                <Button color="#FF0000" onClick={confirmDelete}>Yes</Button>
            </Group>
        </Box>
    )

    const editMode = (
        <Box>
            <form onSubmit={handleSubmit(confirmUpdate)}>
                <TextInput label="Title" {...register("title")} />

                <TextInput label="Description" {...register("description")} />

                <TextInput label="Link" {...register("link")} />

                <DateTimeInput
                    label="Start Time"
                    placeholder="18/02/2025 10:10"
                    value={startDate}
                    onChange={handleStartDate}
                />

                <DateTimeInput
                    label="End Time"
                    placeholder="18/02/2025 10:10"
                    value={endDate}
                    onChange={handleEndDate}
                />

                <Switch
                    label="Is All Day Event"
                    checked={isAllDayEvent}
                    mt={16}
                    onChange={handleSwitch}
                />

                <Group mt={16}>
                    <Button color="#000" variant="outline" onClick={cancelDelete}>Cancel</Button>
                    <Button color="#000" type="submit">Update</Button>
                </Group>
            </form>

        </Box>
    )


    return (
        <Modal shadow="xs" opened={opened} onClose={close} title="Edit Event" centered>
            <Divider />
            {modalState.viewMode ? viewData : null}
            {modalState.deleteMode ? deleteMode : null}
            {modalState.editMode ? editMode : null}
        </Modal>
    )
}