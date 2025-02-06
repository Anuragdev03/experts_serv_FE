import { Anchor, Box, Button, Center, Group, Paper } from "@mantine/core";
import "./styles/style.css";
import TextInput from "../../components/TextInput";
import { useEffect, useState } from "react";
import { getLocation, notify } from "../../utilities/helpers";
import { TiArrowLeft } from "react-icons/ti";
import { useNavigate } from "react-router";

type FieldType = "name" | "email" | "phone";

export default function CustomerProfile() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [number, setNumber] = useState("");
    const navigate = useNavigate();
    const locationData = localStorage.getItem("currentLocation");
    const parsedLocationData = locationData ? JSON.parse(locationData) : { lat: 0, lon: 0 };

    const [triggerEffect, setTriggerEffect] = useState(0);

    function handleChange(type: FieldType, event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.currentTarget.value;
        if (type === "name") {
            setName(value)
        } else if (type === "email") {
            setEmail(value);
        } else if (type === "phone") {
            setNumber(value)
        }

    }

    function handleSave() {
        if (name) {
            localStorage.setItem("customer_name", name);
        }
        if (email) {
            localStorage.setItem("customer_email", email)
        }
        if (number) {
            localStorage.setItem("customer_phone", number)
        }
        notify("SUCCESS", "Data saved successfully!")
    }

    function prefillData() {
        const name = localStorage.getItem("customer_name");
        const email = localStorage.getItem("customer_email");
        const phone = localStorage.getItem("customer_phone");
        if (name) {
            setName(name)
        }
        if (email) {
            setEmail(email)
        }
        if (phone) {
            setNumber(phone)
        }
    }

    useEffect(() => {
        prefillData()
    }, [])

    const goBack = () => navigate(-1);

    async function getUserLocation() {
        const res = await getLocation();
        if (typeof (res) === "string") return
        localStorage.setItem("currentLocation", JSON.stringify(res));
        setTriggerEffect(triggerEffect+1)
    }

    return (
        <div className="profile-container">
            <div>
                <h2 className="profile-header">Edit Profile</h2>
                <p>Data will be stored in your browser!</p>

                <Paper withBorder shadow="md" p={30} mt={30} radius="md" mx={12}>
                    <TextInput
                        value={name}
                        label="Name"
                        placeholder="Your Name"
                        onChange={(e) => handleChange("name", e)}
                    />
                    <TextInput
                        value={email}
                        label="Email"
                        placeholder="you@gmail.com"
                        onChange={(e) => handleChange("email", e)}
                    />
                    <TextInput
                        value={number}
                        label="Mobile"
                        placeholder="+91 98xxx xxxxx"
                        onChange={(e) => handleChange("phone", e)}
                    />
                    <Group mt={12} justify="space-between">
                        <p style={{ fontSize: 14, textDecoration: "underline" }}>Location info</p>
                        <Anchor variant="light" size="xs" onClick={getUserLocation}>Update location</Anchor>
                    </Group>

                    <p className="location-data">Latitude: {parsedLocationData?.lat}</p>
                    <p className="location-data">Longitude: {parsedLocationData?.lon}</p>
                    <Button mt={12} w={"100%"} onClick={handleSave}>Save</Button>

                    <Anchor c="dimmed" size="sm" onClick={goBack}>
                        <Center inline my={8}>
                            <TiArrowLeft size={16} />
                            <Box ml={5}>Back</Box>
                        </Center>
                    </Anchor>
                </Paper>
            </div>
        </div>
    )
}