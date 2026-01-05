import {useEffect, useState} from "react";

import SkyMap from "./Components/SkyMap.tsx";
import CitySelector from "./Components/CitySelector.tsx";
import OverlayKindSelector from "./Components/OverlayKindSelector.tsx";
import CoordinateInput from "./Components/CoodinateInput.tsx";
import './App.css'
import type {City, OVERLAY_KIND} from "./Components/utils.ts";
import {getCities} from "./Api/getCities.ts";
import DateTimePicker from "./Components/DateTimePicker.tsx";

export default function App() {
    const [kind, setKind] = useState<OVERLAY_KIND>("nearest");

    const [cities, setCities] = useState<City[]>([]);
    const [selectedCity, setSelectedCity] = useState<City | undefined>();
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        const now = new Date();
        return now.toISOString().slice(0, 19).replace("T", " ");
    });
    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    console.log(selectedDate)
    useEffect(() => {
        const loadCities = async () => {
            try {
                setCities(await getCities());
            } catch (err) {
                console.error(err);
                setError("Failed to load cities");
            } finally {
                setLoading(false);
            }
        };

        loadCities();
    }, []);

    // ✅ Sync coordinates when a city is selected
    useEffect(() => {
        if (selectedCity) {
            setLatitude(selectedCity.lat);
            setLongitude(selectedCity.lng);
        }
    }, [selectedCity]);

    if (loading) return <div>Loading cities...</div>;
    if (error) return <div>Error: {error}</div>;

    const datetime = new Date().toISOString();

    return (
        <div className="app">
            <div className="top-bar">
                <OverlayKindSelector value={kind} onChange={setKind}/>
                <CitySelector
                    cities={cities}
                    value={selectedCity}
                    onCitySelect={setSelectedCity}
                />
                <DateTimePicker
                    value={selectedDate}
                    onChange={setSelectedDate}
                />
            </div>

            <div className="content-wrapper">
                <div className="main-layout">
                    <CoordinateInput
                        initialLatitude={latitude}
                        initialLongitude={longitude}
                        onCoordinatesChange={(lat, lng) => {
                            setLatitude(lat);
                            setLongitude(lng);
                            setSelectedCity(undefined);
                        }}
                    />

                    <SkyMap
                        kind={kind}
                        limit={50}
                        latitude={latitude}
                        longitude={longitude}
                        datetime={datetime}
                    />
                </div>
            </div>
        </div>
    );
}
