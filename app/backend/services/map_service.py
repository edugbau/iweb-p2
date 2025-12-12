import httpx
import asyncio


class GeocodingService:
    """Servicio de geocodificación usando Nominatim (OpenStreetMap)."""
    
    NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
    # Alternativa: Photon (basado en Nominatim pero con mejor disponibilidad)
    PHOTON_URL = "https://photon.komoot.io/api/"
    MAX_RETRIES = 3
    TIMEOUT_SECONDS = 30

    async def _try_nominatim(self, address: str, client: httpx.AsyncClient) -> tuple[float, float] | None:
        """
        Intenta geocodificar usando Nominatim.
        """
        params = {
            'q': address, 
            'format': 'json', 
            'limit': 1,
            'addressdetails': 1
        }
        headers = {
            'User-Agent': 'ReViews-IWEB-Exam/1.0 (University Project; contact@university.edu)',
            'Accept': 'application/json',
            'Accept-Language': 'es,en'
        }
        
        response = await client.get(self.NOMINATIM_URL, params=params, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            if data and len(data) > 0:
                return float(data[0]['lat']), float(data[0]['lon'])
        return None

    async def _try_photon(self, address: str, client: httpx.AsyncClient) -> tuple[float, float] | None:
        """
        Intenta geocodificar usando Photon (Komoot) como fallback.
        """
        params = {
            'q': address,
            'limit': 1,
            'lang': 'es'
        }
        headers = {
            'User-Agent': 'ReViews-IWEB-Exam/1.0',
            'Accept': 'application/json'
        }
        
        response = await client.get(self.PHOTON_URL, params=params, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            features = data.get('features', [])
            if features and len(features) > 0:
                coords = features[0].get('geometry', {}).get('coordinates', [])
                if len(coords) >= 2:
                    # Photon devuelve [lon, lat], nosotros queremos (lat, lon)
                    return float(coords[1]), float(coords[0])
        return None

    async def get_coordinates(self, address: str) -> tuple[float, float] | None:
        """
        Obtiene latitud y longitud a partir de una dirección.
        Intenta primero con Nominatim y luego con Photon como fallback.
        
        :param address: Dirección en formato texto.
        :return: Tupla (lat, lng) o None si falla.
        """
        async with httpx.AsyncClient(
            timeout=httpx.Timeout(self.TIMEOUT_SECONDS),
            follow_redirects=True
        ) as client:
            
            # Intento 1: Nominatim (servicio principal)
            for attempt in range(self.MAX_RETRIES):
                try:
                    result = await self._try_nominatim(address, client)
                    if result:
                        print(f"Geocoding (Nominatim) success: {address} -> {result}")
                        return result
                    # Si no hay resultado pero no hay error, pasar a Photon
                    break
                except httpx.TimeoutException:
                    print(f"Nominatim timeout (attempt {attempt + 1}/{self.MAX_RETRIES})")
                    if attempt < self.MAX_RETRIES - 1:
                        await asyncio.sleep(1)
                except httpx.ConnectError as e:
                    print(f"Nominatim connection error: {e}")
                    break  # Pasar a Photon inmediatamente
                except Exception as e:
                    print(f"Nominatim error: {type(e).__name__}: {e}")
                    break
            
            # Intento 2: Photon (fallback)
            for attempt in range(self.MAX_RETRIES):
                try:
                    result = await self._try_photon(address, client)
                    if result:
                        print(f"Geocoding (Photon) success: {address} -> {result}")
                        return result
                    break
                except httpx.TimeoutException:
                    print(f"Photon timeout (attempt {attempt + 1}/{self.MAX_RETRIES})")
                    if attempt < self.MAX_RETRIES - 1:
                        await asyncio.sleep(1)
                except httpx.ConnectError as e:
                    print(f"Photon connection error: {e}")
                    break
                except Exception as e:
                    print(f"Photon error: {type(e).__name__}: {e}")
                    break
        
        print(f"Geocoding failed for: {address}")
        return None

