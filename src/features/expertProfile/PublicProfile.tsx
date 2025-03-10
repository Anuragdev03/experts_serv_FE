import { Anchor, Box, Button, Divider, Modal, TagsInput } from "@mantine/core";
import TextInput from "../../components/TextInput";
import { RichText } from "../../components/RichTextEditor";
import { useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { isValidWebsite, notify, purifyHtml } from "../../utilities/helpers";
import { getPublicProfileDetails, updatePublicProfile } from "./api/expertDetail";
import { getAccessToken } from "../../api/refreshToken";
import { useNavigate } from "react-router";


export default function PublicProfileTab() {
    const [richTextData, setRichTextData] = useState("")
    const [opened, { open, close }] = useDisclosure(false);
    const [tags, setTags] = useState<string[]>([]);
    const [website, setWebsite] = useState("");
    const [error, setError] = useState("");
    const [profileUrl, setProfileUrl] = useState("");
    const navigate = useNavigate()
    useEffect(() => {
        getProfileDetails()
    }, [])


    function handleEditorChange(html: string) {
        setRichTextData(html);
    }

    function handleTags(value: string[]) {
        setTags(value);
    }

    function handleWebsite(event: React.ChangeEvent<HTMLInputElement>) {
        setWebsite(event.currentTarget.value)
    }

    async function handleSave() {
        const isValid = isValidWebsite(website);
        if (!isValid && website) {
            setError("Enter a valid url. E.g https://google.com");
            return
        }
        setError("");

        let payLoad = {};
        if (website) {
            payLoad = { ...payLoad, website };
        }
        const tag = tags.toString()
        if (tag) {
            payLoad = { ...payLoad, tags: tag }
        }
        if (richTextData) {
            payLoad = { ...payLoad, description: richTextData }
        }

        if (Object.keys(payLoad).length) {
            const res = await updatePublicProfile(payLoad);
            if (res === "Token has expired") {
                const token = await getAccessToken();
                if (token) handleSave();
            }
            if (res === "Profile updated successfully") {
                notify("SUCCESS", res);
            }

            if (res !== "Token has expired" && res !== "Profile updated successfully") {
                notify("ERROR", res?.slice(5))
            }
        }
    }

    async function getProfileDetails() {
        const res = await getPublicProfileDetails();
        if (res === "Token has expired") {
            const token = await getAccessToken();
            if (token) getProfileDetails();
        }
        if(res.message === "Success") {
            if(res?.data?.website) {
                setWebsite(res?.data?.website)
            }
            if(res?.data?.tags) {
                setTags(res?.data?.tags.split(","))
            }
            if(res?.data?.description) {
                setRichTextData(res?.data?.description)
            }
            if(res?.data?.profile_url) {
                console.log(res?.data?.profile_url)
                setProfileUrl(res.data.profile_url)
            }
        }
    }

    function gotoPublicPage() {
        console.log(profileUrl)
        navigate(`/view-profile/${profileUrl}`)
    }

    return (
        <Box>
            <p className="pub-tab-desc">These details will be displayed in your public profile along with other details like Name and address.</p>

            {profileUrl ? <p className="pub-page">View your public <Anchor onClick={gotoPublicPage}>page</Anchor></p> : null}
            <TextInput
                label="Website/Social Media Link"
                my={16}
                value={website}
                onChange={handleWebsite}
                placeholder="https://yourwebsite.com"
                error={error}
            />

            <TagsInput value={tags} label="Tags" my={16} description="These tags help customers find you through searches. e.g(electrician, plumber, ooty)" onChange={handleTags} />

            <p className="label">Description</p>
            <p className="small-info">Useful information about the work you are doing or about the shop/company that is helpful for the customer.</p>
            <RichText value={richTextData} onChange={handleEditorChange} />
            <p className="gray" style={{fontSize: "10px"}}>(Max length 1500 letters)</p>
            <Box>
                <Anchor size="sm" underline="always" onClick={open}>Preview</Anchor>

            </Box>
            <Button onClick={handleSave} my={16} w={"100%"} color="#000">Save</Button>

            <Modal opened={opened} onClose={close} title="Preview">
                <Divider />
                <div dangerouslySetInnerHTML={{ __html: purifyHtml(richTextData) }}></div>
            </Modal>
        </Box>
    )
}