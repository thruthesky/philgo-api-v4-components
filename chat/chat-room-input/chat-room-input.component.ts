import { Component, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';


import { ActionSheetController, AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ApiChatRoomEnter, ApiChatMessage, PhilGoApiService, ApiError } from '../../../philgo-api/philgo-api.service';
import { DomSanitizer } from '@angular/platform-browser';

import { SimpleLibrary as _ } from 'ng-simple-library';


@Component({
    selector: 'app-chat-room-input-component',
    templateUrl: './chat-room-input.component.html',
    styleUrls: ['./../../scss/index.scss', './chat-room-input.component.scss']
})
export class ChatRoomInputComponent implements OnInit {

    @Output() send = new EventEmitter<ApiChatMessage>();
    @Output() removeMessageByRetvar = new EventEmitter<any>();
    @Output() error = new EventEmitter<ApiError>();


    countMessageSent = 0;
    roomInfo: ApiChatRoomEnter = <any>{};
    form: ApiChatMessage = <any>{};
    // messages: Array<ApiChatMessage> = [];

    // subscriptionNewMessage = null;

    platform: 'web' | 'cordova' = 'web';
    constructor(
        // private activatedRoute: ActivatedRoute,
        // private actionSheetController: ActionSheetController,
        private alertController: AlertController,
        private camera: Camera,
        private domSanitizer: DomSanitizer,
        public philgo: PhilGoApiService,
    ) {
        if (_.isCordova()) {
            this.platform = 'cordova';
        }
        this.resetForm();
    }

    ngOnInit() {
    }

    resetForm() {
        this.form.message = '';
        this.form.url = '';
        this.form.type = '';
        this.form.retvar = '';
        this.form.percentage = 0;
    }

    onClickSendMessage() {
        if (!this.form.message) {
            // console.log('empty form.message. return');
            return;
        }
        // console.log('form: ', this.form);
        this.sendMessage();
    }

    /**
     * 사용자가 채팅 창에 입력한 메시지 뿐만아니라 첨부 파일 등을 보낼 때, 이 함수를 사용한다.
     */
    sendMessage() {
        /**
         * 새 방에 입장하는 경우, 초기화가 좀 느리다. 따라서 초기화 전에 들어가면 그냥 리턴.
         */
        if (!this.philgo.currentRoom) {
            console.log('wait. you cannot type until room is initialized.');
            return false;
        }
        this.form.idx_chat_room = this.philgo.currentRoom.idx;
        this.form.idx_member = this.philgo.idx().toString();
        this.form.retvar = ++this.countMessageSent;

        /**
         * Assign to a new Object.
         */
        const m = Object.assign({}, this.form);
        /**
         * 채팅을 보내고, 바로 idx 를 -1 로 해서, gif loader 가 표시되지 않도록 한다.
         * 에러가 있으면 [x] 표시가 된다.
         * 이 때문에, 괜히, 채팅 속도가 느리니 어쩌니 하는 말이 나온다.
         */
        m.idx = '-1';

        /**
         *
         */
        this.send.emit(m);
        this.resetForm();
        this.philgo.chatSendMessage(m).subscribe(res => {
            /**
             * Update the new Object by reference.
             */
            m.idx = res.idx;
            m.message = res.message;
        }, e => {
            m.failed = true;
            this.error.emit(e);
        });
    }



    onChangeFile(event: Event) {
        if (this.platform === 'cordova') {
            // console.log('Running in cordova. return in onChangeFile()');
            return;
        }
        // console.log('onChangeFile()');
        const files = event.target['files'];
        if (files === void 0 || !files.length || files[0] === void 0) {
            return this.error.emit(this.philgo.error(-1, 'Please select a file'));
        }

        this.doFile(files);
    }


    /**
     * It does everything for file upload.
     * @param files FileList
     * @param dataUrl data url if it has. Cordova Camera returns base64, so it can have data url.
     */
    doFile(files, dataUrl = '') {
        if (!dataUrl) {
            // console.log('No dataUrl. Going to create an object!');
            dataUrl = URL.createObjectURL(files[0]);
        } else {
            // console.log('Got dataUrl already. no create object');
        }
        // console.log('url: ', url);
        const message: ApiChatMessage = <any>{ url: this.safeUrl(dataUrl), retvar: ++this.countMessageSent };
        this.displaySendingFile(message);
        this.philgo.newFileUpload(files, {
            uid: this.philgo.myIdx(),
            secret: this.philgo.myIdx()
        }).subscribe(res => {
            if (typeof res === 'number') {
                // console.log('percentage', res);
                message['percentage'] = res;
            } else {
                // console.log('result ', res);
                // @todo 여기서 부터. 파일을 업로드하기 전에 먼저, 디스크의 파일을 보여주고,
                // 파일이 업로드 완료되고, 다른 사람들에게 채팅으로 모두 전달했으면,
                // 그 때, loader 를 없애고, percentage 를 없앤다.
                // message['percentage'] = 0;
                // message['message'] = `<img src="${res['url']}">`;
                // message.percentage = 0;
                this.removeMessageByRetvar.emit(message.retvar);

                this.form.type = res.type;
                this.form.url = res.url;
                this.sendMessage();
            }
        }, e => this.error.emit(e));
    }
    displaySendingFile(message: ApiChatMessage) {
        message.type = 'sending-file';
        // console.log('displaySendingFile: ', message);
        // this.displayMessage(message);
        this.send.emit(message);
    }

    /**
   * File upload button has been clicked.
   *
   * If it is cordova, then do camera.
   * If not, simply return.
   *
   * @param event click event
   */
    async onClickCordovaCameraIcon(event: Event) {
        // console.log('onClickFile()');
        if (this.platform === 'web') {
            // console.log('it is web. return.');
            return;
        }

        // console.log('cordova camera....');

        const alert = await this.alertController.create({
            header: this.philgo.t({ ko: '사진', en: 'Photo' }),
            subHeader: this.philgo.t({ ko: '사진 전송을 업로드합니다.', en: 'Uploading a photo.' }),
            message: this.philgo.t({
                ko: '카메라로 사진을 찍거나 갤러리에서 사진을 선택하세요.',
                en: 'Please take a photo from Camera or choose one from Gallery.'
            }),
            buttons: [
                { role: 'camera', text: this.philgo.t({ ko: '카메라로 사진 찍기', en: 'Take a photo using Camera' }) },
                { role: 'gallery', text: this.philgo.t({ ko: '갤러리에서 선택하기', en: 'Select a photo from Gallery' }) },
                { role: 'cancel', text: this.philgo.t({ ko: '취소', en: 'Cancel' }) }
            ]
        });


        await alert.present();
        const re = await alert.onDidDismiss();


        const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: this.camera.PictureSourceType.CAMERA
        };

        if (re.role === 'cancel') {
            return;
        }
        if (re.role === 'gallery') {
            options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
        }
        /**
         * 문제의 핵심은 Cordova Camera 로 받은 base64 데이터를 어떻게 <input type='file'> 과 같은 FileList 형의 데이터를 가져오는 것인가이다.
         * FileList 로 값을 가져오면 그냥 HTML 의 <input type='file'> 과 똑 같은 코드로 Angular 로 업로드하면 되기 때문이다.
         */
        const base64 = await this.camera.getPicture(options).then((imageData) => {
            return imageData;
        }, (e) => {
            // console.log(e);
            // console.log('Camera/Gallery cancelled');
            return '';
        });
        if (!base64) {
            // console.log('No data path or base64. just return');
        }
        // console.log('path: ', data);
        const blob = _.base64toBlob(base64);
        /**
         * File 와 FileList 타입의 변수를 만든다.
         * 그리고 그냥 일반 HTML FORM <input type='file'> 에서 파일 정보를 받아 업로드하는 것과 똑 같이 하면 된다.
         */
        const d = new Date();
        const name = d.getFullYear() + (d.getMonth() + 1) + d.getDate() + '-' + d.getHours() + d.getMinutes() + d.getSeconds() +
            '-' + this.philgo.myIdx();
        const file = new File([blob], name + '.jpg', { type: 'image/jpeg' });
        const files: FileList = <any>[file];

        const dataUrl = 'data:image/jpg;base64,' + base64;
        this.doFile(files, dataUrl);
    }



    safeUrl(url) {
        return this.domSanitizer.bypassSecurityTrustUrl(url);
    }
}

