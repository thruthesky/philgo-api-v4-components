# PhilGo Restful API

* This philgo api v4.

## TODO

* 새로운 글목록과 글 쓰기/수정 페이지를 만든다.
  * 글 쓰기(수정)를 버튼을 클릭하면, 모달 팝업창을 띄워서 한다.
    * 코멘트 쓰기나, 코멘트 수정은 글 목록 페이지에서 모달 팝업창을 띄워서 한다.
  * 완료 또는 취소를 하면, 목록페이지로 이동해서 맨 처음 부터 다시 로드한다. 중간에 끼워 넣지 않는다.
  * 중요: 꼭 ... 하나의 페이지에서 이것 저것 다 하려고 하다 보면, 문제가 복잡해 진다.

* capsulate locations of Philipines.
  * Make it class.
* Message functionality.

## Environment

* PhilGo Api is an opinionated service for PhilGo.COM. It uses
  * PhilGo Database.
  * PhilGo Firebase Project.
  * PhilGo push notification system.

* To see PhilGo Api log file on Macbook

```` sh
tail -f ~/tmp/sapcms_debug.log
````

### Firebase

* `firebsae` node module must be installed and initialized correctly on philgo-api.service.ts

### Ionic

* philgo api components will only work with ionic.

## Document

* [PhilGo Api Example](https://github.com/thruthesky/philgo-api-example)
* [PhilGo API v4 Document](https://docs.google.com/document/d/1E_IxnMGDPkjOI0Fl3Hg07RbFwYRjHq89VlfBuESu3BI/edit#)
* [PhilGo API](https://docs.google.com/document/d/1DbGXezNIVoOgFmjhnnZBZjrsx9vEwSVv-BzSJHB3C2s/edit#heading=h.wuw5os21mdy)
* [PhilGo Family Github](https://github.com/thruthesky/philgo-family) which uses this project.

## Examples

* [PhilGo Chat App Example](https://github.com/thruthesky/philgo-chat/tree/philgo-api-chat-example)

* [Examples of PhilGo API](https://github.com/thruthesky/philgo-api-old)
  * [Components example of PhilGo API](https://github.com/thruthesky/philgo-api-old/tree/master/components)

* Old version of [PhilGo API v2](https://github.com/thruthesky/philgo-api/tree/8bcd9b53d06e6acec2bb80f2aa0bfbe59f61b881)

## Install

### Adding PhilGo API as submodule

* You can add philgo-api as submodule of any angualr/ionic project under src/app/module/philgo-api.

```` sh
git submodule add https://github.com/thruthesky/philgo-api src/app/modules/philgo-api
````

### Initializing Philgo Api

* You can inject `PhilGoApiService` without module importing because it is providedIn root.

```` typescript
export class AppModule {
  constructor(philgo: PhilGoApiService) {
    /** Example 1 */
    // philgo.setServerUrl('http://59.30.59.162/sapcms_1_2/api.php');
    // philgo.setFileServerUrl('http://59.30.59.162/sapcms_1_2/index.php'); // Philgo API file server url. Must end with 'indx.php'.
    // philgo.setNewFileServerUrl('http://59.30.59.162/file-server/index.php');
  
    /** Example 2 */
    philgo.setServerUrl('https://local.philgo.com/api.php');
    philgo.setFileServerUrl('https://local.philgo.com/index.php');
    philgo.setNewFileServerUrl('http://work.org/file-server/index.php');

    /** Example 3 */
    // philgoServerUrl: 'https://www.philgo.com/api.php',
    // philgoFileServerUrl: 'https://file.philgo.com/index.php',
    // newFileServerUrl: 'https://file.philgo.com/~file_server/index.php'
  }
}
````

## TEST

* Test service put the service in root injector by using `providedIn: root`. So, no need to import it in module while `PhilGoApiService` needs to be imported by each module.

* [Old test code example](https://github.com/thruthesky/philgo-api-old/blob/master/providers/philgo-api-test.service.ts)
* http://localhost:4200/test/philgo/home for test page
* http://localhost:4200/test/philgo/register

## Example Codes

* @see home.ts to get forums
* get posts of a category

```` typescript
    let req = { post_id: this.post_id, page_no: this.page_no };
    this.post.page( req, ( posts: POSTS ) => {
      console.log('posts: ', posts);
      this.posts = posts;
    }, e => {
      alert( e );
    });
````

## Search

@see home.ts for search.

## Debugging

* To see Reqeust Url, do below.

```` typescript
    this.post.debug = true
````

## Comment Create

```` typescript
        let c = <POST_DATA> {};
        c.id = this.login.id;
        c.session_id = this.login.session_id;
        c.idx_parent = idx_parent;
        c.subject = "Comment title";
        c.content = "Comment content";
        console.log("comment create data: ", c);
        this.post.debug = true;
        this.post.createComment( c, data => {
            console.log('createComment() data: ', data);
            this.updateComment( data.post.idx );
        }, error => {
            console.error("create comment error: " + error );
            alert( error );
        });

````

## Locations of Philippines

You can get provinces and cities of province like below.

 * @example to get provinces : http://philgo.com/etc/location/philippines/json.php
 * @example to get cities of a province : http://philgo.com/etc/location/philippines/json.php?province=Bohol
 * @example to get all the provinces and cities : http://philgo.com/etc/location/philippines/json.php?province=all

 ```` typescript
    http.get( 'http://philgo.com/etc/location/philippines/json.php' )
      .subscribe( re => {
        let data = JSON.parse( re['_body'] );
        this.provinces = data;
        console.log('place:', data);
      });
````

### latest-component

This component shows latest component.

This shows in three format.

1. text only.
2. text with thumbnail.
3. thumbnail only.

### view component

### Event

* view component will emit 'edit' event if edit button clicked.

### broken image

* for broken thumbnail images, most likely, GIF images can have thumbnail, we show original image.

```` html
    <img *ngFor=" let photo of post.photos " [src]=" photo.url_thumbnail " (error)="photoImg.src = photo.url " #photoImg>
````

## Examples

### How to do post query to server

See `api.post()` to learn how to use api post query.

```` typescript
    api.setUrl( 'https://local.philgo.com/api.php' );
    api.post({ method: 'version' }).subscribe( re => {
      console.log('data: ', re);
    }, e => console.log(`Error code: ${e.code}, message: ${e.message}`));
````

### How to build and use api method

See the simplest `api.version()` and `api.exchangeRate()` method on how to call and build.

```` typescript
    api.version().subscribe( re => {
      console.log('version: ', re.version);
    }, e => console.log(`Error code: ${e.code}, message: ${e.message}`));
    api.exchangeRate().subscribe( re => {
      console.log('exchangeRate: ', re);
    }, e => console.log(`Error code: ${e.code}, message: ${e.message}`));
````

### General Post Query

`api.query()` is the general query method. You do not need to create api service method anymore since `api.query()` can take all the queries.

```` typescript
    api.query<ApiCurrencyResponse>('exchangeRate', {currency: 'php'}).subscribe( re => {
      console.log('usd: ', re.usd);
      console.log('php: ', re.php);
    }, e => console.log(e));
````

## Protocol

### Response

If there is no data, code is always 0. and data has the response from server.

If code is not 0, then it is considered as an error response from PhilGo Api.

```` josn
{
    code: 0,
    data: ... response data ...
}
````

### Error code

* -400 cannot connect to webserver or PHP script error.
* -500 Server Internal error.

## Api Unit Test

Run tests like below.

```` typescript
import { Component } from '@angular/core';
import { ApiCurrencyResponse } from '../../modules/philgo-api/providers/philgo-api.service';
import { PhilGoApiTestService } from '../../modules/philgo-api/providers/philgo-api-test.service';
@Component({
  selector: 'app-page-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [PhilGoApiTestService]
})
export class HomePage {
  constructor(
    t: PhilGoApiTestService
  ) {
    t.setUrl('https://local.philgo.com/api.php').run();
  }
}
````

## Pages

### Forum List Page

* see [philgo-family main project page list](https://github.com/thruthesky/philgo-family/blob/master/projects/main/src/app/pages/forum/list/list.page.ts) for best example.

## Components

### Reusable Components

* All components display error on its compment templates Unless `[displayError]` is set to false.
  * Errors are displayed in classes of `.api-error`, `.code`, `.message`.
* All components have output property of `(error)` when an error occurs.

### Text translation for components

* All texts are customizable via `[text]` property.
  You can change it the text by giving new JSON object into [text] property.
* Texts are
  * email, password, nickname, name, mobile, error, submitting, register, loadingProfile, deletePrimaryPhoto
  * email, password, submitting, login

### Cypress e2e test

* Components are tested with Cypress.
* Edit integrationFolder to `philgo-family` project folder and set `baseUrl` in cypress.json.
* Edit package.json for `script: { e2e: 'cypress open' }`
* And run `npm run e2e`

* Example of cypress.json

```` json
{
    "integrationFolder": "projects/modules",
    "testFiles": "**/*.spec.js",
    "baseUrl": "http://localhost:4200/"
}
````

### user-register-and-profile

* This is a resuable component for user registration and update.
* It has `[displayError]`, `[text]`, `(register)`, `(update)`, `(error)`.

* example of app-user-register-profile-component

```` html
<app-user-register-and-profile-component
    (register)=" justRegistered = true "
    (update)=" justRegistered = false "
    (error)=" onError($event) "
    [displayError]="false"
    [text]="{
        email: '이메일'
    }"
>
</app-user-register-and-profile-component>
````

### Forum components

#### Post list component

* This component is highly resusable.
* The DOM layout of posts has two shape.

* when it is collapsed to show only summary of post.

```` html
.post-list
  .posts
    .post
      <a>
````

* When it is opened to show the full content of the post.

```` html
  .post-list[post_id="post id"]
    .posts
      .post
        <app-post-view-component>
          .post-view
            .post-display
              .post-subject
              .post-meta
              .post-content
              <app-data-component>
                  .files
                    .file
              nav.post-buttons
                <button class="post-good">
                <button class="post-bad">
                <button class="post-edit">
                <button class="post-delete">
                <button class="post-report">
                <button class="post-close">
            <app-comment-edit-component>
            <app-comment-list-component>
          <app-post-edit-component>
````

#### Layout and Design for forum coponents

* When post has image which is very wide, the layout may look urgly.
  You can adjust the layout by limiting the max width like below.
  Remember to do it on global css since there is no layout css code in forum components.

* Example of limiting the width

```` scss
$post-content-width: $page-width - ( $sidebar-width * 2 );
.post-edit, .post-list {
    max-width: $post-content-width;
    overflow: hidden;
}
````

* Or if you are using flex based layout, try below.

```` scss
main {
  margin: 0 auto;
  max-width: $page-width;
  min-height: $lg-main-min-height;
  .body {
    display: flex;
    .left {
      flex-basis: $sidebar-width;
    }
    .center {
      flex-grow: 1;
        max-width: $center-width;
        overflow: hidden;
    }
    .right {
      flex-basis: $sidebar-width;
    }
  }
}
````

## Chat

* Simply use `app-chat-all-rooms` component selector and it will begin chat app.

### Chat Room Route

* When chat room is clicked/created, it will navigate to `/room/:idx`.
  So, the app must have chat room page on `/room/:idx` route.
