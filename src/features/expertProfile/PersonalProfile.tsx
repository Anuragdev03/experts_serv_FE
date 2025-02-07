import { Anchor, Box, Button } from "@mantine/core";
import { User } from "./index"
import TextArea from "../../components/TextArea";
import { SubmitHandler, useForm } from "react-hook-form";
import TextInput from "../../components/TextInput";
import { getLocation } from "../../utilities/helpers";
import { useEffect } from "react";

interface Props {
    data: User | null
}

interface FormState {
    name: string
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    lat: string;
    lng: string;
    whatsapp_number: string;
    job_names: string;
}

export default function PersonalProfile(props: Props) {
    const { data } = props;
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setError,
        setValue
    } = useForm<FormState>({
        defaultValues: {
            name: "",
            address: "",
            city: "",
            state: "",
            country: "",
            pincode: "",
            lat: "",
            lng: "",
            whatsapp_number: "",
            job_names: ""
        }
    });

    useEffect(() => {
        prefillData()
    }, [data?.name])

    async function onSubmit() {

    }

    async function getUserLocation() {
        const res = await getLocation();
        if (typeof (res) === "string") return
        setValue("lat", res.lat.toString())
        setValue("lng", res.lon.toString())
    }

    function prefillData() {
        if (data?.name) {
            setValue("name", data?.name);
        }
        if (data?.address) {
            setValue("address", data?.address)
        }
        if (data?.city) {
            setValue("city", data?.city);
        }
        if (data?.state) {
            setValue("state", data?.state);
        }
        if (data?.country) {
            setValue("country", data?.country)
        }
        if (data?.pincode) {
            setValue("pincode", data?.pincode);
        }
        if (data?.lat) {
            setValue("lat", data?.lat);
        }
        if (data?.lng) {
            setValue("lng", data?.lng);
        }
        if (data?.whatsapp_number) {
            setValue("whatsapp_number", data?.whatsapp_number)
        }
    }
    return (
        <Box my={16}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextInput
                    label="Name"
                    placeholder="Your Name"
                    {...register("name")}
                    mb={12}
                />
                <TextArea
                    label="Address"
                    resize="vertical"
                    description="Enter your address"
                    {...register("address")}
                    mb={12}
                />

                <TextInput
                    label="City"
                    placeholder="Your City"
                    {...register("city")}
                    mb={12}
                />

                <TextInput
                    label="Pin Code/Zip Code"
                    placeholder="Your Code"
                    {...register("pincode")}
                    mb={12}
                />

                <TextInput
                    description={"Click the Fetch location button to get the location detail"}
                    label="Latitude"
                    placeholder="Your Latitude"
                    {...register("lat")}
                    mb={12}
                    disabled
                />

                <Anchor onClick={getUserLocation} size="sm" underline="always">Fetch Location</Anchor>

                <TextInput
                    mt={12}
                    label="Longitude"
                    placeholder="Your Longitude"
                    {...register("lng")}
                    mb={12}
                    disabled
                />

                <TextInput
                    label="Whatsapp Number"
                    placeholder="Your Whatsapp Number"
                    {...register("whatsapp_number")}
                    mb={12}
                />

                <Button mt={12} type="submit" w={"100%"} color="#000">Update</Button>
            </form>
        </Box>
    )
}