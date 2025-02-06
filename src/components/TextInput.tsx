import { TextInputProps, TextInput as MTextinput } from "@mantine/core";
import React, { forwardRef } from "react";


const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
    return <MTextinput {...props} ref={ref} />;
});

export default React.memo(TextInput);