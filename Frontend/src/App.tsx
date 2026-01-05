import "./App.css";
import SkyMap from "./Components/SkyMap";
import OverlayKindSelector from "./Components/OverlayKindSelector.tsx";
import {useState, useEffect} from "react";
import type {OverlayKind} from "./Api/getStars.tsx";
import CitySelector from "./Components/CitySelector.tsx";
import type {City} from "./Components/CitySelector";

// Mock function to simulate API call - replace with your actual API call
async function fetchCities(): Promise<City[]> {
    // In a real app, you would call your backend API here
    return [
        {id: "ny", name: "New York", lat: 40.7128, lng: -74.0060},
        {id: "la", name: "Los Angeles", lat: 34.0522, lng: -118.2437},
        {id: "ldn", name: "London", lat: 51.5074, lng: -0.1278},
        {id: "paris", name: "Paris", lat: 48.8566, lng: 2.3522},
        {id: "tokyo", name: "Tokyo", lat: 35.6762, lng: 139.6503},
        {id: "sydney", name: "Sydney", lat: -33.8688, lng: 151.2093},
    ];
}

export default function App() {
    const [kind, setKind] = useState<OverlayKind>("nearest");
    const [selectedCity, setSelectedCity] = useState<string>("none");
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCities = async () => {
            try {
                const citiesData = await fetchCities();
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
                    selectedCity={selectedCity}
                    cities={cities}
                />
            </div>
        </div>
    );
}
