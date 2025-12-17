import "./App.css";
import SkyMap from "./Components/SkyMap";

import rawStars from "../mock_data.json";

type StarRow = {
    id: number;
    proper: string;
    con: string;
    mag: number;
    rarad: number;
    decrad: number;
};

export default function App() {
    const stars = rawStars as unknown as StarRow[];

    return (
        <div style={{ padding: 16 }}>
            <SkyMap width={1100} height={700} stars={stars} />
        </div>
    );
}
