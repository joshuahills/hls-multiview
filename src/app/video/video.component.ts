import { StreamConfig } from './../models/config/stream-config.type';
import { Component, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import Hls from 'hls.js';

@Component({
  selector: 'multiview-video',
  templateUrl: './video.component.html',
})
export class VideoComponent implements AfterViewInit {
  @Input({ required: true }) stream: StreamConfig = null!;
  @ViewChild('video', { static: true }) videoEl?: ElementRef<HTMLVideoElement>;
  ngAfterViewInit(): void {
    this.create();
  }

  create = () => {
    if (!this.videoEl) throw new Error('Video element not found');

    if (!this.stream.hlsAddress.endsWith('.m3u8')) {
      console.log(`Stream address ${this.stream.hlsAddress} does not end with .m3u8, appending "index.m3u8"`);
      this.stream.hlsAddress += '/index.m3u8';
    }

    if (Hls.isSupported()) {
      var hls = new Hls({
        lowLatencyMode: true,
      });

      hls.on(Hls.Events.ERROR, (evt, data) => {
        console.warn('HLS Error:', evt, data);
        if (data.fatal) {
          console.error('HLS Fatal Error, re-creating stream in 2 seconds');
          hls.destroy();
          setTimeout(this.create, 2000);
        }
      });

      hls.loadSource(this.stream.hlsAddress);
      hls.attachMedia(this.videoEl.nativeElement);
      this.videoEl.nativeElement.controls = true;
      this.videoEl.nativeElement.muted = true;
      this.videoEl.nativeElement.play();
    }
  };
}
