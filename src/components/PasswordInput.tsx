import { PasswordInput as MPassword, PasswordInputProps } from "@mantine/core";
import { forwardRef } from "react";


const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>((props, ref) => {
    return <MPassword {...props} ref={ref} />;
});

export default PasswordInput