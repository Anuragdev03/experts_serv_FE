import { Anchor, Box, Container, Group, Modal, Space } from '@mantine/core';
import classes from './FooterSimple.module.css';
import { useDisclosure } from '@mantine/hooks';
const SUPPORT_LINK = "https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAZAAP4c0VdUNVJDUFk2MFg3MkRJMjVYV0VFNjZaVUtDVC4u"


export default function Footer() {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <div className={classes.footer}>
            <Container className={classes.inner}>
                <h3 className={classes.footer_logo}>ExpertService</h3>

                <Group className={classes.links}>
                    <Anchor<'a'>
                        c="dimmed"
                        key={"Contact"}
                        size="sm"
                        target="_blank" rel="noopener noreferrer"
                    >
                        Contact
                    </Anchor>

                    <Anchor<'a'>
                        c="dimmed"
                        key={"privacy"}
                        size="sm"
                        onClick={open}
                    >
                        Privacy
                    </Anchor>

                    <Anchor<'a'>
                        c="dimmed"
                        key={"feedback"}
                        size="sm"
                        target="_blank" rel="noopener noreferrer"
                        href={SUPPORT_LINK}
                    >
                        Feedback
                    </Anchor>
                </Group>
            </Container>

            <Modal opened={opened} onClose={close} centered title="Privacy Policy" fullScreen>
                <Box>
                    <h4 className={classes.privacy_title}>1. Introduction</h4>
                    <p className={classes.privacy_text}>Welcome to Expert Service. Your privacy is important to us. This policy explains how we collect, use, and protect your information when you use our platform.</p>
                    <Space h={"md"} />

                    <h4 className={classes.privacy_title}>2. Information We Collect</h4>
                    <p className={classes.privacy_text}>We may collect:</p>
                    <ul>
                        <li><p className={classes.privacy_text}><span className='highlight-text'> Personal Information:</span> Name, email, phone number, and other details provided.</p></li>
                        <li>
                            <p className={classes.privacy_text}>
                                <span className='highlight-text'>Cookies: </span>To enhance functionality and user experience.
                            </p>
                        </li>
                    </ul>
                    <Space h={"md"} />

                    <h4 className={classes.privacy_title}>3. How We Use Your Information</h4>
                    <p className={classes.privacy_text}>We use your information to:</p>
                    <ul>
                        <li><p className={classes.privacy_text}>Provide and improve our services.</p></li>
                        <li><p className={classes.privacy_text}>Personalize your experience.</p></li>
                        <li><p className={classes.privacy_text}>Communicate updates and support.</p></li>
                        <li><p className={classes.privacy_text}>Ensure security and prevent fraud.</p></li>
                </ul>
                <Space h={"md"} />

                <h4 className={classes.privacy_title}>4. Sharing of Information</h4>
                <p className={classes.privacy_text}>We do not sell or rent your personal data. However, we may share it with:</p>
                <ul>
                    <li><p className={classes.privacy_text}><span className='highlight-text'>Legal authorities </span>if required by law.</p></li>
                </ul>
                <Space h={"md"} />

                <h4 className={classes.privacy_title}>5. Data Security</h4>
                <p className={classes.privacy_text}>We implement security measures to protect your data. However, no method is 100% secure.</p>
                <Space h={"md"} />

                <h4 className={classes.privacy_title}>6. Your Rights</h4>
                <p className={classes.privacy_text}>You can:</p>
                <ul>
                    <li>
                        <p className={classes.privacy_text}>Access, update, or delete your personal data.</p>
                    </li>
                </ul>
                <Space h={"md"} />

                <h4 className={classes.privacy_title}>7. Changes to This Policy</h4>
                <p className={classes.privacy_text}>We may update this policy from time to time. Please review it periodically.</p>
            </Box>
        </Modal>
        </div >
    );
}