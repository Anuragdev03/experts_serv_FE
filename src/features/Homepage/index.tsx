import { Button, Box } from '@mantine/core';
import Header from './Header';
import { useNavigate } from 'react-router';
import Features from './Features';
import Footer from '../../components/footer/Footer';

export default function HomePage() {
    const navigate = useNavigate();

    function navigateToSignIn() {
        navigate("/login")
    }

    function navigateToExpertList() {
        navigate("/experts")
    }

    return (
        <Box className='container'>
            <Header />
            <Box mx={16}>
                <Box className='hero-title'>
                    <h1 style={{ color: "#3b3b3b" }}>Connecting You with the Best in the Business. <br /></h1>
                    <h1 className='hero-highlight'>Experts Who Get the Job Done Right!</h1>
                </Box>

                <Box className='hero-description'>
                    <p>Connect with skilled professionals in minutes. Electricians, plumbers,
                        handymen, and more. Get expert help for any project, anytime, anywhere.</p>
                </Box>

                <Box className='call-to-action'>
                    <Button onClick={navigateToExpertList} size='md'>Find an Expert Now</Button>
                    <Button onClick={navigateToSignIn} size='md'>Join Our Expert Network</Button>
                </Box>

                <Features />
            </Box>
            <Footer />
        </Box>
    );
}