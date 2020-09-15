import { Component } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as $ from 'jquery';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pdf signature';
  pdfSrc = '../assets/sample.pdf';
  clicked = false;
  x = 0;
  y = 0;
  showBorders = true;

  constructor() { }

  pasteSignature(event: any) {
    console.log(event);
    this.clicked = true;
    this.x = event.offsetX;
    this.y = event.offsetY;

    this.getPdf();
  }

  getDataUrl() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    make_base();

    function make_base() {
      const baseImage = new Image();
      // tslint:disable-next-line: max-line-length
      baseImage.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Autograph_of_Benjamin_Franklin.svg/1200px-Autograph_of_Benjamin_Franklin.svg.png';
      baseImage.onload = () => {
        context.drawImage(baseImage, 0, 0);
      };
    }
    return canvas.toDataURL('image/jpeg');
 }

  getPdf() {

    const htmlWidth = $('.render').width();
    const htmlHeight = $('.render').height();
    const tlmargin = 15;
    const pdfWidth = htmlWidth + (tlmargin * 2);
    const pdfHeight = (pdfWidth * 1.5) + (tlmargin * 2);
    const canvasWidth = htmlWidth;
    const canvasHeight = htmlHeight;

    const totalPages = Math.ceil(htmlHeight / pdfHeight) - 1;

    this.showBorders = false;
    html2canvas($('.render')[0], {allowTaint: true}).then((canvas) => {
      canvas.getContext('2d');

      console.log(canvas.height + '  ' + canvas.width);

      let imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'pt',  [pdfWidth, pdfHeight]);
      pdf.addImage(imgData, 'JPG', tlmargin, tlmargin, canvasWidth, canvasHeight);

      pdf.addImage(imgData, 'JPG', tlmargin, -(pdfHeight) + (tlmargin * 4), canvasWidth, canvasHeight);

      imgData = this.getDataUrl();
      pdf.addImage(imgData, 'JPG', this.x, this.y, $('.signature').width(), $('.signature').height());

      console.log(this.x + '  ' + this.y);
      pdf.save('HTML-Document.pdf');
    });
    this.showBorders = true;
  }
}
