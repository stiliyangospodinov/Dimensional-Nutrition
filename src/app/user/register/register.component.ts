import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { appEmailValidator } from 'src/app/shared/validators/app-email-validator';
import { matchPasswordsValidator } from 'src/app/shared/validators/match-passwords-validator';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form = this.fb.group({
    username: ["", [Validators.required, Validators.minLength(5)]],
    email: ["", [Validators.required, appEmailValidator()]],
    tel: [''],
    passGroup: this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        rePassword: ['', [Validators.required]],
      },
      {
        validators: [matchPasswordsValidator('password', 'rePassword')],
      }
    ),
  });

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder) {}
  
  register(): void {
    if (this.form.invalid) {
      return;
    }
  
    const {
      username,
      tel,
      email,
      passGroup: { password, rePassword } = {},
    } = this.form.value;
    if (!username || !email || !tel || !password || !rePassword) {
      return;
    }
    const userData = { username, email, tel, password, rePassword };
    console.log('Data to be sent to Firebase Authentication:', userData);
  
  
    this.userService
      .register(username, email,tel, password,rePassword)
        this.router.navigate(['/products']);
    
  }
}
