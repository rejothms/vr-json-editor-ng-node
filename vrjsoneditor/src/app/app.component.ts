import { Component, OnInit } from '@angular/core';
import { SocketConnectService } from './socket-connect.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'VRTextEditor';
  username: string = '';
  constructor(
    public socket: SocketConnectService,
    public router: Router
  ) { }

  
  ngOnInit(): void {
    let user = localStorage.getItem('username');
    if(user) this.socket.setUserName(user);
    if (!this.socket.socketInitialized) {
      this.socket.initializeSocket().subscribe(status => {
        if(user) {
          this.socket.initializeUser();
        }
      })
    }
  }
  logout() {
    localStorage.removeItem("username");
    this.socket.deleteUser()
    this.router.navigate(["/login"]);
  }

}
