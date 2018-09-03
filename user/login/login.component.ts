import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LanguageTranslate } from '../../../language-translate/language-translate';
import { ApiErrorEmptyUid, ApiErrorEmptyPassword, ApiErrorResponse, PhilGoApiService } from '../../../philgo-api/philgo-api.service';


@Component({
  selector: 'app-login-component',
  templateUrl: 'login.component.html',
  styleUrls: ['./../../scss/index.scss', './login.component.scss']
})
export class LoginComponent implements OnInit {

  @Output() login = new EventEmitter();
  @Output() error = new EventEmitter<ApiErrorResponse>();
  uid = '';
  password = '';
  loader = {
    submit: false
  };
  constructor(
    public philgo: PhilGoApiService,
    public tr: LanguageTranslate
  ) { }

  ngOnInit() {
  }
  onSubmit() {
    if (!this.uid) {
      this.error.emit(this.philgo.error(ApiErrorEmptyUid, this.tr.t({
        en: 'Please input login ID.',
        ko: '로그인 아이디를 입력 해 주세요.'
      })));
      return;
    } else if (!this.password) {
      this.error.emit(this.philgo.error(ApiErrorEmptyPassword, this.tr.t({
        en: 'Please input password.',
        ko: '비밀번호를 입력 해 주세요.'
      })));
      return;
    }
    this.loader.submit = true;
    this.philgo.login({ uid: this.uid, password: this.password }).subscribe(res => {
      this.loader.submit = false;
      this.login.emit();
    }, e => {
      this.loader.submit = false;
      this.error.emit(e);
    });
    return false;
  }

}

