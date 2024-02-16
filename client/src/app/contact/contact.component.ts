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
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import {environment} from "../../environments/environment";

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
  error!: HttpErrorResponse | string;
  data!: any;
  honeypot = false;

  emailField = this.contactForm.get('email');
  nameField = this.contactForm.get('name');
  phoneField = this.contactForm.get('phone');
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
        emailjs
          .send(environment.SERVICE_ID, environment.TEMPLATE_ID, {
            "from_name": this.nameField?.value,
            "message": this.messageField?.value,
            "phone": this.phoneField?.value,
            "email": this.emailField?.value
          }, {
            publicKey: environment.PUBLIC_KEY,
          })
          .then(
            () => {
              this.messageDiv.nativeElement.focus();
            },
            (error) => {
              console.log('FAILED...', (error as EmailJSResponseStatus).text);
              this.error = "Something went wrong. Try again later, or call 715-568-2211.";
              this.messageDiv.nativeElement.focus();
            },
          );
      }
    }
  }
}
