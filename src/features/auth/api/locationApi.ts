import http from "../../../api/Client";

export async function getCountries(keyword: string) {
    try {
        const data = await http.get(`/location/countries/${keyword}`);

        return data.data.data;
    } catch(err) {
        return err
    }
}