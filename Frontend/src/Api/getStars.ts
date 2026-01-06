import type {OVERLAY_KIND} from "../Components/utils.ts";

export interface GetStarsParams {
    latitude: number;
    longitude: number;
    datetime: string;
    kind: OVERLAY_KIND;
    limit?: number;
}

export async function getStars(
    {
        latitude,
        longitude,
        datetime,
        kind,
    }: GetStarsParams) {
    const url = `http://localhost:8000/api/sky/${latitude}:${longitude}/${datetime}/${kind}:50`;
    console.log("url", url)
    try {
        const response = await fetch(url);

        if (!response.ok) {
            let errorMessage = `Failed to fetch stars: ${response.statusText}`;

            try {
                const errorData = await response.json();
                if (errorData.error) {
                    errorMessage = errorData.error;
                } else if (errorData.detail) {
                    errorMessage = errorData.detail;
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                }
            } catch {
                errorMessage = `Server error (${response.status}): ${response.statusText}`;
            }

            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Network error: Unable to fetch stars data');
    }
}
