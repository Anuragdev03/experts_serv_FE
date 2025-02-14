import { Box, Button, Divider, Group, Modal, Paper } from "@mantine/core";
import Header from "./Header";
import "./styles/style.css"
import TextInput from "../../components/TextInput";
import TextArea from "../../components/TextArea";
import { useNavigate, useParams } from "react-router";
import { useForm, SubmitHandler } from "react-hook-form";
import { copyToClipboard, notify } from "../../utilities/helpers";
import { sendCustomerRequest } from "./api/sendRequest";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { baseUrl } from "../../api/Client";

interface FormData {
    name: string;
    email: string;
    phone: string;
    description: string;
}

export default function RequestScreen() {
    const navigate = useNavigate();
    const params = useParams();
    const [trackingLink, setTrackingLink] = useState("");
    const [opened, { open, close }] = useDisclosure(false);
    const [copy, setCopy] = useState("");

    const { register, handleSubmit, formState: { errors }, } = useForm<FormData>({
        defaultValues: {
            name: localStorage.getItem("customer_name") || "",
            email: localStorage.getItem("customer_email") || "",
            phone: localStorage.getItem("customer_phone") || ""
        }
    })
    console.log(params)
    const goBack = () => navigate(-1);


    const sendRequest: SubmitHandler<FormData> = async (data) => {
        const user_name = params?.user_name;
        if (!user_name) {
            notify("ERROR", "Expert Not found");
            return;
        }
        const payLoad = {
            user_name,
            customer_email: data.email,
            customer_name: data.name,
            customer_phone: data.phone,
            message: data.description
        }

        const res = await sendCustomerRequest(payLoad);
        if (res.message === "Request sent successfully") {
            notify("SUCCESS", res.message);
            setTrackingLink(res?.trackingLink);
            open();
        } else {
            notify("ERROR", res.slice(5))
        }
        console.log(res)
    }

    function copyTrackingLink() {
        copyToClipboard(trackingLink)
        setCopy("Copied");

        setTimeout(() => {
            setCopy("")
        }, 3000)
    }

    function openTrackingLink() {
        navigate(`/track/${trackingLink}`)
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
                            <p className="gray" style={{ fontSize: "10px" }}>(Max length 1000 letters)</p>
                            <Group my={16} justify="center">
                                <Button color="#000" variant="outline" onClick={goBack}>Cancel</Button>
                                <Button color="#000" type="submit">Send Request</Button>
                            </Group>
                        </form>
                        <Modal centered opened={opened} onClose={close} title="Tracking Link">
                            <Divider />
                            <p className="modal-desc">You can track the expert's response using this tracking link</p>
                            <p className="clicktocopy">Click to copy</p>
                            <p onClick={copyTrackingLink} className="tracking-code">{trackingLink}</p>
                            <p className="copy-info">{copy}</p>
                            <p className="gray OR">(OR)</p>
                            <a onClick={openTrackingLink} className="tracking-link">{baseUrl}/track/{trackingLink}</a>
                        </Modal>
                    </Box>
                </Paper>
            </Box>
        </Box>
    )
}