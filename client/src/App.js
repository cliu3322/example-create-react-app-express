import React, { Component } from 'react';

import { ArcherContainer, ArcherElement } from 'react-archer';
//import button from 'react-progress-button'
import Select from 'react-select'
import socketIOClient from "socket.io-client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Checkbox, CheckboxGroup} from 'react-checkbox-group';


var {socketport} = require('../package.json');



const rootStyle = { display: 'flex', justifyContent: 'center' };
const rowStyle = { margin: '100px 0', display: 'flex', justifyContent: 'space-between', }
const boxStyle = { padding: '10px', border: '1px solid black', };

const scrollStyle = { margin: '0 10px 20px 10px', padding: '10px', height:'220px',width:'100%',border:'1px solid #ccc',font:'16px/26px Georgia, Garamond, Serif',overflow:'auto', scrollTop:'-220px'};


const reportoptions = [
  { value: 'goleft', label: 'goleft' },
  { value: 'intersect', label: 'intersect plot' },
  { value: 'coverageplot', label: 'Coverage plot' },
  { value: 'annotationplot', label: 'Annotation plot' },
];

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {projects:[],
      buttonState: '',
      response:'sdf', messages:[],
      selectedOption: null,
      selectedReport: null,
      reports: []};

    this.handleUploadImage = this.handleUploadImage.bind(this);
    this.handle = this.handle.bind(this);
    this.handlereport = this.handlereport.bind(this);

    this.trim = React.createRef();
  }


  componentDidMount() {
    const socket = socketIOClient(socketport);
    socket.on("msg",
      data =>
      {
        this.addMessage(<div>{data}</div>);
      }
    );



    fetch('/api/projects')
      .then(response => {return response.json()})
      .then(projects_ => {
        var projects = [];
        projects.push({label:'new',value:'new'})
        projects_.result.forEach(function(element) {
            projects.push({ label:element, value: element })
        });
        this.setState({ projects })
      });

  }

  addMessage(message) {
    // Append the message to the component state
    const messages = this.state.messages;
    messages.push(message);
    this.setState({ messages });
  }
  handleUploadImage(ev) {
    ev.preventDefault();

    if (this.state.selectedOption== null) {
      toast("Please choose a project")
    } else {
      if (this.state.selectedOption.value === "new") {

        const data = new FormData();

        console.log('file', this.uploadInput.files[0])
        data.append('file', this.uploadInput.files[0]);
        //data.append('filename', this.fileName.value);
        console.log('project',this.state.newproject.value)
        data.append('project',this.state.newproject.value)

        fetch('/api/world', {
          method: 'POST',
          body: data,
        }).then((response) => {
          toast('upload successfully!')
        });

      } else {

        const data = new FormData();
        //console.log('filename',this.fileName.value)
        console.log('file', this.uploadInput.files[0])
        data.append('file', this.uploadInput.files[0]);
        //data.append('filename', this.fileName.value);
        data.append('project',this.state.selectedOption.value)

        fetch('/api/world', {
          method: 'POST',
          body: data,
        }).then((response) => {
          toast('upload successfully!')
        });

      }
    }



  }

  handle (e) {

    if (this.state.selectedOption == null) {
      toast("Please choose a project")

    } else {

      if (this.state.selectedOption.value === "new") {
        fetch('/api/handle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({node:e.target.id, project:this.state.selectedOption.value})
        }).then((response) => {
          toast("DONE!")
          this.setState({buttonState: 'success'})
        });
      } else {
        fetch('/api/handle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({node:e.target.id, project:this.state.selectedOption.value})
        }).then((response) => {
          toast("DONE!")
          this.setState({buttonState: 'success'})
        });
      }
    }

  }

  handleChange = selectedReport => {
    this.setState({ selectedReport });

  };

  handleChangeReport = selectedReport => {

    this.setState({ selectedReport });

  };

  handleNewprojectChange = event => {

    this.setState({newproject: {label:event.target.value, value: event.target.value}});

  };

  handlereport = e => {
    e.preventDefault();
    console.log(this.state.selectedReport)
    console.log(this.state.reports)

    if (this.state.selectedOption == null) {
      toast("Please choose a project")

    } else {

      if (this.state.selectedOption.value === "new") {
        fetch('/api/report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({report:this.state.selectedReport.value, reportmethod:this.state.reports})
        }).then((response) => {
          toast("DONE!")
          this.setState({buttonState: 'success'})
        });
      } else {
        fetch('/api/report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({report:this.state.selectedReport.value, reportmethod:this.state.reports})
        }).then((response) => {
          toast("DONE!")
          this.setState({buttonState: 'success'})
        });
      }
    }
  };

  reportmethodChanged = (newFruits) => {
    console.log(newFruits)
    this.setState({
      reports: newFruits
    });
  }


  render() {
    return (
      <div>
      <ToastContainer />
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

                    <div>
                      <Select
                        value={this.state.selectedOption}
                        options={this.state.projects}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div>
                      {this.state.selectedOption && this.state.selectedOption.value === 'new'?
                        (<form>
                          <input type="text" value={this.state.value} onChange={this.handleNewprojectChange}/>
                        </form>):null
                      }
                    </div>

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
                  <button id ={"trim"} ref={(ref) => { this.refnode = ref; }} project = {this.state.selectedOption} newproject = {this.state.newproject} onClick={this.handle} state={this.state.buttonState}>
                    Trim!
                  </button>
                </div>

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
                  <button id ={"bismark_alignment"} project = {this.state.selectedOption} onClick={this.handle} state={this.state.buttonState}>
                    GO!
                  </button>
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
                  <button id ={"bwa_alignment"} project = {this.state.selectedOption} onClick={this.handle} state={this.state.buttonState}>
                    GO!
                  </button>
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
                  <button id ={"bsseek2_alignment"} project = {this.state.selectedOption} onClick={this.handle} state={this.state.buttonState}>
                    GO!
                  </button>
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
                  <button id ={"bitmapperBS_alignment"} project = {this.state.selectedOption} onClick={this.handle} state={this.state.buttonState}>
                    GO!
                  </button>
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
                  <button id ={"gemBS_alignment"} project = {this.state.selectedOption} onClick={this.handle} state={this.state.buttonState}>
                    GO!
                  </button>
                </div>
              </ArcherElement>
          </div>

          <div style={rowStyle}>

              <ArcherElement
                id="Bismark-extract"
                relations={[]}
              >
                <div style={boxStyle}>Bismark</div>
                <div style={boxStyle}>
                  <button id ={"Bismark_extract"} project = {this.state.selectedOption} onClick={this.handle} state={this.state.buttonState}>
                    GO!
                  </button>
                </div>
              </ArcherElement>
              <ArcherElement
                id="BWA-METH-extract"
                relations={[]}
              >
                <div style={boxStyle}>BWA-METH</div>
                <div style={boxStyle}>
                  <button id ={"bwa_extract"} project = {this.state.selectedOption} onClick={this.handle} state={this.state.buttonState}>
                    GO!
                  </button>
                </div>
              </ArcherElement>
              <ArcherElement
                id="BS_seek2-extract"
                relations={[]}
              >
                <div style={boxStyle}>BS_seek2</div>
                <div style={boxStyle}>
                  <button id ={"bsseek2_extract"} project = {this.state.selectedOption} onClick={this.handle} state={this.state.buttonState}>
                    GO!
                  </button>
                </div>
              </ArcherElement>
              <ArcherElement
                id="BitmapperBS-extract"
                relations={[]}
              >
                <div style={boxStyle}>BitmapperBS</div>
                <div style={boxStyle}>
                  <button id ={"bitmapperBS_extract"} project = {this.state.selectedOption} onClick={this.handle} state={this.state.buttonState}>
                    GO!
                  </button>
                </div>
              </ArcherElement>
              <ArcherElement
                id="gembs-extract"
                relations={[]}
              >
                <div style={boxStyle}>gemBS</div>
                <div style={boxStyle}>
                  <button id ={"gemBS_extract"} project = {this.state.selectedOption} onClick={this.handle} state={this.state.buttonState}>
                    GO!
                  </button>
                </div>
              </ArcherElement>
          </div>
          <div style={rootStyle}>
            <div style={rowStyle}>
                <ArcherElement
                  id="goleft"
                >
                  <div style={boxStyle}>Report</div>
                  <div style={boxStyle}>
                    <form onSubmit={this.handlereport}>
                      <div>
                        <Select
                          value={this.state.selectedReport}
                          onChange={this.handleChangeReport}
                          options={reportoptions}
                        />

                      </div>
                      <CheckboxGroup
                        name="reports"
                        value={this.state.reports}
                        onChange={this.reportmethodChanged}>

                        <Checkbox value="bismarkreport"/> Bismark<br />
                        <Checkbox value="bwareport"/> BWA<br />
                        <Checkbox value="bs2report"/> BS2<br />
                        <Checkbox value="bitmapperBSreport"/> BitmapperBS<br />
                        <Checkbox value="gemBS"/> gemBS<br />
                      </CheckboxGroup>
                      <br />
                      <div>
                        <button>choose</button>
                      </div>
                    </form>
                  </div>
                </ArcherElement>

            </div>
          </div>



        </ArcherContainer>
      </div>
    );
  }
}

export default App;
