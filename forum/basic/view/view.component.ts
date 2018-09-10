import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiPost, PhilGoApiService } from '../../../../philgo-api/philgo-api.service';

@Component({
  selector: 'app-forum-basic-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  @Input() post: ApiPost;
  @Input() autoViewContent = false;

  @Output() onView = new EventEmitter();
  @Output() onVote = new EventEmitter();
  @Output() onReply = new EventEmitter();
  @Output() onClickMenu = new EventEmitter();

  constructor(
    public philgo: PhilGoApiService
  ) { }

  ngOnInit() {
  }


  show(post) {
    return post['showMore'] || this.autoViewContent;
  }
}
