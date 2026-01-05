import type {OVERLAY_KIND} from "./utils.ts";

export default function OverlayKindSelector(
    {
        value,
        onChange,
    }: {
        value: OVERLAY_KIND;
        onChange: (next: OVERLAY_KIND) => void;
    }) {
    return (
        <label style={{display: "inline-flex", alignItems: "center", gap: 10}}>
      <span style={{fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial", fontSize: 13}}>
        Overlay
      </span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value as OVERLAY_KIND)}
                style={{
                    padding: "6px 10px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.16)",
                    background: "rgba(20,24,30,0.92)",
                    color: "rgba(255,255,255,0.92)",
                    outline: "none",
                }}
            >
                <option value="brightest">brightest</option>
                <option value="nearest">nearest</option>
                <option value="hottest">hottest</option>
                <option value="largest">largest</option>
            </select>
        </label>
    );
}
