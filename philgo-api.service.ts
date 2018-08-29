import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaderResponse, HttpEventType } from '@angular/common/http';
import { Observable, throwError, Subject, of } from 'rxjs';
import { map, catchError, filter } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';



export const ID = 'id';
export const SESSION_ID = 'session_id';
export const NICKNAME = 'nickname';
export const IDX_MEMBER = 'idx_member';
export const DELETED = 'Deleted';

export const CHAT_STATUS_ENTER = 'E';
export const CHAT_STATUS_LEAVE = 'L';

export const ERROR_CHAT_NOT_IN_THAT_ROOM = -530;
export const ERROR_WRONG_SESSION_ID = -290;
export const ERROR_WRONG_IDX_MEMBER = -280;
export const ERROR_CHAT_ANONYMOUS_CANNOT_ENTER_ROOM = -640;

export const CACHE_CHAT_MY_ROOM = 'cache-chat-my-room';

interface ApiOptionalRequest {
    method?: string;
    idx?: any;
    session_id?: string;
}
export interface ApiRequest {
    method: string;
    idx_member?: string;
    session_id?: string;
}
export interface ApiLoginRequest extends ApiOptionalRequest {
    uid: string;        // id or nickname or email
    password: string;
}
export interface ApiCurrencyRequest extends ApiOptionalRequest {
    currency?: string;
}
export interface ApiRegisterRequest extends ApiOptionalRequest {
    email: string;
    password: string;
    name?: string;
    nickname: string;
    mobile?: string;
    url_profile_photo?: string; // for profile upload form compatibility only.
}
export interface ApiProfileUpdateRequest extends ApiOptionalRequest {
    name: string;
    mobile: string;
}

export interface ApiResponse {
    code: number;
    message?: string;
    data?: any;             // all the data goes here.
}
export interface ApiErrorResponse {
    code: number;
    message?: string;
}
interface ApiVersionResponse {
    version: string;
}


export interface ApiCurrencyResponse extends ApiResponse {
    php: string;
    usd: string;
}
/**
 * @see sapcms_1_2::ApiLibrary::getUserProfile()
 */
export interface ApiProfileResponse extends ApiResponse {
    idx: string;
    id: string;
    email: string;
    name: string;
    nickname: string;
    mobile: string;
    password: string;
    birth_year: string;
    gender: string;
    url_profile_photo: string;
    session_id: string;
}

export interface ApiRegisterResponse extends ApiProfileResponse {
    session_id: string;
}
export interface ApiLoginResponse extends ApiRegisterResponse {
    session_id: string;
}
export interface ApiUserInformation extends ApiRegisterResponse {
    session_id: string;
}

interface ApiThumbnailOption {
    height?: number;
    width?: number;
    path: string;
    percentage: number;
    quality?: number;
    type?: 'adaptive' | 'crop';
}

interface ApiVersion2Request {
    module?: string;
    action?: string;
    submit?: number;
    id?: string;
    idx?: number;
    session_id?: string;
}

interface ApiVersion2Response {
    code: number;
    message?: string;
    action: string;
    domain: string;
    module: string;
    new_message: string; // if there is a new message.
    post_name?: string; // post name if forum list requested.
    // ... and there is more...
    data?: {
        code: number;
        message: string;
    };
}

interface ApiVoteRequest extends ApiVersion2Request {
    for: 'G' | 'B';     // G for good. up vote. B for Bad. Down vote.
    idx: any;        // idx of post or comment
}
interface ApiVoteResponse extends ApiVersion2Response {
    idx: string;
    good: string;
    bad: string;
}

export interface ApiFileUploadResponse extends ApiResponse {
    idx: number;
    name: string; // file name
    path: string; // relative file path on server
    result: number; // 0 on success.
    url: string; // orinal file url
    url_thumbnail: string; // thumbnail url.
}

export const ApiErrorFileNotSelected = 'file-not-selected';
export const ApiErrorFileUploadError = -50020;
export const ApiErrorUrlNotSet = -50030;
export const ApiErrorJsonParse = -50040;
export const ApiErrorMessageInternetOrServer = 'Please check your internet or connection to server.';
export const ApiErrorEmptyUid = -1100;
export const ApiErrorEmptyPassword = -1110;




export interface ApiFileUploadOptions {
    gid?: string;
    login?: 'pass';
    finish?: '1';
    code?: string;
    module_name?: string;
}

export interface ApiNewFileServerUploadOptions {
    uid: string;
    secret: string;
    callbackProgress?: () => number;
}
export interface ApiNewFileServerUpload {
    name: string;
    path: string;
    size: string;
    type: string;
    url?: string; // client only.
}


/**
 * This is an inteface for member information on post and comment.
 * @see ApiLibrary::getPostMemberInfo()
 */
export interface ApiMember {
    idx: string;
    id: string;
    name: string;
    nickname: string;
    stamp: string;
    level: string;
    idx_promiary_photo: string;
}


export interface ApiPhoto {
    idx: number;
    name: string;
    url?: string;
    url_thumbnail?: string;
}

export interface ApiForumPageRequest extends ApiOptionalRequest {

    // page_no?: number; // page number
    // post_id?: string; // post id
    // limit?: number; // number of posts to show in one page.
    fields?: string; // fields to extract
    file?: string; // Y to get only posts with files(photos)
    page_no: number; // page no
    post_id: string; // post id
    limit: number; // limit
}

export interface ApiComment {
    bad?: string;
    blind?: string;
    content: string;
    content_stripped?: string; // Same as post data. it is made up when posts/comments are loaded.
    content_original?: string; // Get a copy of content. Only available in client.
    deleted?: string;
    depth?: string;
    gid: string;
    good?: string;
    idx?: string;
    idx_member?: string;
    idx_parent: string;
    idx_root?: string;
    int_10?: string;
    member?: ApiMember;
    photos?: Array<ApiPhoto>;
    post_id?: string;
    stamp?: string;
    date?: string;
    user_name?: string;
}



/**
 * Post data structure for create/update
 * @deprecated. Do not use this. Use ApiPost
 */
export interface ApiPostData {
    module?: string; // for crate/update
    action?: string; // for create/update
    id?: string; // user id to create/update.
    session_id?: string; // user id to create or update.
    idx?: string;
    stamp?: string;
    idx_member?: string;
    idx_root?: string;
    idx_parent?: string;
    list_order?: string;
    depth?: string;
    gid?: string;
    post_id?: string;
    group_id?: string;
    category?: string;
    sub_category?: string;
    reminder?: string;
    secret?: string;
    checked?: string;
    checked_stamp?: string;
    report?: string;
    blind?: string;
    no_of_comment?: string;
    no_of_attach?: string;
    no_of_first_image?: string;
    user_domain?: string;
    user_id?: string;
    user_password?: string;
    user_name?: string;
    user_email?: string;
    subject?: string;
    content?: string;
    content_stripped?: string; // @note this is not coming from the server. it is made up when posts are loaded.
    content_original?: string; // Get a copy of content. Only available in client.
    link?: string;
    stamp_update?: string;
    stamp_last_comment?: string;
    deleted?: '0' | '1';
    no_of_view?: string;
    good?: string;
    bad?: string;
    access_code?: string;
    region?: string;
    photos?: Array<ApiPhoto>;
    int_1?: string;
    int_2?: string;
    int_3?: string;
    int_4?: string;
    int_5?: string;
    int_6?: string;
    int_7?: string;
    int_8?: string;
    int_9?: string;
    int_10?: string;

    char_1?: string;
    char_2?: string;
    char_3?: string;
    char_4?: string;
    char_5?: string;
    char_6?: string;
    char_7?: string;
    char_8?: string;
    char_9?: string;
    char_10?: string;

    varchar_1?: string;
    varchar_2?: string;
    varchar_3?: string;
    varchar_4?: string;
    varchar_5?: string;
    varchar_6?: string;
    varchar_7?: string;
    varchar_8?: string;
    varchar_9?: string;
    varchar_10?: string;
    varchar_11?: string;
    varchar_12?: string;
    varchar_13?: string;
    varchar_14?: string;
    varchar_15?: string;
    varchar_16?: string;
    varchar_17?: string;
    varchar_18?: string;
    varchar_19?: string;
    varchar_20?: string;
    text_1?: string;
    text_2?: string;
    text_3?: string;
    text_4?: string;
    text_5?: string;
    text_6?: string;
    text_7?: string;
    text_8?: string;
    text_9?: string;
    text_10?: string;

    comments: Array<ApiComment>;
    member?: ApiMember;
    config_subject: string; // forum name. 게시판 이름.
}

/**
 * Rename ApiPostData
 */
export interface ApiPost extends ApiPostData {
    idx?: string;
}

interface ApiBanner {
    src: string; // banner image url
    idx_file: number; // banner image idx
    url: string; // url to be redirected to adv page.
    subject: string; // for premium subject
    sub_subject: string; // for premium sub sub subject
    image_src: string; // for premium banner
}

export interface ApiForumPageResponse extends ApiResponse {
    config_subject?: string; // forum name.
    category: string;
    limit: number;
    page_no: number;
    point_ad: Array<any>;
    post_id: string;
    post_top_ad: Array<ApiBanner>;
    post_top_company_book_ad: Array<ApiBanner>;
    post_top_premium_ad: Array<any>;
    posts: Array<ApiPostData>;
}


export interface ApiPostEditRequest extends ApiVersion2Request {
    idx?: any;
    subject?: string;
    content?: string;
    gid?: string;
    post_id: string;
}
export interface ApiPostEditResponse extends ApiVersion2Response {
    post: ApiPostData;
}

export interface ApiCommentEditRequest extends ApiVersion2Request {
    idx?: any;
    idx_parent: any;
    content?: string;
    gid?: string;
}
export interface ApiCommentEditResponse extends ApiVersion2Response {
    parents: Array<number>;
    post: ApiComment;
}

/**
 * Chat interface
 *
 */

export interface ApiChatRoom {
    idx: string;                // always api_chat_room.idx. This value is same as idx_chat_room and idx_room
    idx_member: string;         // is the owner of the chat room.
    idx_owner?: string;         // is the owner of the chat room.
    no_of_member: string;
    name: string;
    description: string;
    reminder: string;
    stamp_create: string;
    stamp_update: string;
    idx_room?: string;          // api_chat_room.idx
    idx_my_room?: string;       // api_chat_my_room.idx
    idx_chat_room?: string;     // api_chat_room.idx
    favorite?: 'Y' | '';          // 'Y' | '' if it's in favorite list.
    disable_alarm?: 'Y' | '';       // disable chat alarm
    idx_message_last_read?: string;     // api_chat_message.idx which lastly read by the user for that chat room.
    no_of_unread_messages?: string;     // no of unread messages for this room.
    messages?: Array<ApiChatMessage>;   // 내 방 입장한 경우 또는 내 방 목록인 경우에만 이 값이 존재한다.
    just_entered?: 'Y' | '';            //
}

export interface ApiChatRooms {
    info: ApiInfo;
    rooms: Array<ApiChatRoom>;
}


export interface ApiChatMessage {
    idx: string;
    idx_chat_room: string;
    idx_member: string;
    name: string;
    photoUrl: string;
    message: string;
    stamp: string;
    status: string; // char 1 byte.
    retvar?: any; // client session token string or any value. it can be anything. it will be returned from server.
    percentage?: number;                // used only in client.
    type?: string;                      // to determine the message type.
    url?: string;                       // the url of the file.
}
export interface ApiChatRoomCreateRequest extends ApiRequest {
    name: string;
    description: string;
}

export interface ApiChatRoomCreateResponse {
    idx?: string;
}


export interface ApiChatRoomEnterRequest extends ApiOptionalRequest {
    idx: string;
}

export interface ApiChatRoomLeaveRequest extends ApiOptionalRequest {
    idx: string;
}

export interface ApiChatRoomEnter extends ApiChatRoom {
    messages: Array<ApiChatMessage>;
}

export interface ApiInfo {
    sonub_version: string;
    chat_version: string;
}
export interface ApiChatRoomUser {
    idx: string;
    nickname: string;
}
export type ApiChatRoomUsers = Array<ApiChatRoomUser>;

export interface ApiChatRoomUpdate {
    idx: string;
    name: string;
    description: string;
    reminder: string;
}

export interface ApiChatDisableAlarm {
    idx_member?: string;
    idx_chat_room: string;
    disable: 'Y' | '';
    result?: 'on' | 'off'; // This is only available on the response from the server.
}


import * as firebase from 'firebase/app';
import 'firebase/database';
import { AngularLibrary } from '../angular-library/angular-library';
/**
 * PhilGoApiService
 */
@Injectable({
    providedIn: 'root'
})
export class PhilGoApiService {
    static serverUrl = '';
    static fileServerUrl = '';
    static newFileServerUrl = '';

    firebaseApp: firebase.app.App;
    db: firebase.database.Reference;


    /**
     * Api information. This is not an information of a one app. It is Api information.
     */
    info: ApiInfo = null;
    private firebaseEvent: firebase.database.EventType = 'value';

    /**
     * Push notification token. for both web/app.
     */
    pushToken = '';

    /**
     * Chat variables
     */
    /**
     * currentRoomNo is the same as currentRoom.
     */
    // currentRoomNo = 0;
    currentRoom: ApiChatRoomEnter = null;
    listeningRooms: Array<ApiChatRoom> = [];
    newMessageOnCurrentRoom = new Subject<ApiChatMessage>();
    newMessageFromOtherRoom = new Subject<ApiChatMessage>();

    /**
     * myRooms 는 내 방 목록 리스를 담고 있다.
     *      - 새로운 채팅 메시지가 있으면, 새 메시지 수
     *      - 즐겨찾기 추가/삭제
     * 등을 업데이트 할 수 있다.
     */
    myRooms: Array<ApiChatRoom> = [];
    /**
     * 내 방들의 새로운 메시지 총 합. 내 방 목록 페이지에서 새 메시지 개 수로 보여주면된다.
     */
    noOfNewMessageInMyRoom = 0;
    roomsBackup: Array<ApiChatRoom> = [];


    /**
     * Philgo Api user language.
     * Get cached ln code or web browser ln code.
     *
     * localStorage 에 저장된(또는 웹브라우저의) lang code 를 앱이 사작할 때 (또는 PhilgoApiService 가 inject 될 때) 로드를 한다.
     * 그리고 클라이언트에서 philgo.setLanguage().subscribe() 를 하면,
     *  1. 서버에 lang code 를 저장하고
     *  2. localStorage 에 저장하고
     *  3. 이 변수에 업데이트를 한다.
     * 즉, 별도로 코딩은 필요하지 않고, philgo.setLanguage('ko').subscribe() 만 하면 된다.
     * 만약, LanguageTranslate 를 사용하면 LanguageTranslate.languageCode 을 업데이트하면 된다.
     */
    ln = AngularLibrary.getUserLanguage();

    /**
     *
     * @param sanitizer
     * @param http
     */
    constructor(
        private sanitizer: DomSanitizer,
        public http: HttpClient
    ) {
        // console.log('PhilGoApiService::constructor');

        this.updateWebPushToken();
    }

    /**
     * Sets firebase app
     * @param firebaseApp firebase initialized app
     */
    setFirebaseApp(firebaseApp) {
        this.firebaseApp = firebaseApp;
        this.db = this.firebaseApp.database().ref('/');
    }

    setServerUrl(url: string) {
        PhilGoApiService.serverUrl = url;
        // console.log('setServerUrl(): ', this.getServerUrl());
    }
    getServerUrl(): string {
        return PhilGoApiService.serverUrl;
    }
    /**
     * Returns old api's end point.
     */
    getV2ServerUrl(): string {
        return PhilGoApiService.serverUrl.replace('api.php', 'index.php');
    }
    setFileServerUrl(url: string) {
        PhilGoApiService.fileServerUrl = url;
    }
    getFileServerUrl(): string {
        return PhilGoApiService.fileServerUrl;
    }
    setNewFileServerUrl(url: string) {
        PhilGoApiService.newFileServerUrl = url;
    }
    getNewFileServerUrl(): string {
        return PhilGoApiService.newFileServerUrl;
    }



    private httpBuildQuery(params): string | null {
        const keys = Object.keys(params);
        if (keys.length === 0) {
            return null; //
        }
        const esc = encodeURIComponent;
        const query = keys
            .map(k => esc(k) + '=' + esc(params[k]))
            .join('&');
        return query;
    }

    private validatePost(data) {
        const q = this.httpBuildQuery(data);
        console.log('PhilGoApiService::post() url: ', this.getServerUrl() + '?' + q);
        if (!this.getServerUrl()) {
            // console.error(`Error. Server URL is not set.`);
        }
    }

    /**
     * Returns error object
     *
     * @param code error code
     * @param message error message
     */
    error(code: number, message: string): ApiErrorResponse {
        return { code: code, message: message };
    }
    /**
     * 서버로 POST request 를 전송하고 결과를 받아서 데이터를 Observable 로 리턴하거나
     * 응답에 에러가 있거나 각종 상황에서 에러가 있으면 그 에러를 Observable 로 리턴한다.
     *
     * Request to server through POST method.
     * And returns response data observable or error observable.
     *
     * @param data request data
     *
     *      data['session_id'] - user session id
     *      data['route'] - route
     *
     * @return
     *      - 에러가 있으면 { code: number, message: string } 으로 Observable 이 리턴된다.
     */
    post(data): Observable<any> {
        this.validatePost(data);
        if (!this.getServerUrl()) {
            return throwError(this.error(ApiErrorUrlNotSet, 'Server url is not set. Set it on App Module constructor().'));
        }
        return this.http.post(this.getServerUrl(), data).pipe(
            map((res: ApiResponse) => {
                /**
                 * PhilGo API 부터 잘 처리된 결과 데이터가 전달되었다면,
                 * 데이터만 Observable 로 리턴한다.
                 */
                if (res.code !== void 0 && res.code === 0) {
                    return res.data;
                } else {
                    // console.log('** PhilGoApiService -> post -> http.post -> pipe -> map -> res: ', res);
                    /**
                     * (인터넷 접속 에러나 서버 프로그램 에러가 아닌)
                     * PhilGo API 가 올바로 실행되었지만 결과에 성공적이지 못하다면
                     * Javascript 에러를 throw 해서 catchError() 에러 처리한다.
                     */
                    throw res;
                }
            }),
            catchError(e => {
                // console.log('PhilGoApiService::post() => catchError()');
                // console.log('catchError: ', e);
                /**
                 * PhilGo API 의 에러이면 그대로 Observable Error 를 리턴한다.
                 */
                if (e['code'] !== void 0 && e['code'] < 0) {
                    return throwError(e);
                }
                /**
                 * PhilGo API 에러가 아니면, 인터넷 단절, 리눅스/웹서버 다운, PHP script 문법 에러 등이 있을 수 있다.
                 */
                const re: ApiErrorResponse = {
                    code: -400,
                    message: ApiErrorMessageInternetOrServer
                };
                return throwError(re);
            })
        );
    }

    /**
     * 서버로 부터 받은 데이터를 리턴한다. ( code 는 제외 )
     * 만약 코드 값이 0 이 아니면, 에러를 간주하고 에러를 throw 한다. ( 에러는 결국 catchError() 메소드에서 처리가 된다. )
     *
     * Returns the data from server without code.
     * If code is not 0, then it throws an error.
     *
     * @param responseData responseData is the response data coming from the server
     * @param requestData request is the request information sent to the server.
     *
     * @return response data from server if successful.
     *      Or else, throws an error.
     *
     * @deprecated
     */
    // private checkResult(responseData, requestData) {
    //     if (responseData['code'] !== void 0 && responseData['code'] === 0) {
    //         return responseData['data'];
    //     } else {
    //         throw event;
    //     }
    // }
    /**
     * @todo 클라이언트 인터넷 에러인지, 서버에 에러인지 구분이 필요하다. 공식 문서에 나오는데로 해도 잘 안된다.
     * @param error error response
     */
    // private handleError(error: HttpErrorResponse) {
    //     console.log('handleError() : ', error);
    //     /**
    //      * Is it error response from PHP?
    //      */
    //     if (this.isApiError(error)) {
    //         return throwError(error);
    //     }
    //     /**
    //      * Or else, It is an error related with internet or server, php script error.
    //      */
    //     const re: ApiErrorResponse = {
    //         code: -400,
    //         message: ApiErrorMessageInternetOrServer
    //     };
    //     return throwError(re);
    // }
    /**
     * return true if it is an eror
     * @param e error
     *
     * @deprecated
     */
    // private isApiError(e) {
    //     if (e['code'] !== void 0 && e['code'] < 0) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }

    version(): Observable<ApiVersionResponse> {
        return this.post({ method: 'version' });
    }
    exchangeRate(currency?: string): Observable<ApiVersionResponse> {
        return this.post({ method: 'exchangeRate', currency: currency });
    }


    /**
     * PHP 의 /api.php 로 쿼리한다.
     *
     * 클래스 메소드에 Generic 을 Overloading 하는 방법.
     * 상황: Generic 을 사용하는데, 파라메타가 optional 이라서 처치 곤란. 그래서 Overloading 을 사용.
     * 먼저, Overloading implementation 을 메소드 definition 바로 위에 올려야 한다.
     *
     * @param data - 입력 파라메타에서 data 는 항상 객체여야 한다. string 이나 number 이면 안된다.
     *
     * @return Philgo API 응답 중에서 'data' 부분만 리턴한다.
     * @example
        this.api.query<ApiCurrencyResponse>('exchangeRate', ...);
        this.api.query<ApiCurrencyRequest, ApiCurrencyResponse>('exchangeRate', { currency: 'php' })
            .subscribe(re => {
                this.test(re.php, 'Got PHP currency');
                this.test(re.usd === void 0, 'No USD currency');
            }, e => console.log(e));
     */
    query(method: string, data?): Observable<any>;
    query<R>(method: string, data?): Observable<R>;
    query<D, R>(method: string, data: D): Observable<R>;
    query<DATA, RESPONSE>(method: string, data?: DATA): Observable<RESPONSE> {

        // if (data === void 0 || !data) {
        //     data = <any>{};
        // }
        // const idx = this.idx();
        // const sessionId = this.getSessionId();
        // if (idx) {
        //     data['idx_member'] = idx;
        // }
        // if (sessionId) {
        //     data['session_id'] = this.getSessionId();
        // }

        data = this.addLogin(data);
        data['method'] = method;
        return this.post(data);
    }

    /**
     * PHP 의 /index.php 로 쿼리를 한다.
     * 이것은 옛날 API (v2) 버전으로 게시판 글 쓰기 등에 활용된다.
     * 주의: v2 Api 의 endpoint 에서 Raw Input 을 인식하지 못하므로 End point 에 module 과 action 을 적어주어,
     * DataLayer 에서 인식을 하도록 한다.
     */
    queryVersion2(req: ApiVersion2Request): Observable<any> {
        req.module = 'ajax';
        req.submit = 1;
        req.session_id = this.getSessionId();
        req.id = this.getIdxMember().toString();
        const q = this.httpBuildQuery(req);
        // console.log('PhilGoApiService::post() to Old V2 url: ', this.getV2ServerUrl() + '?' + q);
        const url = this.getV2ServerUrl() + '?module=ajax&action=' + req.action + '&submit=1';
        return this.http.post(url, req).pipe(
            map((res: ApiVersion2Response) => {
                // console.log('old api: ', res);
                /**
                 * PhilGo API Version 2 부터 잘 처리된 결과 데이터가 전달되었다면,
                 * 데이터만 Observable 로 리턴한다.
                 */
                if (res.code !== void 0 && res.code === 0) {
                    // console.log('code: ', res.code);
                    if (res.data && res.data.code !== void 0 && res.data.code === 0) {
                        return res.data;
                    } if (res.action) {
                        /**
                         * action='post-list' will simply use the result data.
                         */
                        return res;
                    } else {
                        throw res.data;
                    }
                } else if (res.code !== void 0 && res.code) {
                    if (res.message !== void 0) {
                        throw { code: res.code, message: res.message };
                    }
                } else {
                    /**
                     * (인터넷 접속 에러나 서버 프로그램 에러가 아닌)
                     * PhilGo API 가 올바로 실행되었지만 결과에 성공적이지 못하다면
                     * Javascript 에러를 throw 해서 catchError() 에러 처리한다.
                     */
                    throw res;
                }
            })
        );
    }

    /**
     * Registers
     * @param data User registration data
     * @example see test file in 'philgo-api-test-service.ts'
     */
    register(data: ApiRegisterRequest): Observable<ApiRegisterResponse> {
        return this.query<ApiRegisterRequest, ApiRegisterResponse>('register', data)
            .pipe(
                map(res => {
                    // console.log('register -> query -> pipe -> map -> res: ', res);
                    this.saveUserInformation(res);
                    return res;
                })
            );
    }

    /**
     * Returns user profile data
     * @desc Use this method to
     *      - Get full data of the user information.
     *      - Display user dat into profile update form to update user data.
     */
    profile() {
        const data = this.getLoginObject();
        return this.query<ApiProfileResponse>('profile', data);
    }


    /**
     * Update user information
     *
     * This method gets form data and update user information on PhilGo sf_member table.
     *
     * @desc Use this method to update user information.
     * @param data user profile data to update
     */
    profileUpdate(data: ApiProfileUpdateRequest) {
        // data = Object.assign(data, this.getLoginObject());
        // console.log('profileUpdate data: ', data);
        return this.query<ApiProfileUpdateRequest, ApiProfileResponse>('profileUpdate', data);
    }


    /**
     * User login
     *
     * Use this method to get session id which, laster, can be used to verify who you are.
     * This saves user's login information into localStorage.
     *
     * @param data email and password
     */
    login(data: ApiLoginRequest) {
        return this.query<ApiLoginRequest, ApiLoginResponse>('login', data)
            .pipe(
                map(res => {
                    this.saveUserInformation(res);
                    return res;
                })
            );
    }

    /**
     * Returns user login object.
     * @example
     *      data = Object.assign(data, this.getLoginObject());
     *
     */
    private getLoginObject() {
        return { idx_member: this.getIdxMember(), session_id: this.getSessionId() };
    }

    /**
     * Get an object and add login session id and idx (to login) and returns it.
     *
     * @desc Use this method to add login information before sending data to the server.
     *
     * @param obj Object to add login information.
     *          if `obj` is undefined or falsy, then it return a new object with login information.
     */
    private addLogin(obj?) {
        if (obj === void 0 || !obj) {
            obj = {};
        }
        obj[IDX_MEMBER] = this.myIdx();
        obj[SESSION_ID] = this.mySessionId();
        return obj;
    }

    /**
     * logout by deleting login information from localStorage.
     * It does not really logs out bu connecting backend.
     */
    logout() {
        localStorage.removeItem(SESSION_ID);
        localStorage.removeItem(NICKNAME);
        localStorage.removeItem(IDX_MEMBER);
    }

    /**
     * Save user login session id and nickname.
     *
     * This is invoked after register or login.
     *
     * @param user User information
     */
    saveUserInformation(user: ApiUserInformation) {
        // console.log('saveuserInformation: user: ', user);
        localStorage.setItem(SESSION_ID, user.session_id);
        localStorage.setItem(ID, user.id);
        localStorage.setItem(NICKNAME, user.nickname);
        localStorage.setItem(IDX_MEMBER, user.idx);
    }

    /**
     * Returns user session session id.
     *
     * @return
     *      session id as string
     *      null if the user is not logged in.
     */
    getSessionId(): string {
        return localStorage.getItem(SESSION_ID);
    }
    mySessionId(): string {
        return this.getSessionId();
    }
    /**
     * Returns user idx.
     */
    getIdxMember(): number {
        return this.idx();
    }
    /**
     * @deprecated use myIdx();
     *
     */
    idx(): number {
        const idx = this.myIdx();
        if (isNaN(<any>idx)) {
            return 0;
        } else {
            return parseInt(idx, 10);
        }
    }
    /**
     *
     * Returns login user idx
     *
     * If user has not logged in, it returns 0.
     *
     * @return string
     *      It returns login user's idx as 'string'.
     *      If the user didn't logged in, 'null' will be returned.
     */
    myIdx(): string {
        return localStorage.getItem(IDX_MEMBER);
    }
    /**
     * Returns true if the user has logged in already.
     */
    isLoggedIn(): boolean {
        return !!this.idx();
    }
    /**
     * Returns false if the user has logged out already.
     */
    isLoggedOut(): boolean {
        return !this.isLoggedIn();
    }

    /**
     * Returns user idx.
     */
    getMemberId(): string {
        return localStorage.getItem(ID);
    }

    getMemberNickname(): string {
        return this.nickname();
    }
    /**
     * Returns loggin user's nickname.
     */
    nickname(): string {
        return localStorage.getItem(NICKNAME);
    }
    /**
     * alias of nickname
     */
    name(): string {
        return this.nickname();
    }

    uploadPrimaryPhotoWeb(files: FileList) {
        return this.fileUploadOnWeb(files, {
            gid: this.getMemberId(),
            code: 'primary_photo',
            finish: '1'
        });
    }

    /**
     * 카메라 업로드가 아닌, HTML FORM 파일 선택을 통해서 파일 업로드를 한다.
     * @param files HTML FORM type='file' event.target.files
     * @param option Optoins for requesting file upload to the server
     */
    fileUploadOnWeb(files: FileList, option: ApiFileUploadOptions = {}): Observable<ApiFileUploadResponse> {
        if (files === void 0 || !files.length || files[0] === void 0) {
            return throwError(ApiErrorFileNotSelected);
        }
        const file = files[0];

        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('module', 'ajax');
        formData.append('action', 'file_upload_submit');
        // console.log('option: ', option);
        if (option.gid) {
            formData.append('gid', option.gid);
        }
        if (option.finish) {
            formData.append('finish', option.finish);
        }
        if (option.login === 'pass') {
            formData.append('login', option.login);
        } else {
            formData.append('idx_member', this.getIdxMember().toString());
            formData.append('session_id', this.getSessionId());
        }
        if (option.module_name) {
            formData.append('module_name', option.module_name);
        }
        if (option.code) {
            formData.append('varname', option.code);
        }

        const req = new HttpRequest('POST', this.getFileServerUrl(), formData, {
            reportProgress: true,
            responseType: 'json'
        });

        console.log('file upload: ', this.getFileServerUrl());
        return this.http.request(req).pipe(
            map(e => {
                // console.log('map: ', e);
                if (e instanceof HttpResponse) { // success event.
                    if (e.status === 200) {
                        if (e.body) {
                            // upload success now.
                            console.log('success: ', e);
                            console.log('e.body.data', e.body['data']);
                            if (e.body['data']['result'] === 0) {
                                return e.body['data'];
                            } else {
                                throw { code: ApiErrorFileUploadError, message: e.body['data']['error'] };
                            }
                        } else {
                            return e.body; // Return Server error
                        }
                    }
                } else if (e instanceof HttpHeaderResponse) { // header event
                    return e;
                } else if (e.type === HttpEventType.UploadProgress) { // progress event
                    const precentage = Math.round(100 * e.loaded / e.total);
                    if (isNaN(precentage)) {
                        // console.log('file upload error. percentage is not number');
                    } else {
                        // console.log('upload percentage: ', precentage);
                        return precentage;
                    }
                }
                return e; // other events
            }),
            catchError(e => {
                console.log('catchError : ', e);
                // return of( e );
                throw { code: ApiErrorJsonParse, message: e.body };
            })
        );

    }


    /**
     * New File Upload
     *
     * @since 2018-08-03 새로운 파일 서버에 파일을 업로드한다.
     * 이 파일 서버는 Philgo API 와는 상관이 없는 파일 서버이다.
     *
     * @desc This upload file into a new server.
     *
     */
    fileUpload(files: FileList, options: ApiNewFileServerUploadOptions): Observable<ApiNewFileServerUpload> {
        if (files === void 0 || !files.length || files[0] === void 0) {
            return throwError(ApiErrorFileNotSelected);
        }
        const file = files[0];

        const formData = new FormData();
        formData.append('userfile', file, file.name);
        formData.append('action', 'file-upload');
        // console.log('option: ', options);
        if (options.uid) {
            formData.append('uid', options.uid);
        }
        if (options.secret) {
            formData.append('secret', options.secret);
        }

        const req = new HttpRequest('POST', this.getNewFileServerUrl(), formData, {
            reportProgress: true,
            responseType: 'json'
        });

        // console.log('file upload: ', this.getNewFileServerUrl());
        return this.http.request(req).pipe(
            map(e => {
                if (e instanceof HttpResponse) { // success event.
                    if (e.body !== void 0 && e.body['code'] !== void 0) {
                        if (e.body['code'] === 0) {
                            e.body['data']['url'] = this.getNewFileServerUrl().replace('index.php', e.body['data']['path']);
                            return e.body['data'];
                        } else if (e.body['code'] !== 0) {
                            throw { code: e.body['code'], message: e.body['message'] };
                        }
                    } else {
                        // may php error string?
                        return e.body;
                    }
                } else if (e instanceof HttpHeaderResponse) { // header event
                    // don't return anything about header.
                    // return e;
                } else if (e.type === HttpEventType.UploadProgress) { // progress event
                    const precentage = Math.round(100 * e.loaded / e.total);
                    if (isNaN(precentage)) {
                        // don't do here anything. this will never happens.
                        // console.log('file upload error. percentage is not number');
                        return <any>0;
                    } else {
                        // console.log('upload percentage: ', precentage);
                        return <any>precentage;
                    }
                } else {
                    // don't return other events.
                    // return e; // other events
                }
            }),
            filter(e => e)
        );

    }

    // fileInfo(url: string): Observable<any> {
    //     return this.http.get( url ).pipe(
    //         map( res => {
    //             console.log('info: ', res);
    //         })
    //     );
    // }



    /**
     * Returns thumbnail URL of the photo
     * @see sapcms_1_2/etc/resize_image.php for detail.
     * @example
     *  <img src="{{ api.thumbnailUrl({ width: 100, height: 100, path: form.url_profile_photo }) }}" *ngIf=" form.url_profile_photo ">
     */
    thumbnailUrl(option: ApiThumbnailOption): string {
        let url = this.getFileServerUrl().replace('index.php', '');
        let type = 'adaptive';
        if (option.type) {
            type = option.type;
        }
        const path = '../' + option.path.substr(option.path.indexOf('data/upload'));
        let quality = 100;
        if (option.quality) {
            quality = option.quality;
        }
        url += `etc/image_resize.php?${type}=1&w=${option.width}&h=${option.height}&path=${path}&qualty=${quality}`;
        return url;
    }

    deleteFile(idx: number) {
        return this.queryVersion2({ action: 'data_delete_submit', idx: idx });
    }

    forumPage(option: ApiForumPageRequest): Observable<ApiForumPageResponse> {
        return this.query<ApiForumPageRequest, ApiForumPageResponse>('forumPage', option)
            .pipe(
                map(res => {
                    if (res.posts && res.posts.length) {
                        for (const post of res.posts) {
                            this.prePost(post);
                        }
                    }
                    return res;
                })
            );
    }

    /**
     * Gets a post from server.
     * @param idx Post idx or access code.
     */
    getPost(idx: number | string): Observable<ApiPostData> {
        const req = {
            idx: idx
        };
        return this.query<any, ApiPostData>('getPost', req)
            .pipe(
                map(post => {
                    return this.prePost(post);
                })
            );
    }

    prePost(post: ApiPostData): ApiPostData {
        // post.content_stripped = this.api.strip_tags(post.content);
        post.content_original = post.content;
        post.content_stripped = this.strip_tags(post.content);
        post.content = <any>this.sanitizer.bypassSecurityTrustHtml(post.content);
        if (post.comments) {
            for (const comment of post.comments) {
                this.preComment(comment);
                // console.log('comment', comment);
            }
        }
        // console.log('post:', post);
        return post;
    }
    preComment(comment: ApiComment): ApiComment {
        comment.content_original = comment.content;
        comment.content_stripped = this.strip_tags(comment.content);
        comment.content = <any>this.sanitizer.bypassSecurityTrustHtml(comment.content);
        return comment;
    }


    urlForumView(idx: number | string): string {
        return `/forum/view/${idx}`;
    }

    /**
     * Display short date
     * If it is today, then it dispays YYYY-MM-DD HH:II AP
     * @param stamp unix timestamp
     */
    shortDate(stamp) {
        const d = new Date(stamp * 1000);
        const dt = d.getFullYear().toString().substr(2, 2) +
            '-' + this.add0(d.getMonth() + 1) +
            '-' + this.add0(d.getDate()) +
            ' ' + this.add0(d.getHours()) +
            ':' + this.add0(d.getMinutes());

        // const d = new Date(stamp * 1000);
        const today = new Date();
        // let dt;
        if (d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate()) {
            // dt = d.toLocaleString();
            // dt = dt.substring(dt.indexOf(',') + 2).toLowerCase();
            // dt = dt.replace(/\:\d\d /, ' ');
            return dt;
        } else {
            return dt.substr(0, 10);
        }
        // return dt;
    }

    /**
     * Adds '0' infront of the `n` if the `n` is smaller than 10.
     * @param n numbre
     * @example
     *      add0(1);
     *      - input:  1
     *      - output: 01
     */
    add0(n: number): string {
        if (isNaN(n)) {
            return '00';
        }
        return n < 10 ? '0' + n : n.toString();
    }


    postWrite(req: ApiPostEditRequest): Observable<ApiPostEditResponse> {
        req.action = 'post_write_submit';
        return this.queryVersion2(req);
    }
    postEdit(req: ApiPostEditRequest): Observable<ApiPostEditResponse> {
        req.action = 'post_edit_submit';
        return this.queryVersion2(req);
    }
    postDelete(idx: string): Observable<ApiPostEditResponse> {
        const req = {
            action: 'post_delete_submit',
            idx: parseInt(idx, 10)
        };
        return this.queryVersion2(req);
    }
    setDelete(post: ApiPostData) {
        post.bad = '0';
        post.good = '0';
        post.subject = DELETED;
        post.content = DELETED;
        post.content_stripped = DELETED;
        post.content_original = DELETED;
        post.deleted = '1';
    }
    commentWrite(req: ApiCommentEditRequest): Observable<ApiCommentEditResponse> {
        req.action = 'comment_write_submit';
        return this.queryVersion2(req);
    }

    /**
     * PHP strip_tags() from locutus.
     *
     * @note this is not the latest version since latest version use some dependency, I use old version.
     *
     * @see https://github.com/kvz/locutus/blob/16e78de555fc9e845f5c25919eb0193a95c41068/src/php/strings/strip_tags.js
     * @param input HTML string
     * @param allowed allowed HTML tags
     */
    strip_tags(input: string, allowed?) { // eslint-disable-line camelcase
        //  discuss at: http://locutus.io/php/strip_tags/
        // original by: Kevin van Zonneveld (http://kvz.io)
        // improved by: Luke Godfrey
        // improved by: Kevin van Zonneveld (http://kvz.io)
        //    input by: Pul
        //    input by: Alex
        //    input by: Marc Palau
        //    input by: Brett Zamir (http://brett-zamir.me)
        //    input by: Bobby Drake
        //    input by: Evertjan Garretsen
        // bugfixed by: Kevin van Zonneveld (http://kvz.io)
        // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
        // bugfixed by: Kevin van Zonneveld (http://kvz.io)
        // bugfixed by: Kevin van Zonneveld (http://kvz.io)
        // bugfixed by: Eric Nagel
        // bugfixed by: Kevin van Zonneveld (http://kvz.io)
        // bugfixed by: Tomasz Wesolowski
        // bugfixed by: Tymon Sturgeon (https://scryptonite.com)
        //  revised by: Rafał Kukawski (http://blog.kukawski.pl)
        //   example 1: strip_tags('<p>Kevin</p> <br /><b>van</b> <i>Zonneveld</i>', '<i><b>')
        //   returns 1: 'Kevin <b>van</b> <i>Zonneveld</i>'
        //   example 2: strip_tags('<p>Kevin <img src="someimage.png" onmouseover="someFunction()">van <i>Zonneveld</i></p>', '<p>')
        //   returns 2: '<p>Kevin van Zonneveld</p>'
        //   example 3: strip_tags("<a href='http://kvz.io'>Kevin van Zonneveld</a>", "<a>")
        //   returns 3: "<a href='http://kvz.io'>Kevin van Zonneveld</a>"
        //   example 4: strip_tags('1 < 5 5 > 1')
        //   returns 4: '1 < 5 5 > 1'
        //   example 5: strip_tags('1 <br/> 1')
        //   returns 5: '1  1'
        //   example 6: strip_tags('1 <br/> 1', '<br>')
        //   returns 6: '1 <br/> 1'
        //   example 7: strip_tags('1 <br/> 1', '<br><br/>')
        //   returns 7: '1 <br/> 1'
        //   example 8: strip_tags('<i>hello</i> <<foo>script>world<</foo>/script>')
        //   returns 8: 'hello world'

        // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
        allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');

        const tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
        const commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;

        let before = input;
        let after = input;
        // recursively remove tags to ensure that the returned string doesn't contain forbidden tags
        // after previous passes (e.g. '<<bait/>switch/>')
        while (true) {
            before = after;
            after = before.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
                return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
            });

            // return once no more tags are removed
            if (before === after) {
                return after;
            }
        }
    }

    /**
     * Generates a random string.
     * @param len length of random string.
     * @param prefix prefix to add infront of generated rnadom string.
     */
    randomString(len = 8, prefix?) {
        let text = '';
        const charset = 'abcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < len; i++) {
            text += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        if (prefix) {
            text = prefix + text;
        }

        return text;
    }


    vote(req: ApiVoteRequest): Observable<ApiVoteResponse> {
        req.action = 'post_vote_submit';
        return this.queryVersion2(req);
    }

    report(idx: any): Observable<ApiVersion2Response> {
        const req = {
            action: 'post_report_submit',
            idx: idx
        };
        return this.queryVersion2(req);
    }

    /***********************************************************
     *
     * Chat methods
     *
     **********************************************************/

    /**
     * Create a chat room
     */
    chatRoomCreate(options: ApiChatRoomCreateRequest): Observable<ApiChatRoomCreateResponse> {
        return this.query('chat.createRoom', options);
    }

    /**
     * Get chat room list. It includes my own chat rooms.
     */
    chatOtherRooms(): Observable<ApiChatRooms> {
        return this.query('chat.otherRooms');
    }

    /**
     *
     * @param options
     *  'cacheCallback' - if cacheCallback is set, then it will cache and return it with the callback.
     * @desc there are not simple ways to return twice or emit twice for the observables. so, it simply uses callback.
     * @see readme#chat room cache
     *
     */
    chatMyRooms(options: { cacheCallback: (res: ApiChatRooms) => void; } = <any>{}): Observable<ApiChatRooms> {
        let cache = false;
        if (options.cacheCallback) {
            cache = true;
            options.cacheCallback(AngularLibrary.get(CACHE_CHAT_MY_ROOM));
        }
        return this.query<ApiChatRooms>('chat.myRooms').pipe(
            map(res => {
                // this.info = res.info; // 이것은 arrangeMyRooms() 에서 됨.
                if (cache) {
                    AngularLibrary.set(CACHE_CHAT_MY_ROOM, res);
                }
                return res;
            })
        );
    }

    /**
     * 내 방 목록을 하고,
     * chatMyRooms() 는 내 방 목록을 그냥 리턴하는데,
     * chatDoMyRooms() 는 내 방 목록을 읽어, 정렬하고, 새로운 메시지 수를 세고,
     * 등등 ... 필요한 작업을 하고, philgo api 객체에 저장을 한다.
     *
     * @todo 여기서부터 chatMyRooms() 를 업데이트해서, 마지막 글 30개를 가져오도록 한다.
     */
    chatLoadMyRooms(): Observable<ApiChatRooms> {
        return this.chatMyRooms({
            cacheCallback: res => {
                console.log('cache callback; res: ', res);
                if (res) {
                    this.chatArrangeMyRooms(res);
                    return res;
                }
            }
        }).pipe(
            map(res => {
                console.log('chatLoadMyRooms() server data: ', res);
                this.chatArrangeMyRooms(res);
                return res;
            })
        );
    }


    /**
     * 나의 채팅 방을 일고 나서, 방 정보를 전달 받아, 잘 보여 줄 수 있도록 각종 처리 작업을 한다.
     *
     *      - 정렬을 하고
     *      - 새 메시지 수를 구하고
     *      - 방을 listen 한다.
     *
     * @param res ApiChatRooms
     */
    chatArrangeMyRooms(res: ApiChatRooms) {
        /**
         * Save api information
         */
        this.info = res.info;
        if (res.rooms && res.rooms.length) {
            this.myRooms = res.rooms;
            this.sortMyRooms();
            this.chatCountNoOfNewMessages();
            this.listenMyRooms(this.myRooms).then(() => { });
        }
    }

    sortMyRooms() {
        if (!this.myRooms && !this.myRooms.length) {
            return;
        }
        /**
         * Sort of rooms by
         *  - favorite first.
         *  - Alphabet list for others.
         */
        this.myRooms.sort((a, b) => {
            if (a.favorite === 'Y' && b.favorite === 'Y') {
                return 0;
            } else if (a.favorite === 'Y') {
                return -1;
            } else if (b.favorite === 'Y') {
                return 1;
            } else {
                const nameA = a.name.toUpperCase();
                const nameB = b.name.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                return 0;
            }
        });
    }
    sortMyRoomsByMessage() {
        if (!this.myRooms && !this.myRooms.length) {
            return;
        }
        this.myRooms.sort((a, b) => {
            const aNo = this.parseNumber(a.no_of_unread_messages);
            const bNo = this.parseNumber(b.no_of_unread_messages);
            if (aNo < bNo) {
                return 1;
            } else {
                return -1;
            }
        });
    }

    /**
     * 로딩된 내 방목록에서 새 메시지를 하나 증가한다.
     * @param idx_chat_room
     */
    chatIncreaseNoOfNewMessage(idx_chat_room) {
        this.myRooms.map(room => {
            if (room.idx_chat_room === idx_chat_room) {
                console.log('parseNumber: ', this.parseNumber(room.no_of_unread_messages));
                room.no_of_unread_messages = (this.parseNumber(room.no_of_unread_messages) + 1).toString();
                this.noOfNewMessageInMyRoom += 1;
            }
        });
    }

    /**
     *
     * 메모리에 있는 내방 myRooms 목록에서 특정 방의 새 메시지 수를 0으로 한다.
     *
     * 특정 방의 새 메시지 수를 0 으로 만들고, 전체 새 메시지 갯수에서 해당 방의 새 메시지 개 수 만큼 차감을 한다.
     *
     * 즉, 특정 방에 들어갈 때, 그 방의 새메시지 수를 0 으로 하는 것이다.
     *
     * @example 특정 방에 들어가 할 때, 이 함수를 사용하면 된다.
     *
     * @param idx_chat_room room idx
     */
    chatResetNoOfNewMessageOfRoom(idx_chat_room) {
        this.myRooms.map(room => {
            if (room.idx_chat_room === idx_chat_room) {
                const no = this.parseNumber(room.no_of_unread_messages);
                this.noOfNewMessageInMyRoom -= no;
                room.no_of_unread_messages = '';
            }
        });
    }


    /**
     * 내 방목록의 새 메시지 수를 카운트한다.
     *
     *  - 방 목록을 하거나, 방에 입장을 하거나 할 때, 이 함수를 사용하여 총 메시지 수를 조정하면 된다.
     */
    chatCountNoOfNewMessages() {
        this.noOfNewMessageInMyRoom = 0;
        for (const room of this.myRooms) {
            this.noOfNewMessageInMyRoom += this.parseNumber(room.no_of_unread_messages);
        }
    }
    /**
     * Enters into a chat room and get the room info.
     * @param options
     *      'cacheCallback' - if it is set, then it does cache saving and cache callbacks.
     *
     *
     * @see philao api v4 readme#chat cache 캐시 이용의 고려 할 점.
     *
     */
    chatEnterRoom(data: ApiChatRoomEnterRequest,
        options: { cacheCallback: (res: ApiChatRoomEnter) => void } = <any>{}): Observable<ApiChatRoomEnter> {

        if (options.cacheCallback) {
            const rooms: ApiChatRooms = AngularLibrary.get(CACHE_CHAT_MY_ROOM);
            if (rooms && rooms.rooms.length) {
                const res = rooms.rooms.find(room => room.idx_room === data.idx);
                if (res) {
                    options.cacheCallback(<ApiChatRoomEnter>res);
                }
            }
        }
        return this.query('chat.enterRoom', data).pipe(
            map(res => {
                // if (cache) {
                //     AngularLibrary.set(cacheKey, res);
                // }
                return res;
            })
        );
    }

    /**
     * 내 방 목록들을 가져와 캐시한다.
     */
    // chatLoadMyRooms(): Observable<Array<ApiChatRoomEnter>> {
    //     const cacheKeyPrefix = 'chatRoom';
    //     return this.query('chat.loadMyRooms').pipe(
    //         map((res: Array<ApiChatRoomEnter>) => {
    //             if (res && res.length) {
    //                 for (const room of res) {
    //                     const key = cacheKeyPrefix + room.idx_chat_room;
    //                     AngularLibrary.set(key, room);
    //                 }
    //             }
    //             return res;
    //         })
    //     );
    // }

    // chatRoomCacheKey(idx) {
    //     return 'chatRoom' + idx;
    // }

    chatLeaveRoom(idx: string): Observable<ApiChatRoom> {
        const data: ApiChatRoomLeaveRequest = {
            idx: idx
        };
        return this.query('chat.leaveRoom', data);
    }

    chatFavorite(idx: string): Observable<ApiChatRoom> {
        return this.query('chat.favorite', { idx: idx });
    }

    chatUnfavorite(idx: string): Observable<ApiChatRoom> {
        return this.query('chat.unfavorite', { idx: idx });
    }

    /**
     * Get chat room list. It includes my own chat rooms.
     */
    chatSendMessage(form: ApiChatMessage): Observable<ApiChatMessage> {
        return this.query('chat.sendMessage', form);
    }

    chatLastRead(idx_room: string, idx_message: string): Observable<any> {
        return this.query('chat.lastRead', { idx_room: idx_room, idx_message: idx_message });
    }


    /**
     * Returns chat app version. You can use it to see if the app is latest version or not.
     */
    chatInfo() {
        return this.query('chat.info');
    }
    /**
     * Returns true if the input 'message' is my message.
     * @param message chat message
     */
    isMyChatMessage(message: ApiChatMessage) {
        return message && message.idx_member && message.idx_member === this.idx().toString();
    }
    /**
     * Returns true if the input 'message' is belong to the room that I am in right now.
     * @param idx_chat_room currentRoomNo
     * @param message chat message
     */
    isMyCurrentChatRoomMessage(idx_chat_room, message: ApiChatMessage) {
        return message && message.idx_chat_room && message.idx_chat_room === idx_chat_room;
    }


    /**
     * Save push token
     * @param token token
     */
    chatSaveToken(data: { token: string, domain?: string }) {
        return this.query('chat.saveToken', data);
    }

    chatRoomUsers(idx_chat_room: any): Observable<ApiChatRoomUsers> {
        return this.query('chat.roomUsers', { idx_chat_room: idx_chat_room });
    }

    /**
     * Reset ( init ) to enter a room. 새로운 방에 들어가기 위해서 방에서 사용되는 정보들을 리셋한다.
     *
     * @use just before entering a new room.
     */
    chatResetRoom() {
        // this.currentRoomNo = 0;
        this.currentRoom = null;
    }

    /**
     * 로그아웃 등을 하면 이 함수를 통해서 채팅 정보를 리셋한다.
     */
    chatResetMyRooms() {
        this.chatResetRoom();
        this.myRooms = [];
        AngularLibrary.set(CACHE_CHAT_MY_ROOM, null);
    }

    chatUpdateRoomSetting(form: ApiChatRoomUpdate): Observable<number> {
        return this.query('chat.updateRoomSetting', form);
    }
    chatGetRoomSetting(idx: string): Observable<ApiChatRoom> {
        return this.query('chat.getRoomSetting', { idx: idx });
    }

    chatDisableAlarm(data: ApiChatDisableAlarm): Observable<ApiChatDisableAlarm> {
        return this.query('chat.disableAlarm', data);
    }

    /**
     * It listens new messages of my rooms.
     *
     * @logic
     *      - Unsubscribe all subscribed rooms.
     *      - Subscribe rooms again.
     *
     *
     * @description This may be called in many ways.
     *    - When user first visit my rooms page after app booted.
     *        Which means, my rooms page is at the bottom of navigation stack.
     *        In this case, when user visit all rooms page and visit back to my rooms page, this method will be called.
     *    - Whenever user visit my rooms page when my rooms page is not on the bottom of navigation stack.
     *        It needs to delete all my room and add new ones.
     *
     * @param rooms my rooms
     */
    async listenMyRooms(rooms: Array<ApiChatRoom>) {
        if (!rooms) {
            return;
        }
        /**
         * Off(remove) all the event of old listening rooms.
         */
        for (const room of this.listeningRooms) {
            // console.log('Off: ', room.name);
            await this.db.child(`/chat/rooms/${room.idx}/last-message`).off(this.firebaseEvent, room['off']);
        }
        this.listeningRooms = [];
        /**
         * listen to my rooms
         */
        for (const room of rooms) {
            this.listenRoom(room);
        }
    }


    /**
     * Listens a room.
     *
     * 비 회원인 경우, 모든 방을 listen 하지 않는다.
     * 비 회원이 방에 들어가는 경우, listenMyRoomsIfNotListenning() 를 통해서 listen 하지도 않는다.
     *
     * If the room is already in listening, it double listens. and this is not good.
     *
     * So, do not use this method direcly. use this.addRoomToListen() which does not listen when the room is already listend.
     *
     * You can call any room to listen. Even if it's not your room.
     *
     * @param room chat room
     *
     * @desc 방의 새 메시지를 listen 할 때, 새 메시지가 있으면 philgo.myRooms 의 메시지 목록에 추가를 해 준다.
     *      이 것은 앱에서 방의 마지막 메시지를 표현하고자 할 때 도움이된다.
     */
    listenRoom(room: ApiChatRoom) {
        // console.log('On: ', room.name);
        room['off'] = this.db.child(`/chat/rooms/${room.idx}/last-message`).on(this.firebaseEvent, snapshot => {
            const message: ApiChatMessage = snapshot.val();

            // console.log('listenRoom() => got listen: data: ', message);
            /**
             * Don't toast if I am opening rooms page ( or running app or listening the room ) for the first time of app running.
             * If 'firstOpenning' is undefined, it is first message. define it and return it.
             */
            if (room['firstOpenning'] === void 0) {
                // console.log(`First time visiting on listening the room. Do not toast for the first message only. room: ${room.name}.`);
                room['firstOpenning'] = true;
                return;
            }

            if (!message) { // no chage message yet.
                // console.log('No chat message in the chat room. just return');
                return;
            }

            /**
             * Update last message on myRooms.room.messages.
             */
            // console.log(message);
            if (message.idx_chat_room && this.myRooms && this.myRooms.length) {
                this.myRooms.map(_room => {
                    if (_room.idx_chat_room === message.idx_chat_room) {
                        if (!_room.messages || !_room.messages.length) {
                            _room.messages = [];
                        }
                        _room.messages.unshift(message);
                    }
                });
            }

            // console.log(`AppService::listennMyRooms() got message in ${room.name} : `, message, ' at ', snapshot.ref.parent.key);

            /**
             * Don't toast if it's my message.
             */
            if (this.isMyChatMessage(message)) {
                return;
            }
            /**
             * Don't toast if I am in the same room of the message since it will be displayed on chat messgae box.
             */
            if (this.currentRoom && this.isMyCurrentChatRoomMessage(this.currentRoom.idx, message)) {
                // console.log('AppService::listenMyRooms():: got current room No. ', this.currentRoomNo, 'message. next()', message);
                this.newMessageOnCurrentRoom.next(message);
                return;
            }

            /**
             * 2018년 8월 6일. Firebase 로 방 입장/출장이 오지만 푸시는 되지 않는다.
             * If the message is one of my rooms' message and If I am not in the room, show it as a toast except
             *    If the message is not for enter or leave.
             */
            if (message.status === CHAT_STATUS_ENTER || message.status === CHAT_STATUS_LEAVE) {
                // console.log('User is entering or leaving. No toast!!');
                return;
            }
            // this.toastMessage(message);
            this.newMessageFromOtherRoom.next(message);
        });
        this.listeningRooms.push(room);
    }

    /**
     * 방에 들어가는 경우, 그 방을 listen 한다.이것은 로그인 회원이든 비 로그인 회원이든 그 방을 listen 한다.
     * 이미 listen 중에 있으면, 두번 listen 하지 않는다.
     *
     * It adds a room for listening new message.
     *
     * since it simply don't do anything if the room is already added,
     *    it is harmless you try to listen a room that is already by listened.
     *
     * @description It is needed when a user enters a room that is not his room.
     * For instance,
     * Case 1) when a user enters a new room, it needs to listen for new message for that room
     * but the room is not being listened because it is not listed on my rooms page(in which page, it will listen all the user's rooms )
     * so, it needs to call this method to add listener for that new room.
     *
     * Case 2) when a user directly enters a room without visiting rooms page.
     * WARNING: in this case, the user only can listen the entered room since he didn't visit my room page.
     * This is not happening in normal case and not a big problem any way.
     * This usually happens only on testing.
     *
     * @param room chat room
     */
    addRoomToListen(room: ApiChatRoom) {
        const i = this.listeningRooms.findIndex(v => v.idx === room.idx);
        if (i === -1) { // Not in the listeners array? This may be a new room for the user. Listen it!!
            // console.log('Going to listen a room: ', room.name);
            this.listenRoom(room);
        } else { // the room is already being listened.
            // console.log('The room is already listened. Maybe it is his old room.');
        }
    }





    /**
     * If the user is not listening his rooms, he can call this method.
     *
     * 로그인을 한 사용자가, 전체 자기방을 Listen 하지 않았으면, 전체 listen 한다.
     *
     * User can call this method when he first access chat room page instead of chat rooms list page.
     *
     * If the user has visited before calling this method, then it simply don't listen his rooms.
     * If the user visits again on room list page, then, app will remove all the listeners and listens again for the user's room.
     */
    listenMyRoomsIfNotListenning() {
        if (this.isLoggedIn()) {
            if (this.listeningRooms.length === 0) {
                // console.log('No rooms are listened, I am going to listen my rooms.');
                this.chatMyRooms().subscribe(res => {
                    this.listenMyRooms(res.rooms).then(() => {
                    });
                });
            } else {
                // console.log('My rooms are already listened.');
            }
        }
    }

    /**
     *
     * 앱 또는 웹 토큰을 실제로 서버에 저장한다.
     *
     * 앱이든 웹이든 반드시 실행을 하면 이 함수가 호출된다.
     *
     * 그냥 매우 간단하게 !!!! 접속 할 때 마다 항상 서버에 저장한다.
     *
     * 맨 처음 접속할 때, 로그인을 한 다음에 접속하는 것이 좋다.
     *
     * @param token push notification token
     *
     * @todo domain 옵션을 수정 할 수 있도록 한다.
     */
    updatePusTokenToServer(token) {
        this.pushToken = token; // Cordova 는 이미 값이 있지만, 웹에는 적용을 해 준다.
        console.log('      updatePusTokenToServer(): ', token);
        if (!token) {
            // console.log('token empty. return.');
            return;
        }
        this.chatSaveToken({ token: token, domain: 'chat' }).subscribe(res => {
            // console.log('chat.saveToken', res);
        }, e => {
            // console.log('Error on chat.saveToken(): If the token exists, just ignore. It is not an error. ', e);
        });
    }


    /**
     * 이 함수는 앱 실행 시( 또는 consturctor() )에서 또는 필요할 때 매번 실행을 하면 된다.
     *
     * @desc 푸시 퍼미션이 허용되었는지 물어보고, 허용되었으면 토큰을 업데이트한다.
     *  이 함수는 앱 처음 실행시 한번만 실행되어야 하며, 기본적으로 PhilGoApi::constructor() 에서 실행되므로 따로 신경 쓰지 않아도 된다.
     */
    updateWebPushToken() {
        console.log('  ()updateWebPushToken ==>');
        if (!AngularLibrary.isCordova() && AngularLibrary.isPushPermissionGranted()) {
            this.requestWebPushPermission();
        }
    }

    /**
     * 이 함수는 물어보고 웹 푸시 토큰을 서버에 저장한다.
     */
    requestWebPushPermission() {
        console.log('      ()requestWebPushPermission ==>');
        const messaging = firebase.messaging();
        // console.log('requestPushNotificationPermission()');
        messaging.requestPermission().then(() => {
            // console.log('   ===> Notification permission granted.');
            // TODO(developer): Retrieve an Instance ID token for use with FCM.
            // Callback fired if Instance ID token is updated.

            messaging.getToken().then(token => this.updatePusTokenToServer(token))
                .catch((err) => {
                    // console.log('getToken() error: ', err);
                });
            messaging.onTokenRefresh(() => {
                messaging.getToken().then((token => this.updatePusTokenToServer(token)))
                    .catch((err) => {
                        // console.log('Unable to retrieve refreshed token ', err);
                        // showToken('Unable to retrieve refreshed token ', err);
                    });
            });
        }).catch((err) => {
            // console.log('Unable to get permission to notify. User may have denied permission!', err);
        });
    }


    /**
     * 방의 마지막 메시지를 리턴한다.
     *
     * @desc 방 메시지는 역순으로 정렬되어져 있다.
     *
     * @param room 방 정보
     */
    lastMessage(room: ApiChatRoom) {
        if (room && room.messages && room.messages.length) {
            const message = room.messages[0].message;
            return AngularLibrary.stripTags( message );
        }
    }


    /**
     * Returns number from string.
     * @param v value of number
     */
    parseNumber(v) {
        return AngularLibrary.parseNumber(v);
    }


    /**
     * Saves user language code into philgo server.
     *
     * @desc 서버에 저장하고
     *      - 자동으로 캐시하고
     *      - this.ln 을 업데이트한다.
     *
     * 즉, 클라이언트에서 많은 코딩을 하지 않도록 한다. 실제로 클라이언트 코딩에서 별도로 할 것이 없다. 그냥 subscribe() 정도만 하면된다.
     *
     * @param ln 2 letter language code
     */
    setLanguage(ln) {
        return this.query('setLanguage', { ln: ln }).pipe(
            map(res => {
                AngularLibrary.setUserLanguage(ln);
                this.ln = ln;
                return res;
            })
        );
    }

    /**
     * MIME 타입의 값을 바탕으로 이미지 파일인지 아니지 검사한다.
     * @see AngularLibrary.isImageType
     * @param type Mime type
     */
    isImageType(type) {
        return AngularLibrary.isImageType(type);
    }

    /**
     * 
     * @param url 
     */
    getFileInfo(url: string): { name: string, size: string } {
        const re = {
            name: '',
            size: ''
        };
        if (url) {
            const filename = url.split('/').pop().split('-').pop();
            const li = filename.lastIndexOf('.');
            const v = filename.substr(0, li);
            if (v) {
                re.name = v.substr(0, v.lastIndexOf(' '));
                re.size = AngularLibrary.humanFileSize( v.substr(v.lastIndexOf(' ') + 1) );
                console.log('info name: ', re);
            }
        }
        return re;
    }
}

// EOF
