from geopy.distance import geodesic
IC_COORDINATES = (-9.5532191, -35.7793788)

def check_distance_from_ic(student_coordinates: tuple, max_distance_meters: float = 100.0):


    distance = geodesic(student_coordinates, IC_COORDINATES).meters

    if distance > max_distance_meters:
        raise ValueError(f"Distância muito grande: {distance:.2f} metros. Máximo permitido é {max_distance_meters} metros.")