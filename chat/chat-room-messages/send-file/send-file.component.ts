import { Component, OnInit, Input } from '@angular/core';
import { ApiChatMessage, PhilGoApiService } from '../../../../philgo-api/philgo-api.service';
import { SimpleLibrary as _ } from 'ng-simple-library';

@Component({
  selector: 'app-send-file',
  templateUrl: './send-file.component.html',
  styleUrls: ['./../../../scss/index.scss', './send-file.component.scss']
})
export class ChatRoomSendFileComponent implements OnInit {

  @Input() message: ApiChatMessage;

  _ = _;
  constructor(
    public philgo: PhilGoApiService
  ) { }

  ngOnInit() {
  }

}
