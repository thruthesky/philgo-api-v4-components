import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PhilGoApiService, ApiPost, ApiError, ApiForum } from '../../../../philgo-api/philgo-api.service';
import { AngularLibrary } from '../../../../angular-library/angular-library';
import { ComponentService } from '../../../service/component.service';

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

  pageTitle = '';
  constructor(
    public philgo: PhilGoApiService,
    public readonly componentService: ComponentService
  ) {
    // this.form.subject = 'Hello, qna';
    // this.form.post_id = 'qna';
    // this.onSubmit();

    // this.form.post_id = this.forum.post_id;
    // console.log('constructor:forum:: ', this.forum);


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
        this.form.idx_parent = this.data.idx;
      }
      this.philgo.postCreate(this.form).subscribe(res => {
        this.controller.dismiss(res, 'success');
      }, e => {
        this.componentService.alert(e);
      });
    }
  }


  onChangeFile(event: Event) {
    if (AngularLibrary.isCordova()) {
      return;
    }
    const files = event.target['files'];
    if (files === void 0 || !files.length || files[0] === void 0) {
      const e = { code: -1, message: this.philgo.t({ en: 'Please select a file', ko: '업로드 할 팔일을 선택해주세요.' }) };
      this.componentService.alert(e);
    }
    this.philgo.fileUpload(files, { gid: this.form.gid, user_password: this.form.user_password }).subscribe(res => {
      if (typeof res === 'number') {
        console.log('percentage: ', res);
      } else {
        console.log('file success: ', res);
        if (!this.form.files || !this.form.files.length) {
          this.form.files = [];
        }
        this.form.files.push(res);
      }
    }, e => {
      console.error(e);
      this.componentService.alert(e);
    });
  }
}

