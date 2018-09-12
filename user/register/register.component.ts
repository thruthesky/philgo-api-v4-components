import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LanguageTranslate } from '../../../language-translate/language-translate';
import {
    ApiErrorResponse, ApiProfileUpdateRequest,
    ApiRegisterResponse, ApiProfileResponse, ApiErrorFileNotSelected, ApiErrorFileUploadError, PhilGoApiService
} from '../../../philgo-api/philgo-api.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
    selector: 'app-register-component',
    templateUrl: 'register.component.html',
    styleUrls: ['./../../scss/index.scss', './register.component.scss']
})
export class RegisterComponent implements OnInit {

    @Output() error = new EventEmitter<ApiErrorResponse>();
    @Output() register = new EventEmitter<ApiRegisterResponse>();
    @Output() update = new EventEmitter<ApiProfileResponse>();

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
        public philgo: PhilGoApiService,
        public tr: LanguageTranslate
    ) {
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
            });
        } else {
            this.philgo.register(this.form).subscribe(user => {
                this.loader.submit = false;
                this.register.emit(user);
            }, e => {
                this.loader.submit = false;
                this.error.emit(e);
            });
        }

        return false;
    }


    onChangePrimaryPhoto(event: Event) {
        this.philgo.uploadPrimaryPhotoWeb(event.target['files']).subscribe(re => {
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
            this.error.emit(this.philgo.error(ApiErrorFileUploadError, 'File upload failed'));
        });
    }

    onClickDeletePrimaryPhoto() {
        const idx = this.form.url_profile_photo.split('/').pop();
        this.philgo.deleteFile(parseInt(idx, 10)).subscribe(res => {
            // console.log('res: ', res);
            this.form.url_profile_photo = '';
        }, e => alert(e.message));
    }
}

