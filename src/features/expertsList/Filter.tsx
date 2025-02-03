import { ActionIcon, Box, Button, Group, Paper, Slider, Text, Tooltip } from "@mantine/core";
import "./styles/Filter.css";
import { useEffect, useState } from "react";
import { getJobsApi } from "./api/jobsList";
import MultiSelect from "../../components/Multiselect";
import TextInput from "../../components/TextInput";
import { FaArrowCircleRight } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { getLocation } from "../../utilities/helpers";
import { MdInfoOutline } from "react-icons/md";
import { memo } from "react";

function ExpertFilter() {
    const [jobsList, setJobsList] = useState([]);
    const [expertList, setExpertList] = useState<string[]>([]); // Just the list of jobs in array of string format

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
        console.log(val);
    }

    async function getUserLocation() {
        const res = await getLocation();
        if (typeof (res) === "string") return
        localStorage.setItem("currentLocation", JSON.stringify(res))
    }
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
                    />
                    <Group gap={4} wrap="nowrap">
                        <MdInfoOutline size={20} color="gray" />
                        <Text style={{color: "gray"}} size="xs">Click the location icon before doing distance search</Text>
                    </Group>

                </Box>
            </Paper>

            <Paper shadow="xs" className="expert-filter" radius={8}>
                <Box style={{ padding: "10px", paddingBottom: "16px" }}>
                    <p>Filter by location</p>
                    <TextInput
                        placeholder="Ooty"
                        label="City"
                        rightSection={
                            <ActionIcon size={26} radius="xl" color="#fff" variant="filled">
                                <FaArrowCircleRight size={20} color="#2d2b2b" />
                            </ActionIcon>
                        }
                    />

                    <TextInput
                        placeholder="Kerala"
                        label="State"
                        rightSection={
                            <ActionIcon size={26} radius="xl" color="#fff" variant="filled">
                                <FaArrowCircleRight size={20} color="#2d2b2b" />
                            </ActionIcon>
                        }
                    />

                    <TextInput
                        placeholder="India"
                        label="Country"
                        rightSection={
                            <ActionIcon size={26} radius="xl" color="#fff" variant="filled">
                                <FaArrowCircleRight size={20} color="#2d2b2b" />
                            </ActionIcon>
                        }
                    />
                </Box>
            </Paper>
        </Box>
    )
}

export default memo(ExpertFilter);