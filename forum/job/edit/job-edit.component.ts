import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { PhilGoApiService, ApiPost, ApiFile } from '../../../../philgo-api/philgo-api.service';
import { AngularLibrary } from '../../../../angular-library/angular-library';
import { ComponentService } from '../../../service/component.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { TooltipService } from '../../../tooltip/tooltip.module';

import * as N from './../job.defines';

@Component({
  selector: 'app-job-edit',
  templateUrl: './job-edit.component.html',
  styleUrls: ['../../../scss/index.scss', './job-edit.component.scss']
})
export class JobEditComponent implements OnInit, AfterViewInit {
  controller: ModalController;
  data;
  form: ApiPost = <ApiPost>{};

  month = null;
  day = null;
  year = null;

  provinces: Array<string> = [];
  cities: Array<string> = [];
  showCities = false;

  province = '';
  city = '';

  pageTitle = '';
  percentage = 0;
  fileCode = null;


  N = N;

  _ = AngularLibrary;
  isWeb = AngularLibrary.isWeb();
  isCordova = AngularLibrary.isCordova();

  minAge = new Date().getFullYear() - 17;


  constructor(
    private camera: Camera,
    private alertController: AlertController,
    public philgo: PhilGoApiService,
    public readonly componentService: ComponentService,
    public tooltip: TooltipService
  ) {
    this.philgo.provinces().subscribe(provinces => {
      // console.log('provinces:: ', provinces);
      this.provinces = provinces;
    }, e => {
      this.componentService.alert(e);
    });
  }
  ngOnInit() {
    if (this.data && this.data.idx === void 0) {
      this.form.post_id = this.data.post_id;
      const forumName = this.philgo.forumName(this.data.post_id);
      const categoryName = this.philgo.forumName(this.data.post_id, this.data.category);
      this.pageTitle = `${forumName} >> ${categoryName}`;
    } else {
      this.form = this.data;
      this.pageTitle = this.philgo.t({ en: `Job Editing ##no`, ko: `구인구직 수정 ##no` }, { no: this.data['idx'] });
    }


    if (this.data[N.province]) {
      this.province = this.data[N.province];
      this.city = this.data[N.city];
      this.getCities();
    }

    console.log('this.data[N.birthday]', this.data[N.birthday]);
    if (this.data[N.birthday]) {
      const b = '' + this.data[N.birthday];
      this.year = b.substr(0, 4);
      this.month = b.substr(4, 2);
      this.day = b.substr(6, 2);
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

  get subjectInDanger(): string {
    if (this.form.subject && this.form.subject.length > 10) {
      return 'danger';
    } else {
      return 'dark';
    }
  }

  onSubmit() {
    console.log('data.role: ', this.data.role);

    if (!this.form[N.name]) {
      return this.componentService.alert({ message: this.philgo.t({ ko: '이름을 입력하십시오.', en: 'Please input Name.' }) });
    }
    if (!this.form[N.mobile]) {
      return this.componentService.alert({ message: this.philgo.t({ ko: '휴대 전화 번호를 입력하십시오.', en: 'Please input mobile number.' }) });
    }
    if (!this.form[N.email]) {
      return this.componentService.alert({ message: this.philgo.t({ ko: '이메일을 입력하십시오.', en: 'Please input Email.' }) });
    }
    if (!this.province) {
      return this.componentService.alert({ message: this.philgo.t({ ko: '지방을 선택하십시오.', en: 'Please choose a province.' }) });
    }
    if (!this.city) {
      return this.componentService.alert({ message: this.philgo.t({ ko: '도시를 선택하십시오.', en: 'Please choose a city.' }) });
    }
    if (!this.form[N.address]) {
      return this.componentService.alert({ message: this.philgo.t({ ko: '주소를 입력하십시오.', en: 'Please input address.' }) });
    }
    if (!this.month) {
      return this.componentService.alert({ message: this.philgo.t({ ko: '태어난 달을 선택하십시오.', en: 'Please select birth month.' }) });
    }
    if (!this.day) {
      return this.componentService.alert({ message: this.philgo.t({ ko: '태어난 일을 선택하십시오.', en: 'Please select birth day.' }) });
    }
    if (!this.year) {
      return this.componentService.alert({ message: this.philgo.t({ ko: '태어난 년도를 선택하십시오.', en: 'Please select birth year.' }) });
    }
    if (!this.form[N.gender]) {
      return this.componentService.alert({ message: this.philgo.t({ ko: '성별을 선택하십시오.', en: 'Please select gender.' }) });
    }
    if (!this.form[N.experience]) {
      return this.componentService.alert({ message: this.philgo.t({ ko: '경력을 선택하십시오.', en: 'Please select year of experience.' }) });
    }
    if (!this.form[N.intro]) {
      return this.componentService.alert({ message: this.philgo.t({ ko: '자기 소개를 입력하십시오.', en: 'Please input self introduction.' }) });
    }
    if (!this.form[N.link]) {
      return this.componentService.alert({ message: this.philgo.t({ ko: '프로필 URL (페이스북 등) 을 입력하십시오.', en: 'Please input your profile link like facebook URL.' }) });
    }

    if (!this.form.files || this.form.files.length < 3) {
      return this.componentService.alert({ message: this.philgo.t({ ko: '모든 사진을 업로드하십시오.', en: 'Please upload required photo.' }) });
    }



    /**
   * Pass job category
   */
    this.form.category = this.data.category;

    //

    this.form[N.birthday] = this.year + this.month + this.day;


    this.form[N.province] = this.province;
    this.form[N.city] = this.city;

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
      this.philgo.postCreate(this.form).subscribe(res => {
        console.log('create res: ', res);
        this.controller.dismiss(res, 'success');
      }, e => {
        this.componentService.alert(e);
      });
    }
  }

  onDelete() {
    this.philgo.postDelete({ idx: this.form.idx }).subscribe(res => {
      console.log('delete: res', res);
      this.controller.dismiss(res, 'delete');
    }, e => this.componentService.alert(e));
  }

  async onClickCordovaPhotoUpload(code: string) {

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
    const blob = AngularLibrary.base64toBlob(base64);
    const name = AngularLibrary.dateString() + '-' + AngularLibrary.randomString(8) + '.jpg';
    const file = new File([blob], name, { type: 'image/jpeg' });
    const files: FileList = <any>[file];

    this.onUpload(files, code);
  }

  onChangeFile(event: Event, code: string) {
    const files = <any>event.target['files'];
    this.onUpload(files, code);
  }

  onUpload(files: FileList, code: string) {

    this.fileCode = code;

    console.log('files: ', files);
    if (files === void 0 || !files.length || files[0] === void 0) {
      const e = { code: -1, message: this.philgo.t({ en: 'Please select a file', ko: '업로드 할 파일을 선택해주세요.' }) };
      // this.componentService.alert(e);
      return;
    }

    this.philgo.fileUpload(files, { gid: this.form.gid, code: code }).subscribe(res => {
      if (typeof res === 'number') {
        console.log('percentage: ', res);
        this.percentage = res;
      } else {
        console.log('file success: ', res);
        this.insertUploadedPhoto(res);
        this.percentage = 0;
      }
    }, e => {
      console.error(e);
      this.componentService.alert(e);
      this.percentage = 0;
    });
  }

  /**
   * Insert upload photo into this.form.files array.
   * @param file upload file
   */
  insertUploadedPhoto(file: ApiFile) {
    if (!this.form.files || !this.form.files.length) {
      this.form.files = [];
      this.form.files.push(file);
    } else {
      const pos = this.form.files.findIndex(v => v.code === file.code);
      console.log('src: ', file, 'post: ', pos);
      if (pos !== -1) {
        this.form.files.splice(pos, 1, file);
      } else {
        this.form.files.push(file);
      }
    }
    console.log('file list:', this.form.files);
  }


  /**
   * Returns the src of uploaded photo
   * @param code code of uploaded photo
   */
  src(code): string {
    const src = this.philgo.getSrc(this.form.files, code);
    if (src) {
      return src;
    } else {
      return this.philgo.anonymousPhotoURL;
    }
  }


  onClickProvince() {
    console.log('onClickProvince:: ', this.province);
    if (this.province) {
      // this.city = this.province;
      this.getCities();
    }
  }

  getCities() {
    this.showCities = false;
    this.philgo.cities(this.province).subscribe(cities => {
      console.log('getCities:: ', this.city);
      this.cities = cities;
      this.showCities = true;
    }, e => {
      this.componentService.alert(e);
      this.showCities = false;
    });
  }

  get cityKeys() {
    const keys = Object.keys(this.cities);
    keys.splice(0, 1);
    return keys;
  }


}

