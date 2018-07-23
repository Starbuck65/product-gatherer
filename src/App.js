import React from 'react';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import './App.css';
import { Query } from "react-apollo";
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({
    uri: "http://localhost:51358/graphql"
})

const GET_NAME_PRODUCT = gql`
query product($partNumber: String!) {
  product(partNumber: $partNumber)  {
    partNumber
    name
  }
}
`
/*
class ProductInfo extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      partNumber : ""
    }
  }

  update = (e) => {
    this.props.handleSubmit(e.target.value);
    this.setState({partNumber: e.target.value});
  }

  render(){
    return (
    <Query
    query={GET_NAME_PRODUCT}
    variables={ this.state.partNumber }
  >
      {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :</p>;
      
      return (
        <ul>
        <li key={data.product.partNumber}>{data.product.name}</li>
        </ul>

      );

      }}  
    </Query>  );
  }
}
*/

const ProductInfo = ({ partNumber }) => (
  <Query
    query={GET_NAME_PRODUCT}
    variables={ partNumber }
  >
      {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :</p>;
      
      return (
        <ul>
        <li key={data.product.partNumber}>{data.product.name}</li>
        </ul>

      );

      }}  
    </Query> 
);


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {partNumber: ''};
  }

  handleSubmit(event) {
    this.setState({partNumber: event.target.value});
  }

  render() {
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
        
        <form onSubmit={this.handleSubmit}>
          <label>
          <input type="text" value={this.state.partNumber} />
        </label>
        <input type="submit" value="Submit" />
        </form>
        </div> 

        <ProductInfo partNumber = {this.state.partNumber} />

      </div>
      </ApolloProvider>
    );
  }
}

export default App;
