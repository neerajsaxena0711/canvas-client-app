import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';
// import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import * as io from 'socket.io-client'


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  @ViewChild('imageCanvas', { static: false }) canvas: ElementRef;
  private ctx: CanvasRenderingContext2D;
  private position: DOMRect;
  canvasElement: any;
  drawing = false;
  saveX: number;
  saveY: number;
  socket:any;

  selectedColor = '#9e2956';
  otherColor = '#edbf4c'
  colors = ['#9e2956', '#c2281d', '#de722f', '#edbf4c', '#5db37e', '#459cde', '#4250ad', '#802fa3']
  lineWidth = 5;

  constructor(private platform: Platform) {
    //https://socketdrawing07.herokuapp.com/
    //http://localhost:3000
     this.socket = io.connect('https://socketdrawing07.herokuapp.com/', { transports: ['websocket'] });
    //  this.socket.on('ondraw', ({x, y})=>{
    //  this.draw(x, y);
    //  });

     this.socket.on('ondown', ({x, y})=>{
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

  clear(){
    this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
  }

  startDrawing(ev) {
    if (ev.touches){
      this.saveX = ev.touches[0].pageX - this.position.x;
      this.saveY = ev.touches[0].pageY - this.position.y;
      this.socket.emit('down', {x:this.saveX, y:this.saveY})
    }
  }

  moved(ev) {
    if (ev.touches){
      const currentX = ev.touches[0].pageX - this.position.x;
      const currentY = ev.touches[0].pageY - this.position.y;
  
      this.ctx.lineJoin = "round";
      this.ctx.strokeStyle = this.selectedColor;
      this.ctx.lineWidth = 2;
  
      this.ctx.beginPath();
      this.ctx.moveTo(this.saveX, this.saveY);
      this.ctx.lineTo(currentX, currentY);
      this.ctx.closePath();
      this.ctx.stroke();
  
      this.saveX = currentX;
      this.saveY = currentY;
  
      let message = { x: this.saveX, y: this.saveY }
      this.sendMessage(message);
    }
  }

  draw(x,y) {
    this.ctx.strokeStyle = this.otherColor;
    this.ctx.lineWidth = 5;
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  }

  endDrawing(ev) {
    // console.log('end', ev);
    this.drawing = false;
  }

  sendMessage(msg: any) {
    this.socket.emit('draw', msg);
  }

}
