import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

declare const google: any;

interface ProgressTrackingXHR extends XMLHttpRequest {
  _lastLoaded?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MediaUploadService {
  private readonly CLIENT_ID = environment.googleClientId;
  private readonly SCOPES = 'https://www.googleapis.com/auth/drive.file';
  private readonly MAX_TOTAL_SIZE = 100 * 1024 * 1024; // 100MB in bytes
  private accessTokenSubject = new BehaviorSubject<string | null>(null);
  private googleAuth: any;

  constructor() {
    this.loadGoogleAuthScript();
  }

  get accessToken$() {
    return this.accessTokenSubject.asObservable();
  }

  private loadGoogleAuthScript(): void {
    if (typeof google !== 'undefined') {
      this.initializeGoogleAuth();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (typeof google !== 'undefined') {
        this.initializeGoogleAuth();
      } else {
        console.error('Google API failed to load');
      }
    };
    script.onerror = () => {
      console.error('Failed to load Google API script');
    };
    document.head.appendChild(script);
  }

  private initializeGoogleAuth(): void {
    try {
      this.googleAuth = google.accounts.oauth2.initTokenClient({
        client_id: this.CLIENT_ID,
        scope: this.SCOPES,
        callback: (tokenResponse: any) => {
          if (tokenResponse && tokenResponse.access_token) {
            this.accessTokenSubject.next(tokenResponse.access_token);
          } else {
            this.accessTokenSubject.next(null);
            console.error('Authentication failed: No access token received');
          }
        },
        error_callback: (error: any) => {
          console.error('Google auth error:', error);
          this.accessTokenSubject.next(null);
        }
      });
    } catch (error) {
      console.error('Failed to initialize Google Auth:', error);
    }
  }

  signIn(): void {
    if (this.googleAuth) {
      this.googleAuth.requestAccessToken();
    } else {
      console.error('Google auth not initialized');
      // Retry initialization
      this.loadGoogleAuthScript();
    }
  }

  signOut(): void {
    const token = this.accessTokenSubject.value;
    if (token && typeof google !== 'undefined') {
      google.accounts.oauth2.revoke(token, () => {
        this.accessTokenSubject.next(null);
      });
    } else {
      this.accessTokenSubject.next(null);
    }
  }
  
  async uploadFiles(files: File[], registrationId: string, 
                   progressCallback: (progress: number) => void): Promise<any> {
    const accessToken = this.accessTokenSubject.getValue();
    if (!accessToken) throw new Error('Access token missing. Please log in.');
  
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > this.MAX_TOTAL_SIZE) {
      throw new Error(`Total size (${(totalSize / 1024 / 1024).toFixed(2)}MB) exceeds limit`);
    }
  
    let uploadedSize = 0;
    const uploadPromises = files.map(file => {
      const fileName = `${registrationId}_${file.name}`;
      const metadata = {
        name: fileName,
        mimeType: file.type,
        parents: ['root']
      };
  
      const formData = new FormData();
      formData.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
      formData.append("file", file);
  
      return new Promise((resolve, reject) => {
        const xhr: ProgressTrackingXHR = new XMLHttpRequest();
        xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');
        xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
  
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            // Track the delta since last progress event
            const delta = event.loaded - (xhr._lastLoaded || 0);
            uploadedSize += delta;
            xhr._lastLoaded = event.loaded;
            
            const progress = Math.round((uploadedSize / totalSize) * 100);
            progressCallback(progress);
          }
        };
  
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(`Failed to upload ${file.name}`));
          }
        };
  
        xhr.onerror = () => reject(new Error(`Error uploading ${file.name}`));
        xhr.send(formData);
      });
    });
  
    return Promise.all(uploadPromises);
  }
}