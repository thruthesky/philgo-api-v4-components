import { Component, OnInit, NgZone, OnDestroy, Output, EventEmitter } from '@angular/core';
import { LanguageTranslate } from '../../../language-translate/language-translate';



import {
    ApiChatMessage, CHAT_STATUS_ENTER, ApiChatRoom, ApiErrorResponse,
    PhilGoApiService, ApiChatRoomUsers, ApiChatRoomEnter
} from '../../../philgo-api/philgo-api.service';

import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-chat-room-messages-component',
    templateUrl: './chat-room-messages.component.html',
    styleUrls: ['../../scss/index.scss', './chat-room-messages.component.scss']
})
export class ChatRoomMessagesComponent implements OnInit, OnDestroy {

    // @ViewChild(Content) ionContent: Content;
    // @Output() error = new EventEmitter<ApiErrorResponse>();
    @Output() scroll = new EventEmitter();

    messages: Array<ApiChatMessage> = [];
    subscriptionNewMessage = null;

    show = {
        status: {
            loadingLatestMessages: true
        }
    };

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
        /**
         * 타임아웃으로 호출하는 하는 이유는 부모 컴포넌트에서 enter room 을 할 때, 변화하는 값을 사용하기 때문에,
         * expression changed after it has been checked 와 같은 에러가 발생한다.
         * 이것은 room enter 를 부모 컴포넌트에서 하지 않아 발생하는 복잡함이다.
         *
         * 이 외에도 문제가 계속 발생하고 있다. loadChatRoomEnter() 는 부모 컴포넌트에 들어가야 한다.
         */
        // setTimeout(() => this.loadChatRoomEnter(), 100);
    }


    // scroll() {
    //     this.renderMessageDisplay();
    //     setTimeout(() => {
    //         // this.ionScroll.nativeElement.scrollToBottom(30);
    //         this.ionContent.scrollToBottom(30);
    //         this.renderMessageDisplay();
    //     }, 100);
    // }
    // renderMessageDisplay() {
    //     setTimeout(() => {
    //         this.ngZone.run(() => { });
    //     }, 30);
    // }


    ngOnDestroy() {
        // console.log('   ===> RoomPage::ngOnDestroy()');
        this.leaveRoom();
    }

    leaveRoom() {
        if (this.messages && this.messages.length) {
            this.messages = [];
        }
        // this.philgo.currentRoomNo = 0;
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
            this.scroll.emit();
        }
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


    /**
     * 채팅 방에 새로 들어왔으니,
     * - 채팅 방의 정보를 현재 채팅방의 것으로 업데이트하고
     * - 기존 모든 메시지를 삭제하고,
     * - 현재 채팅방의 마지막 메시지를 보여주고, 스크롤 하고,
     * - 현재 채팅방의 새 정보들을 listen 할 수 있도록 하고,
     * 등등을 한다.
     * 
     * @param res data for chat room enter
     */
    arrangeRoomEnter(res: ApiChatRoomEnter) {
        console.log('ChatRoomMessageComponent::arrangeRoomEnter() => roomInfo: ', res);
        if (!res) {
            return;
        }
        this.messages = [];
        this.philgo.currentRoom = res;
        /**
         * get real idx_chat_room
         */
        // this.form.idx_chat_room = this.roomInfo.idx_chat_room;
        // this.philgo.currentRoomNo = AngularLibrary.parseNumber(this.philgo.currentRoom.idx_chat_room);

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
        this.scroll.emit();
    }


    sendNewMessage(message: ApiChatMessage) {
        this.messages.push(message);
        this.scroll.emit();
    }


    removeMessageByRetvar(retvar) {
        const i = this.messages.findIndex(m => m.retvar === retvar);
        if (i !== -1) {
            this.messages.splice(i, 1);
        }
    }

    displayUsers(users: ApiChatRoomUsers) {
        const message: ApiChatMessage = <any>{};
        message.idx_member = '0';
        message.name = this.tr.t({ ko: '방 인원 목록 총 ' + users.length + ' 명', en: 'Room user list. No: ' + users.length });
        message.stamp = Math.round((new Date).getTime() / 1000).toString();
        message.message = '';
        for (const user of users) {
            message.message += ' ' + user.nickname;
        }
        this.displayMessage(message);
    }

}

