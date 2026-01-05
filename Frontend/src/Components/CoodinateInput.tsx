import React, {useEffect, useState} from "react";
import "../assets/CoordinateInput.css";

interface CoordinateInputProps {
    onCoordinatesChange: (latitude: number, longitude: number) => void;
    initialLatitude?: number;
    initialLongitude?: number;
}

export default function CoordinateInput(
    {
        onCoordinatesChange,
        initialLatitude = 0,
        initialLongitude = 0,
    }: CoordinateInputProps) {
    const [latitude, setLatitude] = useState(initialLatitude.toString());
    const [longitude, setLongitude] = useState(initialLongitude.toString());
    const [latError, setLatError] = useState("");
    const [lonError, setLonError] = useState("");

    useEffect(() => {
        setLatitude(initialLatitude.toString());
        setLongitude(initialLongitude.toString());
        setLatError("");
        setLonError("");
    }, [initialLatitude, initialLongitude]);

    const validateLatitude = (value: string): boolean => {
        const num = parseFloat(value);
        if (isNaN(num)) {
            setLatError("Please enter a valid number");
            return false;
        }
        if (num < -90 || num > 90) {
            setLatError("Latitude must be between -90° and 90°");
            return false;
        }
        setLatError("");
        return true;
    };

    const validateLongitude = (value: string): boolean => {
        const num = parseFloat(value);
        if (isNaN(num)) {
            setLonError("Please enter a valid number");
            return false;
        }
        if (num < -180 || num > 180) {
            setLonError("Longitude must be between -180° and 180°");
            return false;
        }
        setLonError("");
        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateLatitude(latitude) && validateLongitude(longitude)) {
            onCoordinatesChange(parseFloat(latitude), parseFloat(longitude));
        }
    };

    return (
        <form className="coord-card" onSubmit={handleSubmit}>
            <div className="coord-header">Coordinates</div>

            <div className="coord-group">
                <label className="coord-label">
                    Latitude <span className="coord-hint">(-90° to 90°)</span>
                </label>
                <input
                    className={`coord-input ${latError ? "error" : ""}`}
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="48.8566"
                />
                {latError && <div className="coord-error">{latError}</div>}
            </div>

            <div className="coord-group">
                <label className="coord-label">
                    Longitude <span className="coord-hint">(-180° to 180°)</span>
                </label>
                <input
                    className={`coord-input ${lonError ? "error" : ""}`}
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="2.3522"
                />
                {lonError && <div className="coord-error">{lonError}</div>}
            </div>

            <button type="submit" className="coord-button">
                Apply Coordinates
            </button>
        </form>
    );
}
