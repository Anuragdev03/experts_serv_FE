import { Anchor, Box, Button } from "@mantine/core";
import { User } from "./index"
import TextArea from "../../components/TextArea";
import { SubmitHandler, useForm } from "react-hook-form";
import TextInput from "../../components/TextInput";
import { getLocation, notify } from "../../utilities/helpers";
import { useEffect, useState } from "react";
import { AutoCompleteForm } from "../../components/AutoCompleteForm";
import { useDebouncedCallback } from "@mantine/hooks";
import { getCountries, getStates } from "../expertsList/api/locationApi";
import MultiSelect from "../../components/Multiselect";
import { getJobsApi } from "../expertsList/api/jobsList";
import { updateExpertDetail } from "./api/expertDetail";
import { getAccessToken } from "../../api/refreshToken";

interface Props {
    data: User | null
}

export interface FormState {
    name: string
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    lat: string;
    lng: string;
    whatsapp_number: string;
}

interface Job {
    id: number;
    name: string
}

export default function PersonalProfile(props: Props) {
    const { data } = props;
    const [countries, setCountries] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([]);
    const [jobsList, setJobsList] = useState<Array<Job>>([]);
    const [expertList, setExpertList] = useState<string[]>([]);
    const [selectedJobsArr, setSelectedJobsArr] = useState<string[]>([]);
    const [selectedJobIds, setSelectedJobIds] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
        control,
        watch
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
        }
    });
    const selectedCountry = watch("country");

    const getCountryId = () => {
        const country = countries?.find(obj => obj?.name === selectedCountry);
        return country?.id;
    }

    useEffect(() => {
        prefillData();
        fetchCountryList();
    }, [data?.name]);

    useEffect(() => {
        getJobsList();
    }, [])

    async function getJobsList() {
        const res = await getJobsApi();
        const data = await res.data;
        const filteredData = data.map((item: { id: number, name: string }) => item.name);
        const uniqueArr = [...new Set(filteredData)] as string[];
        setJobsList(data);
        setExpertList(uniqueArr);
    }

    const onSubmit: SubmitHandler<FormState> = async(data) => {
        let flag = 1;
        const jobIds = selectedJobIds;
        const payload = {...data, jobIds};
        const res = await updateExpertDetail(payload);
        if(res === "Token has expired") {
            if (flag > 3) return;
            const token = await getAccessToken();
            if(token) onSubmit(data);
            flag++;
        }
        if(res === "Profile updated successfully") {
            notify("SUCCESS", res);
        }

        if(res !== "Token has expired" && res !== "Profile updated successfully") {
            notify("ERROR", res?.slice(5))
        }
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
        if(data?.job_names) {
            const toArr = data?.job_names.split(",");
            setSelectedJobsArr(toArr)
        }
    }

    async function fetchCountryList() {
        if (data?.country) {
            const results = await getCountries(data?.country);
            if (Array.isArray(results)) {
                setCountries(results);
            }
        }
    }

    const handleCountrySearch = useDebouncedCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        const results = await getCountries(query);
        if (Array.isArray(results)) {
            setCountries(results);
        }
    }, 500);

    const handleStateSearch = useDebouncedCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        const selectedCountryId = getCountryId()
        const results = await getStates(selectedCountryId, query);
        if (Array.isArray(results)) {
            setStates(results);
        }
    }, 500);

    function handleJobsListChange(val: string[]) {
        const nameToIdMap = new Map(jobsList.map(obj => [obj.name, obj.id]));

        const ids = val.map(name => nameToIdMap.get(name));
        setSelectedJobIds(ids.toString());

        setSelectedJobsArr(val)
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

                <AutoCompleteForm
                    control={control}
                    name="country"
                    label="Country"
                    placeholder="India"
                    data={countries}
                    handleChange={handleCountrySearch}
                />

                <AutoCompleteForm
                    control={control}
                    name="state"
                    label="State"
                    placeholder="Kerala"
                    data={states}
                    handleChange={handleStateSearch}
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

                <MultiSelect
                    label="Filter by Jobs"
                    placeholder="Electrician"
                    data={expertList}
                    handleChange={handleJobsListChange}
                    value={selectedJobsArr}
                />

                <Button mt={12} type="submit" w={"100%"} color="#000">Update</Button>
            </form>
        </Box>
    )
}