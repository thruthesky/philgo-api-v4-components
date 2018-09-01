import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PhilGoApiService, ApiPost, ApiForum } from '../../../philgo-api/philgo-api.service';
import { EditService } from '../edit/edit.component.service';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, AfterViewInit {



  forum: ApiForum = null;
  posts: Array<ApiPost> = [];
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    public readonly philgo: PhilGoApiService,
    public readonly edit: EditService
  ) {

    this.activatedRoute.paramMap.subscribe(params => {
      this.philgo.postSearch({ post_id: params.get('post_id'), page_no: 1, limit: 10 }).subscribe(search => {
        console.log('search: ', search);
        this.forum = search;
        this.posts = search.posts;
        // this.onClickPost();
      });
    });

  }

  ngOnInit() {
  }

  ngAfterViewInit() {

  }
  async onClickPost() {
    const res = await this.edit.present(this.forum);
    if (res.role == 'success') {
      this.posts.unshift(res.data);
    }
  }

}


