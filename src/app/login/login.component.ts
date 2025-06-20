import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../api/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class LoginComponent {
  form: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
  if (this.form.invalid) return;

  const { username, password } = this.form.value;

  this.userService.loginUser$Xml({ username, password }).subscribe({
    next: async (response: any) => {
      if (response instanceof Blob) {
        const text = await response.text();
        const sessionId = text.split(':')[1]?.trim();
        localStorage.setItem('authToken', sessionId || 'demo-token');
        this.router.navigate(['/']);
      } else {
        const sessionId = response.split(':')[1]?.trim();
        localStorage.setItem('authToken', sessionId || 'demo-token');
        this.router.navigate(['/']);
      }
    },
    error: (err) => {
      this.error = 'Invalid username or password';
    },
  });
}
}
