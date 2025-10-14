from geopy.distance import geodesic

def check_distance(scan_latitude: float, scan_longitude: float, token_latitude: float, token_longitude: float, max_distance_meters: float = 100.0):
    scan_coords = (scan_latitude, scan_longitude)
    token_coords = (token_latitude, token_longitude)
    
    distance = geodesic(scan_coords, token_coords).meters
    
    if distance > max_distance_meters:
        raise ValueError(f"Distância muito grande: {distance:.2f} metros. Máximo permitido é {max_distance_meters} metros.")