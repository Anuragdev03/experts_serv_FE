import { Anchor, Box, Button, Center, Checkbox, Group, Paper, Progress, Text } from "@mantine/core";
import "./style.css";
import { TiArrowLeft } from "react-icons/ti";
import { useNavigate } from "react-router";
import { SubmitHandler, useForm } from "react-hook-form";
import { useInputState } from "@mantine/hooks";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import TextInput from "../../components/TextInput";
import PasswordInput from "../../components/PasswordInput";
import { createAccount } from "./api/signup";
import { notify } from "../../utilities/helpers";
import { useAuth } from "../../authProvider/AuthProvider";

interface FormData {
    name: string;
    user_name: string;
    email: string;
    password: string;
    retypePassword: string;
    mobile_number: string;
    terms: boolean;
}

export default function SignUp() {
    const navigate = useNavigate();
    const { storeToken } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setError
    } = useForm<FormData>({
        defaultValues: {
            name: "",
            user_name: "",
            email: "",
            password: "",
            retypePassword: "",
            mobile_number: "",
            terms: false
        }
    });
    const reTypePwd = watch("retypePassword");

    const gotToHome = () => navigate("/");

    const goToSignin = () => navigate("/login");
    const [value, setValue] = useInputState('');

    const requirements = [
        { re: /[0-9]/, label: 'Includes number' },
        { re: /[a-z]/, label: 'Includes lowercase letter' },
        { re: /[A-Z]/, label: 'Includes uppercase letter' },
        { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
    ];

    const strength = getStrength(value);

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const body = {
            name: data.name,
            user_name: data.user_name,
            email: data.email,
            password: data.password,
            mobile_number: data.mobile_number,
            role: "expert"
        }

        const res = await createAccount(body);
        if (res?.token) {
            notify(
                "SUCCESS",
                "Your account has been created. Please complete your profile.",
                "Welcome aboard!"
            )
            storeToken(res?.token?.accessToken, res?.data);
            navigate("/dashboard")
        } else {
            let err = res?.response?.data?.message;
            if (err) {
                notify(
                    "ERROR",
                    err,
                    "Error"
                )
                if (err === "User name already exists") {
                    setError("user_name", { message: "Already exists" }, { shouldFocus: true })
                }
                if (err === "Email already exists") {
                    setError("email", { message: "Already exists" }, { shouldFocus: true })
                }
                if (err === "Mobile number already exists") {
                    setError("mobile_number", { message: "Already exists" }, { shouldFocus: true })
                }
            }
        }
    };

    function getStrength(password: string) {
        let multiplier = password.length > 11 ? 0 : 1;

        requirements.forEach((requirement) => {
            if (!requirement.re.test(password)) {
                multiplier += 1;
            }
        });

        return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 0);
    }

    function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
        return (
            <Text component="div" c={meets ? 'teal' : 'red'} mt={5} size="sm">
                <Center inline>
                    {meets ? <FaCheck size={14} /> : <RxCross2 size={14} />}
                    <Box ml={7}>{label}</Box>
                </Center>
            </Text>
        );
    }

    const bars = Array(4)
        .fill(0)
        .map((_, index) => (
            <Progress
                styles={{ section: { transitionDuration: '0ms' } }}
                value={
                    value.length > 0 && index === 0 ? 100 : strength >= ((index + 1) / 4) * 100 ? 100 : 0
                }
                color={strength > 80 ? 'teal' : strength > 50 ? 'yellow' : 'red'}
                key={index}
                size={4}
            />
        ));

    const checks = requirements.map((requirement, index) => (
        <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(value)} />
    ));


    return (
        <Box className="signup-container">
            <Box>
                <h2 className="login-header">Create Your Free Account!</h2>
                <p className="header-description">Already have an account? <Anchor onClick={goToSignin} size="sm" component="button">
                    Login
                </Anchor></p>

                <Paper withBorder shadow="md" p={30} mt={30} radius="md" mx={12} mb={16}>
                    <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
                        <TextInput
                            label="Name"
                            placeholder="John Doe"
                            required {...register("name", { required: "Name is required" })}
                            error={errors.name ? errors.name.message : ""}
                            mb={12}
                        />

                        <TextInput
                            label="User Name"
                            placeholder="johndoe_03"
                            required
                            {...register("user_name", { required: "User name is required" })}
                            error={errors.user_name ? errors.user_name.message : ""}
                            mb={12}
                        />

                        <TextInput
                            label="Email"
                            placeholder="you@email.com"
                            required
                            error={errors.email ? errors.email.message : ""}
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: "Invalid email address",
                                },
                            })}
                            mb={12}
                        />
                        <TextInput
                            label="Mobile Number"
                            placeholder="+91 99999 xxxxx"
                            required
                            error={errors.mobile_number ? errors.mobile_number.message : ""}
                            {...register("mobile_number", {
                                required: "Mobile Number is required",
                            })}
                            mb={12}
                        />
                        <Box>
                            <PasswordInput
                                label="Password"
                                placeholder="Your password"
                                required mb={12}
                                error={errors.password ? errors.password?.message : ""}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 12, message: "Password must be at least 12 characters" },
                                })}
                                onChange={setValue}
                            />

                            <Group gap={5} grow mt="xs" mb="md">
                                {bars}
                            </Group>

                            <PasswordRequirement label="Has at least 12 characters" meets={value.length > 11} />
                            {checks}
                        </Box>
                        <Box>
                            <PasswordInput
                                label="Re-type Password"
                                placeholder="*******"
                                required
                                mb={12}
                                error={errors.retypePassword ? errors.retypePassword?.message : ""}
                                {...register("retypePassword", {
                                    required: "Password is required",
                                    minLength: { value: 12, message: "Password and re-type password should be same" },
                                })}
                            />
                            <PasswordRequirement label="Passwords must match." meets={value === reTypePwd && reTypePwd.length > 11} />
                        </Box>

                        <Group justify="space-between" mt="lg">
                            <Checkbox required {...register("terms", { required: true })} />
                            <Anchor component="button" size="xs" type="button">
                                I agree to the terms of service
                            </Anchor>
                        </Group>
                        <Button fullWidth mt={8} type="submit">
                            Sign up
                        </Button>
                    </form>
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