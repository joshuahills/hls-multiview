import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import { Config, StreamConfig, View } from '../models/config';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private appConfig: Config | undefined;
  private http : HttpClient;
  
  constructor(http: HttpClient) {
	  this.http = http;
  }

  async loadAppConfig() {
    return lastValueFrom(this.http.get<Config>('/assets/config.json'))
      .then(config => this.appConfig = config);
  }

  get config(): Config | undefined {
    return this.appConfig;
  }

  get streamsConfig(): StreamConfig[] {
    return this.config?.streams ?? [];
  }

  get viewConfig(): View {
    return this.config?.view ?? View.OneByOne;
  }
}
