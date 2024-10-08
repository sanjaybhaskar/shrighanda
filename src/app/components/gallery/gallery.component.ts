import { Component, OnInit } from '@angular/core';
import { MediaService } from './media.service';

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

  constructor(private mediaService: MediaService) {}

  ngOnInit() {
    this.loadMedia();
    this.loadVideos();
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
    this.years = Array.from({ length: 5 }, (_, i) => currentYear - i); // Last 5 years
  }

  loadVideos() {
    this.mediaService.getVideos(this.pageToken, this.selectedYear).subscribe(data => {
      this.videos = data.items;
      this.pageToken = data.nextPageToken; // Update page token for pagination
      this.currentYearVideos = data.items.length; // Store current year video count
    });
  }

  loadMore() {
    if (this.pageToken) {
      this.mediaService.getVideos(this.pageToken, this.selectedYear).subscribe(data => {
        this.videos.push(...data.items);
        this.pageToken = data.nextPageToken; // Update page token for pagination
      });
    }
  }

  onYearToggle(year: any) {
    this.selectedYear = this.selectedYear === year ? '' : year; // Toggle the year selection
    this.videos = []; // Reset the video list
    this.pageToken = ''; // Reset the page token
    this.loadVideos(); // Load videos for the selected year
  }
}