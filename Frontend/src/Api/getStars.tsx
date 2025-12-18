// getStars.tsx
// GET /api/overlays/top?kind=brightest|nearest|hottest|largest&limit=50
// API returns: Star[] (plain JSON array)

export type OverlayKind = "brightest" | "nearest" | "hottest" | "largest";

export type Star = {
    id: number;

    hip: number | string | null;
    hd: number | string | null;
    hr: number | string | null;
    gl: number | string | null;
    bf: number | string | null;

    proper: string | null;

    ra: number;
    dec: number;
    dist: number;

    pmra: number;
    pmdec: number;
    rv: number;

    mag: number;
    absmag: number;

    spect: string | null;
    ci: number;

    x: number;
    y: number;
    z: number;

    vx: number;
    vy: number;
    vz: number;

    rarad: number;
    decrad: number;
    pmrarad: number;
    pmdecrad: number;

    bayer: string | null;
    flam: string | null;
    con: string | null;

    comp: number;
    comp_primary: number;

    base: string | null;
    lum: number;

    var: string | null;
    var_min: string | null;
    var_max: string | null;
};

export class ApiError extends Error {
    status: number;
    body?: unknown;

    constructor(message: string, status: number, body?: unknown) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.body = body;
    }
}


const API_BASE =
    (import.meta as any).env?.VITE_API_BASE_URL ?? "";

function assertStarArray(data: unknown): asserts data is Star[] {
    if (!Array.isArray(data)) throw new Error("Expected JSON array");
    for (const it of data) {
        if (!it || typeof it !== "object") throw new Error("Invalid item");
        const o = it as any;
        if (typeof o.id !== "number") throw new Error("Missing numeric id");
        if (typeof o.ra !== "number" || typeof o.dec !== "number") {
            throw new Error("Missing numeric ra/dec");
        }
    }
}

export async function getStars(opts: {
    kind: OverlayKind;
    limit?: number;
    signal?: AbortSignal;
}): Promise<Star[] | void> {
    const limit = opts.limit ?? 50;
    const base = import.meta.env.VITE_API_BASE_URL;

    if (!base) throw new Error("Missing VITE_API_BASE_URL");

    const url = new URL(`${API_BASE}/api/overlays/top`, window.location.origin);
    url.searchParams.set("kind", opts.kind);
    url.searchParams.set("limit", String(limit));

    const res = await fetch(url.toString(), {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: opts.signal,
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

    const data: unknown = await res.json();
    assertStarArray(data);
    return data;
}
