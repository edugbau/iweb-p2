import httpx

class GeocodingService:
    NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

    async def get_coordinates(self, address: str) -> tuple[float, float] | None:
        """
        Obtiene latitud y longitud a partir de una dirección.
        :param address: Dirección en formato texto.
        :return: Tupla (lat, lng) o None si falla.
        """
        async with httpx.AsyncClient() as client:
            try:
                params = {'q': address, 'format': 'json', 'limit': 1}
                headers = {'User-Agent': 'IWEB_Exam_Template/1.0'}
                response = await client.get(self.NOMINATIM_URL, params=params, headers=headers)
                
                if response.status_code == 200:
                    data = response.json()
                    if data:
                        return float(data[0]['lat']), float(data[0]['lon'])
                return None
            except Exception as e:
                print(f"Geocoding error: {e}")
                return None

