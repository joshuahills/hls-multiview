import { Component, OnInit } from '@angular/core';

import { View } from './models/config';
import { StreamConfig } from './models/config/stream-config.type';
import { ConfigService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'HLS Multiview';
  streamsConfig: StreamConfig[];
  view: View;
  streams: string[] = [];
  View: typeof View = View;

  viewStreamsCounts: Record<View, number> = {
    [View.OneByOne]: 1,
    [View.TwoByTwo]: 4,
  };

  constructor(config: ConfigService) {
    this.streamsConfig = config.streamsConfig;
    this.view = config.viewConfig;
  }

  ngOnInit(): void {
    this.validate();
  }
  
  validate(): void {
    if (!Object.values(View).includes(this.view))
      console.error(`Invalid config for view: ${this.view}. Allowed values are: ${Object.values(View)}`);

    const maxStreams = this.viewStreamsCounts[this.view];
    if (this.streamsConfig.length > maxStreams) {
      console.warn(`More streams than view can handle. Only the first ${maxStreams} streams will be shown.`);
      this.streamsConfig = this.streamsConfig.slice(0, maxStreams);
    }
  }
}
