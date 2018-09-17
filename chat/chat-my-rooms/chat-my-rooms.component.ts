import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ApiChatRoom, PhilGoApiService, ApiErrorResponse } from '../../../philgo-api/philgo-api.service';
import { SimpleLibrary as _ } from 'ng-simple-library';

@Component({
  selector: 'app-chat-my-rooms-component',
  templateUrl: './chat-my-rooms.component.html',
  styleUrls: ['./../../scss/index.scss', './chat-my-rooms.component.scss']
})
export class ChatMyRoomsComponent implements OnInit, OnDestroy {

  @Output() error = new EventEmitter<ApiErrorResponse>();
  rooms: Array<ApiChatRoom> = [];
  roomsBackup: Array<ApiChatRoom> = [];


  _ = _;
  isMobileWeb = _.isMobileWeb();
  show = {
    loader: {
      roomList: true
    }
  };
  constructor(
    private router: Router,
    public philgo: PhilGoApiService
  ) {
    this.loadMyChatRoomList();
  }

  ngOnInit() {
  }
  ngOnDestroy() {
  }

  loadMyChatRoomList() {
    // console.log('ChatMyRoomsComponent::loadMyChatRoomtList()');
    this.show.loader.roomList = true;

    this.philgo.chatLoadMyRooms().subscribe(res => {
      this.show.loader.roomList = false;
    }, e => {
      this.show.loader.roomList = false;
      this.error.emit(e);
    });

  }

  // onClickRoom(idx) {
  //   this.router.navigateByUrl('/room/' + idx);
  // }


}
