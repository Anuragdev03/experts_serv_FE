import { LoadingOverlay } from "@mantine/core";

interface Props {
    loading: boolean
}

export default function Loader(props: Props) {
    return (
        <LoadingOverlay
            visible={props.loading}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 2 }}
            loaderProps={{ color: '#000', type: 'bars' }}
        />
    )
}