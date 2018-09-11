import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { PhilGoApiService, ApiPost, ApiError, ApiForum, ApiFile } from '../../../../philgo-api/philgo-api.service';
import { AngularLibrary } from '../../../../angular-library/angular-library';
import { ComponentService } from '../../../service/component.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { TooltipService } from '../../../tooltip/tooltip.module';

@Component({
  selector: 'app-ads-edit',
  templateUrl: './ads-edit.component.html',
  styleUrls: ['../../../scss/index.scss', './ads-edit.component.scss']
})
export class AdsEditComponent implements OnInit, AfterViewInit {
  controller: ModalController;
  data;
  form: ApiPost = <ApiPost>{};

  pageTitle = '';
  percentage = 0;

  subjectMinLength = 16;
  subjectMaxLength = 48;
  constructor(
    private readonly alertController: AlertController,
    private camera: Camera,
    public philgo: PhilGoApiService,
    public readonly componentService: ComponentService,
    public tooltip: TooltipService
  ) {


  }
  ngOnInit() {
    if (this.data && this.data.idx === void 0) {
      this.form.post_id = this.data.post_id;
      const name = this.philgo.forumName(this.data.post_id);
      this.pageTitle = this.philgo.t({ en: `Posting on #name`, ko: `#name 글쓰기` }, { name: name });
    } else {
      this.form = this.data;
      this.pageTitle = this.philgo.t({ en: `Post Editing ##no`, ko: `글 수정 ##no` }, { no: this.data['idx'] });
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
    if (this.subjectLength < this.subjectMinLength) return 'danger';
    if (this.subjectLength > this.subjectMaxLength) return 'danger';
    return 'dark';
  }
  get subjectLength(): number {
    if (this.form.subject) {
      return this.form.subject.trim().length;
    } else {
      return 0;
    }
  }

  onSubmit() {
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
          this.percentage = 0;
      }
    }, e => {
      console.error(e);
      this.componentService.alert(e);
        this.percentage = 0;
    });
  }

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

  getPhoto(code): ApiFile {
    return this.philgo.getFile(this.form.files, code);
    // if (this.form.files) {
    //   return this.form.files.find(v => v.code === code);
    // }
  }

  src(code): string {
    return this.getPhoto(code).src + '?name=' + this.getPhoto(code).name;
  }

  onClickIntro(event: Event) {
    this.tooltip.present(event, {
      title: this.philgo.t({ en: 'Advertisement Information', ko: '광고 등록 안내' }),
      subTitle: this.philgo.t({ en: 'Advertisement', ko: '광고' }),
      content: this.philgo.t({
        en: 'You can post advertisement text, banner and content image. But you have to contact admin after you make changes to display your advertisement.',
        ko: '광고 문구, 배너, 내용 사진 등을 직접 등록 및 수정하시면됩니다. 하지만 운영자의 승인이 있어야 광고가 표시되므로 등록 또는 수정 꼭 운영자에게 연락주세요.'
      })
    });
  }
}

