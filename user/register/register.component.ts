import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
    ApiErrorResponse, ApiProfileUpdateRequest,
    ApiRegisterResponse, ApiProfileResponse, ApiErrorFileNotSelected, ApiErrorFileUploadError, PhilGoApiService
} from '../../../philgo-api/philgo-api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ComponentService } from '../../service/component.service';
import { SimpleLibrary as _ } from 'ng-simple-library';


@Component({
    selector: 'app-register-component',
    templateUrl: 'register.component.html',
    styleUrls: ['./../../scss/index.scss', './register.component.scss']
})
export class RegisterComponent implements OnInit {

    @Output() error = new EventEmitter<ApiErrorResponse>();
    @Output() register = new EventEmitter<ApiRegisterResponse>();
    @Output() update = new EventEmitter<ApiProfileResponse>();

    _ = _;
    isCordova = _.isCordova();
    isWeb = _.isWeb();
    /**
     * @Bug This component may created once, but used many times without Angular lifecycle due to Ionic lifecycle.
     *      And this will lead a bug of not initializing the form.
     *      If it's a big matter to you, then you may call `loadUserProfile()` again on Ionic life cycle.
     */
    form;
    loader = {
        profile: false,
        submit: false
    };
    percentage = 0;
    constructor(
        private alertController: AlertController,
        private camera: Camera,
        public philgo: PhilGoApiService,
        private componentService: ComponentService
    ) {
        this.resetForm();
    }
    ngOnInit() {
        this.loadUserProfile();
    }

    loadUserProfile() {
        if (this.philgo.isLoggedIn()) {
            this.loader.profile = true;
            this.philgo.profile().subscribe(user => {
                this.loader.profile = false;
                this.form = user;
                // console.log('user: ', user);
            }, e => {
            });
        } else {
            this.resetForm();
        }
    }

    resetForm() {
        this.form = {
            email: '',
            password: '',
            name: '',
            nickname: '',
            mobile: '',
            url_profile_photo: ''
        };
    }

    onSubmit(event?: Event) {
        if (event) {
            event.preventDefault();
        }

        // console.log('philgo.isLoggedIn?', this.philgo.isLoggedIn());
        // console.log('whoami?: ', this.philgo.nickname());
        // console.log('di?', this.form);
        if (this.philgo.isLoggedIn()) {
            // console.log('going to update profile');
            const data: ApiProfileUpdateRequest = {
                name: this.form.name,
                mobile: this.form.mobile
            };
            this.philgo.profileUpdate(data).subscribe(user => {
                this.loader.submit = false;
                this.update.emit(user);
            }, e => {
                this.loader.submit = false;
                this.error.emit(e);
                this.componentService.alert(e);
            });
        } else {
            this.philgo.register(this.form).subscribe(user => {
                this.loader.submit = false;
                this.register.emit(user);
            }, e => {
                this.loader.submit = false;
                this.error.emit(e);
                this.componentService.alert(e);
            });
        }

        return false;
    }



    async onClickCordovaPhotoUpload() {

        if (this.isWeb) {
            return;
        }

        /**
         * Ask first
         */
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
        if (re.role === 'cancel') {
            return;
        }


        /**
         * This is camera settings.
         */
        const options: CameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: this.camera.PictureSourceType.CAMERA
        };
        if (re.role === 'gallery') {
            options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
        }


        /**
         * Take photo
         * Get base64 data of photo.
         *
         * 문제의 핵심은 Cordova Camera 로 받은 base64 데이터를 어떻게 <input type='file'> 과 같은 FileList 형의 데이터를 가져오는 것인가이다.
         * FileList 로 값을 가져오면 그냥 HTML 의 <input type='file'> 과 똑 같은 코드로 Angular 로 업로드하면 되기 때문이다.
         */
        const base64 = await this.camera.getPicture(options).then((imageData) => {
            return imageData;
        }, (e) => {
            // console.log('Camera/Gallery cancelled');
            return '';
        });

        if (!base64) {
            // console.log('No data path or base64. just return');
            return;
        }


        /**
         * Convert and upload
         *
         * File 와 FileList 타입의 변수를 만든다.
         * 그리고 그냥 일반 HTML FORM <input type='file'> 에서 파일 정보를 받아 업로드하는 것과 똑 같이 하면 된다.
         */
        const blob = _.base64toBlob(base64);
        const name = _.dateString() + '-' + _.randomString(8) + '.jpg';
        const file = new File([blob], name, { type: 'image/jpeg' });
        const files: FileList = <any>[file];

        this.onUpload(files);
    }
    onChangePrimaryPhoto(event: Event) {
        this.onUpload(event.target['files']);
    }

    onUpload(files: FileList) {
        this.philgo.uploadPrimaryPhotoWeb(files).subscribe(re => {
            // console.log(event);
            if (typeof re === 'number') {
                // console.log(`File is ${re}% uploaded.`);
                this.percentage = re;
            } else if (re['code'] && re['idx'] === void 0) {
                // console.log('error: ', re);
            } else if (re['idx'] !== void 0 && re['idx']) {
                console.log('file upload success: ', re);
                // this.photo = re;
                this.form.url_profile_photo = re['src'];
                this.percentage = 0;
            }
        }, (e: HttpErrorResponse) => {
            console.log('error subscribe: ', e);
            if (e.error instanceof Error) {
                console.log('Client-side error occurred.');
            } else {
                // console.log(err);
                if (e.message === ApiErrorFileNotSelected) {
                    console.log('file is not selected');
                } else if (e['code'] !== void 0 && e['code'] === ApiErrorFileUploadError) {
                    console.log('File upload error:', e.message);
                } else {
                    console.log('Other error. May be FILE TOO LARGE. See error message on network tab. ' + e.message);
                }
            }
            console.log('file upload failed');
            const err = this.philgo.error(ApiErrorFileUploadError, 'File upload failed');
            this.error.emit(err);
            this.componentService.alert(err);
        });
    }

    onClickDeletePrimaryPhoto(event: Event) {
        event.stopPropagation();
        const idx = this.form.url_profile_photo.split('/').pop();
        this.philgo.deleteFile(parseInt(idx, 10)).subscribe(res => {
            // console.log('res: ', res);
            this.form.url_profile_photo = '';
        }, e => alert(e.message));
    }
}

