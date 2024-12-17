import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AuthenticationService } from '@unsoul-mfe/auth';
import { Observable, map, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

@UntilDestroy()
@Component({
  imports: [CommonModule, RouterModule],
  selector: 'nx-mfe-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthenticationService);
  private readonly router = inject(Router);

  isLoggedIn$ = this.authService.isAuthenticated$;

  readonly showHeader$ = this.router.events.pipe(
    map(event => {
      if (event instanceof NavigationEnd) {
        return !event.url.endsWith('login');
      }
      return true;
    })
  )

  ngOnInit(): void {
    this.listenLogginState();
  }

  ngOnDestroy(): void {
    console.log('Destroyed');
  }

  private listenLogginState(): void {
    this.isLoggedIn$.pipe(
      untilDestroyed(this),
      tap(isLoggedIn => {
        if (!isLoggedIn) {
          this.router.navigate(['login']);
        } else {
          this.router.navigate(['/']);
        }
      })
    ).subscribe();
  }

  logout(): void {
    this.authService.logout();
  }
}
