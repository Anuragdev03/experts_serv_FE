import { Anchor, Container, Group, Modal } from '@mantine/core';
import classes from './FooterSimple.module.css';
import { useDisclosure } from '@mantine/hooks';
const SUPPORT_LINK = "https://forms.office.com/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAZAAP4c0VdUNVJDUFk2MFg3MkRJMjVYV0VFNjZaVUtDVC4u"

const links = [
    { link: '#', label: 'Contact' },
    { link: '#', label: 'Privacy' },
    { link: SUPPORT_LINK, label: 'Feedback' },
];

export default function Footer() {
    const [opened, { open, close }] = useDisclosure(false);

    const items = links.map((link) => (
        <Anchor<'a'>
            c="dimmed"
            key={link.label}
            href={link.link}
            size="sm"
            target="_blank" rel="noopener noreferrer"
        >
            {link.label}
        </Anchor>
    ));

    return (
        <div className={classes.footer}>
            <Container className={classes.inner}>
                <h3 className={classes.footer_logo}>ExpertService</h3>
                <Group className={classes.links}>{items}</Group>
            </Container>

            <Modal opened={opened} onClose={close} centered>

            </Modal>
        </div>
    );
}