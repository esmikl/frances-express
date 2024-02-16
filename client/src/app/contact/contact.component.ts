import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClientModule, HttpErrorResponse} from "@angular/common/http";
import {ContactService} from "./contact.service";
import { Contact } from './contact';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, RouterLink],
  providers: [ContactService],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  @ViewChild('message') messageDiv!: ElementRef;

  contactForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    secondary: new FormControl(''),
    name: new FormControl('', Validators.required),
    message: new FormControl('', Validators.required),
    phone: new FormControl()
  });

  submitted = false;
  error!: HttpErrorResponse;
  data!: any;
  honeypot = false;

  emailField = this.contactForm.get('email');
  nameField = this.contactForm.get('name');
  messageField = this.contactForm.get('message');
  secondaryField = this.contactForm.get('secondary');

  constructor(private contactService: ContactService) { }

  emailValidationMessage() {
    if (this.emailField) {
      return this.emailField.hasError('required') ? 'Please enter an email' :
        this.emailField.hasError('email') ? 'Not a valid email' : '';
    } else {
      return;
    }
  }

  nameValidationMessage() {
    if (this.nameField) {
      return this.nameField.hasError('required') ? 'Please enter your name' : '';
    } else {
      return;
    }
  }

  messageValidationMessage() {
    if (this.messageField) {
      return this.messageField.hasError('required') ? 'Please enter a message' : '';
    } else {
      return;
    }
  }

  onSubmit() {
    if (this.contactForm && this.secondaryField) {
      if (this.contactForm.valid && this.secondaryField.value) {
        this.submitted = true;
        this.honeypot = true;
      }
      if (this.contactForm.valid && !this.honeypot) {
        this.submitted = true;
        return this.contactService.contactForm(this.contactForm.getRawValue()).subscribe((res: Contact) => {
          this.data = res;
          console.log(res);
          this.messageDiv.nativeElement.focus();
        }, (error: HttpErrorResponse) => {
          this.error = error;
          this.messageDiv.nativeElement.focus();
        });
      }
    }
  }
}
