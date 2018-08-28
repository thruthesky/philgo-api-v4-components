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
  constructor(
    public philgo: PhilGoApiService
  ) { }

  ngOnInit() {
    console.log('onInit', this.message);
    if ( this.philgo.isImageType( this.message.type ) ) {

    } else {
      if ( this.message.url ) {
        const filename = this.message.url.split('/').pop().split('-').pop();
        const li = filename.lastIndexOf('.');
        const v = filename.substr( 0, li );
        if ( v ) {
          const name = v.substr( 0, v.lastIndexOf(' ') );
          const size = v.substr( v.lastIndexOf(' ') + 1 );
            console.log('info name: ', name);
            console.log('info size: ', size);
        }
      }
      
    }
  }

  onClickPhoto() {
    this.clicked = !this.clicked;
  }
  onImageLoad() {
    // alert('image loaded');
    this.load.emit();
  }
}
