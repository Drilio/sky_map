import SkyMap from "./Components/SkyMap.tsx";
import CitySelector from "./Components/CitySelector.tsx";
import OverlayKindSelector from "./Components/OverlayKindSelector.tsx";
import {useEffect, useState} from "react";
import type {City, OVERLAY_KIND} from "./Components/utils.ts";
import {getCities} from "./Api/getCities.ts";

export default function App() {
    const [kind, setKind] = useState<OVERLAY_KIND>("nearest");
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

    const latitude = selectedCity?.lat ?? 0;
    const longitude = selectedCity?.lng ?? 0;
    const datetime = new Date().toISOString();

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
                    latitude={latitude}
                    longitude={longitude}
                    datetime={datetime}
                />
            </div>
        </div>
    );
}
