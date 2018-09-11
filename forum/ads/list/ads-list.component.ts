import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { PhilGoApiService, ApiPost, ApiForum } from '../../../../philgo-api/philgo-api.service';
import { ActivatedRoute } from '@angular/router';
import { PopoverController, InfiniteScroll } from '@ionic/angular';
import { ComponentService } from '../../../service/component.service';
import { AdsEditService } from '../edit/ads-edit.component.service';


@Component({
  selector: 'app-ads-list-component',
  templateUrl: './ads-list.component.html',
  styleUrls: ['../../../scss/index.scss', './ads-list.component.scss']
})
export class AdsListComponent implements OnInit, AfterViewInit {

  @Input() autoViewContent = false;
  forum: ApiForum = null;

  post_id = 'ads';
  limit = 200;
  constructor(
    public readonly philgo: PhilGoApiService,
    public readonly edit: AdsEditService,
    private readonly componentService: ComponentService
  ) {
    this.loadPage();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    window.setTimeout(() => this.onClickPost(), 200);
  }

  loadPage(event?: Event) {
    this.philgo.postSearch({ post_id: this.post_id, uid: this.philgo.myIdx(), page_no: 1, limit: this.limit, deleted: 0 }).subscribe(search => {
      console.log('search: ', search);
      this.forum = search;
    });
  }

  async onClickPost() {
    const res = await this.edit.present(this.forum);
    if (res.role === 'success') {
      this.forum.posts.unshift(res.data);
    }
  }

  /**
   * Opens an edit box.
   * @param post post or comment to edit
   */
  async onEdit(post: ApiPost) {

    /**
     * Make a copy from post. So, it will not be referenced.
     */
    const data = Object.assign({}, post);
    const res = await this.edit.present(data);

    if (res.role === 'success') {
      /// Assign to main post's position( reference )
      Object.assign(post, res.data);
    } else if (res.role === 'delete') {
      console.log('res: data', res.data);
      const i = this.forum.posts.findIndex(v => v.idx == res.data.idx);
      this.forum.posts.splice(i, 1);
    }
  }


  show(post) {
    return post['showMore'] || this.autoViewContent;
  }
}


