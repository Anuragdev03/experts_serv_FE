import { ActionIcon, Box, Group, Paper, Slider, Text, Tooltip } from "@mantine/core";
import "./styles/Filter.css";
import { useEffect, useRef, useState } from "react";
import { getJobsApi } from "./api/jobsList";
import MultiSelect from "../../components/Multiselect";
import TextInput from "../../components/TextInput";
import { FaArrowCircleRight } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { getLocation } from "../../utilities/helpers";
import { MdInfoOutline } from "react-icons/md";
import { memo } from "react";
import AutoComplete from "../../components/AutoComplete";
import { useDebouncedCallback } from '@mantine/hooks';
import { getCountries, getStates } from "./api/locationApi";
import { TbFilterX } from "react-icons/tb";

interface Props {
    handleCityClick: (val: string) => void
    fetchCountryValue: (val: string) => void;
    applyCountryFilter: () => void;
    fetchStateValue: (val: string) => void;
    clearLocationFilter: () => void;
    getJobIds: (ids: string) => void;
    handleDistance: (val: number) => void
}

interface Job {
    id: number;
    name: string
}

function ExpertFilter(props: Props) {
    const {  handleCityClick, fetchCountryValue, applyCountryFilter, fetchStateValue, clearLocationFilter, getJobIds, handleDistance } = props;
    const [jobsList, setJobsList] = useState<Array<Job>>([]);
    const [expertList, setExpertList] = useState<string[]>([]); // Just the list of jobs in array of string format
    const [countries, setCountries] = useState<any[]>([]);
    const [states, setStates] = useState<any[]>([])
    const [selectedCountryId, setSelectedCountryId] = useState("");

    // Refs
    const cityRef = useRef<HTMLInputElement>(null);

    async function getJobsList() {
        const res = await getJobsApi();
        const data = await res.data;
        const filteredData = data.map((item: { id: number, name: string }) => item.name);
        const uniqueArr = [...new Set(filteredData)] as string[];
        setJobsList(data);
        setExpertList(uniqueArr);
    }

    useEffect(() => {
        getJobsList();
    }, []);

    function handleJobsListChange(val: string[]) {
        const nameToIdMap = new Map(jobsList.map(obj => [obj.name, obj.id]));

        const ids = val.map(name => nameToIdMap.get(name));
        getJobIds(ids.toString())
    }

    async function getUserLocation() {
        const res = await getLocation();
        if (typeof (res) === "string") return
        localStorage.setItem("currentLocation", JSON.stringify(res))
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
        const results = await getStates(selectedCountryId, query);
        if (Array.isArray(results)) {
            setStates(results);
        }
    }, 500);

    function getSelectedCountry(val: string) {
        const country = countries?.find(obj => obj?.name === val);
        fetchCountryValue(val);
        setSelectedCountryId(country?.id);

    }

    function getSelectedState(val: string) {
        fetchStateValue(val);
    }

    function handleCitySubmission() {
        if(cityRef?.current?.value) {
            handleCityClick(cityRef.current.value);
        } else {
            handleCityClick("");

        }
    }

    function resetLocationFilter() {
        clearLocationFilter();
        if(cityRef?.current?.value) cityRef.current.value = ""
    }

    const handleSliderChange = useDebouncedCallback((value: number) => {
        handleDistance(value);
    }, 500)

    return (
        <Box className="filter-wrapper">
            <Paper shadow="xs" className="expert-filter" radius={8}>
                <Box style={{ padding: "10px", paddingBottom: "16px" }}>
                    <MultiSelect
                        label="Filter by Jobs"
                        placeholder="Electrician"
                        data={expertList}
                        handleChange={handleJobsListChange}
                    />
                </Box>
            </Paper>
            <Paper shadow="xs" className="expert-filter" radius={8}>
                <Box style={{ padding: "10px", paddingBottom: "16px" }}>
                    <Group justify="space-between" style={{ cursor: "pointer" }}>
                        <p>Filter by distance</p>
                        <Tooltip label={"Fetch your current location"}>
                            <ActionIcon color="#2d2b2b" onClick={getUserLocation}>
                                <CiLocationOn size={18} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                    <Slider
                        defaultValue={0}
                        labelTransitionProps={{
                            transition: 'skew-down',
                            duration: 150,
                            timingFunction: 'linear',
                        }}
                        onChange={handleSliderChange}
                    />
                    <Group gap={4} wrap="nowrap">
                        <MdInfoOutline size={20} color="gray" />
                        <Text style={{ color: "gray" }} size="xs">Click the location icon before doing distance search</Text>
                    </Group>

                </Box>
            </Paper>

            <Paper shadow="xs" className="expert-filter" radius={8}>
                <Box style={{ padding: "10px", paddingBottom: "16px" }}>
                    <Group justify="space-between">
                        <p>Filter by location</p>
                        <Tooltip label="Clear Location Filters">
                        <ActionIcon color="#2d2b2b" onClick={resetLocationFilter}>
                            <TbFilterX />
                        </ActionIcon>
                        </Tooltip>
                    </Group>
                    <TextInput
                        ref={cityRef}
                        placeholder="Ooty"
                        label="City"
                        rightSection={
                            <ActionIcon size={26} radius="xl" color="#fff" variant="filled" onClick={handleCitySubmission}>
                                <FaArrowCircleRight size={20} color="#2d2b2b" />
                            </ActionIcon>
                        }
                    />

                    <AutoComplete
                        label="Country"
                        placeholder="India"
                        rightSection={<ActionIcon size={26} radius="xl" color="#fff" variant="filled" onClick={applyCountryFilter}>
                            <FaArrowCircleRight size={20} color="#2d2b2b" />
                        </ActionIcon>}
                        data={countries}
                        handleChange={handleCountrySearch}
                        getSelectedValue={getSelectedCountry}
                    />

                    <AutoComplete
                        label="State"
                        placeholder="Kerala"
                        rightSection={<ActionIcon size={26} radius="xl" color="#fff" variant="filled" onClick={applyCountryFilter}>
                            <FaArrowCircleRight size={20} color="#2d2b2b" />
                        </ActionIcon>}
                        data={states}
                        handleChange={handleStateSearch}
                        getSelectedValue={getSelectedState}
                    />
                </Box>
            </Paper>
        </Box>
    )
}

export default memo(ExpertFilter);