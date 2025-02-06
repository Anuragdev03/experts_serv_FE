import http from "../../../api/Client";

interface Arguments {
    page: number | string;
    keyword?: string;
    city?: string;
    state?: string;
    country?: string;
    job_ids?: string;
    distance?: number;
    lat?: string;
    lng?: string
}

export async function getExpertList(arg: Arguments) {
    try {

        const { page, keyword, city, state, country, job_ids, distance, lat, lng } = arg;
        let apiUrl = `/experts-list`;

        if (page) {
            apiUrl += `?page=${page}`;
        }
        if (keyword) {
            apiUrl += `&searchKey=${keyword}`;
        }
        if (city) {
            apiUrl += `&city=${city}`
        }
        if (state) {
            apiUrl += `&state=${state}`;
        }
        if (country) {
            apiUrl += `&country=${country}`;
        }
        if (job_ids) {
            apiUrl += `&job_ids=${job_ids}`
        }
        if(distance) {
            apiUrl += `&distance=${distance}&lat=${lat}&lng=${lng}`
        }

        const res = await http.get(apiUrl);

        return res.data;

    } catch (err) {
        return err
    }
}