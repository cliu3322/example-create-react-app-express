import React, { Component } from 'react';

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
    this.state = {buttonState: '',response:'sdf', messages:[], trimreport:[]};

    // This binding is necessary to make `this` work in the callback
    this.handleClick = this.handleClick.bind(this);
    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.handleTrim = this.handleTrim.bind(this);
  }


  componentDidMount() {
    const socket = socketIOClient(socketport);
    socket.on("msg",
      data =>
      {
        this.addMessage(<div>{data}</div>);
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
  handleUploadImage(ev) {
    ev.preventDefault();

    const data = new FormData();
    console.log(this.fileName.value)
    console.log('file', this.uploadInput.files[0])
    data.append('file', this.uploadInput.files[0]);
    data.append('filename', this.fileName.value);

    fetch('/api/world', {
      method: 'POST',
      body: data,
    }).then((response) => {
      console.log(response)
    });

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

    console.log(response)

    window.open(response.file)

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



  async handleBismark_extract () {


    const response = await fetch('/api/Bismark_extract', {
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


  async handleBWA_METH_extract () {


    const response = await fetch('/api/BWA_METH_extract', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const body = await response.text();


    this.setState({buttonState: 'loading'})
    // make asynchronous call
    setTimeout(() => {
      this.setState({buttonState: 'success'})
    }, 3000)
  }


  async handleBS_seek2_extract () {


    const response = await fetch('/api/BS_seek2_extract', {
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

  async handleBitmapperBS_extract () {


    const response = await fetch('/api/BitmapperBS_extract', {
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

  async handlegemBS_extract () {


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


  async handleBismark_plot () {


    const response = await fetch('/api/Bismark_plot', {
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

  async handleBWA_METH_plot () {


    const response = await fetch('/api/BWA_METH_plot', {
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


  async handleBS_seek2_plot () {


    const response = await fetch('/api/BS_seek2_plot', {
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

  async handleBitmapperBS_plot () {


    const response = await fetch('/api/BitmapperBS_plot', {
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

  async handlegemBS_plot () {


    const response = await fetch('/api/gemBS_plot', {
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

  async test (a) {
    console.log(this.value)

  }

  async handle () {
    const response = await fetch('/api/handle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({value:this.value,method:this.method})
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
                  <form onSubmit={this.handleUploadImage}>
                    <div>
                      <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
                    </div>
                    <div>
                      <input ref={(ref) => { this.fileName = ref; }} type="text" placeholder="Enter the desired name of file" />
                    </div>
                    <br />
                    <div>
                      <button>Upload</button>
                    </div>
                  </form>
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
                  <ProgressButton node ={"trim"} onClick={this.handleTrim} state={this.state.buttonState}>
                    Trim!
                  </ProgressButton>
                </div>
                { this.state.trimreport }
              </ArcherElement>

            </div>
          </div>
          <div style={rowStyle}>

              <ArcherElement
                id="Bismark"
                relations={[{
                  targetId: 'Bismark-extract',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>extraction</div>,
                }]}
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
                relations={[{
                  targetId: 'BWA-METH-extract',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>extraction</div>,
                }]}
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
                relations={[{
                  targetId: 'BS_seek2-extract',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>extraction</div>,
                }]}
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
                relations={[{
                  targetId: 'BitmapperBS-extract',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>extraction</div>,
                }]}
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
                relations={[{
                  targetId: 'gembs-plot',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>plot</div>,
                },{
                  targetId: 'gembs-goleft',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>goleft</div>,
                }]}
              >
                <div style={boxStyle}>gemBS</div>
                <div style={boxStyle}>
                  <ProgressButton onClick={this.handlegemBS} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>
          </div>

          <div style={rowStyle}>

              <ArcherElement
                id="Bismark-extract"
                relations={[{
                  targetId: 'Bismark-plot',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>plot</div>,
                },
                {
                  targetId: 'Bismark-goleft',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>goleft</div>,
                }]}
              >
                <div style={boxStyle}>Bismark</div>
                <div style={boxStyle}>
                  <ProgressButton onClick={this.handleBismark_extract} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>
              <ArcherElement
                id="BWA-METH-extract"
                relations={[{
                  targetId: 'BWA-METH-plot',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>plot</div>,
                },{
                  targetId: 'BWA-METH-goleft',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>goleft</div>,
                }]}
              >
                <div style={boxStyle}>BWA-METH</div>
                <div style={boxStyle}>
                  <ProgressButton onClick={this.handleBWA_METH_extract} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>
              <ArcherElement
                id="BS_seek2-extract"
                relations={[{
                  targetId: 'BS_seek2-plot',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>plot</div>,
                }, {
                  targetId: 'BS_seek2-goleft',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>goleft</div>,
                }]}
              >
                <div style={boxStyle}>BS_seek2</div>
                <div style={boxStyle}>
                  <ProgressButton onClick={this.handleBS_seek2_extract} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>
              <ArcherElement
                id="BitmapperBS-extract"
                relations={[{
                  targetId: 'BitmapperBS-plot',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>plot</div>,
                }, {
                  targetId: 'BitmapperBS-goleft',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>goleft</div>,
                }]}
              >
                <div style={boxStyle}>BitmapperBS</div>
                <div style={boxStyle}>
                  <ProgressButton onClick={this.handleBitmapperBS_extract} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>
              <div></div>
          </div>

          <div style={rowStyle}>
              <ArcherElement
                id="Bismark-goleft"
              >
                <div style={boxStyle}>Bismark</div>
                <div style={boxStyle}>
                  <ProgressButton onClick={this.handleBismark_plot} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>
              <ArcherElement
                id="Bismark-plot"
              >
                <div style={boxStyle}>Bismark</div>
                <div style={boxStyle}>
                  <ProgressButton onClick={this.handleBismark_plot} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>
              <ArcherElement
                id="BWA-METH-goleft"
              >
                <div style={boxStyle}>BWA-METH</div>
                <div style={boxStyle}>
                  <ProgressButton onClick={this.handleBWA_METH_plot} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>
              <ArcherElement
                id="BWA-METH-plot"
              >
                <div style={boxStyle}>BWA-METH</div>
                <div style={boxStyle}>
                  <ProgressButton onClick={this.handleBWA_METH_plot} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>
              <ArcherElement
                id="BS_seek2-goleft"
              >
                <div style={boxStyle}>BS_seek2</div>
                <div style={boxStyle}>
                  <ProgressButton onClick={this.handleBS_seek2_plot} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>
              <ArcherElement
                id="BS_seek2-plot"
              >
                <div style={boxStyle}>BS_seek2</div>
                <div style={boxStyle}>
                  <ProgressButton onClick={this.handleBS_seek2_plot} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>
              <ArcherElement
                id="BitmapperBS-goleft"
              >
                <div style={boxStyle}>BitmapperBS</div>
                <div style={boxStyle}>
                  <ProgressButton onClick={this.handleBitmapperBS_plot} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>
              <ArcherElement
                id="BitmapperBS-plot"
              >
                <div style={boxStyle}>BitmapperBS</div>
                <div style={boxStyle}>
                  <ProgressButton onClick={this.handleBitmapperBS_plot} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>
              <ArcherElement
                id="gembs-goleft"
              >
                <div style={boxStyle}>BitmapperBS</div>
                <div style={boxStyle}>
                  <ProgressButton onClick={this.handleBitmapperBS_plot} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>
              <ArcherElement
                id="gembs-plot"
              >
                <div style={boxStyle}>BitmapperBS</div>
                <div style={boxStyle}>
                  <ProgressButton onClick={this.handle} value ={"gembs"} method={"plot"} state={this.state.buttonState}>
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
