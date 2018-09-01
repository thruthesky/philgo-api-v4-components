import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PhilGoApiService, ApiPost, ApiError, ApiForum } from '../../../philgo-api/philgo-api.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  controller: ModalController;
  forum: ApiForum;
  form: ApiPost = <ApiPost>{};
  error: ApiError = null;
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
      // console.log('post_id:: ', this.forum);
      if ( this.forum  && this.forum.post_id ) {
          this.form.post_id = this.forum.post_id;
      }

  }



  onSubmit() {
      this.error = null;
      if ( ! this.form.subject || this.form.subject.length < 10 ) {
          this.error = {code: -1, message:'Please input title, and length cannot be less than 10'};
          return;
      }
      if ( ! this.form.content || this.form.content.length < 10 ) {
          this.error = {code: -1, message:'Please input content, and length cannot be less than 10'};
          return;
      }

    console.log('onSubmit(): ', this.form);
    this.philgo.postCreate(this.form).subscribe(res => {
      console.log('post res: ', res);
      this.controller.dismiss( res, 'success' );
    }, e => {
      console.error(e);
      this.error = e;
    });
  }
}
