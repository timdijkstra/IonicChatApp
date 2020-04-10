import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Socket } from 'ng-socket-io';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  nickname = '';

  constructor(public navCtrl: NavController, private socket: Socket, private router: Router) {}

  joinChat() {
    this.socket.connect();
    this.socket.emit('set-nickname', this.nickname);
    this.router.navigate(['/chatroom', {name: this.nickname}]);
  }
}
