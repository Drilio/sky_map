import "./App.css";
import SkyMap from "./Components/SkyMap";
import OverlayKindSelector from "./Components/OverlayKindSelector.tsx";
import {useState} from "react";
import type {OverlayKind} from "./Api/getStars.tsx";

export default function App() {
    const [kind, setKind] = useState<OverlayKind>("nearest");

    return (
        <div style={{ padding: 16 }}>
            <OverlayKindSelector value={kind} onChange={setKind} />
            <div style={{ marginTop: 12 }}>
                <SkyMap kind={kind} limit={50} />
            </div>
        </div>
    );
}
