import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-media-upload',
  templateUrl: './media-upload.component.html',
  styleUrls: ['./media-upload.component.scss']
})
export class MediaUploadComponent {
  registrationId: string = '';
  selectedFiles: File[] = [];
  totalSize: number = 0;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  uploadProgress = 0;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
    this.totalSize = this.selectedFiles.reduce((sum, file) => sum + file.size, 0);
  }

  triggerFileInput() {
    document.getElementById('fileUpload')?.click();
  }

  onSubmit(form: any) {
    if (!this.registrationId || this.selectedFiles.length === 0) {
      this.errorMessage = 'Please provide a Registration ID and select files.';
      return;
    }

    const formData = new FormData();
    this.selectedFiles.forEach((file, index) => {
      const renamedFile = new File([file], `${this.registrationId}_${index + 1}.${file.name.split('.').pop()}`, {
        type: file.type
      });
      formData.append('files[]', renamedFile);
    });

    formData.append('registrationId', this.registrationId);

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.uploadProgress = 0;

    this.http.post('https://shrigandha.nl/wp-json/wc/v2/upload', formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event: any) => {
        if (event.type === 1 && event.total) {
          this.uploadProgress = Math.round((event.loaded / event.total) * 100);
        } else if (event.body) {
          this.successMessage = 'Files uploaded successfully!';
          this.selectedFiles = [];
          this.totalSize = 0;
          form.resetForm();
        }
      },
      error: () => {
        this.errorMessage = 'File upload failed!';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

}