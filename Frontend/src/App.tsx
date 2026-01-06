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
    const [latitude, setLatitude] = useState<number>(-23.5504);
    const [longitude, setLongitude] = useState<number>(-46.6339);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadCities = async () => {
            try {
                const citiesData = await getCities();
                setCities(citiesData);
                // Set first city as default
                if (citiesData.length > 0) {
                    setSelectedCity(citiesData[0]);
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load cities");
            } finally {
                setLoading(false);
            }
        };

        loadCities();
    }, []);

    useEffect(() => {
        if (selectedCity) {
            setLatitude(selectedCity.lat);
            setLongitude(selectedCity.lng);
        }
    }, [selectedCity]);

    if (loading) return <div>Loading cities...</div>;
    if (error) return <div>Error: {error}</div>;

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
                        latitude={latitude}
                        longitude={longitude}
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
                        datetime={selectedDate}
                    />
                </div>
            </div>
        </div>
    );
}
