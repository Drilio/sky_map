import React, { useEffect, useMemo, useRef, useState } from "react";
import { getStars } from "../Api/getStars"; // adjust if your path differs

type OverlayKind = "brightest" | "nearest" | "hottest" | "largest";

type Star = {
    id: number;
    x: number;
    y: number;
    z?: number;
    mag?: number;
    proper?: string;
    con?: string;
};

type View = {
    scale: number;
    panX: number;
    panY: number;
};

function clamp(n: number, a: number, b: number) {
    return Math.max(a, Math.min(b, n));
}

function starLabel(s: Star) {
    const con = (s.con ?? "").toString().trim();
    if (con) return con;
    const proper = (s.proper ?? "").toString().trim();
    if (proper) return proper;
    return `Star #${s.id}`;
}

export default function SkyMap({
                                   kind = "nearest",
                                   limit = 50,
                                   width = 900,
                                   height = 650,
                               }: {
    kind?: OverlayKind;
    limit?: number;
    width?: number;
    height?: number;
}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [stars, setStars] = useState<Star[]>([]);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        const ac = new AbortController();
        setErr(null);

        getStars({ kind, limit, signal: ac.signal })
            .then((rows) => {
                // keep only what this canvas uses
                setStars(
                    rows.map((s) => ({
                        id: s.id,
                        x: s.x,
                        y: s.y,
                        z: s.z ?? 0,
                        mag: s.mag,
                        proper: s.proper ?? undefined,
                        con: s.con ?? undefined,
                    })),
                );
            })
            .catch((e: any) => {
                if (e?.name === "AbortError") return;
                setErr(e instanceof Error ? e.message : String(e));
                setStars([]);
            });

        return () => ac.abort();
    }, [kind, limit]);

    const diskRadius = Math.min(width, height) * 0.42;
    const cx = width / 2;
    const cy = height / 2;

    const pts = useMemo(() => {
        return (stars ?? []).map((s) => ({
            ...s,
            X: Number(s.x) || 0,
            Y: Number(s.y) || 0,
            Z: Number(s.z) || 0,
            MAG: typeof s.mag === "number" ? s.mag : Number(s.mag) || 0,
            LABEL: starLabel(s),
        }));
    }, [stars]);

    const [view, setView] = useState<View>({ scale: 1, panX: 0, panY: 0 });
    const [hover, setHover] = useState<null | { starId: number; px: number; py: number }>(null);

    const worldCenter = useMemo(() => {
        if (!pts.length) return { cxw: 0, cyw: 0 };
        const sx = pts.reduce((a, p) => a + p.X, 0);
        const sy = pts.reduce((a, p) => a + p.Y, 0);
        return { cxw: sx / pts.length, cyw: sy / pts.length };
    }, [pts]);

    useEffect(() => {
        if (!pts.length) return;

        let rMax = 1e-9;
        for (const p of pts) {
            const dx = p.X - worldCenter.cxw;
            const dy = p.Y - worldCenter.cyw;
            rMax = Math.max(rMax, Math.hypot(dx, dy));
        }

        const margin = 0.92;
        const fitScale = (diskRadius * margin) / rMax;

        setView((v) => ({
            ...v,
            scale: clamp(Math.min(1, fitScale), 0.02, 1),
            panX: 0,
            panY: 0,
        }));
    }, [pts, worldCenter.cxw, worldCenter.cyw, diskRadius]);

    const toScreen = (p: (typeof pts)[number], v: View) => {
        const xw = p.X - worldCenter.cxw;
        const yw = p.Y - worldCenter.cyw;
        return {
            sx: cx + v.panX + xw * v.scale,
            sy: cy + v.panY - yw * v.scale,
        };
    };

    const starPixelRadius = (mag: number) => {
        const m = clamp(mag, -2, 12);
        const r = 4.2 - (m + 2) * (3.2 / 14);
        return clamp(r, 1.0, 4.2);
    };

    const draw = () => {
        const c = canvasRef.current;
        if (!c) return;
        const g = c.getContext("2d");
        if (!g) return;

        g.clearRect(0, 0, width, height);

        g.fillStyle = "#06080c";
        g.fillRect(0, 0, width, height);

        g.save();
        g.beginPath();
        g.arc(cx + view.panX, cy + view.panY, diskRadius, 0, Math.PI * 2);
        g.clip();

        g.strokeStyle = "rgba(255,255,255,0.10)";
        g.lineWidth = 1;
        for (let i = 1; i <= 5; i++) {
            g.beginPath();
            g.arc(cx + view.panX, cy + view.panY, (diskRadius * i) / 5, 0, Math.PI * 2);
            g.stroke();
        }

        g.strokeStyle = "rgba(255,255,255,0.08)";
        g.beginPath();
        g.moveTo(cx + view.panX - diskRadius, cy + view.panY);
        g.lineTo(cx + view.panX + diskRadius, cy + view.panY);
        g.stroke();

        g.beginPath();
        g.moveTo(cx + view.panX, cy + view.panY - diskRadius);
        g.lineTo(cx + view.panX, cy + view.panY + diskRadius);
        g.stroke();

        for (const p of pts) {
            const { sx, sy } = toScreen(p, view);
            const dx = sx - (cx + view.panX);
            const dy = sy - (cy + view.panY);
            if (dx * dx + dy * dy > diskRadius * diskRadius) continue;

            const r = starPixelRadius(p.MAG);
            g.fillStyle = "rgba(255,255,255,0.92)";
            g.beginPath();
            g.arc(sx, sy, r, 0, Math.PI * 2);
            g.fill();
        }

        if (hover) {
            const p = pts.find((q) => q.id === hover.starId);
            if (p) {
                const { sx, sy } = toScreen(p, view);
                g.strokeStyle = "rgba(255,255,255,0.65)";
                g.lineWidth = 1.5;
                g.beginPath();
                g.arc(sx, sy, 7, 0, Math.PI * 2);
                g.stroke();
            }
        }

        g.restore();

        g.strokeStyle = "rgba(255,255,255,0.14)";
        g.lineWidth = 1;
        g.beginPath();
        g.arc(cx + view.panX, cy + view.panY, diskRadius, 0, Math.PI * 2);
        g.stroke();
    };

    useEffect(() => {
        draw();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pts, view, hover, width, height]);

    const drag = useRef<{ on: boolean; x: number; y: number } | null>(null);

    const pickStar = (mx: number, my: number) => {
        let best: { id: number; d2: number } | null = null;
        for (const p of pts) {
            const { sx, sy } = toScreen(p, view);
            const r = starPixelRadius(p.MAG) + 6;
            const dx = mx - sx;
            const dy = my - sy;
            const d2 = dx * dx + dy * dy;
            if (d2 <= r * r && (!best || d2 < best.d2)) best = { id: p.id, d2 };
        }
        return best?.id ?? null;
    };

    const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        const d = drag.current;
        if (d?.on) {
            const dx = mx - d.x;
            const dy = my - d.y;
            d.x = mx;
            d.y = my;
            setView((v) => ({ ...v, panX: v.panX + dx, panY: v.panY + dy }));
            return;
        }

        const id = pickStar(mx, my);
        if (id == null) {
            if (hover) setHover(null);
            return;
        }
        setHover({ starId: id, px: mx, py: my });
    };

    const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        drag.current = { on: true, x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onMouseUp = () => {
        if (drag.current) drag.current.on = false;
    };

    const onWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        const zoom = e.deltaY < 0 ? 1.08 : 1 / 1.08;

        setView((v) => {
            const nextScale = clamp(v.scale * zoom, 0.02, 2);
            const ax = mx - (cx + v.panX);
            const ay = my - (cy + v.panY);
            const panX = v.panX + ax - ax * (nextScale / v.scale);
            const panY = v.panY + ay - ay * (nextScale / v.scale);
            return { scale: nextScale, panX, panY };
        });
    };

    const hoveredStar = hover ? pts.find((p) => p.id === hover.starId) : null;

    return (
        <div style={{ position: "relative", width, height }}>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                style={{ width, height, display: "block", borderRadius: 14, background: "#06080c" }}
                onMouseMove={onMouseMove}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseLeave={() => {
                    if (drag.current) drag.current.on = false;
                    setHover(null);
                }}
                onWheel={onWheel}
            />

            {err && (
                <div
                    style={{
                        position: "absolute",
                        left: 12,
                        top: 12,
                        padding: "8px 10px",
                        borderRadius: 10,
                        background: "rgba(140,40,40,0.85)",
                        color: "rgba(255,255,255,0.95)",
                        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
                        fontSize: 12,
                    }}
                >
                    {err}
                </div>
            )}

            {hoveredStar && hover && (
                <div
                    style={{
                        position: "absolute",
                        left: clamp(hover.px + 14, 0, width - 220),
                        top: clamp(hover.py + 14, 0, height - 90),
                        width: 220,
                        padding: 10,
                        borderRadius: 10,
                        background: "rgba(20,24,30,0.92)",
                        color: "rgba(255,255,255,0.9)",
                        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
                        fontSize: 12,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
                        pointerEvents: "none",
                    }}
                >
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{hoveredStar.LABEL}</div>
                    <div style={{ opacity: 0.85 }}>Mag: {hoveredStar.MAG.toFixed(2)}</div>
                    <div style={{ opacity: 0.65, marginTop: 6 }}>
                        x: {hoveredStar.X.toFixed(6)} | y: {hoveredStar.Y.toFixed(6)} | z: {hoveredStar.Z.toFixed(6)}
                    </div>
                </div>
            )}
        </div>
    );
}
