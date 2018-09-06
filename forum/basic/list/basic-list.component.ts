import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { PhilGoApiService, ApiPost, ApiForum } from '../../../../philgo-api/philgo-api.service';
import { EditService } from '../edit/edit.component.service';
import { ActivatedRoute } from '@angular/router';
import { PopoverController, InfiniteScroll } from '@ionic/angular';
import { MenuPopoverComponent } from './menu-popover/menu-popover.component';
import { ComponentService } from '../../../service/component.service';


@Component({
  selector: 'app-forum-basic-list-component',
  templateUrl: './basic-list.component.html',
  styleUrls: ['../../../scss/index.scss', './basic-list.component.scss']
})
export class ForumBasicListComponent implements OnInit, AfterViewInit {

  @Input() autoViewContent = false;
  forum: ApiForum = null;
  posts: Array<ApiPost> = [];


  post_id: string = '';
  page_no = 1;
  limit = 20;
  noMorePosts = false;
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly popoverController: PopoverController,
    public readonly philgo: PhilGoApiService,
    public readonly edit: EditService,
    private readonly componentService: ComponentService
  ) {

    this.activatedRoute.paramMap.subscribe(params => {
      this.post_id = params.get('post_id');
      this.loadPage();
    });

  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // window.setTimeout(() => this.onClickPost(), 200);
  }

  loadPage(event?: Event) {
    let infiniteScroll: InfiniteScroll;
    if (event) {
      infiniteScroll = <any>event.target;
    }
    this.philgo.postSearch({ post_id: this.post_id, page_no: this.page_no, limit: this.limit }).subscribe(search => {
      console.log('search: ', search);
      this.page_no++;
      this.forum = search;

      if (!search.posts || !search.posts.length) {
        infiniteScroll.disabled = true;
        this.noMorePosts = true;
        return;
      }
      this.posts = this.posts.concat(search.posts);
      if (event) {
        infiniteScroll.complete();
      }
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


  async onClickMenu(event: any, post: ApiPost) {
    const popover = await this.popoverController.create({
      component: MenuPopoverComponent,
      componentProps: {
        controller: this.popoverController
      },
      event: event,
      translucent: true
    });
    await popover.present();
    const re = await popover.onDidDismiss();
    const action = re.role;

    console.log('action: ', action);
    if (action === 'view') {
      this.onView(post);
    } else if (action === 'edit') {
      this.onEdit(post);
    } else if (action === 'delete') {
      this.onDelete(post);
    } else if (action === 'like') {
      this.onVote(post, 'good');
    } else if (action === 'reply') {
      this.onReply(post, post);
    } else if (action === 'report') {
      this.onReport(post);
    }
  }


  onView(post: ApiPost) {
    post['showMore'] = ! post['showMore'];
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


