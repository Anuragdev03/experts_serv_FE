import { Box, Divider } from "@mantine/core";
import "./homepage.css"
import { useDisclosure } from '@mantine/hooks';
import { Burger, Drawer } from '@mantine/core';

export default function Header() {
    const [opened, { toggle, close }] = useDisclosure(false);
    // const [opened, { open, close }] = useDisclosure(false);

    return (
        <Box className="header-container">
            <Box>
                <h5 className="logo">ExpertService</h5>
            </Box>
            <Box className="header-items">
                <a>Features</a>
                <a>About</a>
                <a>Support</a>
            </Box>
            <Box className="hide-on-desktop hamburger">
                <Burger opened={opened} onClick={toggle} aria-label="Toggle navigation" />
            </Box>

            <Drawer opened={opened} onClose={close} title="Menu" size={"sm"}>
                <Divider />
                <Box className="menu-items">
                <a>Features</a>
                <a>About</a>
                <a>Support</a>

                </Box>
            </Drawer>
        </Box>
    )
}