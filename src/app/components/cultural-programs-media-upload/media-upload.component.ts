import { Component, OnInit } from '@angular/core';
import { MediaUploadService } from './media-upload-service';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-media-upload',
  templateUrl: './media-upload.component.html',
  styleUrls: ['./media-upload.component.scss']
})
export class MediaUploadComponent implements OnInit {
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  registrationId = '';
  accessToken: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private uploadService: MediaUploadService,
    private location: Location
  ) {}

  ngOnInit() {
    this.uploadService.accessToken$.subscribe({
      next: (token) => {
        this.accessToken = token;
        if (token) {
          this.errorMessage = '';
        }
      },
      error: (err) => {
        console.error('Token error:', err);
        this.errorMessage = 'Authentication error. Please try again.';
      }
    });
  }

  signIn() {
    this.uploadService.signIn();
  }

  signOut() {
    this.uploadService.signOut();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Check file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        this.errorMessage = 'File size exceeds 100MB limit';
        this.selectedFile = null;
        return;
      }
      this.selectedFile = file;
      this.errorMessage = '';
    }
  }

  goBack() {
    this.location.back();
  }

  async onSubmit(form: NgForm): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    if (form.invalid) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file to upload';
      return;
    }

    this.isLoading = true;

    try {
      await this.uploadService.uploadFile(this.selectedFile, this.registrationId);
      this.successMessage = 'File uploaded successfully!';
      form.resetForm();
      this.selectedFile = null;
    } catch (error: any) {
      console.error('Upload error:', error);
      this.errorMessage = error.message || 'Upload failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}