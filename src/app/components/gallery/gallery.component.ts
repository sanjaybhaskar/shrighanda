import { Component, OnInit } from '@angular/core';
import { MediaService } from './media.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  mediaItems: any[] = [];
  videos: any = [];
  pageToken: string = '';
  selectedYear: any = 2024;
  years: number[] = [];
  currentYearVideos: number = 0;
  paginatedVideos: any[] = [];
  videosPerPage: number = 12; // Number of videos to display per page
  currentPage: number = 1;

  constructor(private mediaService: MediaService, private http: HttpClient) {}

  ngOnInit() {
    this.loadMedia();
    this.loadYouTubeVideos(this.selectedYear);
    this.loadYears();
  }

  loadMedia() {
    this.mediaService.getFacebookMedia().subscribe((fbMedia: any) => {
      this.mediaItems = fbMedia.data;
      this.mediaService.getInstagramMedia().subscribe((igMedia: any) => {
        this.mediaItems = [...this.mediaItems, ...igMedia.data];
      });
    });
  }

  loadYears() {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 6 }, (_, i) => currentYear - i); // Last 5 years
  }

  loadYouTubeVideos(year: number): void {
    const filename = `https://usercontent.one/wp/shrigandha.nl/wp-content/themes/shrighanda_new/angular-app/assets/youtube/${year}_data.json`;
    
    this.http.get<any>(filename).subscribe(data => {
      this.videos = data.items.map((item: any) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high.url,
        description: item.snippet.description,
        publishDate: item.snippet.publishedAt
      }));

      this.currentPage = 1; // Reset to first page when year changes
      this.paginateVideos();
    });
  }

  // Paginate the videos array to show only a limited number per page
  paginateVideos(): void {
    const startIndex = (this.currentPage - 1) * this.videosPerPage;
    const endIndex = startIndex + this.videosPerPage;
    this.paginatedVideos = this.videos.slice(0, endIndex);
  }

  loadMore() {
    this.currentPage++;
    this.paginateVideos();
  }

  onYearToggle(year: any) {
    this.selectedYear = year;
    this.loadYouTubeVideos(year);
  }
}