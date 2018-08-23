import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ApiChatRoom, PhilGoApiService, ApiErrorResponse } from '../../philgo-api/philgo-api.service';
import { LanguageTranslate } from '../../language-translate/language-translate';
import { AngularLibrary } from '../../angular-library/angular-library';

@Component({
  selector: 'app-chat-my-rooms-component',
  templateUrl: './chat-my-rooms.component.html',
  styleUrls: ['./chat-my-rooms.component.scss']
})
export class ChatMyRoomsComponent implements OnInit, OnDestroy {

  @Output() error = new EventEmitter<ApiErrorResponse>();
  @Input() share = {};
  rooms: Array<ApiChatRoom> = [];
  roomsBackup: Array<ApiChatRoom> = [];


  isMobileWeb = AngularLibrary.isMobileWeb();
  show = {
    loader: {
      roomList: true
    }
  };
  constructor(
    private router: Router,
    public philgo: PhilGoApiService,
    public tr: LanguageTranslate
  ) {
    this.loadMyChatRoomList();
  }

  ngOnInit() {
  }
  ngOnDestroy() {
  }

  loadMyChatRoomList() {
    this.show.loader.roomList = true;

    this.philgo.chatDoMyRooms().subscribe( res => {
      this.show.loader.roomList = false;
    }, e => {
      this.show.loader.roomList = false;
      this.error.emit(e);
    });

  }

  onClickRoom(idx) {
    this.router.navigateByUrl('/room/' + idx);
  }

}
