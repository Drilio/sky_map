import type {City} from "./utils.ts";

export default function CitySelector(
    {
        cities,
        value,
        onChange,
    }: {
        cities: City[];
        value: City | undefined;
        onChange: (next: City | undefined) => void;
    }) {
    return (
        <label style={{display: "inline-flex", alignItems: "center", gap: 10}}>
      <span style={{
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
          fontSize: 13
      }}>
        City View
      </span>
            <select
                value={value?.id ?? "none"}
                onChange={(e) => {
                    const selectedValue = e.target.value;
                    if (selectedValue === "none") {
                        onChange(undefined);
                    } else {
                        const selectedId = Number(selectedValue);
                        const selectedCity = cities.find(city => city.id === selectedId);
                        if (selectedCity) {
                            onChange(selectedCity);
                        }
                    }
                }}
                style={{
                    padding: "6px 10px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.16)",
                    background: "rgba(20,24,30,0.92)",
                    color: "rgba(255,255,255,0.92)",
                    outline: "none",
                }}
            >
                <option value="none">Select a city</option>
                {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                        {city.city}
                    </option>
                ))}
            </select>
        </label>
    );
}
