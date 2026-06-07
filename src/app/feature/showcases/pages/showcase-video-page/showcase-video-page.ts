import { Component } from '@angular/core';

import { Video } from '@app/shared/ui';

@Component({
  standalone: true,
  selector: 'app-showcase-video-page',
  imports: [Video],
  templateUrl: './showcase-video-page.html',
  styleUrl: './showcase-video-page.scss',
})
export class ShowcaseVideoPage {

}
