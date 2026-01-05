import "./App.css";
import SkyMap from "./Components/SkyMap";
import OverlayKindSelector from "./Components/OverlayKindSelector.tsx";
import {useState, useEffect} from "react";
import type {OverlayKind} from "./Api/getStars.ts";
import CitySelector from "./Components/CitySelector.tsx";
import type {City} from "./Components/utils.ts";
import {getCities} from "./Api/getCities.ts";

export default function App() {
    const [kind, setKind] = useState<OverlayKind>("nearest");
    const [selectedCity, setSelectedCity] = useState<City | undefined>();
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCities = async () => {
            try {
                const citiesData = await getCities();
                setCities(citiesData);
            } catch (err) {
                setError("Failed to load cities");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadCities();
    }, []);

    if (loading) {
        return <div>Loading cities...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div style={{padding: 16}}>
            <div style={{
                display: "flex",
                gap: 16,
                alignItems: "center",
                marginBottom: 12
            }}>
                <OverlayKindSelector value={kind} onChange={setKind}/>
                <CitySelector
                    cities={cities}
                    value={selectedCity}
                    onChange={setSelectedCity}
                />
            </div>
            <div style={{marginTop: 12}}>
                <SkyMap
                    kind={kind}
                    limit={50}
                />
            </div>
        </div>
    );
}
