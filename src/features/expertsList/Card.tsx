import { Button, Paper } from "@mantine/core";
import "./styles/Card.css"


export default function Card() {
    return (
        <Paper shadow="xs" radius={8} className="card">
            <h3>Anurag D</h3>
            <p className="card-email">Electrician</p>
            <Button variant="light" my={8} color="#000" size="xs">View Profile</Button>
            <Button color="#000" size="xs">Request Service</Button>
        </Paper>
    )
}