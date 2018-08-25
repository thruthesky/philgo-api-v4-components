import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ApiChatRoom, PhilGoApiService, ApiErrorResponse } from '../../philgo-api/philgo-api.service';
import { LanguageTranslate } from '../../language-translate/language-translate';
import { AngularLibrary } from '../../angular-library/angular-library';


@Component({
  selector: 'app-chat-all-rooms-component',
  templateUrl: './chat-all-rooms.component.html',
  styleUrls: ['./chat-all-rooms.component.scss']
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

  isMobileWeb = AngularLibrary.isMobileWeb();
  constructor(
    private ngZone: NgZone,
    private router: Router,
    public philgo: PhilGoApiService,
    public tr: LanguageTranslate
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
      this.render();
    }, e => {
      this.show.loader.roomList = false;
      this.error.emit(e);
    });
  }

  onSearch(value) {
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
      if (room.name.indexOf(value) !== -1) {
        return true;
      }
      if (room.description.indexOf(value) !== -1) {
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
    this.onCancelSearch();
    this.router.navigateByUrl('/room/' + idx);
  }


  render() {
    setTimeout(() => {
      this.ngZone.run(() => { });
    }, 2000);
  }

}
