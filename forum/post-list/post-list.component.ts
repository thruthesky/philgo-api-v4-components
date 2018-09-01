import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PhilGoApiService, ApiPost, ApiForum } from '../../../philgo-api/philgo-api.service';
import { EditService } from '../edit/edit.component.service';
import { ActivatedRoute } from '@angular/router';
import { ModalController, PopoverController, AlertController } from '@ionic/angular';
import { MenuPopoverComponent } from './menu-popover/menu-popover.component';


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
    private readonly popoverController: PopoverController,
    private readonly alertController: AlertController,
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
    this.forum['role'] = 'post-create';
    const res = await this.edit.present(this.forum);
    if (res.role == 'success') {
      this.posts.unshift(res.data);
    }
  }

  async onClickReply(post: ApiPost) {
    post['role'] = 'reply';
    const res = await this.edit.present(post);
    if (res.role == 'success') {
      // this.posts.unshift(res.data);
      if (post.comments && post.comments.length) {

      } else {
        post.comments = [];
      }
      post.comments.push(res.data);
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
    if (action == 'view') {
      this.onView(post);
    } else if (action == 'edit') {
      this.onPostEdit(post);
    } else if (action == 'delete') {
      this.onDelete(post);
    }
  }


  onView(post: ApiPost) {
    post['showMore'] = true;
  }


  async onPostEdit(post: ApiPost) {
    post['role'] = 'post-edit';
    const data = Object.assign({}, post);
    const res = await this.edit.present(data);
    if (res.role == 'success') {
      Object.assign(post, res.data);
    }
  }
  async onClickCommentEdit(comment: ApiPost) {
    comment['role'] = 'comment-edit';
    const data = Object.assign({}, comment);
    const res = await this.edit.present(data);
    if (res.role == 'success') {
      Object.assign(comment, res.data);
    }
  }

  async onDelete(post: ApiPost) {
    console.log(post);
    if (post.idx_member === '0') {
      return this.onActionDeleteWithPassword(post);
    }
    const alert = await this.alertController.create({
      message: 'Are you sure you want to delete this post?',
      buttons: [
        {
          text: 'Yes',
          role: 'yes',
          handler: () => {
            console.log('going to delete:', post.idx);
            this.philgo.postDelete({ idx: post.idx }).subscribe(res => {
              console.log('delete success: ', res);
              post.subject = this.philgo.textDeleted();
              post.content = this.philgo.textDeleted();
            }, async e => {
              const fail = await this.alertController.create({
                message: this.philgo.t({ en: `Failed to delete: #reason`, ko: '글 삭제 실패: #reason' }, { reason: e.message }),
                buttons: [this.philgo.t({ en: 'OK', ko: '확인' })]
              });
              await fail.present();
            });
          }
        },
        {
          text: 'No',
          role: 'no',
          handler: () => {
          }
        }
      ]
    });

    await alert.present();

  }
  async onActionDeleteWithPassword(post: ApiPost) {
    const alert = await this.alertController.create({
      header: this.philgo.t({ en: 'Password', ko: '비밀번호' }),
      inputs: [
        {
          name: 'user_password',
          type: 'text',
          placeholder: this.philgo.t({ en: 'Please input password!', ko: '비밀번호를 입력하세요.' })
        }
      ],
      buttons: [
        {
          text: this.philgo.t({ en: 'Cancel', ko: '취소' }),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.philgo.t({ en: 'Ok', ko: '확인' }),
          handler: input => {
            console.log('Confirm Ok', input);
            this.philgo.postDelete({ idx: post.idx, user_password: input.user_password }).subscribe(res => {
              console.log('delete success: ', res);
              post.subject = this.philgo.textDeleted();
              post.content = this.philgo.textDeleted();
            }, async e => {
              const fail = await this.alertController.create({
                message: this.philgo.t({ en: `Failed to delete: #reason`, ko: '글 삭제 실패: #reason' }, { reason: e.message }),
                buttons: [this.philgo.t({ en: 'OK', ko: '확인' })]
              });
              await fail.present();
            });
          }
        }
      ]
    });

    await alert.present();
  }
}


