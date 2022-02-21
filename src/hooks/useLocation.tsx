import { useEffect, useState } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { Location } from '../interface/appInterface';


export const useLocation = () => {

    const [hasLocation, setHasLocation] = useState(false);
    const [initialPosition, setInitialPosition] = useState<Location>({
        longitude: 0,
        latitude: 0
    });

    useEffect(() => {
        getCurrentLocation()
            .then(location => {
                setInitialPosition(location);
                setHasLocation(true);
            })
    }, []); 

    //promesa que resuelve resultados de tipo location (interface)
    const getCurrentLocation = (): Promise<Location> => {
        return new Promise((resolve, reject) => {
            //regresa una promesa, con la posicion actual del usuario
            Geolocation.getCurrentPosition(
                ({ coords }) => {
                    resolve({
                        latitude: coords.latitude,
                        longitude: coords.longitude,
                    });
                },
                (err) => reject({ err }), { enableHighAccuracy: true /*para usar el gps*/ },
            );
        });

    }

    return {
        hasLocation,
        initialPosition,
        getCurrentLocation
    }
}