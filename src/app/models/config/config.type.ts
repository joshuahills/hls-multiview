import { StreamConfig } from './stream-config.type';
import { View } from './view.enum';

export type Config = {
  streams: StreamConfig[];
  view: View;
}