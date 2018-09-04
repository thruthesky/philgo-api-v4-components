import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ApiChatRoomCreateRequest, PhilGoApiService, ApiErrorResponse } from '../../../philgo-api/philgo-api.service';
import { LanguageTranslate } from '../../../language-translate/language-translate';

@Component({
  selector: 'app-chat-create-room-component',
  templateUrl: './chat-create-room.component.html',
  styleUrls: ['./../../scss/index.scss', './chat-create-room.component.scss']
})
export class ChatCreateRoomComponent implements OnInit {

  @Output() error = new EventEmitter<ApiErrorResponse>();
  @Output() cancel = new EventEmitter<any>();

  form: ApiChatRoomCreateRequest = <any>{};
  constructor(
    private router: Router,
    public philgo: PhilGoApiService,
    public tr: LanguageTranslate
  ) {
    //
    // this.test();
  }

  // test() {
  //   this.form.name = 'abc';
  //   this.form.description = 'this is abc room';
  //   this.onSubmit();
  // }

  ngOnInit() {
  }

  onSubmit() {
    // console.log('onSubmit(): create room: ', this.form);
    this.philgo.chatRoomCreate(this.form).subscribe(res => {
      // console.log('create: ', res);
      this.router.navigateByUrl('/room/' + res.idx);
    }, e => {
      // console.error(e);
      this.error.emit(e);
    });
  }
  onCancel() {
    // console.log('onCancel: ');
    this.cancel.emit();
  }
}


