import type {City} from "../Components/utils.ts";


export async function getCities(): Promise<City[]> {
    const url = new URL(`http://localhost:8000/api/sky/cities/`);

    const res = await fetch(url.toString(), {
        method: "GET",
        headers: {Accept: "application/json"},
    });

    if (!res.ok) {

        throw new Error(`GET ${url.pathname} failed`);
    }

    return await res.json();
}


