import { Component, OnInit } from '@angular/core';
import { PhilGoApiService } from '../../philgo-api/philgo-api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    public philgo: PhilGoApiService
  ) {
    // philgo.forumPage({ post_id: 'freetalk', page_no: 1, limit: 10 }).subscribe(res => {
    //   console.log('res: ', res);
    // });

    activatedRoute.paramMap.subscribe(params => {
      console.log('params: ', params);

      philgo.postSearch({ post_id: params.get('post_id') }).subscribe(search => {
        console.log('serach', search);
      })

    });
  }

  ngOnInit() {
  }

}
