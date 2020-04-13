import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.page.html',
  styleUrls: ['./chatroom.page.scss'],
})
export class ChatroomPage implements OnInit {
  messages = [];
  nickname = '';
  message = '';

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.nickname = params['name'];
    });
  }

  constructor(
    private router: ActivatedRoute,
    private socket: Socket,
    private toastCtrl: ToastController,
    private route: ActivatedRoute
  ) {

    this.getMessages().subscribe(message => {
      this.messages.push(message);
    });

    this.getUsers().subscribe(data => {
      let user = data['user'];
      if (data['event'] === 'left') {
        this.showToast('User left: ' + user);
      } else {
        this.showToast('User joined: ' + user);
      }
    });
  }

  sendMessage() {
    this.socket.emit('add-message', { text: this.message });
    this.message = '';
  }

  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  getUsers() {
    let observable = new Observable(observer => {
      this.socket.on('users-changed', (data) => {
        observer.next(data);
      });
    });
    return observable;
  }

  ionViewWillLeave() {
    this.socket.disconnect();
  }

  async showToast(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    return toast.present();
  }

}
