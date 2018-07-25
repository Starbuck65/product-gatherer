import React from 'react';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import './App.css';
import { Query } from "react-apollo";
import { ApolloProvider } from 'react-apollo';
import * as html2canvas from 'html2canvas';
import * as jspdf from 'jspdf';

const client = new ApolloClient({
    uri: "https://graphqlserver-productsinfo.herokuapp.com/"
})

const GET_INFO_PRODUCT = gql`
query product($partNumber: String!) {
  product(partNumber: $partNumber)  {
    partNumber
    name
    type
    normalPrice
    secondPrice
    familyPrice_startDate
    familyPrice_endDate
    familyPrice_price
    familyPrice_disclaimer
  }
}
`


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {partNumber: ''};
  };

  updateSearch = (event) => {
    this.setState({
      partNumber: document.getElementById("input_value").value
    })
  }

   submitSearch = (event) => {
     event.preventDefault()
     //console.log(this.state)
   }

   printDocument() {
     const input = document.getElementById('printarea');
     var doc = new jspdf();
     var elementHandler = {
       '#ignorePDF': function (element, renderer) {
         return true;
     }
    };
     doc.fromHTML(
       input, );

     doc.save("test.pdf");

     /*
     html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf();
        pdf.addImage(imgData,'PNG',0,20);
        //pdf.output('dataurlnewwindow');
        //pdf.output('save','product.pdf');
        pdf.save('product.pdf');
      })
    ; */


   }

  render() {

    const { partNumber } = this.state;

    return (
      <ApolloProvider
        client={client}>
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Product Gatherer</h1>
        </header>
        <div className="App-intro">
        <p className="intro-header">
          Please, enter the Product Number below:
        </p>
        <form onSubmit={this.submitSearch}>
          <label>
          <input id="input_value" type="text"/>
        </label>
        <input type="submit" onClick={this.updateSearch} />
        </form>
        </div>
        <div className="button">
          <button onClick={this.printDocument}><b>Download as PDF</b></button>
        </div>

        <div id="printarea" style={{
        backgroundColor: '#ffffff',
        width: '210mm',
        minHeight: '297mm',
        marginLeft: 'auto',
        marginTop: '20mm',
        marginRight: 'auto'}} >
        <Query
          query={GET_INFO_PRODUCT}
          skip={!partNumber}
          variables={{partNumber: partNumber}} >

        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :</p>;
          if (data.product === null) return <p>Null product for reference number</p>;

          return (
            <ul>
            <p><b></b></p>
            <p><li key={data.product.partNumber}><b>NAME:</b>{data.product.name}</li></p>
            <p><li><b>TYPE: </b>{data.product.type}</li></p>
            <p><li><b>NORMAL_PRICE: </b>{data.product.normalPrice}</li></p>
            <p><li><b>SECOND_PRICE: </b>{data.product.secondPrice}</li></p>
            <p><li><b>FAMILY_START_DATE: </b>{data.product.familyPrice_startDate}</li></p>
            <p><li><b>FAMILY_END_DATE: </b>{data.product.familyPrice_endDate}</li></p>
            <p><li><b>FAMILY_DISCLAIMER: </b>{data.product.familyPrice_disclaimer}</li></p>
            </ul>
          );
        }}

        </Query>
        </div>




      </div>
      </ApolloProvider>
    );
  }
}

export default App;
