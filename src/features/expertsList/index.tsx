import { ActionIcon, Box, Button, Group, Paper, TextInput, LoadingOverlay } from "@mantine/core";
import "./styles/style.css"
import ExpertHeader from "./Header";
import ExpertFilter from "./Filter";
import { FaArrowCircleRight } from "react-icons/fa";
import { ChangeEvent, useState } from "react";
import Card from "./Card";

export default function ExpertsList() {
    const [searchText, setSearchText] = useState("");

    function handleKeywordChange(event: ChangeEvent<HTMLInputElement>) {
        setSearchText(event.currentTarget.value)
    }
    return (
        <Box>
            <ExpertHeader />
            <Box className="experts-wrapper">
                <ExpertFilter />
                <Box>
                    {/* Search */}
                    <Paper shadow="xs" radius={8} className="expert-search">
                        <Group align="end">
                            <TextInput
                                value={searchText}
                                label="Search"
                                placeholder="John Doe"
                                className="search-input"
                                onChange={handleKeywordChange}
                                rightSection={
                                    <ActionIcon size={26} radius="xl" color="#fff" variant="filled">
                                        <FaArrowCircleRight size={22} color="#2d2b2b" />
                                    </ActionIcon>
                                }
                            />

                        </Group>
                    </Paper>
                    
                    {/* Search Results */}
                    <Paper shadow="xs" radius={8} className="expert-search-results">
                        <h4 className="search-result-header">Search Results</h4>
                        <Box className="card-container">
                            <Card />
                            <Card />
                            <Card />
                            <Card />
                            <Card />
                            <Card />
                            <Card />
                            <Card />
                            <Card />
                            <Card />
                            <Card />

                        </Box>
                    </Paper>
                </Box>
                <Box className="advertisement"></Box>
            </Box>
        </Box>
    )
}