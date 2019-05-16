import React, { Component } from 'react';
import { ArcherContainer, ArcherElement } from 'react-archer';
import ProgressButton from 'react-progress-button'


const rootStyle = { display: 'flex', justifyContent: 'center' };
const rowStyle = { margin: '200px 0', display: 'flex', justifyContent: 'space-between', }
const boxStyle = { padding: '10px', border: '1px solid black', };



class App extends Component {

  constructor(props) {
    super(props);
    this.state = {buttonState: ''};

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }



  componentDidMount() {

  }

  handleClick () {
    console.log(this.state)
    this.setState({buttonState: 'loading'})
    // make asynchronous call
    setTimeout(() => {
      this.setState({buttonState: 'success'})
    }, 3000)
  }

  render() {
    return (
      <div>

        <ArcherContainer strokeColor='red' >
          <div style={rootStyle}>
            <ArcherElement
              id="root"
              relations={[{
                targetId: 'element2',
                targetAnchor: 'top',
                sourceAnchor: 'bottom',
              }]}
            >
            <div style={boxStyle}>
              <ProgressButton onClick={this.handleClick} state={this.state.buttonState}>
                Go!
              </ProgressButton>
              <div style={boxStyle}>Element 2</div>
            </div>

            </ArcherElement>
          </div>

          <div style={rowStyle}>
            <ArcherElement
              id="element2"
              relations={[{
                targetId: 'element3',
                targetAnchor: 'left',
                sourceAnchor: 'right',
                style: { strokeColor: 'blue', strokeWidth: 1 },
                label: <div style={{ marginTop: '-20px' }}>Arrow 2</div>,
              }]}
            >
              <div style={boxStyle}>Element 2</div>
            </ArcherElement>

            <ArcherElement id="element3">
              <div style={boxStyle}>Element 3</div>
            </ArcherElement>

            <ArcherElement
              id="element4"
              relations={[{
                targetId: 'root',
                targetAnchor: 'right',
                sourceAnchor: 'left',
                label: 'Arrow 3',
              }]}
            >
              <div style={boxStyle}>Element 4</div>
            </ArcherElement>
          </div>
        </ArcherContainer>

      </div>
    );
  }
}

export default App;
