import { Injectable, inject } from "@angular/core";
import { AuthenticationDetails, CognitoUser, CognitoUserPool, CognitoUserSession } from 'amazon-cognito-identity-js';
import { POOL_DATA } from '@config';
import { AuthState, AuthStore, initialAuthState } from '@unsoul-mfe/unsoul-data-access-auth';
import { BehaviorSubject } from 'rxjs'


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private readonly authStore = inject(AuthStore);
    
    public isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    login(email: string, password: string): void {
        if (email && password) {
            let authenticationDetails = new AuthenticationDetails({
              Username: email,
              Password: password,
            });
      
            let userPool = new CognitoUserPool(POOL_DATA);
            let userData = {
              Username: email,
              Pool: userPool,
            };
            this.isAuthenticated$.next(true);
            let cognitoUser = new CognitoUser(userData);
            cognitoUser.authenticateUser(authenticationDetails, {
              onSuccess: (result: CognitoUserSession) => {
                const currentUser: CognitoUser | null = userPool.getCurrentUser();
                this.isAuthenticated$.next(true);
                const state: AuthState = {
                  userName: currentUser? currentUser.getUsername() : null,
                  userSession: result,
                  loaded: true,
                  error: null
                };
                console.log(result);
                this.authStore.saveAuthInfo(state);
              },
      
              onFailure: (err) => {
                alert(err.message || JSON.stringify(err));
                this.authStore.patchError(err);
                this.isAuthenticated$.next(false);
              },
            });
          }
    }

    logout(): void {
        let userPool = new CognitoUserPool(POOL_DATA);
        let cognitoUser = userPool.getCurrentUser();
        cognitoUser?.signOut();
        this.authStore.saveAuthInfo(initialAuthState);
        this.isAuthenticated$.next(false);
    }
}
