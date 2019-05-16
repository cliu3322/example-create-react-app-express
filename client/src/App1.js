import React, { Component } from 'react';
import Tree from "react-d3-tree";
import clone from "clone";

const debugData = {
  name: "1",
  id:'id1',
  nodeSvgShape:{shape: 'circle',
    shapeProps: {
      r: 10,
      fill: 'red',
    }
  },
  children: [
    {
      name: "2"
    },
    {
      name: "2"
    }
  ]
};

const containerStyles = {
  width: "100%",
  height: "100vh"
};


class App extends Component {
  state = {
    data: debugData
  };

  injectedNodesCount = 0;

  // updateNode1 = () => {
  //   const nextData = clone(this.state.data);
  //   console.log(nextData.nodeSvgShape.shapeProps.fill);
  //   nextData.nodeSvgShape.shapeProps.fill ='green'
  //
  //   this.setState({
  //     data: nextData
  //   });
  // };


  updateNode1 = async e => {
    e.preventDefault();
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post: this.state.post }),
    });
    const body = await response.text();

    const nextData = clone(this.state.data);

    nextData.nodeSvgShape.shapeProps.fill = body

    this.setState({
      data: nextData
    });
  };


  addChildNode = () => {
    const nextData = clone(this.state.data);
    const target = nextData.children;
    this.injectedNodesCount++;
    target.push({
      name: `Inserted Node ${this.injectedNodesCount}`,
      id: `inserted-node-${this.injectedNodesCount}`
    });
    this.setState({
      data: nextData
    });
  };

  removeChildNode = () => {
    const nextData = clone(this.state.data);
    const target = nextData.children;
    target.pop();
    this.injectedNodesCount--;
    this.setState({
      data: nextData
    });
  };

  componentDidMount() {
    // Get treeContainer's dimensions so we can center the tree
    const dimensions = this.treeContainer.getBoundingClientRect();
    this.setState({
      translate: {
        x: dimensions.width / 2,
        y: dimensions.height / 2
      }
    });
  }

  render() {
    return (
      <div style={containerStyles} ref={tc => (this.treeContainer = tc)}>
        <button onClick={this.addChildNode}>Add Node</button>
        <button onClick={this.removeChildNode}>Remove Node</button>
        <button onClick={this.updateNode1}>updateNode1</button>
        <Tree
          data={this.state.data}
          translate={this.state.translate}
          orientation={"vertical"}
        />
      </div>
    );
  }
}

export default App;
