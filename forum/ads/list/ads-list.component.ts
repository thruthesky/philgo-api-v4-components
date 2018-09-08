import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { PhilGoApiService, ApiPost, ApiForum } from '../../../../philgo-api/philgo-api.service';
import { ActivatedRoute } from '@angular/router';
import { PopoverController, InfiniteScroll } from '@ionic/angular';
import { ComponentService } from '../../../service/component.service';
import { AdsEditService } from '../edit/edit.component.service';


@Component({
  selector: 'app-ads-list-component',
  templateUrl: './ads-list.component.html',
  styleUrls: ['../../../scss/index.scss', './ads-list.component.scss']
})
export class AdsListComponent implements OnInit, AfterViewInit {

  @Input() autoViewContent = false;
  forum: ApiForum = null;
  posts: Array<ApiPost> = [];


  post_id = 'ads';
  limit = 200;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly popoverController: PopoverController,
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
    
    this.philgo.postSearch({ post_id: this.post_id, page_no: 1, limit: this.limit }).subscribe(search => {
      console.log('search: ', search);
      this.forum = search;
    });
  }

  async onClickPost() {
    this.forum['role'] = 'post-create';
    const res = await this.edit.present(this.forum);
    this.forum['role'] = '';
    if (res.role === 'success') {
      this.posts.unshift(res.data);
    }
  }


  async onReply(post: ApiPost, rootPost: ApiPost) {
    console.log('onReply()', post, rootPost);
    post['role'] = 'reply';
    const res = await this.edit.present(post);
    post['role'] = '';
    if (res.role === 'success') {
      /**
       * Or post create?
       */
      if (rootPost.comments && rootPost.comments.length) {

      } else {
        rootPost.comments = [];
      }

      console.log('post, rootPost, res.data', post, rootPost, res.data);
      /**
       * Is it comment create?
       */
      if (post.idx_parent) {
        const pos = rootPost.comments.findIndex(comment => comment.idx === post.idx);
        if (pos !== -1) {
          rootPost.comments.splice(pos + 1, 0, res.data);
        } else {
          rootPost.comments.push(res.data);
        }
      }
    }
  }



  onView(post: ApiPost) {
    post['showMore'] = !post['showMore'];
  }


  /**
   * Opens an edit box.
   * @param post post or comment to edit
   */
  async onEdit(post: ApiPost) {


    if (this.philgo.isAnonymousPost(post)) {
      const password = await this.componentService.checkPostUserPassword(post);
      if (password) {
        post.user_password = password;
      } else {
        console.log('onEdit() ==> philgo.isAnonymousPost() failed ==> return ');
        return;
      }
    }
    // console.log('daa: ', data);
    if (post.idx_parent !== '0') {
      post['role'] = 'comment-edit';
    } else {
      post['role'] = 'post-edit';
    }


    /**
     * Make a copy from post. So, it will not be referenced.
     */
    const data = Object.assign({}, post);
    const res = await this.edit.present(data);
    post['role'] = '';
    if (res.role === 'success') {
      /// Assign to main post's position( reference )
      Object.assign(post, res.data);
    }
  }




  onDelete(post: ApiPost) {
    console.log(post);
    if (this.philgo.parseNumber(post.idx_member) === 0) {
      return this.componentService.deletePostWithPassword(post);
    } else {
      return this.componentService.deletePostWithMemberLogin(post);
    }
  }
  onVote(post, mode: 'good' | 'bad') {
    this.philgo.postLike({ idx: post.idx, mode: mode }).subscribe(res => {
      console.log('res: ', res);
      post[mode] = res.result;
    }, e => {
      this.componentService.alert(e);
    });
  }

  onReport(post: ApiPost) {

    this.philgo.postReport(post.idx).subscribe(res => {
      console.log('res: ', res);
      this.componentService.alert({
        message: this.philgo.t({ en: 'This post has been reported.', ko: '본 글은 신고되었습니다.' })
      });
    }, e => {
      this.componentService.alert(e);
    });

  }

  show(post) {
    return post['showMore'] || this.autoViewContent;
  }
}


