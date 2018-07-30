import * as jsPDF from 'jspdf';
import * as images from './images';
import * as jspdf_customfont from './fonts';


const translations = {
  de:{
    fromDate: 'Gultig von ',
    to: ' bis ',
    header1: {
      text:'Jetz',
      size:'120'
    },
    header2: {
      text:'im Angebot',
      size:'78'
    },
    normalPrice: 'Normalpreis: '
  },

  fr:{
    fromDate: 'Valable du ',
    to: ' au ',
    header1: {
      text:'Maintenant',
      size:'89'
    },
    header2: {
      text:"sur l'offre",
      size:'69'
    },
    normalPrice: 'Prix normal: '
  },
  it:{
    fromDate: 'Valido dal ',
    to: ' al ',
    header1: {
      text:'Ora',
      size:'155'
    },
    header2: {
      text:"in Offerta",
      size:'100'
    },
    normalPrice: 'Prezzo normale: '
  }
}


const ptag = {

  a5 : (product, discount) => {
    var doc = new jsPDF('l','mm','A4');
    doc.addFont('Verdana.ttf', 'Verdana', 'normal','WinAnsiEncoding');
    doc.addFont('Verdana Bold.ttf', 'Verdana', 'bold','WinAnsiEncoding');
    doc.addFont('Verdana Bold Italic.ttf', 'Verdana', 'bold italic','WinAnsiEncoding');
    doc.addFont('Verdana Italic.ttf', 'Verdana', 'italic','WinAnsiEncoding');

    doc.setFont('Verdana', 'normal');
    const positions = [5,80,157,225];

    for (var i = 0; i < positions.length; i++) {
      var x = positions[i];
      doc.setFontStyle('normal');
      doc.setFontSize(12);
      doc.text(product.type,x,12);

      doc.setFontSize(26);
      doc.setFontStyle('bold');
      doc.text(product.name.toUpperCase(),x,24);

      doc.setFontSize(16);
      doc.setFontStyle('normal');
      var t = doc.splitTextToSize('Characteristics dsf sd fsd fsd fsd ffsdf ',65);
      doc.text(t, x, 30);
      var priceDiscount = product.normalPrice - (product.normalPrice * (discount/100));
      var priceDiscount = priceDiscount.toFixed(2);
      doc.setFontSize(48);
      doc.setFontStyle('bold');
      doc.text(priceDiscount.toString(),x,155);

      doc.setFontSize(8);
      doc.setFontStyle('normal');
      doc.text(translations[product.lang].normalPrice,x,164);

      doc.setFontSize(30);
      doc.setFontStyle('bold');
      doc.text(product.normalPrice,x,175);

      doc.addImage(images.images.logo, 'JPEG', x, 195);
    }
    var nameFile = product.partNumber + '.pdf';
    doc.save(nameFile);
  },

  pb25x60: (product, discount, start, end) => {
    var doc = new jsPDF('p','mm',[500,600]);
    doc.addFont('Verdana.ttf', 'Verdana', 'normal','WinAnsiEncoding');
    doc.addFont('Verdana Bold.ttf', 'Verdana', 'bold','WinAnsiEncoding');
    doc.addFont('Verdana Bold Italic.ttf', 'Verdana', 'bold italic','WinAnsiEncoding');
    doc.addFont('Verdana Italic.ttf', 'Verdana', 'italic','WinAnsiEncoding');
    const positions = [30, 280];
    for (var i = 0; i < positions.length; i++) {
      var x = positions[i];

      doc.setFontSize(translations[product.lang].header1.size);
      doc.setFontStyle('bold');
      doc.text(translations[product.lang].header1.text, x, 67 );

      doc.setFontSize(translations[product.lang].header2.size);
      doc.text(translations[product.lang].header2.text, x, 100);

      doc.setFontSize(42);
      doc.setFontStyle('bold');
      var t = doc.splitTextToSize(product.type,185);
      if (t.length > 1) {
        doc.text(t , x, 144 );
      }else{
        doc.text(t , x, 161 );
      }

      doc.setFontSize(72);
      doc.setFontStyle('bold');
      doc.text(product.name.toUpperCase(), x, 194 );

      doc.setFontSize(30);
      doc.setFontStyle('normal');
      var t = doc.splitTextToSize(product.info,185);
      doc.text(t, x, 212);

      doc.setFontStyle('bold');
      //var priceDiscount= discount.toString();
      var priceDiscount= product.normalPrice.toString();//discount.toString();
      var splitText = priceDiscount.split('.')
      var size = doc.getStringUnitWidth(splitText[0] + '.'); // get the size
      var fS = 280;
      var width = size * fS; //widht of the box, 535pt -> for change to mm divide by (72/25.6)
      const box = 310;

      while (width >= box) {
        fS= fS -10;
        width = size * fS;
      }

      doc.setFontSize(fS);
      doc.text(splitText[0] + '.', x, 460);
      var height = doc.getTextDimensions('0');
      doc.setFontSize(fS/2);
      var h2 = doc.getTextDimensions('0');
      var pos = 460 - h2.h;
      doc.text(splitText[1], x+110, 460);


      doc.setFontSize(32);
      doc.setFontStyle('normal');
      //doc.text(translations[product.lang].fromDate + start + translations[product.lang].to + end, x, 500);
      console.log(product);
      doc.text(product.priceDisclaimer, x, 500);

      doc.setFontSize(50);
      doc.setFontStyle('bold');
      doc.text(translations[product.lang].normalPrice + product.secondPrice, x, 538);

      doc.addImage(images.images.logo, 'JPEG', x+70, 558, 47,16);

    }

    var nameFile = product.partNumber + '.pdf';
    doc.save(nameFile);
  },
  pb50x120: (product, discount, start, end) => {
    var doc = new jsPDF('p','mm',[500,1200]);
    doc.addFont('Verdana.ttf', 'Verdana', 'normal','WinAnsiEncoding');
    doc.addFont('Verdana Bold.ttf', 'Verdana', 'bold','WinAnsiEncoding');
    doc.addFont('Verdana Bold Italic.ttf', 'Verdana', 'bold italic','WinAnsiEncoding');
    doc.addFont('Verdana Italic.ttf', 'Verdana', 'italic','WinAnsiEncoding');

    const positions = [60];
    for (var i = 0; i < positions.length; i++) {
      var x = positions[i];

      doc.setFontSize(translations[product.lang].header1.size);
      doc.setFontStyle('bold');
      doc.text(translations[product.lang].header1.text, x, 67 );

      doc.setFontSize(translations[product.lang].header2.size);
      doc.text(translations[product.lang].header2.text, x, 100);

      doc.setFontSize(42);
      doc.setFontStyle('bold');
      var t = doc.splitTextToSize(product.type,185);
      if (t.length > 1) {
        doc.text(t , x, 144 );
      }else{
        doc.text(t , x, 161 );
      }

      doc.setFontSize(72);
      doc.setFontStyle('bold');
      doc.text(product.name.toUpperCase(), x, 194 );

      doc.setFontSize(30);
      doc.setFontStyle('normal');
      var t = doc.splitTextToSize('Characteristics dsf sd fsd fsd fsd ffsdf ',185);
      doc.text(t, x, 212);

      doc.setFontStyle('bold');
      var priceDiscount= discount.toString();
      var splitText = priceDiscount.split('.')
      var size = doc.getStringUnitWidth(splitText[0] + '.'); // get the size
      var fS = 280;
      var width = size * fS; //widht of the box, 535pt -> for change to mm divide by (72/25.6)
      const box = 310;

      while (width >= box) {
        fS= fS -10;
        width = size * fS;
      }

      doc.setFontSize(fS);
      doc.text(splitText[0] + '.', x, 460);
      var height = doc.getTextDimensions('0');
      doc.setFontSize(fS/2);
      var h2 = doc.getTextDimensions('0');
      var pos = 460 - h2.h;
      doc.text(splitText[1], x+110, 460);


      doc.setFontSize(32);
      doc.setFontStyle('normal');
      doc.text(translations[product.lang].fromDate + start + translations[product.lang].to + end, x, 500);

      doc.setFontSize(50);
      doc.setFontStyle('bold');
      doc.text(translations[product.lang].normalPrice + product.normalPrice, x, 538);

      doc.addImage(images.images.logo, 'JPEG', x+70, 558, 47,16);

    }

    var nameFile = product.partNumber + '.pdf';
    doc.save(nameFile);
  },

}

export { ptag };
