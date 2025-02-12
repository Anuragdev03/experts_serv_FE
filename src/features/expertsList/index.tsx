import { ActionIcon, Box, Pagination, Group, Paper, TextInput, Drawer, Button } from "@mantine/core";
import "./styles/style.css"
import ExpertHeader from "./Header";
import ExpertFilter from "./Filter";
import { FaArrowCircleRight } from "react-icons/fa";
import { useCallback, useEffect, useRef, useState } from "react";
import Card from "./Card";
import Loader from "../../components/Loader";
import { parseAsInteger, useQueryState } from "nuqs";
import { getExpertList } from "./api/expertList";
import { useDisclosure } from "@mantine/hooks";

interface User {
    name: string;
    email: string;
    job_names: string;
    id: number;
    address: string;
    city: string;
    lat: string;
    lng: string;
    profile_url?: string;
    user_name: string;
}

export default function ExpertsList() {
    const [searchText, setSearchText] = useQueryState("keyword", { defaultValue: "" });
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))
    const [city, setCity] = useQueryState("city", { defaultValue: "" });
    const [state, setState] = useQueryState("state", { defaultValue: "" });
    const [country, setCountry] = useQueryState("country", { defaultValue: "" });
    const [jobIds, setJobIds] = useQueryState("jobIds", { defaultValue: "" });
    const [totalCount, setTotalCount] = useQueryState("totalCount", parseAsInteger.withDefault(0));
    const [distance, setDistance] = useQueryState("distance", parseAsInteger.withDefault(0));
    const [expertList, setExpertList] = useState<Array<User> | null>(null);
    const [opened, { toggle, close }] = useDisclosure(false);

    // To trigger the api
    const [triggerApi, setTriggerApi] = useState(0);

    // Refs
    const inputRef = useRef<HTMLInputElement>(null);


    function handleSearch() {
        if (inputRef.current?.value) {
            setSearchText(inputRef.current?.value);
        } else {
            setSearchText("");
        }
        setTriggerApi(triggerApi + 1)
    }

    useEffect(() => {
        fetchExpertResult();
    }, [page, jobIds, triggerApi])

    async function fetchExpertResult() {
        setLoading(true);
        const userLocation = localStorage.getItem("currentLocation");
        let body: any = {
            page,
        };


        if (searchText) {
            body = { ...body, keyword: searchText }
        }
        if (city) {
            body = { ...body, city: city };
        }
        if (state) {
            body = { ...body, state: state };
        }
        if (country) {
            body = { ...body, country: country };
        }
        if (jobIds) {
            body = { ...body, job_ids: jobIds };

        }

        if(distance > 0 && userLocation) {
            const parsed = JSON.parse(userLocation);
            if(!parsed?.lat) return;
            if(!parsed?.lon) return

            body = {...body, distance, lat: parsed.lat, lng: parsed.lon}
        }

        const res = await getExpertList(body);
        setExpertList(res?.data);
        let count = res?.totalCount / res?.limit;
        setTotalCount(Math.ceil(count));
        setLoading(false);
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            if (inputRef.current?.value) {
                setSearchText(inputRef.current?.value)

            } else {
                setSearchText("")
            }
            setTriggerApi(triggerApi + 1)
        }
    };



    const fetchCountryValue = useCallback((country: string) => {
        setCountry(country);
    }, [])

    const fetchStateValue = useCallback((state: string) => {
        setState(state)
    }, [])

    const clearLocationFilter = () => {
        setCountry("");
        setState("");
        setCity("");
        setTriggerApi(triggerApi + 1)
    }

    const getJobIds = useCallback((ids: string) => {
        setJobIds(ids);
    }, [])

    const handleCityClick = (val: string) => {
        setCity(val);
        setTriggerApi(triggerApi + 1)
    }

    const handleDistance = (val: number) => {
        setDistance(val);
        setTriggerApi(triggerApi + 1);
    }

    return (
        <Box>
            <ExpertHeader />
            <Box className="experts-wrapper">
                <Box className="hide-on-mobile">
                    <ExpertFilter
                        handleCityClick={handleCityClick}
                        fetchCountryValue={fetchCountryValue}
                        applyCountryFilter={fetchExpertResult}
                        fetchStateValue={fetchStateValue}
                        clearLocationFilter={clearLocationFilter}
                        getJobIds={getJobIds}
                        handleDistance={handleDistance}
                    />
                </Box>
                <Box>
                    {/* Search */}
                    <Paper shadow="xs" radius={8} className="expert-search">
                        <Group align="end">
                            <TextInput
                                ref={inputRef}
                                label="Search"
                                placeholder="John Doe"
                                className="search-input"
                                rightSection={
                                    <ActionIcon size={26} radius="xl" color="#fff" variant="filled" onClick={handleSearch}>
                                        <FaArrowCircleRight size={22} color="#2d2b2b" />
                                    </ActionIcon>
                                }
                                onKeyDown={handleKeyDown}
                            />
                        </Group>
                        <Button className="filter-button" onClick={toggle} variant="transparent" p={4}>Filters</Button>
                    </Paper>

                    {/* Search Results */}
                    <Paper pos={"relative"} shadow="xs" radius={8} className="expert-search-results">

                        {/* Loader */}
                        <Loader loading={loading} />

                        {/* Results */}
                        <h4 className="search-result-header">Search Results</h4>
                        <Box className="card-container">
                            {Array.isArray(expertList) && expertList.map(user => (
                                <Card
                                    name={user.name}
                                    job_names={user.job_names}
                                    city={user.city}
                                    key={user.id}
                                    lat={user.lat}
                                    lng={user.lng}
                                    profile_url={user.profile_url}
                                    user_name={user?.user_name}
                                />
                            ))}
                        </Box>

                        {/* Pagination */}
                        <Group justify="center" my={16}>
                            <Pagination color="#000" total={totalCount} value={page} onChange={setPage} />
                        </Group>
                    </Paper>
                </Box>
                <Box className="advertisement">
                    <h4 className="advertisement-header">Advertisement</h4>
                    <p className="ad-desc">(Contact admin for advertisement)</p>
                </Box>
            </Box>
            <Drawer opened={opened} onClose={close} title="Filters" size={"sm"} className="filter-drawer" keepMounted>
                <ExpertFilter
                    handleCityClick={handleCityClick}
                    fetchCountryValue={fetchCountryValue}
                    applyCountryFilter={fetchExpertResult}
                    fetchStateValue={fetchStateValue}
                    clearLocationFilter={clearLocationFilter}
                    getJobIds={getJobIds}
                    handleDistance={handleDistance}
                />
            </Drawer>
        </Box>
    )
}