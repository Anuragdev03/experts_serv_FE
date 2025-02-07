import { Textarea as MTextArea, TextareaProps} from "@mantine/core";
import { forwardRef } from "react";

const TextArea = forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
    return <MTextArea {...props} ref={ref} />;
});

export default TextArea;