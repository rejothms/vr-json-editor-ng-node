import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { EventDispatcherService } from './service/event-dispatcher.service';
@Injectable({
  providedIn: 'root'
})
export class SocketConnectService {

  public socket: any;
  public socketInitialized: Boolean = false;
  public user: any | undefined;
  public selectedFileName: string | undefined;

  private socketConnect = new BehaviorSubject<any>(null);
  private subject = new BehaviorSubject<any>(null);

  constructor() { }

  public initializeSocket() {

    let observable = new Observable(observer => {

      this.socket = io.connect('http://localhost:3003');

      this.socket.on('connect', (data: any) => {
        this.socketInitialized = true;
        //this.socketConnect.next(this.socketInitialized);
        observer.next('connection success');
      });

      this.socket.on('notifyjson', (data: any) => {
        EventDispatcherService.get(EventDispatcherService.ON_JSON_UPDATE).emit(data);
      });

      this.socket.on('notifyupdates', (data: any) => {
        EventDispatcherService.get(EventDispatcherService.ON_JSON_PUBLISHED_BY).emit(data);
      });


      this.socket.on('disconnect', (data: any) => {
        this.socketInitialized = false;
        observer.next('socket disconnected');
      });

      this.socket.on('reconnecting', (data: any) => {
        observer.next('socket reconnecting');
      });

      return () => {
        observer.next('connection failure');
      };
    })
    return observable;
  }

  public setUserName(user: string) {
    this.user = user;
  }

  public getUserName(): string {
    return this.user;
  }
  public deleteUser() {
    if (this.socket) {
      this.socket.disconnect();
      this.user = null;
    }
    this.socketInitialized = false;
  }
 

  public initializeUser() {
    if (this.socket.connected) {
      this.socket.emit('join', this.user);
    }
  }

  public sendJson(json: any) {
    let msg = {
      json: json,
      from: this.user,
      filename: this.selectedFileName
    }
    this.socket.emit('jsonupdate', msg);
  }

  public fileOpen(fileName: string) {
    this.selectedFileName = fileName;
    this.socket.emit('fileopen', {fileName, from: this.user});
  }
  

}
