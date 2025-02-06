import http from "../../../api/Client";

export async function getCountries(keyword: string) {
    try {
        const data = await http.get(`/location/countries/${keyword}`);

        return data.data.data;
    } catch(err) {
        return err
    }
}

export async function getStates(countryId: string, state: string) {
    if(!countryId) return;
    if(!state) return;

    try {
        const res = await http.get(`/location/states?countryId=${countryId}&state=${state}`);
        return res.data.data
    } catch(err) {
        return err;
    }
}