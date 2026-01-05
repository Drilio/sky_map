export type OVERLAY_KIND = "brightest" | "nearest" | "hottest" | "largest";

export type Star = {
    id: number;
    x: number;
    y: number;
    z?: number;
    mag?: number;
    proper?: string;
    con?: string;
};

export type View = {
    scale: number;
    panX: number;
    panY: number;
};

export type StarPoint = Star & {
    X: number;
    Y: number;
    Z: number;
    MAG: number;
    LABEL: string;
};

export function clamp(n: number, a: number, b: number) {
    return Math.max(a, Math.min(b, n));
}

export function starLabel(s: Star) {
    const con = (s.con ?? "").toString().trim();
    if (con) return con;
    const proper = (s.proper ?? "").toString().trim();
    if (proper) return proper;
    return `Star #${s.id}`;
}

export function toPoints(stars: Star[]): StarPoint[] {
    return (stars ?? []).map((s) => ({
        ...s,
        X: Number(s.x) || 0,
        Y: Number(s.y) || 0,
        Z: Number(s.z) || 0,
        MAG: typeof s.mag === "number" ? s.mag : Number(s.mag) || 0,
        LABEL: starLabel(s),
    }));
}

export function computeWorldCenter(pts: StarPoint[]) {
    if (!pts.length) return {cxw: 0, cyw: 0};
    const sx = pts.reduce((a, p) => a + p.X, 0);
    const sy = pts.reduce((a, p) => a + p.Y, 0);
    return {cxw: sx / pts.length, cyw: sy / pts.length};
}

export function computeFitScale(params: {
    pts: StarPoint[];
    worldCenter: { cxw: number; cyw: number };
    diskRadius: number;
    margin?: number;
    maxScale?: number;
    minScale?: number;
}) {
    const {pts, worldCenter, diskRadius} = params;
    const margin = params.margin ?? 0.92;
    const maxScale = params.maxScale ?? 1;
    const minScale = params.minScale ?? 0.02;

    if (!pts.length) return clamp(1, minScale, maxScale);

    let rMax = 1e-9;
    for (const p of pts) {
        const dx = p.X - worldCenter.cxw;
        const dy = p.Y - worldCenter.cyw;
        rMax = Math.max(rMax, Math.hypot(dx, dy));
    }

    const fitScale = (diskRadius * margin) / rMax;
    return clamp(Math.min(maxScale, fitScale), minScale, maxScale);
}

export function toScreen(
    p: StarPoint,
    v: View,
    params: {
        cx: number;
        cy: number;
        worldCenter: { cxw: number; cyw: number };
    },
) {
    const xw = p.X - params.worldCenter.cxw;
    const yw = p.Y - params.worldCenter.cyw;
    return {
        sx: params.cx + v.panX + xw * v.scale,
        sy: params.cy + v.panY - yw * v.scale,
    };
}

export function starPixelRadius(mag: number) {
    const m = clamp(mag, -2, 12);
    const r = 4.2 - (m + 2) * (3.2 / 14);
    return clamp(r, 1.0, 4.2);
}

export function pickStar(params: {
    pts: StarPoint[];
    view: View;
    cx: number;
    cy: number;
    worldCenter: { cxw: number; cyw: number };
    mx: number;
    my: number;
    hitPad?: number;
}) {
    const {pts, view, cx, cy, worldCenter, mx, my} = params;
    const hitPad = params.hitPad ?? 6;

    let best: { id: number; d2: number } | null = null;

    for (const p of pts) {
        const {sx, sy} = toScreen(p, view, {cx, cy, worldCenter});
        const r = starPixelRadius(p.MAG) + hitPad;
        const dx = mx - sx;
        const dy = my - sy;
        const d2 = dx * dx + dy * dy;
        if (d2 <= r * r && (!best || d2 < best.d2)) best = {id: p.id, d2};
    }

    return best?.id ?? null;
}


export type City = {
    id: number;
    city: string;
    lat: number;
    lng: number;
};