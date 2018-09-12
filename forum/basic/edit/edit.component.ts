import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { PhilGoApiService, ApiPost, ApiError, ApiForum } from '../../../../philgo-api/philgo-api.service';
import { AngularLibrary } from '../../../../angular-library/angular-library';
import { ComponentService } from '../../../service/component.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['../../../scss/index.scss', './edit.component.scss']
})
export class EditComponent implements OnInit, AfterViewInit {
  controller: ModalController;
  data;
  form: ApiPost = <ApiPost>{};
  // error: ApiError = null;

  isWeb = true;
  isCordova = false;

  pageTitle = '';
  percentage = 0;
  constructor(
    private readonly alertController: AlertController,
    private camera: Camera,
    public philgo: PhilGoApiService,
    public readonly componentService: ComponentService
  ) {
    // this.form.subject = 'Hello, qna';
    // this.form.post_id = 'qna';
    // this.onSubmit();

    // this.form.post_id = this.forum.post_id;
    // console.log('constructor:forum:: ', this.forum);

    if (AngularLibrary.isCordova()) {
      this.isWeb = false;
      this.isCordova = true;
    }

  }
  ngOnInit() {
    if (this.data) {
      switch (this.data['role']) {
        case 'post-create':
          this.form.post_id = this.data.post_id;
          const name = this.philgo.forumName(this.data.post_id);
          this.pageTitle = this.philgo.t({ en: `Posting on #name`, ko: `#name 글쓰기` }, { name: name });
          break;
        case 'post-edit':
          this.form = this.data;
          this.pageTitle = this.philgo.t({ en: `Post Editing ##no`, ko: `글 수정 ##no` }, { no: this.data['idx'] });
          break;
        case 'reply':
          this.pageTitle = this.philgo.t({ en: `Reply on No. #idx`, ko: `답변글 쓰기 No. #name 글쓰기` }, { idx: this.data.idx });
          break;
        case 'comment-edit':
          this.form = this.data;
          this.pageTitle = this.philgo.t({ en: `Comment Editing ##no`, ko: `덧글 수정 ##no` }, { no: this.data['idx'] });
          break;
      }
    } else {
      console.error('data is not set: ');
    }
  }

  ngAfterViewInit() {
    console.log('form: ', this.form);
    setTimeout(() => {
      if (!this.form.gid) {
        this.form.gid = AngularLibrary.randomString(19, this.philgo.myIdx());
        console.log(this.form.gid);
      }
    });
  }
  onSubmit() {
    // this.error = null;
    // if (!this.form.subject || this.form.subject.length < 10) {
    //   this.error = { code: -1, message: 'Please input title, and length cannot be less than 10' };
    //   return;
    // }
    // if (!this.form.content || this.form.content.length < 10) {
    //   this.error = { code: -1, message: 'Please input content, and length cannot be less than 10' };
    //   return;
    // }

    console.log('data.role: ', this.data.role);

    /**
     * Edit
     */
    if (this.form.idx) {
      this.philgo.postEdit(this.form).subscribe(res => {
        this.controller.dismiss(res, 'success');
      }, e => {
        this.componentService.alert(e);
      });
    } else {
      /**
       * Create
       */
      if (this.data.role === 'reply') {
        console.log('reply');
        this.form.idx_parent = this.data.idx;
      }
      this.philgo.postCreate(this.form).subscribe(res => {
        console.log('create res: ', res);
        this.controller.dismiss(res, 'success');
      }, e => {
        this.componentService.alert(e);
      });
    }
  }


  onChangeFile(event: Event) {
    this.uploadFile(<any>event.target['files']);

    // if (AngularLibrary.isCordova()) {
    //   return;
    // }
    // const files = event.target['files'];
    // if (files === void 0 || !files.length || files[0] === void 0) {
    //   const e = { code: -1, message: this.philgo.t({ en: 'Please select a file', ko: '업로드 할 팔일을 선택해주세요.' }) };
    //   this.componentService.alert(e);
    // }

    // this.philgo.fileUpload(files, { gid: this.form.gid, user_password: this.form.user_password }).subscribe(res => {
    //   if (typeof res === 'number') {
    //     console.log('percentage: ', res);
    //   } else {
    //     console.log('file success: ', res);
    //     if (!this.form.files || !this.form.files.length) {
    //       this.form.files = [];
    //     }
    //     this.form.files.push(res);
    //   }
    // }, e => {
    //   console.error(e);
    //   this.componentService.alert(e);
    // });
  }

  async onClickCordovaFileUploadButton() {

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
    const blob = AngularLibrary.base64toBlob(base64);
    const name = AngularLibrary.dateString() + '-' + AngularLibrary.randomString(8) + '.jpg';
    const file = new File([blob], name, { type: 'image/jpeg' });
    const files: FileList = <any>[file];

    this.uploadFile(files);
  }

  uploadFile(files: FileList) {

    console.log('files: ', files);
    if (files === void 0 || !files.length || files[0] === void 0) {
      const e = { code: -1, message: this.philgo.t({ en: 'Please select a file', ko: '업로드 할 파일을 선택해주세요.' }) };
      // this.componentService.alert(e);
      return;
    }

    this.philgo.fileUpload(files, { gid: this.form.gid, user_password: this.form.user_password }).subscribe(res => {
      if (typeof res === 'number') {
        console.log('percentage: ', res);
        this.percentage = res;
      } else {
        console.log('file success: ', res);
        if (!this.form.files || !this.form.files.length) {
          this.form.files = [];
        }
        this.form.files.push(res);
          this.percentage = 0;
      }
    }, e => {
      console.error(e);
        this.percentage = 0;
      this.componentService.alert(e);
    });
  }
}

