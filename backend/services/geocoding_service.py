"""
Servicio de Geocodificación usando Nominatim (OpenStreetMap).
"""

import httpx
from dataclasses import dataclass


@dataclass
class GeocodingResult:
    """
    Resultado de una operación de geocodificación.
    """
    latitude: float
    longitude: float
    display_name: str


class GeocodingService:
    """
    Servicio para convertir direcciones en coordenadas geográficas.
    Utiliza la API de Nominatim (OpenStreetMap).
    """
    
    NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
    USER_AGENT = "IWEBExamTemplate/1.0"
    
    async def geocode(self, address: str) -> GeocodingResult | None:
        """
        Convierte una dirección textual en coordenadas geográficas.
        :param address: Dirección a geocodificar.
        :return: Resultado con latitud, longitud y nombre formateado, o None si falla.
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    self.NOMINATIM_URL,
                    params={
                        "q": address,
                        "format": "json",
                        "limit": 1
                    },
                    headers={
                        "User-Agent": self.USER_AGENT
                    },
                    timeout=10.0
                )
                
                if response.status_code != 200:
                    print(f"❌ Error en geocodificación: {response.status_code}")
                    return None
                
                data = response.json()
                
                if not data:
                    print(f"❌ No se encontraron resultados para: {address}")
                    return None
                
                result = data[0]
                return GeocodingResult(
                    latitude=float(result["lat"]),
                    longitude=float(result["lon"]),
                    display_name=result.get("display_name", address)
                )
        
        except Exception as e:
            print(f"❌ Error en geocodificación: {e}")
            return None


# Instancia global del servicio
geocoding_service = GeocodingService()
