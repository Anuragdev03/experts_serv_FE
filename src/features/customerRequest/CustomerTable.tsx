import { Table } from "@mantine/core";
import NoCustomersFound from "./NoCustomerFound";
import { formatDate } from "../../utilities/dates";
import { useNavigate } from "react-router";

interface Data {
    customer_phone: string;
    customer_name: string;
    customer_email: string;
    message: string;
    tracking_link: string;
    created_at: string;
}

interface Props {
    data: Array<Data> | null
}
  

export default function CustomerTable(props: Props) {
    const {data} = props;
    const navigate = useNavigate()

    if(!data) {
        return (
            <NoCustomersFound />
        )
    }
    const rows = data.map((obj, i) => {
        return (
            <Table.Tr key={i}>
                <Table.Td>{i+1}</Table.Td>
                <Table.Td onClick={() => navigate(`/expert-response/${obj.tracking_link}`, {state: obj})} className="customer_name">{obj?.customer_name}</Table.Td>
                <Table.Td>{obj?.customer_phone}</Table.Td>
                <Table.Td>{obj?.customer_email}</Table.Td>
                <Table.Td>{obj?.message}</Table.Td>
                <Table.Td>{formatDate(obj?.created_at)}</Table.Td>
            </Table.Tr>
        )
    })
    return (
        <Table.ScrollContainer minWidth={400} my={24} mx={16}>
        <Table verticalSpacing="sm" striped highlightOnHover withColumnBorders withTableBorder>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>S.No</Table.Th>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Phone</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Message</Table.Th>
                    <Table.Th>Requested Date</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
        </Table>
        </Table.ScrollContainer>
    )
}