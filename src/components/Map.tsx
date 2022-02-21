import React, { useEffect, useRef } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import { useLocation } from '../hooks/useLocation';
import { LoadingScreen } from '../pages/LoadingScreen';
import { Fab } from './Fab';

interface Props {
    markers?: Marker[]; //arreglo de markers
}

export const Map = ({ markers }: Props) => {

    const { hasLocation, initialPosition, getCurrentLocation } = useLocation();

    const mapViewRef = useRef<MapView>();

    const centerPosition = async () => {

        const { latitude, longitude } = await getCurrentLocation();

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
                region={{
                    latitude: initialPosition.latitude,
                    longitude: initialPosition.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }}
            >
                {/* <Marker
                    image={require('../assets/custom-marker.png')}
                    coordinate={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                    }}
                    title='Esto es un titulo'
                    description='Esto es una descripcion del marcador'
                /> */}
            </MapView>

            <Fab
                iconName='compass-outline'
                onPress={centerPosition}
                style={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                }}
            />
        </>
    )
}
