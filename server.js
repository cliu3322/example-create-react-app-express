const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const { spawn, exec } = require('child_process');
const socketio = require('socket.io')(2000);
const cors = require('cors')

const fileUpload = require('express-fileupload');


const app = express();
const port = process.env.PORT || 5000;

app.use('/static', express.static('../test'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(fileUpload());

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));



socketio.on('disconnect', function(socket){
	console.log('user disconnected');
});

socketio.on('connection', function(socket){
	console.log('connection')
});

app.post('/api/handle', (req, res) => {
  var str = ''


  switch(req.body.node) {
    case "trim":
      str = 'trim_galore -q 20 --stringency 5 --paired --length 20 -o /home/eric_liu/pipeline/trim /home/eric_liu/pipeline/uploads/test1.fastq /home/eric_liu/pipeline/uploads/test2.fastq'
      break;
    case 'bismark':
      console.log('bismark');
      break;
  }

  const ls  = exec(str)

  ls.stdout.on('data', (data) => {

    console.log(`${data}`)
    socketio.emit('msg',`stdout: ${data}`)
  });

  ls.stderr.on('data', (data) => {
    console.log(`${data}`)
    socketio.emit('msg',`stderr: ${data}`);

  });

  ls.on('close', (code) => {
    socketio.emit('msg',`close: child process exited with code ${code}`)
    console.log(`child process exited with code ${code}`);
    res.send({ express: 'Hello From close' });
  });

});
