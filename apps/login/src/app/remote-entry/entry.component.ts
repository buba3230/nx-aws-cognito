import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '@unsoul-mfe/auth';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'nx-mfe-login-entry',
  templateUrl: 'entry.component.html',
  styleUrls: ['entry.component.scss']
})
export class RemoteEntryComponent {
  emailControl = new FormControl('', [Validators.required]);
  passwordControl = new FormControl('', [Validators.required, Validators.minLength(8)]);

  loginForm = new FormGroup({
    email: this.emailControl,
    password: this.passwordControl,
  });

  constructor(private authService: AuthenticationService){}

  onSubmit(): void {
    const { email, password } = this.loginForm.value;

    if (email && password) {
      this.authService.login(email, password);
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
