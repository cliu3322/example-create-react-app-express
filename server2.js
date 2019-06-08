const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const { spawn, exec } = require('child_process');
const socketio = require('socket.io')(9000);
var cors = require('cors')

const fileUpload = require('express-fileupload');


const app = express();

app.use('/static', express.static('../test'))

const port = process.env.PORT || 5000;

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


app.get('/api/trim', (req, res) => {
  //trim_galore -q 20 --stringency 5 --paired --length 20 -o /home/azureuser/pipeline/trim /home/azureuser/pipeline/uploads/test1.fastq /home/azureuser/pipeline/uploads/test2.fastq
  const ls = spawn('trim_galore', ['--paired', '--trim1', '-o', '../pipeline/trim', '../pipeline/uploads/test1.fastq', '../pipeline/uploads/test2.fastq']);
  ls.stdout.on('data', (data) => {

    console.log('trim',`stdout: ${data}`)
    socketio.emit('msg',`stdout: ${data}`)
  });

  ls.stderr.on('data', (data) => {
    console.log('trim',`stderr: ${data}`)
    socketio.emit('msg',`stderr: ${data}`);

  });

  ls.on('close', (code) => {
    socketio.emit('msg',`close: child process exited with code ${code}`)
    console.log(`child process exited with code ${code}`);
    //res.sendFile('/Users/chunyiliu/projects/pipeline/trim/test1.fastq_trimming_report.txt');
    res.download('./package.json');
  });
});
