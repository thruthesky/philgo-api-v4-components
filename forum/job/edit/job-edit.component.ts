import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { PhilGoApiService, ApiPost, ApiError, ApiForum, ApiFile } from '../../../../philgo-api/philgo-api.service';
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
  birthday;

  pageTitle = '';
  percentage = 0;

  profilePhoto = 'profile-photo';
  bodyPhoto = 'body-photo';


  N = N;

  constructor(
    public philgo: PhilGoApiService,
    public readonly componentService: ComponentService,
    public tooltip: TooltipService
  ) {
  }
  ngOnInit() {
    const d = new Date();
    this.birthday = { 'month': { 'text': '10', 'value': 10, 'columnIndex': 0 }, 'day': { 'text': '11', 'value': 11, 'columnIndex': 1 }, 'year': { 'text': '1998', 'value': 1998, 'columnIndex': 2 } };

    if (this.data && this.data.idx === void 0) {
      this.form.post_id = this.data.post_id;
      const forumName = this.philgo.forumName(this.data.post_id );
      const categoryName = this.philgo.forumName(this.data.post_id, this.data.category );
      this.pageTitle = `${forumName} >> ${categoryName}`;
    } else {
      this.form = this.data;
      this.pageTitle = this.philgo.t({ en: `Job Editing ##no`, ko: `구인구직 수정 ##no` }, { no: this.data['idx'] });
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
    if (this.form.subject && this.form.subject.length > 10) return 'danger';
    else return 'dark';
  }

  onSubmit() {
    console.log('data.role: ', this.data.role);

    // this.form[N.birthday] = this.birthday;
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


  onChangeFile(event: Event, code: string) {
    const files = <any>event.target['files'];
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
      }
    }, e => {
      console.error(e);
      this.componentService.alert(e);
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
   * Returns the photo of the code.
   * @param code code of the uploaded file
   */
  getPhoto(code): ApiFile {
    if (this.form.files) {
      return this.form.files.find(v => v.code === code);
    }
  }

  /**
   * Returns the src of uploaded photo
   * @param code code of uploaded photo
   */
  src(code): string {
    return this.getPhoto(code).src + '?name=' + this.getPhoto(code).name;
  }
}

