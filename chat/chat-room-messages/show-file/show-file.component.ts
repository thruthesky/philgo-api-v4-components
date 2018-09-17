import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiChatMessage, PhilGoApiService } from '../../../../philgo-api/philgo-api.service';
import { SimpleLibrary as _ } from 'ng-simple-library';


@Component({
  selector: 'app-show-file',
  templateUrl: './show-file.component.html',
  styleUrls: ['./../../../scss/index.scss', './show-file.component.scss']
})
export class ChatRoomShowFileComponent implements OnInit {

  @Input() message: ApiChatMessage;
  @Output() load = new EventEmitter<any>();

  _ = _;

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
        const re = this.philgo.getFileInfo(this.message.url);
        this.name = re.name;
        this.size = re.size;
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
