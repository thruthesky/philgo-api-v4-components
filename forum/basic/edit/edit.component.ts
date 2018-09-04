import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PhilGoApiService, ApiPost, ApiError, ApiForum } from '../../../../philgo-api/philgo-api.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['../../../scss/index.scss', './edit.component.scss']
})
export class EditComponent implements OnInit, AfterViewInit {
  controller: ModalController;
  data;
  form: ApiPost = <ApiPost>{};
  error: ApiError = null;

  pageTitle = '';
  constructor(
    public philgo: PhilGoApiService
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

  }



  onSubmit() {
    this.error = null;
    // if (!this.form.subject || this.form.subject.length < 10) {
    //   this.error = { code: -1, message: 'Please input title, and length cannot be less than 10' };
    //   return;
    // }
    if (!this.form.content || this.form.content.length < 10) {
      this.error = { code: -1, message: 'Please input content, and length cannot be less than 10' };
      return;
    }


    /**
     * Edit
     */
    if (this.form.idx) {
      console.log('onSubmit() => postEdit() : ', this.form);
      this.philgo.postEdit(this.form).subscribe(res => {
        console.log('post res: ', res);
        this.controller.dismiss(res, 'success');
      }, e => {
        console.error(e);
        this.error = e;
      });
    } else {
      /**
       * Create
       */
      console.log('onSubmit() => postCreate() : ', this.form);
      if (this.data.role === 'reply') {
        this.form.idx_parent = this.data.idx;
      }
      this.philgo.postCreate(this.form).subscribe(res => {
        console.log('post res: ', res);
        this.controller.dismiss(res, 'success');
      }, e => {
        console.error(e);
        this.error = e;
      });
    }
  }
}
