import type {City} from "./utils.ts";

type Props = {
    cities: City[];
    value?: City;
    onCitySelect: (next: City | undefined) => void;
};

export default function CitySelector(
    {
        cities,
        value,
        onCitySelect,
    }: Props) {
    return (
        <label
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
            }}
        >
            <span
                style={{
                    fontFamily:
                        "system-ui, -apple-system, Segoe UI, Roboto, Arial",
                    fontSize: 13,
                }}
            >
                City
            </span>

            <select
                value={value?.id ?? "none"}
                onChange={(e) => {
                    const selected = e.target.value;

                    onCitySelect(
                        selected === "none"
                            ? undefined
                            : cities.find(
                                (c) =>
                                    c.id === Number(selected)
                            )
                    );
                }}
                style={{
                    padding: "6px 10px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.16)",
                    background: "rgba(20,24,30,0.92)",
                    color: "rgba(255,255,255,0.92)",
                    outline: "none",
                    cursor: "pointer",
                }}
            >
                <option value="none">none</option>

                {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                        {city.city}
                    </option>
                ))}
            </select>
        </label>
    );
}
