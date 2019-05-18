import React, { Component } from 'react';
import FileUploadProgress  from 'react-fileupload-progress';
import { ArcherContainer, ArcherElement } from 'react-archer';
import ProgressButton from 'react-progress-button'
import socketIOClient from "socket.io-client";


var {socketport} = require('../package.json');



const rootStyle = { display: 'flex', justifyContent: 'center' };
const rowStyle = { margin: '100px 0', display: 'flex', justifyContent: 'space-between', }
const boxStyle = { padding: '10px', border: '1px solid black', };

const scrollStyle = { margin: '0 10px 20px 10px', padding: '10px', height:'220px',width:'100%',border:'1px solid #ccc',font:'16px/26px Georgia, Garamond, Serif',overflow:'auto', scrollTop:'-220px'};

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {buttonState: '',response:'sdf', messages:[]};

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
  }



  componentDidMount() {
    const socket = socketIOClient(socketport);
    socket.on("trim",
      data =>
      {
        this.addMessage(<div>{data}</div>);
        console.log(this.state.messages)

        // this.setState(state => {
        //   console.log(state.messages)
        //   const messages = state.messages.push(<div>aa</div>)
        //   return {
        //     messages
        //   }
        // }, () => {
        //           console.log(this.state);
        //       })
      }
    );
    // socket.on("trim",
    //   data => ToastsStore.success(data)
    // );
  }

  addMessage(message) {
    // Append the message to the component state
    const messages = this.state.messages;
    messages.push(message);
    this.setState({ messages });
  }

  async handleClick () {


    const response = await fetch('/api/world', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    const body = await response.text();

    console.log(body)

    this.setState({buttonState: 'loading'})
    // make asynchronous call
    setTimeout(() => {
      this.setState({buttonState: 'success'})
    }, 3000)
  }

  async handleTrim () {


    const response = await fetch('/api/trim', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const body = await response.text();

    console.log(body)

    this.setState({buttonState: 'loading'})
    // make asynchronous call
    setTimeout(() => {
      this.setState({buttonState: 'success'})
    }, 3000)
  }

  async handleBismark () {


    const response = await fetch('/api/Bismark', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const body = await response.text();

    console.log(body)

    this.setState({buttonState: 'loading'})
    // make asynchronous call
    setTimeout(() => {
      this.setState({buttonState: 'success'})
    }, 3000)
  }

  async handleBWA_METH () {


    const response = await fetch('/api/BWA_METH', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const body = await response.text();

    console.log(body)

    this.setState({buttonState: 'loading'})
    // make asynchronous call
    setTimeout(() => {
      this.setState({buttonState: 'success'})
    }, 3000)
  }


  async handleBS_seek2 () {


    const response = await fetch('/api/BS_seek2', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const body = await response.text();

    console.log(body)

    this.setState({buttonState: 'loading'})
    // make asynchronous call
    setTimeout(() => {
      this.setState({buttonState: 'success'})
    }, 3000)
  }

  async handleBitmapperBS () {


    const response = await fetch('/api/BitmapperBS', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const body = await response.text();

    console.log(body)

    this.setState({buttonState: 'loading'})
    // make asynchronous call
    setTimeout(() => {
      this.setState({buttonState: 'success'})
    }, 3000)
  }

  async handlegemBS () {


    const response = await fetch('/api/gemBS', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const body = await response.text();

    console.log(body)

    this.setState({buttonState: 'loading'})
    // make asynchronous call
    setTimeout(() => {
      this.setState({buttonState: 'success'})
    }, 3000)
  }

  render() {
    return (
      <div>
      <div style={scrollStyle}>
        { this.state.messages }
      </div>
        <ArcherContainer strokeColor='red' >

          <div style={rootStyle}>
            <ArcherElement
              id="upload"
              relations={[{
                targetId: 'trim',
                targetAnchor: 'top',
                sourceAnchor: 'bottom',
              }]}
            >
              <div style={boxStyle}>upload</div>
              <div style={boxStyle}>
                <FileUploadProgress key='ex1' url='/api/world'
                  onProgress={(e, request, progress) => {console.log('progress', e, request, progress);}}
                  onLoad={ (e, request) => {console.log('load', e, request);}}
                  onError={ (e, request) => {console.log('error', e, request);}}
                  onAbort={ (e, request) => {console.log('abort', e, request);}}
                  />
                <FileUploadProgress key='ex2' url='http://localhost:3000/api/upload'
                  onProgress={(e, request, progress) => {console.log('progress', e, request, progress);}}
                  onLoad={ (e, request) => {console.log('load', e, request);}}
                  onError={ (e, request) => {console.log('error', e, request);}}
                  onAbort={ (e, request) => {console.log('abort', e, request);}}
                  />
              </div>
            </ArcherElement>
          </div>

          <div style={rootStyle}>
            <div style={rowStyle}>
              <ArcherElement
                id="trim"
                relations={[{
                  targetId: 'Bismark',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>Allignment</div>,
                },
                {
                  targetId: 'BWA-METH',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>Allignment</div>,
                },
                {
                  targetId: 'BS_seek2',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>Allignment</div>,
                },
                {
                  targetId: 'BitmapperBS',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>Allignment</div>,
                },
                {
                  targetId: 'gemBS',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>Allignment</div>,
                }]}
              >
                <div style={boxStyle}>Trim</div>
                <div style={boxStyle}>
                  <ProgressButton onClick={this.handleTrim} state={this.state.buttonState}>
                    Trim!
                  </ProgressButton>
                </div>
              </ArcherElement>

            </div>
          </div>
          <div style={rowStyle}>

              <ArcherElement
                id="Bismark"
              >
                <div style={boxStyle}>Bismark</div>
                <div style={boxStyle}>
                  <ProgressButton onClick={this.handleBismark} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>
              <ArcherElement
                id="BWA-METH"
              >
                <div style={boxStyle}>BWA-METH</div>
                <div style={boxStyle}>
                  <ProgressButton onClick={this.handleBWA_METH} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>
              <ArcherElement
                id="BS_seek2"
              >
                <div style={boxStyle}>BS_seek2</div>
                <div style={boxStyle}>
                  <ProgressButton onClick={this.handleBS_seek2} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>
              <ArcherElement
                id="BitmapperBS"
              >
                <div style={boxStyle}>BitmapperBS</div>
                <div style={boxStyle}>
                  <ProgressButton onClick={this.handleBitmapperBS} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>
              <ArcherElement
                id="gemBS"
              >
                <div style={boxStyle}>gemBS</div>
                <div style={boxStyle}>
                  <ProgressButton onClick={this.handlegemBS} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>
          </div>
        </ArcherContainer>
      </div>
    );
  }
}

export default App;
