import React, { useState, useEffect, useRef } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps'
import { useLocation } from '../hooks/useLocation';
import { LoadingScreen } from '../pages/LoadingScreen';
import { Fab } from './Fab';

interface Props {
    markers?: Marker[]; //arreglo de markers
}

export const Map = ({ markers }: Props) => {

    const [showPolyline, setShowPolyline] = useState(true);

    const {
        hasLocation,
        initialPosition,
        getCurrentLocation,
        followuserLocation,
        userLocation,
        stopFollowuserLocation,
        routeLines } = useLocation();

    const mapViewRef = useRef<MapView>();
    const following = useRef<boolean>(true);

    useEffect(() => {
        followuserLocation(); //posicion actual del usuario
        return () => {
            stopFollowuserLocation()
        }
    }, []);

    //escuchar cambios y seguir con la camara del gps
    useEffect(() => {

        const { latitude, longitude } = userLocation;

        if (!following.current) return; //si ya no esta siguiendo que no haga nada

        mapViewRef.current?.animateCamera({
            center: { latitude, longitude }
        })

    }, [userLocation]);

    const centerPosition = async () => {

        const { latitude, longitude } = await getCurrentLocation();

        following.current = true; //para volver a darle el seguimiento al usuario

        mapViewRef.current?.animateCamera({
            center: {
                latitude,
                longitude
            }
        })
    }

    //hasta que no tenemos una localizacion que aparesca el loading
    if (!hasLocation) {
        return <LoadingScreen />
    }

    return (
        <>
            <MapView
                ref={(el) => mapViewRef.current = el!}
                style={{ flex: 1 }}
                // provider={PROVIDER_GOOGLE} Para apple
                showsUserLocation
                region={{
                    latitude: initialPosition.latitude,
                    longitude: initialPosition.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }}
                //cuando arrastro el mapa que no
                onTouchStart={() => following.current = false}
            >

                {showPolyline && (
                    <Polyline
                        coordinates={routeLines}
                        strokeColor="red"
                        strokeWidth={3}
                    />
                )}

                {/* <Marker
                    image={require('../assets/custom-marker.png')}
                    coordinate={{
                        latitude: initialPosition.latitude,
                        longitude: initialPosition.longitude,
                    }}
                    title='Esto es un titulo'
                    description='Esto es una descripcion del marcador'
                    style={{
                        width: 20
                    }}
                /> */}
            </MapView>

            <Fab
                iconName='compass-outline'
                onPress={centerPosition}
                style={{
                    position: 'absolute',
                    bottom: 10,
                    right: 20,
                }}
            />
             <Fab
                iconName='brush-outline'
                onPress={() => setShowPolyline(value => !value)}
                style={{
                    position: 'absolute',
                    bottom: 80,
                    right: 20,
                }}
            />
        </>
    )
}
