import { Box, Divider } from "@mantine/core";
import "./styles/homepage.css"
import { useDisclosure } from '@mantine/hooks';
import { Burger, Drawer } from '@mantine/core';
import { useNavigate } from "react-router";

export default function Header() {
    const [opened, { toggle, close }] = useDisclosure(false);
    const navigate = useNavigate();
    const goHome = () => navigate("/")
    const SUPPORT_LINK = "https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAZAAP4c0VdUNVJDUFk2MFg3MkRJMjVYV0VFNjZaVUtDVC4u"
    return (
        <Box className="header-container">
            <Box>
                <h5 onClick={goHome} className="logo">ExpertService</h5>
            </Box>
            <Box className="header-items">
                <a>Features</a>
                <a>About</a>
                <a href={SUPPORT_LINK} target="_blank" rel="noopener noreferrer">Support</a>
            </Box>
            <Box className="hide-on-desktop hamburger">
                <Burger opened={opened} onClick={toggle} aria-label="Toggle navigation" />
            </Box>

            <Drawer opened={opened} onClose={close} title="Menu" size={"sm"}>
                <Divider />
                <Box className="menu-items">
                <a>Features</a>
                <a>About</a>
                <a href={SUPPORT_LINK} target="_blank" rel="noopener noreferrer">Support</a>

                </Box>
            </Drawer>
        </Box>
    )
}