import React from 'react';
import './App.css';
import { Grid, Container, Header, Icon, Divider } from 'semantic-ui-react';
import { Tab } from 'semantic-ui-react';
import {OnlineProduct} from './components/online.js';
import {TemplateProduct} from './components/template.js';

const panes = [
  { menuItem: 'Online', render: () => <Tab.Pane attached={false}><OnlineProduct/></Tab.Pane> },
  { menuItem: 'Template', render: () => <Tab.Pane attached={false}><TemplateProduct/></Tab.Pane> }
]

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <Container>
          <div className="App">
            <Grid columns = {1} >
              <Grid.Row>
                <Grid.Column>
                  <Header as='h2' icon textAlign='center'>
                    <Icon name='print' circular />
                    <Header.Content>Discount Ptag Printer</Header.Content>
                  </Header>
                  <Divider />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Tab menu={{ pointing: true }} panes={panes} />
                </Grid.Column>
              </Grid.Row>
              <Divider />
              <Grid.Row>
                <Grid.Column>
                  <p>If you have any suggestion, please send an email to: <a href="mailto:javier.hospitalponcell@ikea.com">javier.hospitalponcell@ikea.com</a></p>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        </Container>
      </div>
    );
  }
}

export default App;
