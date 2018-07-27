import * as jsPDF from 'jspdf';
import * as images from './images';
import * as jspdf_customfont from './fonts';


const ptag = {

  a5 : (product, discount) => {
    var doc = new jsPDF('l','mm','A4');
    console.log(product);

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
      doc.text('Normale preis:',x,164);

      doc.setFontSize(30);
      doc.setFontStyle('bold');
      doc.text(product.normalPrice,x,175);

      doc.addImage(images.images.logo, 'JPEG', x, 195);
    }
    var nameFile = product.partNumber + '.pdf';
    doc.save(nameFile);
  }
}

export { ptag };
