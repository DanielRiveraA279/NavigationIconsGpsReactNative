import React, { useEffect, useState, useRef } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { Location } from '../interface/appInterface';

export const useLocation = () => {

    const [hasLocation, setHasLocation] = useState(false);
    const [routeLines, setRouteLines] = useState<Location[]>([]);

    const [initialPosition, setInitialPosition] = useState<Location>({
        longitude: 0,
        latitude: 0
    });

    const [userLocation, setUserLocation] = useState<Location>({
        longitude: 0,
        latitude: 0
    });

    const watchId = useRef<number>();

    useEffect(() => {
        getCurrentLocation()
            .then(location => {
                setInitialPosition(location);
                setUserLocation(location);
                setRouteLines(routes => [...routes, location]); //almacenamos localizacion actual y agregamos nueva localizacion
                setHasLocation(true);
            })
    }, []);

    //promesa que resuelve resultados de tipo location (interface) - Centrar la camara del Mapa
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

    //Seguir al usuario
    const followuserLocation = () => {
        //obtengo numeros para limpiar el seguimiento de la camara gps
        watchId.current = Geolocation.watchPosition(
            ({ coords }) => {

                const location: Location = {
                    latitude: coords.latitude,
                    longitude: coords.longitude
                }

                setUserLocation(location);
                setRouteLines(routes => [...routes, location])
            },
            (err) => console.log(err), { enableHighAccuracy: true /*para usar el gps*/, distanceFilter: 10 /*cad vez que pase 10 metros me va a notificars*/ },
        );
    }

    const stopFollowuserLocation = () => {
        //si tiene un valor llama al clearWatch(watchId)
        if (watchId.current)
            Geolocation.clearWatch(watchId.current);
    }

    return {
        hasLocation,
        initialPosition,
        getCurrentLocation,
        followuserLocation,
        userLocation,
        stopFollowuserLocation,
        routeLines
    }
}