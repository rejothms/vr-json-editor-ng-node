import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SocketConnectService } from '../../../socket-connect.service';

@Component({
  selector: 'app-loginview',
  templateUrl: './loginview.component.html',
  styleUrl: './loginview.component.scss'
})
export class LoginviewComponent {
  username: string = '';
  constructor(private router: Router,
    private socket: SocketConnectService) { }
  navigateToDashboard() {
    localStorage.setItem('username', this.username);
    this.socket.setUserName(this.username);
    if (!this.socket.socketInitialized) {
      this.socket.initializeSocket().subscribe(status => {
        
          this.socket.initializeUser();
         
          this.router.navigate(['/dashboard']);
      })
    }


  }

}
