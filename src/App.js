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
const container = createElement('ROOT');
const mountNode = PDFRenderer.createContainer(container);
const doc = `
  <Document>
    <Page size="A5">
      <Select value={0} />
      <Select value={10} />
      <Select value={20} />
      <Select value={30} />
      <Select value={40} />
      <Select value={50} />
      <Select value={60} />
      <Select value={70} />
      <Select value={80} />
      <Select value={90} />
      <Select value={100} />
    </Page>
  </Document>`
;

var u = "";
PDFRenderer.updateContainer(doc, mountNode, this);
pdf(container)
      .toBlob()
      .then(blob => {
        const url = URL.createObjectURL(blob);
        //this.setState({ document: url });
        u = url;
      });


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
     html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf();
        pdf.addImage(imgData,'JPEG',0,0);
        pdf.output('dataurlnewwindow');

      })
    ;
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
        <Document file={u} />
        <form onSubmit={this.submitSearch}>
          <label>
          <input id="input_value" type="text"/>
        </label>
        <input type="submit" onClick={this.updateSearch} />
        </form>
        </div>

        <div id="printarea" style={{
        backgroundColor: '#f5f5f5',
        width: '210mm',
        minHeight: '297mm',
        marginLeft: 'auto',
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
        <div className="button">
          <button onClick={this.printDocument}>Print</button>
        </div>
        


      </div>
      </ApolloProvider>
    );
  }
}

export default App;
