import { Box } from "@mantine/core";
import { DateSelectArg, DatesSetArg, EventChangeArg, EventClickArg } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import AddEvent from "./modals/AddEvent";
import EditEvent from "./modals/EditEvent";
import { updateEvent } from "./api/events";
import { useNavigate } from "react-router";
import { notify } from "../../utilities/helpers";
import { getAccessToken } from "../../api/refreshToken";

interface EventData {
    allDay?: boolean;
    start?: Date;
    end?: Date;
}

interface Props {
    events: Array<any>;
    fetchEvents: (start: string | Date, end: string | Date) => void
}

interface initialDate {
    startDate: Date | null;
    endDate: Date | null
}

interface SelectedEvent {
    id: string;
    allDay?: boolean;
    start: Date;
    end: Date;
    title: string;
    description?: string;
    link?: string;
}

export default function Calendar(props: Props) {
    const { events, fetchEvents } = props;
    const navigate = useNavigate()
    const [weekendsVisible, setWeekendVisible] = useState(true);
    const [eventData, setEventData] = useState<EventData | null>(null);
    const [opened, { open, close }] = useDisclosure(false);
    const [initialDate, setInitialDate] = useState<initialDate>({
        startDate: null,
        endDate: null
    });
    const [selectedEvent, setSelectedEvent] = useState<SelectedEvent | null>(null);
    const [editModalStatus, handleEventEdit] = useDisclosure(false);

    function handleWeekendVisibility() {
        setWeekendVisible(!weekendsVisible)
    }

    function handleDateSelect(arg: DateSelectArg) {
        setEventData({
            allDay: arg.allDay,
            start: arg.start,
            end: arg.end
        })
        open()
    }

    function handleEventClick(arg: EventClickArg) {
        if (!arg.event.start) return;
        if (!arg.event.end) return;
        const payLoad = {
            id: arg.event.id,
            title: arg.event.title,
            start: arg.event.start,
            end: arg.event.end,
            allDay: arg.event.allDay,
            description: arg.event.extendedProps?.description,
            link: arg.event.extendedProps?.link
        }
        setSelectedEvent(payLoad);
        handleEventEdit.open();
    }

    function handleHeaderButtonClicks(arg: DatesSetArg) {
        fetchEvents(arg.start, arg.end)
        setInitialDate({ startDate: arg.start, endDate: arg.end })
    }

    async function handleDragAndDropEvent(e: EventChangeArg) {
        const start = e.event.start;
        const end = e.event.end;
        const event_id = e.event.id;

        if (!event_id || !start || !end) {
            return
        }

        const payload = {
            id: event_id,
            start_date: start,
            end_date: end
        }
        const res = await updateEvent(payload);
        if (res === "Please login again") {
            navigate("/login");
            notify("INFO", "Please login again");
        }

        if (res === "Token has expired") {
            const token = await getAccessToken();
            if (token) handleDragAndDropEvent(e);
        }

        if (res?.message === "Event updated successfully") {
            notify("SUCCESS", res?.message);
        }
    }

    function fetchEventApiCall() {
        if (initialDate.startDate && initialDate.endDate)
            fetchEvents(initialDate.startDate, initialDate.endDate)
    }


    return (
        <Box px={16} className="t-calendar">

            <FullCalendar
                height={600}
                eventColor={"#000"}
                nowIndicator={true}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                    left: 'prev,next today',
                    right: 'dayGridMonth,timeGridFourDay,timeGridWeek,timeGridDay,hideWeekends',
                }}
                views={{
                    timeGridFourDay: {
                        type: 'timeGrid',
                        duration: { days: 3 },
                        buttonText: '3 Day View',
                    }
                }}
                customButtons={{
                    hideWeekends: {
                        text: weekendsVisible ? "Hide Weekends" : "Show Weekends",
                        click: handleWeekendVisibility
                    }
                }}
                initialView="timeGridFourDay"
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={weekendsVisible}
                select={handleDateSelect}
                datesSet={handleHeaderButtonClicks}
                events={events}
                eventClick={handleEventClick}
                eventChange={handleDragAndDropEvent}
            // initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
            // eventContent={renderEventContent} // custom render function
            // eventClick={handleEventClick}
            // eventsSet={handleEvents} // called after events are initialized/added/changed/removed
            /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
            />

            {/* Add Modal */}
            <AddEvent
                opened={opened}
                close={close}
                data={eventData}
                fetchEvents={fetchEventApiCall}
            />

            {/* Edit/View/Delete Event */}
            <EditEvent
                opened={editModalStatus}
                close={handleEventEdit.close}
                data={selectedEvent}
                fetchEvents={fetchEventApiCall}
            />
        </Box>
    )
}