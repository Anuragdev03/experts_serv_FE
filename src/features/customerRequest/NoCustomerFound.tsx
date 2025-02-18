import { Box, Group } from "@mantine/core";
import { FaUsersSlash } from "react-icons/fa";


export default function NoCustomersFound() {
    return(
        <Box>
            <Group align="center" justify="center" mt={24} style={{flexDirection: "column", }}>
                <Box>
                    <FaUsersSlash size={30} />
                </Box>
                <h2>No Customers Found</h2>
                <p></p>
            </Group>
        </Box>
    )
}