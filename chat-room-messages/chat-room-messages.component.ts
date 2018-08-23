import { Component, OnInit, NgZone, ViewChild, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { LanguageTranslate } from '../../language-translate/language-translate';

import * as firebase from 'firebase/app';
import 'firebase/messaging';
import { ApiChatMessage, CHAT_STATUS_ENTER, ApiChatRoom, ApiErrorResponse, PhilGoApiService } from '../../philgo-api/philgo-api.service';
import { ActivatedRoute } from '@angular/router';
import { AngularLibrary } from '../../angular-library/angular-library';

@Component({
    selector: 'app-chat-room-messages-component',
    templateUrl: './chat-room-messages.component.html',
    styleUrls: ['./chat-room-messages.component.scss']
})
export class ChatRoomMessagesComponent implements OnInit, OnDestroy {

    @ViewChild('ionScroll') ionScroll;
    @Output() error = new EventEmitter<ApiErrorResponse>();

    messages: Array<ApiChatMessage> = [];
    subscriptionNewMessage = null;
    constructor(
        public tr: LanguageTranslate,
        public philgo: PhilGoApiService,
        private ngZone: NgZone,
        private activatedRoute: ActivatedRoute,
    ) {

        /**
         * @desc (Ionic Life Cycle 을 따르는 경우) 채팅 방 부터 먼저 접속한 경우, 로비로 갔다가 다시 오면,
         *          life cyle 이벤트가 발생하지 않는다. 이것은 기존 컴포넌트 인스턴스 어딘가에 살아 있다는 뜻이다.
         *          따라서, 기존 subscription 사용하고 새로 만들지 않는다.
         */
        if (this.subscriptionNewMessage) {
            // console.log(' ==> Unsubscribing new message');
            this.subscriptionNewMessage.unsubscribe();
        }
        // console.log(' ===> Going to subscribe new message event!');
        this.subscriptionNewMessage = philgo.newMessageOnCurrentRoom.subscribe(message => {
            // console.log(` ==> RoomPage::constructor() => Got new message in ${this.roomInfo.name} : you should see it on chat box.`,
            //   message, CHAT_STATUS_ENTER, this.philgo.myIdx());
            this.displayMessage(message);
            this.updateLastRead(message.idx);
            // this.updateLastRead();
        });

        this.philgo.listenMyRoomsIfNotListenning();
    }

    ngOnInit() {
        this.messages = [];
        this.loadChatRoomEnter();
    }


    scroll() {
        this.renderMessageDisplay();
        setTimeout(() => {
            this.ionScroll.nativeElement.scrollToBottom(30);
            this.renderMessageDisplay();
        }, 100);
    }
    renderMessageDisplay() {
        setTimeout(() => {
            this.ngZone.run(() => { });
        }, 30);
    }


    ngOnDestroy() {
        // console.log('   ===> RoomPage::ngOnDestroy()');
        this.leaveRoom();
    }

    leaveRoom() {
        if (this.messages && this.messages.length) {
            this.messages = [];
        }
        this.philgo.currentRoomNo = 0;
        if (this.subscriptionNewMessage) {
            // console.log(' ==> New message unsubscribed !!');
            this.subscriptionNewMessage.unsubscribe();
            this.subscriptionNewMessage = null;
        }
    }

    displayMessage(message: ApiChatMessage) {
        // console.log('displayMessage: ', message);
        if (message.status === CHAT_STATUS_ENTER && message.idx_member === this.philgo.myIdx()) {
            // if it's a greeting message for my entering, then no need to show it to myself.
        } else {
            this.messages.push(message);
        }
        this.scroll();
    }
    updateLastRead(idx_message: string) {
        if (!idx_message) {
            return;
        }
        if (this.philgo.isLoggedOut()) {
            return;
        }
        // console.log('updateLastRead(): ', this.roomInfo.idx);
        this.philgo.chatLastRead(this.philgo.currentRoom.idx, idx_message).subscribe(res => {
            // console.log('chatMssagelastRead()', res);
        }, e => {
            console.log('error:', e);
        });
    }

    loadChatRoomEnter() {
        setTimeout(() => {
            // console.log('loadChatRoomEnter() setTimeout()');
            this.activatedRoute.paramMap.subscribe(params => {
                const idx = params.get('idx_chat_room');
                if (idx) {
                    this.philgo.chatResetNoOfNewMessageOfRoom( idx );
                    /**
                     * idx_chat_room in route may be string.
                     */
                    //   this.form.idx_chat_room = idx;
                    this.philgo.currentRoomNo = AngularLibrary.parseNumber(idx);
                    // this.a.currentRoomNo = parseInt(this.form.idx_chat_room, 10);
                    this.philgo.chatEnterRoom({ idx: idx }).subscribe(res => {
                        console.log('roomInfo: ', res);
                        this.philgo.currentRoom = res;
                        /**
                         * get real idx_chat_room
                         */
                        // this.form.idx_chat_room = this.roomInfo.idx_chat_room;
                        this.philgo.currentRoomNo = AngularLibrary.parseNumber(this.philgo.currentRoom.idx_chat_room);

                        if (this.philgo.currentRoom.messages && this.philgo.currentRoom.messages.length) {
                            this.philgo.currentRoom.messages.reverse().map(v => {
                                this.displayMessage(v);
                            });
                        }
                        // this.messages = this.roomInfo.messages.reverse();
                        // this.scroll();
                        const room: ApiChatRoom = <any>this.philgo.currentRoom;
                        delete room['messages'];
                        this.philgo.addRoomToListen(room);
                        this.scroll();
                    }, e => {
                        console.log(e.code);
                        this.error.emit(e);
                    });
                } else {
                    // this error will not happens.
                    // this.a.toast('Chat room number was not provided.');
                    console.error('Chat room number was not provided in route.');
                }
            });
        }, 100);
    }


    sendNewMessage(message: ApiChatMessage) {
        this.messages.push(message);
        this.scroll();
    }


    removeMessageByRetvar(retvar) {
        const i = this.messages.findIndex(m => m.retvar === retvar);
        if (i !== -1) {
            this.messages.splice(i, 1);
        }
    }
}

