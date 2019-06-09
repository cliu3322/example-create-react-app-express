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

  console.log(req.body.node)

  switch(req.body.node) {
    case "trim":
      str = 'trim_galore -q 20 --stringency 5 --paired --length 20 -o /home/eric_liu/pipeline/trim /home/eric_liu/pipeline/uploads/test1.fastq /home/eric_liu/pipeline/uploads/test2.fastq'
      break;
    case 'bismark_alignment':
      str = 'bismark /datadrive -o /home/eric_liu/pipeline/test_direction_result -2 /home/eric_liu/pipeline/trim/test1_val_1.fq -1 /home/eric_liu/pipeline/trim/test2_val_2.fq --parallel 4 -p 4 --score_min L,0,-0.6 --non_directional'
      break;
    case 'bwa_alignment':
      str = 'bwameth.py --threads 16 --reference /datadrive/hg38.fa /home/eric_liu/pipeline/trim/test1_val_1.fq /home/eric_liu/pipeline/trim/test2_val_2.fq > /home/eric_liu/pipeline/BWA/bwa_test.sam'
      break;
    case 'bsseek2_alignment':
      str = 'bs_seeker2-align.py -1 /home/eric_liu/pipeline/trim/test1_val_1.fq -2 /home/eric_liu/pipeline/trim/test2_val_2.fq --aligner=bowtie2 --bt2-p 19 --bt2--mm -o /home/eric_liu/pipeline/BSresult/test_bs2.bam -f bam -g /datadrive/hg38_bs2/grch38_core_and_bs_controls.fa -d /datadrive/hg38_bs2 --temp_dir=/home/eric_liu/pipeline/temp'
      break;
    case 'bitmapperBS_alignment':
      str = 'bitmapperBS --search /datadrive/hg38_bitmapper/grch38_core_and_bs_controls.fa --sensitive -e 0.1 --seq1 /home/eric_liu/pipeline/trim/test1_val_1.fq --seq2 /home/eric_liu/pipeline/trim/test2_val_2.fq --pe --bam -o /home/eric_liu/pipeline/bitmapperResult/test_bitmapper.bam'
      break;
    case 'gemBS_alignment':
      str = 'gemBS prepare -c /home/eric_liu/pipeline/gembsprepare/example.conf -t /home/eric_liu/pipeline/gembsprepare/example.csv'
      str += ' && gemBS map';
      str += ' && gemBS call';
      break;
  }

  const ls  = exec(str)

  ls.stdout.on('data', (data) => {

    console.log(`${data}`)
    socketio.emit('msg',`${data}`)
  });

  ls.stderr.on('data', (data) => {
    console.log(`${data}`)
    socketio.emit('msg',`${data}`);

  });

  ls.on('close', (code) => {
    socketio.emit('msg',`close: child process exited with code ${code}`)
    console.log(`child process exited with code ${code}`);
    res.send({ express: 'Hello From close' });
  });

});
