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
  form: ApiPost = <any>{};
  error: ApiError = null;
  constructor(
    public philgo: PhilGoApiService
  ) {
    this.form.subject = 'Hello, qna';
    this.form.post_id = 'qna';
    // this.onSubmit();
  }
  ngOnInit() {
  }

  onSubmit() {
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
