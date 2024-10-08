import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private fbAccessToken = 'EAARe8DY1AP8BOZBmWkx7PWwKkzZA81l1Ob98mQvsXB9tvIfaJI7s44uMTlwgr6lWT2WZCkymxCphZB2wvfw5n6ycdMQ4IRUDzrPGwZC1nSvWGDC5H8j2tGs9xZAiiAPvUR3kipChG9QLMEgCm1Hl5Bc4Prwdkfn43hfNsdnDkn2hgqhZCV5vU06AX1kmvZCbT6yK2YbKHkKJza0Y0AKA7yA9djmPRBtkrmd3YbpNR9YKqaHBS6CctXWye49SpC9v';
  private igAccessToken = 'YOUR_INSTAGRAM_ACCESS_TOKEN';
  private apiKey = 'AIzaSyDWo9xTGgr3_xQQ11RxoPvAPl04y-D0rlA'; // Replace with your API key
  private channelId = 'UCtikVLN76VEPLvAj-vrlL7A'; // Channel ID for ShrigandhaNL
  private baseUrl = 'https://www.googleapis.com/youtube/v3/search';

  constructor(private http: HttpClient) {}

  getFacebookMedia(): Observable<any> {
    const url = `https://graph.facebook.com/v21.0/me?fields=id&access_token=${this.fbAccessToken}`;
    return this.http.get<any>(url);
  }

  getInstagramMedia(): Observable<any> {
    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url&access_token=${this.igAccessToken}`;
    return this.http.get<any>(url);
  }

  getVideos(pageToken: string = '', year: string = '', maxResults: number = 12): Observable<any> {
    let url = `${this.baseUrl}?key=${this.apiKey}&channelId=${this.channelId}&part=snippet,id&order=date&maxResults=${maxResults}`;

    // Add pagination token if available
    if (pageToken) {
      url += `&pageToken=${pageToken}`;
    }

    // Add year filter if provided
    if (year) {
      url += `&publishedAfter=${year}-01-01T00:00:00Z`;
      url += `&publishedBefore=${year}-12-31T23:59:59Z`;
    }

    return this.http.get<any>(url);
  }
}
