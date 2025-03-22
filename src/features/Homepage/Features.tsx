import { Box, Group } from "@mantine/core";
import "./styles/features.css";

// Icons
import expertSearch from "./assets/expert-search.webp";
import dashboard from "./assets/dashboard.webp";
import customerReq from "./assets/customer-request.webp";
import tasks from "./assets/tasks.webp";
import eventImg from "./assets/events.webp"

export default function Features() {
    return (
        <Box id="features" className="feature-container">
            <Box>
                <h2 className="feature-title">Features</h2>

                <Group wrap="nowrap" my={16}>
                    <Box>
                        <img className="feature-img" src={expertSearch} />
                    </Box>
                    <Box style={{ alignSelf: "flex-start" }}>
                        <p className="feature-sub-title">Expert Search</p>
                        <p className="feature-description" ><span className="highlight-text">Search for Experts</span> using multiple criteria such as location, state, country, city, and distance to find the most relevant professionals.</p>
                        <p className="feature-description"><span className="highlight-text">Request Appointments</span> with selected experts, making it easy to schedule consultations or services</p>
                        <p className="feature-description"><span className="highlight-text">Track Appointment Requests</span> in real time, ensuring transparency and updates on the request status</p>
                    </Box>
                </Group>

                <Group wrap="nowrap" my={16}>
                    <Box>
                        <img className="feature-img" src={dashboard} />
                    </Box>
                    <Box style={{ alignSelf: "flex-start" }}>
                        <p className="feature-sub-title">Expert Dashboard</p>
                        <p className="feature-description">The Expert Dashboard provides a centralized view where experts can efficiently manage their workflow.</p>
                        <p className="feature-description">Experts can view their task list, event list, and pending requests.</p>
                    </Box>
                </Group>

                <Group wrap="nowrap" my={16}>
                    <Box>
                        <img className="feature-img" src={customerReq} />
                    </Box>
                    <Box style={{ alignSelf: "flex-start" }}>
                        <p className="feature-sub-title">Customer Requests</p>
                        <p className="feature-description">Experts can view and manage customer requests efficiently.</p>
                        <p className="feature-description"><span className="highlight-text">View Customer Requests</span> – Access all incoming appointment requests.</p>
                        <p className="feature-description"><span className="highlight-text">Respond to Customers</span> – Communicate directly and provide necessary information.</p>
                        <p className="feature-description"><span className="highlight-text">Accept Appointments</span> – Confirm and schedule appointments as per availability.</p>
                    </Box>
                </Group>

                <Group wrap="nowrap" my={16}>
                    <Box>
                        <img className="feature-img" src={tasks} />
                    </Box>
                    <Box style={{ alignSelf: "flex-start" }}>
                        <p className="feature-sub-title">Tasks</p>
                        <p className="feature-description">The Tasks feature allows experts to manage their work efficiently.</p>
                        <p className="feature-description"><span className="highlight-text">View Task List</span> – Access all assigned tasks in one place.</p>
                        <p className="feature-description"><span className="highlight-text">Track Progress</span> – Update and monitor the status of each task.</p>
                        <p className="feature-description"><span className="highlight-text">Manage Deadlines</span> – Ensure timely completion of tasks.</p>
                    </Box>
                </Group>

                <Group wrap="nowrap" my={16}>
                    <Box>
                        <img className="feature-img" src={eventImg} />
                    </Box>
                    <Box style={{ alignSelf: "flex-start" }}>
                        <p className="feature-sub-title">Events</p>
                        <p className="feature-description">The Events feature helps experts stay updated with their scheduled activities. </p>
                        <p className="feature-description"><span className="highlight-text">View Event List </span> –  Access all upcoming events in one place.</p>
                        <p className="feature-description"><span className="highlight-text">Track Schedules</span> – Stay informed about important meetings and appointments.</p>
                        <p className="feature-description"><span className="highlight-text">Manage Availability</span> – Plan and organize their time effectively.</p>
                    </Box>
                </Group>
            </Box>
        </Box>
    )
}