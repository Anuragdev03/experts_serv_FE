import { Anchor, Box, Button, Center, Checkbox, Group, Paper } from "@mantine/core";
import "./style.css"
import { useNavigate } from "react-router";
import { TiArrowLeft } from "react-icons/ti";
import TextInput from "../../components/TextInput";
import PasswordInput from "../../components/PasswordInput";
import { useAuth } from "../../authProvider/AuthProvider";
import { useEffect, useState } from "react";
import { loginToAccount } from "./api/login";
import useEncryption from "../../hooks/useEncryption";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isChecked, setIsChecked] = useState(false);
    const { encrypt, decrypt } = useEncryption()

    const { storeToken } = useAuth();
    const goToSignup = () => navigate("/signup");

    const gotoForgotPassword = () => navigate("/forgot-password")

    const gotToHome = () => navigate("/");

    function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
        setEmail(event.currentTarget.value)
    }

    function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        setPassword(event.currentTarget.value)
    }

    function handleCheckBox(event: React.ChangeEvent<HTMLInputElement>) {
        setIsChecked(event.currentTarget.checked)
    }

    async function handleLogin() {
        const body = {
            email: email,
            password: password
        }

        const res = await loginToAccount(body);

        if(res?.token) {
            storeToken(res.token?.accessToken, res?.data);
            if(isChecked) {
                localStorage.setItem("email", email);
                const encryptedPassword = await encrypt(password);
                localStorage.setItem("enKey", `${encryptedPassword}`)
                localStorage.setItem("rememberMe", "true");
                navigate("/dashboard");
            } else {
                localStorage.setItem("email", "");
                localStorage.setItem("enKey", "");
                localStorage.setItem("rememberMe", "");
                navigate("/dashboard");
            }
        }

    }

    async function preFillFields() {
        let email = localStorage.getItem("email")
        const rememberMe = localStorage.getItem("rememberMe");
        const encryptedThing = localStorage.getItem("enKey");

        if(email) {
            setEmail(email)
        }
        if(rememberMe === "true") {
            setIsChecked(true)
        }
        if(encryptedThing) {
            const decryptedThing = await decrypt(encryptedThing) as string;
            decryptedThing && setPassword(decryptedThing)
        }
        
    }

    useEffect(() => {
        preFillFields()
    }, [])
    return (
        <Box className="login-container">
            <Box>
                <h1 className="login-header">Welcome back!</h1>
                <p className="header-description">Don't have an account yet? <br/> <Anchor onClick={goToSignup} size="sm" component="button">
                    Create account
                </Anchor></p>

                <Paper withBorder shadow="md" p={30} mt={30} radius="md" mx={12}>
                    <TextInput value={email} label="Email" placeholder="you@email.com" required onChange={handleEmailChange} />
                    <PasswordInput value={password} label="Password" placeholder="Your password" required mt="md" onChange={handlePasswordChange} />
                    <Group justify="space-between" mt="lg">
                        <Checkbox checked={isChecked} label="Remember me" onChange={handleCheckBox} />
                        <Anchor component="button" size="sm" onClick={gotoForgotPassword}>
                            Forgot password?
                        </Anchor>
                    </Group>
                    <Button fullWidth mt="xl" onClick={handleLogin}>
                        Sign in
                    </Button>
                    <Anchor c="dimmed" size="sm" onClick={gotToHome}>
                        <Center inline my={8}>
                            <TiArrowLeft size={16} />
                            <Box ml={5}>Back to the Home page</Box>
                        </Center>
                    </Anchor>
                </Paper>
            </Box>
        </Box>
    )
}