import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PhilGoApiService, ApiPost } from '../../../philgo-api/philgo-api.service';
import { EditService } from '../edit/edit.component.service';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, AfterViewInit {



  posts: Array<ApiPost> = [];
  constructor(
    public philgo: PhilGoApiService,
    public edit: EditService
  ) {
    philgo.postSearch({ post_id: 'freetalk', page_no: 1, limit: 10 }).subscribe(res => {
      console.log('res: ', res);
      this.posts = res.posts;
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }
  onClickPost() {
    this.edit.present();
  }

}


