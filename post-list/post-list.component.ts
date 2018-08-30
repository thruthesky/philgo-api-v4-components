import { Component, OnInit } from '@angular/core';
import { PhilGoApiService } from '../../philgo-api/philgo-api.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  constructor(
    public philgo: PhilGoApiService
  ) {
    philgo.forumPage({ post_id: 'freetalk', page_no: 1, limit: 10 }).subscribe(res => {
      console.log('res: ', res);
    });
  }

  ngOnInit() {
  }

}
