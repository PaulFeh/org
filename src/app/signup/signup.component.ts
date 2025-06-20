import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../api/services/user.service'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class SignupComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: [''],
      lastName: [''],
      phone: [''],
    });
  }

  signup() {
    if (this.form.valid) {
      const formValue = this.form.value;

      const newUser = {
        id: Date.now(),
        username: formValue.username,
        password: formValue.password,
        email: formValue.email,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        phone: formValue.phone,
        userStatus: 1,
      };

      this.userService.createUser$Json$Json({ body: newUser }).subscribe({
        next: () => {
          this.userService.loginUser$Xml({
            username: newUser.username,
            password: newUser.password
          }).subscribe({
            next: (response: string) => {
              const sessionId = response.split(':')[1]?.trim();
              localStorage.setItem('authToken', sessionId || 'demo-token');
              this.router.navigate(['/']);
            },
            error: (err) => {
              console.error('Login failed:', err);
              alert('Signup succeeded, but login failed. Please try logging in manually.');
            }
          });
        },
        error: (err) => {
          console.error('Signup failed:', err);
          alert('User creation failed. Try a different username or try again later.');
        },
      });
    }
  }
}
