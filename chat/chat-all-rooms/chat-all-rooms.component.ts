import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ApiChatRoom, PhilGoApiService, ApiErrorResponse } from '../../../philgo-api/philgo-api.service';
import { ComponentService } from '../../service/component.service';
// import { AppService } from '../../../../providers/app.service';
import { SimpleLibrary as _ } from 'ng-simple-library';



@Component({
  selector: 'app-chat-all-rooms-component',
  templateUrl: './chat-all-rooms.component.html',
  styleUrls: ['./../../scss/index.scss', './chat-all-rooms.component.scss']
})
export class ChatAllRoomsComponent implements OnInit, OnDestroy {

  @Output() error = new EventEmitter<ApiErrorResponse>();
  @Input() share = {};
  rooms: Array<ApiChatRoom> = [];
  roomsBackup: Array<ApiChatRoom> = [];

  show = {
    loader: {
      roomList: true
    }
  };

  isMobileWeb = _.isMobileWeb();
  constructor(
    private router: Router,
    public philgo: PhilGoApiService,
    private componentService: ComponentService
    // public a: AppService
  ) {
    console.log('ChatAllRoomsComponent::constructor()');
    this.loadAllChatRoomList();
    //   this.needUpdate = a.platform == 'cordova' && philgo.info && appVersion < philgo.info.chat_version;
  }

  ngOnInit() {
    // console.log('RoomsComponent::ngOnInit()');
    // this.loadMyChatRoomList();
  }
  ngOnDestroy() {
    // console.log('RoomsComponent::ngOnDestroy()');
  }

  // updateShare() {
  //   if (this.rooms && this.rooms.length) {
  //     let no = 0;
  //     for (const room of this.rooms) {
  //       if (!isNaN(<any>room.no_of_unread_messages)) {
  //         no += parseInt(room.no_of_unread_messages, 10);
  //       }
  //     }
  //     this.share['totalNoOfNewMessages'] = no;
  //   }
  // }

  loadAllChatRoomList() {
    console.log('  ==> loadAllChatRoomList()');
    this.show.loader.roomList = true;
    this.philgo.chatOtherRooms().subscribe(res => {
      this.show.loader.roomList = false;
      this.philgo.info = res.info;
      console.log('   ===> other room list: ', res);
      this.rooms = res.rooms;
    }, e => {
      this.show.loader.roomList = false;
      this.error.emit(e);
    });
  }

  onSearch(value: string) {
    // console.log('value: ', value);
    if (value === '' && this.roomsBackup.length) {
      this.onCancelSearch();
      return;
    }
    if (this.roomsBackup.length === 0) {
      this.roomsBackup = this.rooms;
    }
    this.rooms = this.roomsBackup;
    this.rooms = this.rooms.filter(room => {
      if (room.name.toLowerCase().indexOf(value.toLocaleLowerCase()) !== -1) {
        return true;
      }
      if (room.description.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1) {
        return true;
      }
    });
  }

  onCancelSearch() {
    if (this.roomsBackup.length) {
      this.rooms = this.roomsBackup;
      this.roomsBackup = [];
    }
  }

  onClickRoom(idx) {
    if (this.philgo.isLoggedIn()) {
      this.onCancelSearch();
      this.router.navigateByUrl('/room/' + idx);
    } else {
      this.componentService.alert({
        header: this.philgo.t({ en: 'Login', ko: '로그인' }),
        message: this.philgo.t({
          en: 'Please login first to enter chat room.',
          ko: '회원 로그인을 하셔야 채팅방에 입장 할 수 있습니다.'
        })
      });
    }
  }

}
