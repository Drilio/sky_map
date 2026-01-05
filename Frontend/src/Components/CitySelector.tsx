export type City = {
    id: string;
    name: string;
    lat: number;
    lng: number;
};

export default function CitySelector(
    {
        cities,
        value,
        onChange,
    }: {
        cities: City[];
        value: string;
        onChange: (next: string) => void;
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
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    padding: "6px 10px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.16)",
                    background: "rgba(20,24,30,0.92)",
                    color: "rgba(255,255,255,0.92)",
                    outline: "none",
                }}
            >
                <option value="none">None (3D View)</option>
                {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                        {city.name}
                    </option>
                ))}
            </select>
        </label>
    );
}
