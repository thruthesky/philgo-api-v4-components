import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiChatMessage, PhilGoApiService } from '../../../philgo-api/philgo-api.service';

@Component({
  selector: 'app-show-file',
  templateUrl: './show-file.component.html',
  styleUrls: ['./show-file.component.scss']
})
export class ChatRoomShowFileComponent implements OnInit {

  @Input() message: ApiChatMessage;
  @Output() load = new EventEmitter<any>();

  clicked = false;

  name = '';
  size = '';

  constructor(
    public philgo: PhilGoApiService
  ) { }

  ngOnInit() {
    console.log('onInit', this.message);
    if (this.philgo.isImageType(this.message.type)) {

    } else {
      if (this.message.url) {
        const filename = this.message.url.split('/').pop().split('-').pop();
        const li = filename.lastIndexOf('.');
        const v = filename.substr(0, li);
        if (v) {
          this.name = v.substr(0, v.lastIndexOf(' '));
          this.size = v.substr(v.lastIndexOf(' ') + 1);
          console.log('info name: ', this.name);
          console.log('info size: ', this.size);
        }
      }
    }
  }

  fileName() {
    return this.name;
  }

  fileSize() {
    return this.size;
  }

  onClickPhoto() {
    this.clicked = !this.clicked;
  }
  onImageLoad() {
    // alert('image loaded');
    this.load.emit();
  }

  onClickFile() {
  }
}
