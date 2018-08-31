import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PhilGoApiService, ApiPost, ApiPostSearch } from '../../../philgo-api/philgo-api.service';
import { EditService } from '../edit/edit.component.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, AfterViewInit {



  search: ApiPostSearch = null;
  posts: Array<ApiPost> = [];
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    public readonly philgo: PhilGoApiService,
    public readonly edit: EditService
  ) {

    philgo.postSearch({ post_id: 'freetalk', page_no: 1, limit: 10 }).subscribe(search => {
      console.log('search: ', search);
      this.search = search;
      this.posts = search.posts;
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


