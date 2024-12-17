import { HttpErrorResponse } from "@angular/common/http";
import { computed } from "@angular/core";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { CognitoUserSession } from 'amazon-cognito-identity-js';

export type AuthState = {
    userName: string | null,
    userSession: CognitoUserSession | null,
    loaded: boolean,
    error: HttpErrorResponse | null,
}

export const initialAuthState: AuthState = {
    userName: null,
    userSession: null,
    loaded: false,
    error: null,
}

export const AuthStore = signalStore(
    {
        providedIn: 'root',
    },
    withState(initialAuthState),
    withComputed(({ userSession }) => ({
        _accessToken: computed(() => {
            return userSession()?.getAccessToken()
        }),
        _idToken: computed(() => {
            return userSession()?.getIdToken()
        }),
        refreshToken: computed(() => {
            return userSession()?.getRefreshToken()
        }),
    })),
    withMethods((store) => ({
        saveAuthInfo(info: AuthState): void {
            patchState(store, {
                ...info
            })
        },
        patchLoaded(loaded: boolean): void {
            patchState(store, () => ({
                loaded
            })
            )
        },
        patchError(error: HttpErrorResponse | null): void {
            patchState(store, () => ({
                error
            })
            )
        }
    })
    )
)