import {ApiError} from "./getStars.ts";
import type {City} from "../Components/utils.ts";


export async function getCities(): Promise<City[]> {
    const url = new URL(`http://localhost:8000/api/sky/cities/`);

    const res = await fetch(url.toString(), {
        method: "GET",
        headers: {Accept: "application/json"},
    });

    if (!res.ok) {
        let body: unknown;
        try {
            body = await res.json();
        } catch {
            body = await res.text().catch(() => undefined);
        }
        throw new ApiError(`GET ${url.pathname} failed`, res.status, body);
    }

    return await res.json();
}


