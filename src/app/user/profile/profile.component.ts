import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { appEmailValidator } from 'src/app/shared/validators/app-email-validator';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

interface Profile {
  username: string;
  email: string;
  tel: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  isEditMode: boolean = false;

  profileDetails: Profile = {
    username: '',
    email: '',
    tel: '',
  };

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(5)]],
    email: [
      '',
      [Validators.required, appEmailValidator],
    ],
    tel: [''],
    // ToDo: render this from the template and make more fields on click of a button
    // persons: this.fb.array([]),
  });

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    const { username, email, tel } = this.userService.user!;
    this.profileDetails = {
      username,
      email,
      tel,
    };

    this.form.setValue({
      username,
      email,
      tel,
    });
  }
  logout(): void {
    this.userService.logout().subscribe(() => {
      this.router.navigate(['/home']);
    });
  }
  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode
}
saveProfileHandler(): void {
  if (this.form.invalid) {
    return;
  }

  this.profileDetails = { ...this.form.value } as Profile;
  const { username, email, tel } = this.profileDetails;

  this.userService.updateProfile(username!, email!, tel!).subscribe(() => {
    this.toggleEditMode();
  });
}
}