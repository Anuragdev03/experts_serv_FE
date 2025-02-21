import { Box } from "@mantine/core";
import { DateSelectArg, DatesSetArg, EventChangeArg, EventClickArg, formatDate } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import AddEvent from "./modals/AddEvent";

interface EventData {
    allDay?: boolean;
    start?: Date;
    end?: Date;
}

interface Props {
    events: Array<any>;
    fetchEvents: (start: string | Date, end: string | Date) => void
}

export default function Calendar(props: Props) {
    const { events, fetchEvents } = props;
    const [weekendsVisible, setWeekendVisible] = useState(true);
    const [eventData, setEventData] = useState<EventData | null>(null);
    const [opened, { open, close }] = useDisclosure(false);

    function handleWeekendVisibility() {
        setWeekendVisible(!weekendsVisible)
    }

    function handleDateSelect(arg: DateSelectArg) {
        console.log(arg);
        setEventData({
            allDay: arg.allDay,
            start: arg.start,
            end: arg.end
        })
        open()
    }

    function handleEventClick(arg: EventClickArg) {
        console.log(arg)
    }

    function handleHeaderButtonClicks(arg: DatesSetArg) {
        console.log(arg);
        fetchEvents(arg.start, arg.end)
    }

    function handleDragAndDropEvent(e: EventChangeArg) {
        const start = e.event.start;
        const end = e.event.end;
        console.log(start, end);
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
            />
        </Box>
    )
}