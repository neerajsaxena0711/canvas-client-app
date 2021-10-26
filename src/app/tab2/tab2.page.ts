import { Component, ElementRef, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';
import * as io from 'socket.io-client'


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  @ViewChild('imageCanvas', { static: false }) canvas: ElementRef;
  private ctx: CanvasRenderingContext2D;
  private position: DOMRect;
  canvasElement: any;
  drawing = false;
  saveX: number;
  saveY: number;
  socket: any;

  selectedColor = '#9e2956';
  otherColor = '#edbf4c'
  colors = ['#9e2956', '#c2281d', '#de722f', '#edbf4c', '#5db37e', '#459cde', '#4250ad', '#802fa3']
  lineWidth = 5;

  constructor(private platform: Platform) {
    //https://socketdrawing07.herokuapp.com/
    //http://localhost:3000
    this.socket = io.connect('https://socketdrawing07.herokuapp.com/', { transports: ['websocket'] });
    this.socket.on('ondraw', ({ x, y }) => {
      this.draw(x, y);
    });

    this.socket.on('ondown', ({ x, y }) => {
      this.ctx.moveTo(x, y);
    });
  }

  ionViewDidEnter() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.position = this.canvas.nativeElement.getBoundingClientRect();
    this.canvasElement = this.canvas.nativeElement;
    this.canvasElement.width = this.platform.width() + '';
    this.canvasElement.height = 450;
  }

  draw(x, y) {
    this.ctx.strokeStyle = this.otherColor;
    this.ctx.lineWidth = 2;
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    // console.log('drawing');
  }

}
