import { Box, Button, Group, Modal, Paper } from "@mantine/core"
import "./styles/style.css"
import PasswordInput from "../../components/PasswordInput"
import { useState } from "react"
import { notify } from "../../utilities/helpers";
import { useDisclosure } from "@mantine/hooks";
import { deleteAccount } from "./api/account";
import { useNavigate } from "react-router";
import { getAccessToken } from "../../api/refreshToken";

export default function Settings() {
    const [password, setPassword] = useState("");
    const [opened, { open, close }] = useDisclosure(false);
    const navigate = useNavigate();

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
        if(res.message === "Account deleted successfully") {
            notify("SUCCESS", "Account deleted successfully");
            navigate("/")
        }
    }
    return (
        <div className="settings-wrapper">
            <Box>
                <h3 className="settings-title">Settings</h3>
                <Paper shadow="sm" radius={8} className="settings-paper">
                    <p className="delete-title">Delete Account</p>
                    <PasswordInput
                        label="Password"
                        placeholder="Enter password to confirm delete"
                        value={password}
                        onChange={handleChange}
                    />
                    <Button onClick={handleDelete} color="red" my={16}>Delete Account</Button>

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