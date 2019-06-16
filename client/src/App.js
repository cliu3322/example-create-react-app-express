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
    this.state = {project:'project1', buttonState: '', response:'sdf', messages:[], trimreport:[]};

    this.handleUploadImage = this.handleUploadImage.bind(this);

  }


  componentDidMount() {
    const socket = socketIOClient(socketport);
    socket.on("msg",
      data =>
      {
        this.addMessage(<div>{data}</div>);
      }
    );

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


  async handle () {
    console.log(this.node)
    console.log(this.project)
    await fetch('/api/handle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({node:this.node, project:this.state.project})
    }).then((response) => {
      this.setState({buttonState: 'success'})
    });


    this.setState({buttonState: 'loading'});
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
              id="project"
              relations={[{
                targetId: 'upload',
                targetAnchor: 'top',
                sourceAnchor: 'bottom',
              }]}
            >
              <div style={boxStyle}>Choose your project</div>
              <div style={boxStyle}>
                  <form onSubmit={this.chooseProject}>
                    <div>
                      <input ref={(ref) => { this.newproject = ref; }} type="text" placeholder="existing project" />
                    </div>

                    <br />
                    <div>
                      <button>select the project</button>
                    </div>
                  </form>
              </div>
            </ArcherElement>
          </div>

          <div style={rootStyle}>
            <div style={rowStyle}>
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

                      <br />
                      <div>
                        <button>Upload</button>
                      </div>
                    </form>
                </div>
              </ArcherElement>
            </div>
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
                  <ProgressButton node ={"trim"} project = {this.state.project} onClick={this.handle} state={this.state.buttonState}>
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
                  <ProgressButton node ={"bismark_alignment"} project = {this.state.project} onClick={this.handle} state={this.state.buttonState}>
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
                  <ProgressButton node ={"bwa_alignment"} project = {this.state.project} onClick={this.handle} state={this.state.buttonState}>
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
                  <ProgressButton node ={"bsseek2_alignment"} project = {this.state.project} onClick={this.handle} state={this.state.buttonState}>
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
                  <ProgressButton node ={"bitmapperBS_alignment"} project = {this.state.project} onClick={this.handle} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>
              <ArcherElement
                id="gemBS"
                relations={[{
                  targetId: 'gembs-extract',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>extraction</div>,
                }]}
              >
                <div style={boxStyle}>gemBS</div>
                <div style={boxStyle}>
                  <ProgressButton node ={"gemBS_alignment"} project = {this.state.project} onClick={this.handle} state={this.state.buttonState}>
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
                },{
                  targetId: 'Bismark-goleft',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>goleft</div>,
                },{
                  targetId: 'coverage',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>annotation-plot</div>,
                },{
                  targetId: 'region_analysis',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>annotation-plot</div>,
                }]}
              >
                <div style={boxStyle}>Bismark</div>
                <div style={boxStyle}>
                  <ProgressButton node ={"Bismark_extract"} project = {this.state.project} onClick={this.handle} state={this.state.buttonState}>
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
                },{
                  targetId: 'coverage',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>annotation-plot</div>,
                },{
                  targetId: 'region_analysis',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>annotation-plot</div>,
                }]}
              >
                <div style={boxStyle}>BWA-METH</div>
                <div style={boxStyle}>
                  <ProgressButton node ={"bwa_extract"} project = {this.state.project} onClick={this.handle} state={this.state.buttonState}>
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
                },{
                  targetId: 'coverage',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>plot</div>,
                }, {
                  targetId: 'region_analysis',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>goleft</div>,
                }]}
              >
                <div style={boxStyle}>BS_seek2</div>
                <div style={boxStyle}>
                  <ProgressButton node ={"bsseek2_extract"} project = {this.state.project} onClick={this.handle} state={this.state.buttonState}>
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
                },{
                  targetId: 'coverage',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>plot</div>,
                }, {
                  targetId: 'region_analysis',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>goleft</div>,
                }]}
              >
                <div style={boxStyle}>BitmapperBS</div>
                <div style={boxStyle}>
                  <ProgressButton node ={"bitmapperBS_extract"} project = {this.state.project} onClick={this.handle} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>
              <ArcherElement
                id="gembs-extract"
                relations={[{
                  targetId: 'gembs-plot',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>plot</div>,
                }, {
                  targetId: 'gembs-goleft',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>goleft</div>,
                }, {
                  targetId: 'coverage',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>plot</div>,
                }, {
                  targetId: 'region_analysis',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                  style: { strokeColor: 'blue', strokeWidth: 1 },
                  label: <div style={{ marginTop: '-20px' }}>goleft</div>,
                }]}
              >
                <div style={boxStyle}>gemBS</div>
                <div style={boxStyle}>
                  <ProgressButton node ={"gemBS_extract"} project = {this.state.project} onClick={this.handle} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>
          </div>

          <div style={rowStyle}>
              <ArcherElement
                id="Bismark-goleft"
              >
                <div style={boxStyle}>Bismark</div>
                <div style={boxStyle}>
                  <ProgressButton node ={"Bismark_goleft"} project = {this.state.project} onClick={this.handle} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>
              <ArcherElement
                id="Bismark-plot"
                relations={[{
                  targetId: 'intersect',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                }]}
              >
                <div style={boxStyle}>Bismark</div>
                <div style={boxStyle}>
                  <ProgressButton node ={"Bismark_correlation_plot"} project = {this.state.project} onClick={this.handle} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>
              <ArcherElement
                id="BWA-METH-goleft"
              >
                <div style={boxStyle}>BWA-METH</div>
                <div style={boxStyle}>
                  <ProgressButton node ={"bwa_goleft"} project = {this.state.project} onClick={this.handle} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>
              <ArcherElement
                id="BWA-METH-plot"
                relations={[{
                  targetId: 'intersect',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                }]}
              >
                <div style={boxStyle}>BWA-METH</div>
                <div style={boxStyle}>
                  <ProgressButton node ={"bwa_correlation_plot"} project = {this.state.project} onClick={this.handle} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>
              <ArcherElement
                id="BS_seek2-goleft"
              >
                <div style={boxStyle}>BS_seek2</div>
                <div style={boxStyle}>
                  <ProgressButton node ={"bsseek2_goleft"} project = {this.state.project} onClick={this.handle} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>
              <ArcherElement
                id="BS_seek2-plot"
                relations={[{
                  targetId: 'intersect',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                }]}
              >
                <div style={boxStyle}>BS_seek2</div>
                <div style={boxStyle}>
                  <ProgressButton node ={"bsseek2_correlation_plot"} project = {this.state.project} onClick={this.handle} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>
              <ArcherElement
                id="BitmapperBS-goleft"
              >
                <div style={boxStyle}>BitmapperBS</div>
                <div style={boxStyle}>
                  <ProgressButton node ={"bitmapperBS_goleft"} project = {this.state.project} onClick={this.handle} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>
              <ArcherElement
                id="BitmapperBS-plot"
                relations={[{
                  targetId: 'intersect',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                }]}
              >
                <div style={boxStyle}>BitmapperBS</div>
                <div style={boxStyle}>
                  <ProgressButton node ={"bitmapperBS_correlation_plot"} project = {this.state.project} onClick={this.handle} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>
              <ArcherElement
                id="gembs-goleft"
              >
                <div style={boxStyle}>gemBS</div>
                <div style={boxStyle}>
                  <ProgressButton node ={"gemBS_report"} project = {this.state.project} onClick={this.handle} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>
              <ArcherElement
                id="gembs-plot"
                relations={[{
                  targetId: 'intersect',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom',
                }]}
              >
                <div style={boxStyle}>gemBS</div>
                <div style={boxStyle}>
                  <ProgressButton node ={"gemBS_correlation_plot"} project = {this.state.project} onClick={this.handle} value ={"gembs"} method={"plot"} state={this.state.buttonState}>
                    GO!
                  </ProgressButton>
                </div>
              </ArcherElement>

          </div>

          <div style={rowStyle}>

            <ArcherElement
              id="intersect"
              relations={[]}
            >
              <div style={boxStyle}>Correlation Plot</div>
              <div style={boxStyle}>
                <ProgressButton node ={"intersect"} project = {this.state.project} onClick={this.handle} state={this.state.buttonState}>
                  Intersect
                </ProgressButton>
              </div>
              { this.state.trimreport }
            </ArcherElement>

            <ArcherElement
              id="coverage"
              relations={[]}
            >
              <div style={boxStyle}>Correlation Plot</div>
              <div style={boxStyle}>
                <ProgressButton node ={"intersect"} project = {this.state.project} onClick={this.handle} state={this.state.buttonState}>
                  Coverage
                </ProgressButton>
              </div>
              { this.state.trimreport }
            </ArcherElement>

            <ArcherElement
              id="annotation"
              relations={[]}
            >
              <div style={boxStyle}>annotation</div>
              <div style={boxStyle}>
                <ProgressButton node ={"intersect"} project = {this.state.project} onClick={this.handle} state={this.state.buttonState}>
                  Annotation
                </ProgressButton>
              </div>
              { this.state.trimreport }
            </ArcherElement>

            <ArcherElement
              id="region_analysis"
              relations={[]}
            >
              <div style={boxStyle}>Differential Methylation Region Analysis</div>
              <div style={boxStyle}>
                <ProgressButton node ={"intersect"} project = {this.state.project} onClick={this.handle} state={this.state.buttonState}>
                  Region Analysis
                </ProgressButton>
              </div>
              { this.state.trimreport }
            </ArcherElement>

          </div>


        </ArcherContainer>
      </div>
    );
  }
}

export default App;
