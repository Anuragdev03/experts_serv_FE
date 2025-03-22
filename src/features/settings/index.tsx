import { Box, Button, Divider, Group, Modal, Paper } from "@mantine/core"
import "./styles/style.css"
import PasswordInput from "../../components/PasswordInput"
import { useState } from "react"
import { notify } from "../../utilities/helpers";
import { useDisclosure } from "@mantine/hooks";
import { deleteAccount, updateExpertPassword } from "./api/account";
import { useNavigate } from "react-router";
import { getAccessToken } from "../../api/refreshToken";
import { SubmitHandler, useForm } from "react-hook-form";

interface FormData {
    current_password: string;
    new_password: string;
    confirm_password: string;
}

export default function Settings() {
    const [password, setPassword] = useState("");
    const [opened, { open, close }] = useDisclosure(false);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, setError, reset } = useForm<FormData>({
        defaultValues: {
            current_password: "",
            new_password: "",
            confirm_password: ""
        }
    })

    function handleDelete() {
        if (!password) {
            notify("ERROR", "Password is required to delete password")
            return;
        }
        open()
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPassword(e.target.value)
    }

    async function confirmDelete() {
        const res = await deleteAccount(password);
        if (res === "Token has expired") {
            const token = await getAccessToken();
            if (token) confirmDelete();
        }
        if (res === "Please login again") {
            notify("ERROR", res);
            navigate("/login")
        }
        if (res.message === "Account deleted successfully") {
            notify("SUCCESS", "Account deleted successfully");
            navigate("/")
        }
    }

    const handlePasswordUpdate :SubmitHandler<FormData> = async (data) => {
        if(data.new_password !== data.confirm_password) {
            setError("confirm_password", {message: "New password and confirm password should be same"});
            return
        }

        const res = await updateExpertPassword(data.current_password, data.new_password);
        if (res === "Token has expired") {
            const token = await getAccessToken();
            if (token) handlePasswordUpdate(data);
        }
        if (res === "Please login again") {
            notify("ERROR", res);
            navigate("/login")
        }
        if(res.message === "Password changed successfully") {
            notify("SUCCESS", res.message)
            reset()
        }
    }
    return (
        <div className="settings-wrapper">
            <Box>
                <h3 className="settings-title">Settings</h3>
                <Paper shadow="sm" radius={8} className="settings-paper">
                    <p className="sub-title">Delete Account</p>
                    <PasswordInput
                        label="Password"
                        placeholder="Enter password to confirm delete"
                        value={password}
                        onChange={handleChange}
                    />
                    <Button size="xs" onClick={handleDelete} color="red" my={16}>Delete Account</Button>

                    <Divider mb={16} />
                    <p className="sub-title">Change Password</p>
                    <form onSubmit={handleSubmit(handlePasswordUpdate)}>
                        <PasswordInput
                            label="Current Password"
                            required
                            placeholder="Enter Current Password"
                            mb={12}
                            {...register("current_password", {
                                required: "Current is required",
                                minLength: { value: 12, message: "Password must be at least 12 characters" },
                            })}
                            error={errors.current_password ? errors.current_password?.message : ""}
                        />
                        <PasswordInput
                            label="New Password"
                            required
                            placeholder="Enter New Password"
                            mb={12}
                            {...register("new_password", {
                                required: "New Password is required",
                                minLength: { value: 12, message: "New Password must be at least 12 characters" },
                            })}
                            error={errors.new_password ? errors.new_password?.message : ""}
                        />
                        <PasswordInput
                            label="Confirm New Password"
                            required
                            placeholder="Confirm New Password"
                            mb={12}
                            {...register("confirm_password", {
                                required: "Confirm New Password is required",
                                minLength: { value: 12, message: "New Password must be at least 12 characters" },
                            })}
                            error={errors.confirm_password ? errors.confirm_password?.message : ""}
                        />

                        <Button type="submit" color="#000" size="xs">Update Password</Button>
                    </form>
                    <Modal onClose={close} opened={opened} title="Confirm Delete" centered>
                        <p className="delete-info-text">Are you sure you want to delete your account? This action is permanent and cannot be undone. All your data, including saved preferences and history, will be lost forever.

                            If you proceed, you will no longer have access to your account.</p>
                        <Group mt={16}>
                            <Button variant="outline" color="#000" onClick={close}>Cancel</Button>
                            <Button color="red" onClick={confirmDelete}>Confirm Delete</Button>
                        </Group>
                    </Modal>
                </Paper>
            </Box>
        </div>
    )
}