import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class MediaUploadService {
  private readonly CLIENT_ID = environment.googleClientId;
  private readonly SCOPES = 'https://www.googleapis.com/auth/drive.file';
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

  async uploadFile(file: File, registrationId: string): Promise<any> {
    const accessToken = this.accessTokenSubject.getValue();
    if (!accessToken) {
      throw new Error('Access token is missing. User must log in.');
    }

    const fileName = `${registrationId}_${file.name}`;
    
    const metadata = {
      name: fileName,
      mimeType: file.type,
      parents: ['root']
    };

    const formData = new FormData();
    formData.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );
    formData.append("file", file);

    try {
      const response = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }
}