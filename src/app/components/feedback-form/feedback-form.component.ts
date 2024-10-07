import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss']
})
export class FeedbackFormComponent {
  feedbackForm: FormGroup = new FormGroup({});  // Initialize with an empty FormGroup
  captchaResponse: string | null = null; // To store the reCAPTCHA response
  captchaError: boolean = false;
  successMessage: string | null = null;
  captchaValue: number = 0;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.feedbackForm = new FormGroup({
      type: new FormControl('feedback', Validators.required),
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      message: new FormControl('', Validators.required)
    });
  }


  onSubmit() {
    if (this.feedbackForm.valid) {
      const formData = {
        ...this.feedbackForm.value
      };

      // Send form data to the WordPress REST API
      this.http.post('https://shrigandha.nl/wp-json/wc/v2/send-email', formData).subscribe(
        (response: any) => {
          console.log('Email sent successfully:', response);
          // Optionally reset the form
          this.feedbackForm.reset();
          this.successMessage = 'Email sent successfully!';
        },
        (error) => {
          this.successMessage = 'Email could not be sent.';
          console.error('Error sending email:', error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }
}
