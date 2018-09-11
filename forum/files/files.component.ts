import { Component, OnInit, Input } from '@angular/core';
import { ApiPost, ApiFile, PhilGoApiService } from '../../../philgo-api/philgo-api.service';
import { ComponentService } from '../../service/component.service';

@Component({
  selector: 'app-files-component',
  templateUrl: './files.component.html',
  styleUrls: ['./../../scss/index.scss', './files.component.scss']
})
export class FilesComponent implements OnInit {

  @Input() showDeleteButton = false;
  @Input() post: ApiPost;
  @Input() percentage = 0;
  constructor(
    public philgo: PhilGoApiService,
    private componentService: ComponentService
  ) { }

  ngOnInit() {
  }

  onClickDeleteButton(file: ApiFile) {
    const req = { idx: file.idx, gid: this.post.gid, user_password: this.post.user_password };
    console.log('going to delete file: ', file, req);
    this.philgo.fileDelete(req).subscribe(res => {
      console.log('file delete success', res);
      const pos = this.post.files.findIndex(orgFile => orgFile.idx === res.idx);
      if (pos !== -1) {
        this.post.files.splice(pos, 1);
      }
    }, e => this.componentService.alert(e));
  }
}
