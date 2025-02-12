import { Box, Button, Divider, Group, Paper } from "@mantine/core";
import Header from "./Header";
import "./styles/style.css"
import TextInput from "../../components/TextInput";
import TextArea from "../../components/TextArea";
import { useNavigate } from "react-router";
import { useForm, SubmitHandler } from "react-hook-form";

interface FormData {
    name: string;
    email: string;
    phone: string;
    description: string;
}

export default function RequestScreen() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, } = useForm<FormData>({
        defaultValues: {
            name: localStorage.getItem("customer_name") || "",
            email: localStorage.getItem("customer_email") || "",
            phone: localStorage.getItem("customer_phone") || ""
        }
    })

    const goBack = () => navigate(-1);


    const sendRequest: SubmitHandler<FormData> = async (data) => {
        console.log(data);
    }

    return (
        <Box>
            <Header />
            <Box className="rs-wrapper">
                <Paper shadow="xs" radius={8} className="rs-paper">
                    <h3 className="rs-title">Appointment Request</h3>
                    <Divider />
                    <Box style={{ padding: "2rem" }}>
                        <form onSubmit={handleSubmit(sendRequest)}>
                            <TextInput
                                label="Name"
                                required
                                {...register("name", { required: "Name is required" })}
                                mb={12}
                                error={errors.name ? errors.name.message : ""}
                            />
                            <TextInput
                                label="Email"
                                required
                                {...register("email", {
                                    required: "Name is required", pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                        message: "Invalid email address",
                                    },
                                })}
                                mb={12}
                                error={errors.email ? errors.email.message : ""}
                            />
                            <TextInput
                                label="Phone"
                                required
                                {...register("phone", { required: "Name is required" })}
                                mb={12}
                                error={errors.phone ? errors.phone.message : ""}
                            />
                            <TextArea
                                label="Explain Your Requirement"
                                resize="vertical"
                                required
                                {...register("description", { required: "Name is required" })}
                                mb={12}
                                error={errors.description ? errors.description.message : ""}
                            />
                            <p className="gray" style={{fontSize: "10px"}}>(Max length 1000 letters)</p>
                            <Group my={16} justify="center">
                                <Button color="#000" variant="outline" onClick={goBack}>Cancel</Button>
                                <Button color="#000" type="submit">Send Request</Button>
                            </Group>
                        </form>
                    </Box>
                </Paper>
            </Box>
        </Box>
    )
}