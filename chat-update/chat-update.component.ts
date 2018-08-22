import { Component, OnInit, Input } from '@angular/core';
import { LanguageTranslate } from '../../language-translate/language-translate';
import { PhilGoApiService } from '../../philgo-api/philgo-api.module';
import { AngularLibrary } from '../../angular-library/angular-library';

import * as firebase from 'firebase/app';
import 'firebase/messaging';


@Component({
  selector: 'app-chat-update-component',
  templateUrl: './chat-update.component.html',
  styleUrls: ['./chat-update.component.scss']
})
export class ChatUpdateComponent implements OnInit {

  @Input() appVersion = 0;
  constructor(
    public tr: LanguageTranslate,
    public philgo: PhilGoApiService
  ) {
  }

  ngOnInit() {
  }

  get needUpdate(): boolean {

    if (AngularLibrary.isCordova()) {
      if (this.philgo.info && this.philgo.info.chat_version) {
        const serverVersion = AngularLibrary.parseNumber(this.philgo.info.chat_version);
        if (this.appVersion < serverVersion) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Returns true if it's not Cordova and permission is not requeted.
   */
  get needRequestWebPushPermission(): boolean {
    if (!AngularLibrary.isCordova()) {
      if (!AngularLibrary.isPushPermissionRequested()) {
        return true;
      }
    }
    return false;
  }

  /**
   * Return true if the user rejected push notification.
   */
  get isWebPushPermissionDenied(): boolean {
    if (!AngularLibrary.isCordova()) {
      if (AngularLibrary.isPushPermissionDenied()) {
        return true;
      }
    }
    return false;
  }


  /**
   * 매번 실행시 호출 하면 되지만, 맨 처음에는 rooms 페이지에서 한번 물어 보고 한다.
   */
  requestWebPushPermission() {
    const messaging = firebase.messaging();
    // console.log('requestPushNotificationPermission()');
    messaging.requestPermission().then(() => {
      // console.log('   ===> Notification permission granted.');
      // TODO(developer): Retrieve an Instance ID token for use with FCM.
      // Callback fired if Instance ID token is updated.

      messaging.getToken().then(token => this.philgo.updatePusTokenToServer(token))
        .catch((err) => {
          // console.log('getToken() error: ', err);
        });
      messaging.onTokenRefresh(() => {
        messaging.getToken().then((token => this.philgo.updatePusTokenToServer(token)))
          .catch((err) => {
            // console.log('Unable to retrieve refreshed token ', err);
            // showToken('Unable to retrieve refreshed token ', err);
          });
      });
    }).catch((err) => {
      // console.log('Unable to get permission to notify. User may have denied permission!', err);
    });
  }

}

