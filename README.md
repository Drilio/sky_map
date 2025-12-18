# sky_map

Full-stack Sky Map application (Frontend + Python API) packaged for local development with Docker Compose.

Repository layout (top-level): `API/`, `Frontend/`, `data/`, `.env.sample`, `docker-compose.yml`,
`init.docker-compose.yml`, `dev.yml`, `port.yml`, `requirements.txt`. :contentReference[oaicite:0]{index=0}

---

## What this project is

- **Frontend**: web UI (TypeScript-heavy). :contentReference[oaicite:1]{index=1}
- **API**: Python backend. :contentReference[oaicite:2]{index=2}
- **data/**: local data assets used by the app. :contentReference[oaicite:3]{index=3}
- **Docker**: compose files to run the stack locally / in dev-like mode. :contentReference[oaicite:4]{index=4}

---

## Quickstart

1. Create your env file from the sample:
   ```bash
   cp .env.sample .env
    ```

2. Start the stack:

    ```bash
    docker compose up --build
    ```

3. If your repo expects an initialization pass (DB seed/migrations, bootstrap, etc.), use the init compose file:

    ```bash
    docker compose -f init.docker-compose.yml up --build
    ```

Notes:

- Port mappings may be documented in port.yml.

- Dev overrides may exist in dev.yml.

## User documentation

### Accessing the app

- Start the stack (Docker section above).
- Open the Frontend URL exposed by your compose/ports configuration (check `port.yml` for the definitive mapping).

### Core workflow (typical)

- Open the web UI.
- Allow required browser permissions if prompted (e.g., location), depending on features implemented in the Frontend.
- Use the main map view to explore the sky map layers/data available in `data/` or via the API.

### Common actions

- **Refresh data**: reload the page, or use the UI refresh control if present.
- **Search / filter**: use the UI search or filters (if implemented) to locate objects/layers.
- **Switch layers**: toggle overlays or datasets exposed by the application.
