import { Box } from "@mantine/core";
import { useNavigate } from "react-router";

export default function Header() {
    const navigate = useNavigate();

    const goHome = () => navigate("/")

    return (
        <Box className="experts-header">
            <Box>
                <h5 onClick={goHome} className="logo">ExpertService</h5>
            </Box>
        </Box>
    )
}