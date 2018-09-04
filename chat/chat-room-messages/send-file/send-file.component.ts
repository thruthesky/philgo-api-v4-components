import { Component, OnInit, Input } from '@angular/core';
import { ApiChatMessage, PhilGoApiService } from '../../../../philgo-api/philgo-api.service';
import { LanguageTranslate } from '../../../../language-translate/language-translate';

@Component({
  selector: 'app-send-file',
  templateUrl: './send-file.component.html',
  styleUrls: ['./../../../scss/index.scss', './send-file.component.scss']
})
export class ChatRoomSendFileComponent implements OnInit {

  @Input() message: ApiChatMessage;
  constructor(
    public philgo: PhilGoApiService,
    public tr: LanguageTranslate
  ) { }

  ngOnInit() {
  }

}
