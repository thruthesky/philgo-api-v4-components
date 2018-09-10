import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AlertOptions } from '@ionic/core';
import { PhilGoApiService, ApiPost } from '../../philgo-api/philgo-api.service';

@Injectable()
export class ComponentService {

  constructor(
    private readonly alertController: AlertController,
    private readonly philgo: PhilGoApiService
  ) { }

  async alert(options: AlertOptions) {
    if (!options) {
      return;
    }

    if (!options.buttons) {
      options.buttons = [this.philgo.t({ en: 'OK', ko: '확인' })];
    }

    const fail = await this.alertController.create(options);
    await fail.present();
  }

  async checkPostUserPassword(post: ApiPost): Promise<string> {
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
          role: 'cancel'
        }, {
          text: this.philgo.t({ en: 'Ok', ko: '확인' }),
          role: 'ok'
        }
      ]
    });
    await alert.present();
    const re = await alert.onDidDismiss();
    console.log('result: ', re, re.data, re.role);
    if (re.role && re.role === 'ok') {
      if (re.role && re.data.values && re.data.values.user_password) {
        return await this.philgo.postCheckPassword({ idx: post.idx, user_password: re.data.values.user_password }).toPromise()
          .then(res => res['user_password'])
          .catch(() => {
            this.alert({ message: this.philgo.t({ en: 'You have input wrong password.', ko: '비밀번호가 틀립니다.' }) });
            return '';
          });
      } else {
        this.alert({ message: this.philgo.t({ en: 'Please input password', ko: '비밀번호를 입력하세요.' }) });
      }
    }
    return '';
  }

  async deletePostWithMemberLogin(post: ApiPost) {
    const alert = await this.alertController.create({
      message: 'Are you sure you want to delete this post?',
      buttons: [
        {
          text: 'Yes',
          role: 'yes',
          handler: () => {
            console.log('going to delete:', post.idx);
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
    const re = await alert.onDidDismiss();
    if (re.role === 'yes') {
      return await this.philgo.postDelete({ idx: post.idx }).toPromise().then(res => {
        console.log('delete success: ', res);
        post.subject = this.philgo.textDeleted();
        post.content = this.philgo.textDeleted();
        return 'success';
      }).catch(async e => {
        this.alert(e);
        return 'failed';
      });
    } else {
      return 'failed';
    }
  }

  async deletePostWithPassword(post: ApiPost) {
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
          role: 'ok',
          handler: input => {
            console.log('Confirm Ok', input);
          }
        }
      ]
    });

    await alert.present();
    const re = await alert.onDidDismiss();
    if (re.role === 'ok') {
      return await this.philgo.postDelete({ idx: post.idx, user_password: re.data.values['user_password'] }).toPromise()
        .then(res => {
          console.log('delete success: ', res);
          post.subject = this.philgo.textDeleted();
          post.content = this.philgo.textDeleted();
          return 'success';
        }).catch(async e => {
          this.alert({
            message: this.philgo.t({ en: `Failed to delete: #reason`, ko: '글 삭제 실패: #reason' }, { reason: e.message })
          });
          return 'failed';
        });
    } else {
      return 'failed';
    }
  }

}
