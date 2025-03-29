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
  selectedFiles: File[] = [];
  totalSize = 0;

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

  goBack() {
    this.location.back();
  }

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
    this.totalSize = this.selectedFiles.reduce((sum, file) => sum + file.size, 0);
    
    if (this.totalSize > 100 * 1024 * 1024) {
      this.errorMessage = `Total size (${(this.totalSize / 1024 / 1024).toFixed(2)}MB) exceeds 100MB limit`;
      this.selectedFiles = [];
      this.totalSize = 0;
    } else {
      this.errorMessage = '';
    }
  }

  async onSubmit(form: NgForm): Promise<void> {
    this.errorMessage = '';
    this.successMessage = '';

    if (form.invalid) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    if (!this.selectedFiles.length) {
      this.errorMessage = 'Please select at least one file';
      return;
    }

    this.isLoading = true;

    try {
      const results = await this.uploadService.uploadFiles(this.selectedFiles, this.registrationId);
      this.successMessage = `Successfully uploaded ${results.length} file(s)!`;
      form.resetForm();
      this.selectedFiles = [];
      this.totalSize = 0;
    } catch (error: any) {
      console.error('Upload error:', error);
      this.errorMessage = error.message || 'Upload failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}