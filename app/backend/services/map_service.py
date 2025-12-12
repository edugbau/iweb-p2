import httpx
import asyncio


class GeocodingService:
    """
    Servicio de geocodificación con múltiples proveedores.
    Intenta en orden: Nominatim -> Photon -> OpenCage (si está configurado).
    """
    
    # Servicios de geocodificación gratuitos
    NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
    PHOTON_URL = "https://photon.komoot.io/api/"
    # Alternativa adicional: API de Geocode.maps.co (gratuita, sin API key para bajo volumen)
    GEOCODE_MAPS_URL = "https://geocode.maps.co/search"
    
    MAX_RETRIES = 2
    TIMEOUT_SECONDS = 15

    async def _try_nominatim(self, address: str, client: httpx.AsyncClient) -> tuple[float, float] | None:
        """Intenta geocodificar usando Nominatim (OpenStreetMap)."""
        print(f"[Geocoding] Trying Nominatim for: {address}")
        params = {
            'q': address, 
            'format': 'json', 
            'limit': 1,
            'addressdetails': 1
        }
        headers = {
            'User-Agent': 'ReViews-IWEB-Exam/1.0 (University Project)',
            'Accept': 'application/json',
            'Accept-Language': 'es,en'
        }
        
        response = await client.get(self.NOMINATIM_URL, params=params, headers=headers)
        print(f"[Geocoding] Nominatim response status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if data and len(data) > 0:
                lat, lon = float(data[0]['lat']), float(data[0]['lon'])
                print(f"[Geocoding] Nominatim found: ({lat}, {lon})")
                return lat, lon
            print("[Geocoding] Nominatim: No results found")
        return None

    async def _try_photon(self, address: str, client: httpx.AsyncClient) -> tuple[float, float] | None:
        """Intenta geocodificar usando Photon (Komoot)."""
        print(f"[Geocoding] Trying Photon for: {address}")
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
        print(f"[Geocoding] Photon response status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            features = data.get('features', [])
            if features and len(features) > 0:
                coords = features[0].get('geometry', {}).get('coordinates', [])
                if len(coords) >= 2:
                    # Photon devuelve [lon, lat], nosotros queremos (lat, lon)
                    lat, lon = float(coords[1]), float(coords[0])
                    print(f"[Geocoding] Photon found: ({lat}, {lon})")
                    return lat, lon
            print("[Geocoding] Photon: No results found")
        return None

    async def _try_geocode_maps(self, address: str, client: httpx.AsyncClient) -> tuple[float, float] | None:
        """Intenta geocodificar usando Geocode.maps.co (tercer fallback)."""
        print(f"[Geocoding] Trying Geocode.maps.co for: {address}")
        params = {
            'q': address,
            'format': 'json'
        }
        headers = {
            'User-Agent': 'ReViews-IWEB-Exam/1.0',
            'Accept': 'application/json'
        }
        
        response = await client.get(self.GEOCODE_MAPS_URL, params=params, headers=headers)
        print(f"[Geocoding] Geocode.maps.co response status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if data and len(data) > 0:
                lat, lon = float(data[0]['lat']), float(data[0]['lon'])
                print(f"[Geocoding] Geocode.maps.co found: ({lat}, {lon})")
                return lat, lon
            print("[Geocoding] Geocode.maps.co: No results found")
        return None

    async def _try_service(
        self, 
        service_name: str,
        service_func,
        address: str, 
        client: httpx.AsyncClient
    ) -> tuple[float, float] | None:
        """
        Intenta un servicio de geocodificación con reintentos.
        """
        for attempt in range(self.MAX_RETRIES):
            try:
                result = await service_func(address, client)
                if result:
                    return result
                # Sin resultado pero sin error -> no reintentar
                return None
            except httpx.TimeoutException:
                print(f"[Geocoding] {service_name} timeout (attempt {attempt + 1}/{self.MAX_RETRIES})")
                if attempt < self.MAX_RETRIES - 1:
                    await asyncio.sleep(1)
            except httpx.ConnectError as e:
                print(f"[Geocoding] {service_name} connection error: {e}")
                return None  # No reintentar errores de conexión
            except Exception as e:
                print(f"[Geocoding] {service_name} error: {type(e).__name__}: {e}")
                return None
        return None

    async def get_coordinates(self, address: str) -> tuple[float, float] | None:
        """
        Obtiene latitud y longitud a partir de una dirección.
        Intenta múltiples servicios en cascada: Nominatim -> Photon -> Geocode.maps.co
        
        :param address: Dirección en formato texto.
        :return: Tupla (lat, lng) o None si todos los servicios fallan.
        """
        print(f"\n[Geocoding] === Starting geocoding for: {address} ===")
        
        # Lista de servicios a probar en orden
        services = [
            ("Nominatim", self._try_nominatim),
            ("Photon", self._try_photon),
            ("Geocode.maps.co", self._try_geocode_maps),
        ]
        
        # Crear cliente HTTP con configuración robusta
        async with httpx.AsyncClient(
            timeout=httpx.Timeout(self.TIMEOUT_SECONDS, connect=10.0),
            follow_redirects=True,
            limits=httpx.Limits(max_connections=10)
        ) as client:
            
            for service_name, service_func in services:
                print(f"[Geocoding] Attempting {service_name}...")
                try:
                    result = await self._try_service(service_name, service_func, address, client)
                    if result:
                        print(f"[Geocoding] === SUCCESS with {service_name}: {result} ===\n")
                        return result
                    print(f"[Geocoding] {service_name} returned no results, trying next...")
                except Exception as e:
                    print(f"[Geocoding] {service_name} failed with exception: {e}")
                    continue
        
        print(f"[Geocoding] === ALL SERVICES FAILED for: {address} ===\n")
        return None

