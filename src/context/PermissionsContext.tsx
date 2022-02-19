import React, { createContext, useEffect, useState } from 'react';
import { AppState, Platform } from 'react-native';
import { check, openSettings, PERMISSIONS, PermissionStatus, request } from 'react-native-permissions';

export interface PermissionState {
    locationStatus: PermissionStatus;

}

export const permissionInitState: PermissionState = {
    locationStatus: 'unavailable',
}

type PermissionsContextProps = {
    permissions: PermissionState;
    askLocationPermission: () => void;
    checkLocationPermission: () => void;
}

export const PermissionsContext = createContext({} as PermissionsContextProps) //que datos exporta

export const PermissionsProvider = ({ children }: any) => {

    const [permissions, setPermissions] = useState(permissionInitState)

    //listener: escucha
    useEffect(() => {
        
        checkLocationPermission();

        //escucha el estado de la app
        AppState.addEventListener('change', state => {
            if (state !== 'active') return

            checkLocationPermission(); //que pregunta de nuevo
        });

    }, [])

    const askLocationPermission = async () => {
        let permissionStatus: PermissionStatus; //tipar

        if (Platform.OS === 'ios') {
            // permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            permissionStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE); //para preguntar con un mensaje configurado en el nucleo de ios
        } else {
            // permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            permissionStatus = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        }

        if(permissionStatus === 'blocked'){
            openSettings(); //abre las configuraciones de permisos
        }

        setPermissions({
            ...permissions,
            locationStatus: permissionStatus
        })
    }

    const checkLocationPermission = async () => {
        let permissionStatus: PermissionStatus; //tipar

        if (Platform.OS === 'ios') {
            permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE); //para preguntar con un mensaje configurado en el nucleo de ios
        } else {
            permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        }

        setPermissions({
            ...permissions,
            locationStatus: permissionStatus
        })
    }

    return (
        <PermissionsContext.Provider value={{
            permissions,
            askLocationPermission,
            checkLocationPermission
        }}>
            {children}
        </PermissionsContext.Provider>
    )
}