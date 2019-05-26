const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const { spawn, exec } = require('child_process');
const socketio = require('socket.io')(4000);
const fileUpload = require('express-fileupload');

const app = express();

app.use('/static', express.static('../test'))

const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(fileUpload());
// API calls
app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.post('/api/world', (req, res) => {

  console.log('name',req.body.filename)

  let uploadFile = req.files.file;
  uploadFile.mv(`../pipeline/uploads/${req.files.file.name}`,function(err) {
    if (err) {
      return res.send(err)
    }
    res.json({file:req.files.file.name})
  })
});

app.post('/api/feedback', (req, res) => {
  console.log(req.body);
  res.send(
    `green`,
  );
});

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


app.get('/api/Bismark', (req, res) => {
  const ls = spawn('bismark', ['../geno', '-o','../pipeline/test_direction_result' , '-1', '../pipeline/trim/test1_val_1.fq',
  '-2', '../pipeline/trim/test2_val_2.fq', '--parallel', '4', '-p', '4', '--score_min', 'L,0,-0.6', '--non_directional']);

  ls.stdout.on('data', (data) => {

    console.log('Bismark',`stdout: ${data}`)
    socketio.emit('msg',`stdout: ${data}`)
  });

  ls.stderr.on('data', (data) => {
    console.log('Bismark',`stderr: ${data}`)
    socketio.emit('msg',`stderr: ${data}`);

  });

  ls.on('close', (code) => {
    socketio.emit('msg',`close: child process exited with code ${code}`)
    console.log(`child process exited with code ${code}`);
    //res.sendFile('/Users/chunyiliu/projects/pipeline/trim/test1.fastq_trimming_report.txt');
    res.send({ express: 'Hello From Bismark' });
  });
});

app.get('/api/BWA_METH', (req, res) => {
  const ls = exec('bwameth.py --threads 16 --reference ../geno/hg38.fa ../pipeline/trim/test1_val_1.fq ../pipeline/trim/test2_val_2.fq > ../pipeline/BWA/bwa_test.sam')

  ls.stdout.on('data', (data) => {

    console.log('BWA_METH',`stdout: ${data}`)
    socketio.emit('msg',`stdout: ${data}`)
  });

  ls.stderr.on('data', (data) => {
    console.log('BWA_METH',`stderr: ${data}`)
    socketio.emit('msg',`stderr: ${data}`);

  });

  ls.on('close', (code) => {
    socketio.emit('msg',`close: child process exited with code ${code}`)
    console.log(`child process exited with code ${code}`);
    //res.sendFile('/Users/chunyiliu/projects/pipeline/trim/test1.fastq_trimming_report.txt');
    res.send({ express: 'Hello From BWA_METH' });
  });
});

app.get('/api/BS_seek2', (req, res) => {
  const ls = spawn('bs_seeker2-align.py', ['-1', '../pipeline/trim/test1_val_1.fq', '-2', '../pipeline/trim/test2_val_2.fq', '--aligner=bowtie2',
   '--bt2-p', '19', '--bt2','--mm','-o', '../pipeline/BSresult/test_bs2.bam', '-f',
   'bam', '-g', '../geno/hg38_bs2/grch38_core_and_bs_controls.fa', '-d', '../geno/hg38_bs2', '--temp_dir=../pipeline/temp']);

  ls.stdout.on('data', (data) => {

    console.log('BS_seek2',`stdout: ${data}`)
    socketio.emit('msg',`stdout: ${data}`)
  });

  ls.stderr.on('data', (data) => {
    console.log('BS_seek2',`stderr: ${data}`)
    socketio.emit('msg',`stderr: ${data}`);

  });

  ls.on('close', (code) => {
    socketio.emit('msg',`close: child process exited with code ${code}`)
    console.log(`child process exited with code ${code}`);
    //res.sendFile('/Users/chunyiliu/projects/pipeline/trim/test1.fastq_trimming_report.txt');
    res.send({ express: 'Hello From BS_seek2' });
  });
});

app.get('/api/BitmapperBS', (req, res) => {
  // const ls = spawn('../BitmapperBS/BitmapperBS', ['--search', './geno/hg38_bitmapper/grch38_core_and_bs_controls.fa', '--sensitive', '-e', '0.1',
  //  '--seq1', '../pipeline/trim/test1_val_1.fq', '--seq2', '../pipeline/trim/test2_val_2.fq', '--pe', '--bam', '-o','../../pipeline/bitmapperResult/test_bitmapper.bam']);
  const ls = exec('cd ../BitMapperBS/ && ./bitmapperBS --search ../geno/hg38_bitmapper/grch38_core_and_bs_controls.fa --sensitive -e 0.1 --seq1 ../pipeline/trim/test1_val_1.fq --seq2 ../pipeline/trim/test2_val_2.fq --pe --bam -o ../pipeline/bitmapperResult/test_bitmapper.bam')

  ls.stdout.on('data', (data) => {

    console.log('BitmapperBS',`stdout: ${data}`)
    socketio.emit('msg',`stdout: ${data}`)
  });

  ls.stderr.on('data', (data) => {
    console.log('BitmapperBS',`stderr: ${data}`)
    socketio.emit('msg',`stderr: ${data}`);

  });

  ls.on('close', (code) => {
    socketio.emit('msg',`close: child process exited with code ${code}`)
    console.log(`child process exited with code ${code}`);
    //res.sendFile('/Users/chunyiliu/projects/pipeline/trim/test1.fastq_trimming_report.txt');
    res.send({ express: 'Hello From BitmapperBS' });
  });
});

app.get('/api/gemBS', (req, res) => {
  //const ls = spawn('gemBS', ['map']);
  const ls = exec('cd //home/cliu3322/gemBS/prepare/ && gemBS prepare -c example.conf -t example.csv && gemBS map&& gemBS call && gemBS extract && gemBS map-report && gemBS call-report')
  ls.stdout.on('data', (data) => {

    console.log('gemBS',`stdout: ${data}`)
    socketio.emit('msg',`stdout: ${data}`)
  });

  ls.stderr.on('data', (data) => {
    console.log('gemBS',`stderr: ${data}`)
    socketio.emit('msg',`stderr: ${data}`);

  });

  ls.on('close', (code) => {
    socketio.emit('msg',`close: child process exited with code ${code}`)
    console.log(`child process exited with code ${code}`);
    //res.sendFile('/Users/chunyiliu/projects/pipeline/trim/test1.fastq_trimming_report.txt');
    res.send({ express: 'Hello From Express gemBS' });
  });
});



app.get('/api/Bismark_extract', (req, res) => {
  const ls = exec('samtools view -@ 4 -b -h -F 0x04 -F 0x400 -F 512 -q 1 -f 0x02 ../pipeline/test_direction_result/test1_val_1_bismark_bt2_pe.bam > ../pipeline/test_direction_result/test1_val_1_bismark_bt2_pe.filter.bam');
  ls.stdout.on('data', (data) => {

    console.log('Bismark',`stdout: ${data}`)
    socketio.emit('msg',`stdout: ${data}`)
  });

  ls.stderr.on('data', (data) => {
    console.log('Bismark',`stderr: ${data}`)
    socketio.emit('msg',`stderr: ${data}`);

  });

  ls.on('close', (code) => {
    socketio.emit('msg',`close: child process exited with code ${code}`)
    console.log(`child process exited with code ${code}`);
    //res.sendFile('/Users/chunyiliu/projects/pipeline/trim/test1.fastq_trimming_report.txt');
    //res.send({ express: 'Hello From Bismark' });
  });

  const ls2 = exec('bismark_methylation_extractor --bedGraph --gzip --CX ../pipeline/test_direction_result/test1_val_1_bismark_bt2_pe.filter.bam');
  ls2.stdout.on('data', (data) => {

    console.log('Bismark',`stdout: ${data}`)
    socketio.emit('msg',`stdout: ${data}`)
  });

  ls2.stderr.on('data', (data) => {
    console.log('Bismark',`stderr: ${data}`)
    socketio.emit('msg',`stderr: ${data}`);

  });

  ls2.on('close', (code) => {
    socketio.emit('msg',`close: child process exited with code ${code}`)
    console.log(`child process exited with code ${code}`);
    //res.sendFile('/Users/chunyiliu/projects/pipeline/trim/test1.fastq_trimming_report.txt');
    res.send({ express: 'Hello From Bismark_extract' });
  });
});

app.get('/api/BWA_METH_extract', (req, res) => {
  const ls = exec('samtools view -@ 4 -b -h -F 0x04 -F 0x400 -F 512 -q 1 -f 0x02 ../pipeline/BWA/bwa_test.bam > ../pipeline/BWA/bwa_test.filter.bam');

  ls.stdout.on('data', (data) => {

    console.log('BWA_METH',`stdout: ${data}`)
    socketio.emit('msg',`stdout: ${data}`)
  });

  ls.stderr.on('data', (data) => {
    console.log('BWA_METH',`stderr: ${data}`)
    socketio.emit('msg',`stderr: ${data}`);

  });

  ls.on('close', (code) => {
    socketio.emit('msg',`close: child process exited with code ${code}`)
    console.log(`child process exited with code ${code}`);
    //res.sendFile('/Users/chunyiliu/projects/pipeline/trim/test1.fastq_trimming_report.txt');
    //res.send({ express: 'Hello From BWA_METH' });
  });

  const ls2 = exec('picard -Xmx32G SortSam INPUT=../pipeline/BWA/bwa_test.filter.bam OUTPUT=../pipeline/BWA/bwa_test.sort.bam SORT_ORDER=coordinate')

  ls2.stdout.on('data', (data) => {

    console.log('BWA_METH',`stdout: ${data}`)
    socketio.emit('msg',`stdout: ${data}`)
  });

  ls2.stderr.on('data', (data) => {
    console.log('BWA_METH',`stderr: ${data}`)
    socketio.emit('msg',`stderr: ${data}`);

  });

  ls2.on('close', (code) => {
    socketio.emit('msg',`close: child process exited with code ${code}`)
    console.log(`child process exited with code ${code}`);
    //res.sendFile('/Users/chunyiliu/projects/pipeline/trim/test1.fastq_trimming_report.txt');
    //res.send({ express: 'Hello From BWA_METH_extract' });
  });

  const ls3 = exec('samtools index ../pipeline/BWA/bwa_test.sort.bam')

  ls3.stdout.on('data', (data) => {

    console.log('BWA_METH',`stdout: ${data}`)
    socketio.emit('msg',`stdout: ${data}`)
  });

  ls3.stderr.on('data', (data) => {
    console.log('BWA_METH',`stderr: ${data}`)
    socketio.emit('msg',`stderr: ${data}`);

  });

  l3.on('close', (code) => {
    socketio.emit('msg',`close: child process exited with code ${code}`)
    console.log(`child process exited with code ${code}`);
    //res.sendFile('/Users/chunyiliu/projects/pipeline/trim/test1.fastq_trimming_report.txt');
    //res.send({ express: 'Hello From BWA_METH_extract' });
  });

  const ls4 = exec('MethylDackel extract ../geno/hg38.fa --CHH --CHG ../pipeline/BWA/bwa_test.sort.bam')

  ls4.stdout.on('data', (data) => {

    console.log('BWA_METH',`stdout: ${data}`)
    socketio.emit('msg',`stdout: ${data}`)
  });

  ls4.stderr.on('data', (data) => {
    console.log('BWA_METH',`stderr: ${data}`)
    socketio.emit('msg',`stderr: ${data}`);

  });

  l4.on('close', (code) => {
    socketio.emit('msg',`close: child process exited with code ${code}`)
    console.log(`child process exited with code ${code}`);
    //res.sendFile('/Users/chunyiliu/projects/pipeline/trim/test1.fastq_trimming_report.txt');
    res.send({ express: 'Hello From BWA_METH_extract' });
  });
});

app.get('/api/BS_seek2_extract', (req, res) => {
  const ls = spawn('bs_seeker2-align.py', ['-1', '../pipeline/trim/test1_val_1.fq', '-2', '../pipeline/trim/test2_val_2.fq', '--aligner=bowtie2',
   '--bt2-p', '19', '--bt2--mm','-o', '../pipeline/BSresult/test_bs2.bam', '-f',
   'bam', '-g', '../geno/hg38_bs2/grch38_core_and_bs_controls.fa', '-d', '../geno/hg38_bs2', '--temp_dir=../pipeline/temp']);

  ls.stdout.on('data', (data) => {

    console.log('BS_seek2',`stdout: ${data}`)
    socketio.emit('msg',`stdout: ${data}`)
  });

  ls.stderr.on('data', (data) => {
    console.log('BS_seek2',`stderr: ${data}`)
    socketio.emit('msg',`stderr: ${data}`);

  });

  ls.on('close', (code) => {
    socketio.emit('msg',`close: child process exited with code ${code}`)
    console.log(`child process exited with code ${code}`);
    //res.sendFile('/Users/chunyiliu/projects/pipeline/trim/test1.fastq_trimming_report.txt');
    res.send({ express: 'Hello From BS_seek2' });
  });
});

app.get('/api/BitmapperBS_extract', (req, res) => {
  // const ls = spawn('../BitmapperBS/BitmapperBS', ['--search', './geno/hg38_bitmapper/grch38_core_and_bs_controls.fa', '--sensitive', '-e', '0.1',
  //  '--seq1', '../pipeline/trim/test1_val_1.fq', '--seq2', '../pipeline/trim/test2_val_2.fq', '--pe', '--bam', '-o','../../pipeline/bitmapperResult/test_bitmapper.bam']);
  const ls = exec('cd ../BitMapperBS/ && ./bitmapperBS --search ../geno/hg38_bitmapper/grch38_core_and_bs_controls.fa --sensitive -e 0.1 --seq1 ../pipeline/trim/test1_val_1.fq --seq2 ../pipeline/trim/test2_val_2.fq --pe --bam -o ../pipeline/bitmapperResult/test_bitmapper.bam')

  ls.stdout.on('data', (data) => {

    console.log('BitmapperBS',`stdout: ${data}`)
    socketio.emit('msg',`stdout: ${data}`)
  });

  ls.stderr.on('data', (data) => {
    console.log('BitmapperBS',`stderr: ${data}`)
    socketio.emit('msg',`stderr: ${data}`);

  });

  ls.on('close', (code) => {
    socketio.emit('msg',`close: child process exited with code ${code}`)
    console.log(`child process exited with code ${code}`);
    //res.sendFile('/Users/chunyiliu/projects/pipeline/trim/test1.fastq_trimming_report.txt');
    res.send({ express: 'Hello From BitmapperBS' });
  });
});

app.get('/api/gemBS_extract', (req, res) => {
  //const ls = spawn('gemBS', ['map']);
  const ls = exec('cd //home/cliu3322/gemBS/prepare/ && gemBS prepare -c example.conf -t example.csv && gemBS map&& gemBS call && gemBS extract && gemBS map-report && gemBS call-report')
  ls.stdout.on('data', (data) => {

    console.log('gemBS',`stdout: ${data}`)
    socketio.emit('msg',`stdout: ${data}`)
  });

  ls.stderr.on('data', (data) => {
    console.log('gemBS',`stderr: ${data}`)
    socketio.emit('msg',`stderr: ${data}`);

  });

  ls.on('close', (code) => {
    socketio.emit('msg',`close: child process exited with code ${code}`)
    console.log(`child process exited with code ${code}`);
    //res.sendFile('/Users/chunyiliu/projects/pipeline/trim/test1.fastq_trimming_report.txt');
    res.send({ express: 'Hello From Express gemBS' });
  });
});


app.get('/api/Bismark_plot', (req, res) => {
  const ls = spawn('bismark', ['../geno', '-o','../pipeline/test_direction_result' , '-1', '../pipeline/trim/test1_val_1.fq',
  '-2', '../pipeline/trim/test2_val_2.fq', '--parallel', '4', '-p', '4', '--score_min', 'L,0,-0.6', '--non_directional']);

  ls.stdout.on('data', (data) => {

    console.log('Bismark',`stdout: ${data}`)
    socketio.emit('msg',`stdout: ${data}`)
  });

  ls.stderr.on('data', (data) => {
    console.log('Bismark',`stderr: ${data}`)
    socketio.emit('msg',`stderr: ${data}`);

  });

  ls.on('close', (code) => {
    socketio.emit('msg',`close: child process exited with code ${code}`)
    console.log(`child process exited with code ${code}`);
    //res.sendFile('/Users/chunyiliu/projects/pipeline/trim/test1.fastq_trimming_report.txt');
    res.send({ express: 'Hello From Bismark' });
  });
});

app.get('/api/BWA_METH_plot', (req, res) => {
  const ls = exec('bwameth.py --threads 16 --reference ../geno/hg38.fa ../pipeline/trim/test1_val_1.fq ../pipeline/trim/test2_val_2.fq > ../pipeline/BWA-METH/bwa_test.sam')

  ls.stdout.on('data', (data) => {

    console.log('BWA_METH',`stdout: ${data}`)
    socketio.emit('msg',`stdout: ${data}`)
  });

  ls.stderr.on('data', (data) => {
    console.log('BWA_METH',`stderr: ${data}`)
    socketio.emit('msg',`stderr: ${data}`);

  });

  ls.on('close', (code) => {
    socketio.emit('msg',`close: child process exited with code ${code}`)
    console.log(`child process exited with code ${code}`);
    //res.sendFile('/Users/chunyiliu/projects/pipeline/trim/test1.fastq_trimming_report.txt');
    res.send({ express: 'Hello From BWA_METH' });
  });
});

app.get('/api/BS_seek2_plot', (req, res) => {
  const ls = spawn('bs_seeker2-align.py', ['-1', '../pipeline/trim/test1_val_1.fq', '-2', '../pipeline/trim/test2_val_2.fq', '--aligner=bowtie2',
   '--bt2-p', '19', '--bt2','--mm','-o', '../pipeline/BSresult/test_bs2.bam', '-f',
   'bam', '-g', '../geno/hg38_bs2/grch38_core_and_bs_controls.fa', '-d', '../geno/hg38_bs2', '--temp_dir=../pipeline/temp']);

  ls.stdout.on('data', (data) => {

    console.log('BS_seek2',`stdout: ${data}`)
    socketio.emit('msg',`stdout: ${data}`)
  });

  ls.stderr.on('data', (data) => {
    console.log('BS_seek2',`stderr: ${data}`)
    socketio.emit('msg',`stderr: ${data}`);

  });

  ls.on('close', (code) => {
    socketio.emit('msg',`close: child process exited with code ${code}`)
    console.log(`child process exited with code ${code}`);
    //res.sendFile('/Users/chunyiliu/projects/pipeline/trim/test1.fastq_trimming_report.txt');
    res.send({ express: 'Hello From BS_seek2' });
  });
});

app.get('/api/BitmapperBS_plot', (req, res) => {
  // const ls = spawn('../BitmapperBS/BitmapperBS', ['--search', './geno/hg38_bitmapper/grch38_core_and_bs_controls.fa', '--sensitive', '-e', '0.1',
  //  '--seq1', '../pipeline/trim/test1_val_1.fq', '--seq2', '../pipeline/trim/test2_val_2.fq', '--pe', '--bam', '-o','../../pipeline/bitmapperResult/test_bitmapper.bam']);
  const ls = exec('cd ../BitMapperBS/ && ./bitmapperBS --search ../geno/hg38_bitmapper/grch38_core_and_bs_controls.fa --sensitive -e 0.1 --seq1 ../pipeline/trim/test1_val_1.fq --seq2 ../pipeline/trim/test2_val_2.fq --pe --bam -o ../pipeline/bitmapperResult/test_bitmapper.bam')

  ls.stdout.on('data', (data) => {

    console.log('BitmapperBS',`stdout: ${data}`)
    socketio.emit('msg',`stdout: ${data}`)
  });

  ls.stderr.on('data', (data) => {
    console.log('BitmapperBS',`stderr: ${data}`)
    socketio.emit('msg',`stderr: ${data}`);

  });

  ls.on('close', (code) => {
    socketio.emit('msg',`close: child process exited with code ${code}`)
    console.log(`child process exited with code ${code}`);
    //res.sendFile('/Users/chunyiliu/projects/pipeline/trim/test1.fastq_trimming_report.txt');
    res.send({ express: 'Hello From BitmapperBS' });
  });
});

app.get('/api/gemBS_plot', (req, res) => {
  //const ls = spawn('gemBS', ['map']);
  const ls = exec('cd //home/cliu3322/gemBS/prepare/ && gemBS prepare -c example.conf -t example.csv && gemBS map&& gemBS call && gemBS extract && gemBS map-report && gemBS call-report')
  ls.stdout.on('data', (data) => {

    console.log('gemBS',`stdout: ${data}`)
    socketio.emit('msg',`stdout: ${data}`)
  });

  ls.stderr.on('data', (data) => {
    console.log('gemBS',`stderr: ${data}`)
    socketio.emit('msg',`stderr: ${data}`);

  });

  ls.on('close', (code) => {
    socketio.emit('msg',`close: child process exited with code ${code}`)
    console.log(`child process exited with code ${code}`);
    //res.sendFile('/Users/chunyiliu/projects/pipeline/trim/test1.fastq_trimming_report.txt');
    res.send({ express: 'Hello From Express gemBS' });
  });
});
