import { Box, Button, Divider, Group, Paper } from "@mantine/core";
import "./styles/style.css"
import Calendar from "./Calendar";
import { IoAddSharp } from "react-icons/io5";
import { useDisclosure } from "@mantine/hooks";
import AddEvent from "./modals/AddEvent";
import {  useState } from "react";
import { eventDate, monthAndYear } from "../../utilities/dates";
import { getEventList } from "./api/events";
import { getAccessToken } from "../../api/refreshToken";

export default function Events() {
    const [opened, { open, close }] = useDisclosure(false);
    const [events, setEvents] = useState([]);


    async function fetchEvents() {
        const currDate = new Date();

        const supportedFormat = monthAndYear(currDate);
        let start = supportedFormat + "-01";
        let end = supportedFormat + "-28";
        const list = await getEventList(start, end);
        if (list === "Token has expired") {
            const token = await getAccessToken();
            if (token) fetchEvents();
        }
        const data = list?.data;

        if(data) {
            const formattedEvents = data.map((event: any) => ({
                id: event.id,
                title: event.title,
                start: event.start_date, 
                end: event.end_date,
                allDay: event.all_day === "true" ? true : false,
                description: event.description,
                link: event.link
              }));
            
            setEvents(formattedEvents)
        }

        if(list?.message === "No Data Found!") {
            setEvents([]);
        }
    }

    async function fetchEventsByArg(start: string | Date, end: string | Date) {
        let date1 = eventDate(start);
        let date2 = eventDate(end);

        const list = await getEventList(date1, date2);
        if (list === "Token has expired") {
            const token = await getAccessToken();
            if (token) fetchEventsByArg(start, end);
        }

        if(list?.message === "No Data Found!") {
            setEvents([]);
            return;
        }
        const data = list?.data;
        const formattedEvents = data.map((event: any) => ({
            id: event.id,
            title: event.title,
            start: event.start_date, 
            end: event.end_date,
            allDay: event.all_day === "true" ? true : false,
            description: event.description,
            link: event.link
          }));
        
        setEvents(formattedEvents)
    }


    return (
        <Box className="t-wrapper">
            <Paper shadow="sm" radius={8}>
                <h6 className="page-head">Events</h6>
                <Group mx={8}>
                    <Button onClick={open} leftSection={<IoAddSharp size={14} />} size="xs" variant="outline" className="e-links">Add Events</Button>
                </Group>
                <Divider my={8} />
                <Calendar events={events} fetchEvents={fetchEventsByArg} />

                {/* Add Modal */}
                <AddEvent
                    opened={opened}
                    close={close}
                    fetchEvents={fetchEvents}
                />
            </Paper>
        </Box>
    )
}