import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SocketConnectService } from '../../../socket-connect.service';
import { Route, Router } from '@angular/router';
import { DataService } from '../../../service/data.service';
import { TextEditorComponent } from '../text-editor/text-editor.component';
import { EventDispatcherService } from '../../../service/event-dispatcher.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  public username: string = "";
  public jsonNameList: Array<string> = [];
  public selectedFile: any;
  public selectedFileName: string | undefined
  @ViewChild (TextEditorComponent) textedit!: TextEditorComponent;
  private notificationSubscribe: Subscription = new Subscription();
  constructor(public socket: SocketConnectService,
    public data: DataService,
    private router: Router) { }
  ngOnInit(): void {
    this.username = this.socket.getUserName();
    if (!this.username) { this.router.navigate(['/login']); return };
    this.data.getJsonList().subscribe(res => {
      this.jsonNameList = res;
    this.notificationSubscribe.add(EventDispatcherService.get(EventDispatcherService.ON_JSON_PUBLISHED_BY).subscribe((res) => {
     this.textedit.lastpublished(res, this.selectedFileName);
    }));
    });
  }

  selectFile(file: string) {
    this.data.getFile(file).subscribe(res => {
      this.socket.fileOpen(file);
      this.selectedFile = res;
      this.selectedFileName = file;
    });
  }

  downLoadfile(event: any) {
    this.textedit.download(this.selectedFileName);
    event.stopPropagation();
  }

}
