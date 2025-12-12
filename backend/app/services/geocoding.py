import httpx
import asyncio

# Use Photon instead of Nominatim (no rate limits)
PHOTON_URL = "https://photon.komoot.io/api/"

async def get_coordinates(address: str) -> tuple[float, float] | None:
    """
    Geocodes an address to (lat, lng) using Photon.
    :param address: The address string.
    :return: Tuple (lat, lng) or None if not found.
    """
    async with httpx.AsyncClient() as client:
        params = {"q": address, "limit": 1}
        
        try:
            response = await client.get(PHOTON_URL, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            
            if data.get("features"):
                coords = data["features"][0]["geometry"]["coordinates"]
                # Photon returns [lon, lat], we need [lat, lon]
                return float(coords[1]), float(coords[0])
            return None
        except Exception as e:
            # In a real app, log this error
            print(f"Geocoding error: {e}")
            return None
