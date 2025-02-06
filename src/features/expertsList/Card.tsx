import { Button, Group, Paper, Tooltip } from "@mantine/core";
import "./styles/Card.css"
import React from "react";
import { calculateDistance } from "../../utilities/helpers";

interface Props {
    name: string;
    job_names: string;
    city: string;
    lat: string;
    lng: string;
}

function Card(props: Props) {
    const { name, job_names, city, lat, lng } = props;

    function calculateTheDistance() {
        const userLocation = localStorage.getItem("currentLocation");
        if (!lat || !lng) return "NA"
        if (userLocation) {
            const parsed = JSON.parse(userLocation);
            const distance = calculateDistance(Number(parsed.lat), Number(parsed.lon), Number(lat), Number(lng));
            if (distance) {
                return Math.round(distance/1000) + "KM"
            } else {
                return "NA"
            }
        } else {
            return "NA"
        }
    }
    return (
        <Paper shadow="xs" radius={8} className="card">
            <Group dir="row" justify="space-between" wrap="nowrap">
                <h3 className="text-ellipsis">{name}</h3>
                <Tooltip label="How Far Away"><p>{calculateTheDistance()}</p></Tooltip>
            </Group>
            <p className="card-email text-ellipsis">{job_names}</p>
            <p className="card-email text-ellipsis" style={{ fontSize: 12 }}>City: {city}</p>
            <Button variant="light" my={8} color="#000" size="xs">View Profile</Button>
            <Button color="#000" size="xs">Request Service</Button>
        </Paper>
    )
}

export default React.memo(Card)