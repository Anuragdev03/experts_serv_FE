import { TextInputProps, TextInput as MTextinput } from "@mantine/core";
import { forwardRef } from "react";


const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
    return <MTextinput {...props} ref={ref} />;
});

export default TextInput;