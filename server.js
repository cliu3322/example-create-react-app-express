const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const { spawn, exec } = require('child_process');
const socketio = require('socket.io')(2000);
const cors = require('cors')

const fileUpload = require('express-fileupload');

const { lstatSync, readdirSync } = require('fs')
const { join } = require('path')

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


//projects
const isDirectory = source => lstatSync(source).isDirectory()
const getDirectories = source =>
  readdirSync(source).map(name => join(source, name)).filter(isDirectory)



var directorystr = '/datadrive/projects/'


app.get('/api/projects', (req, res) => {

  var list = getDirectories(directorystr)

  var result = list.map(x => x.replace(directorystr,''))

  res.json({result})
});

app.post('/api/world', (req, res) => {
  console.log('project', file)

  let uploadFile = req.files.file;


  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  uploadFile.mv(`/home/eric_liu/pipeline/uploads/${req.files.file.name}`,function(err) {
    if (err) {
      return res.send(err)
    }
    res.json({file:req.files.file.name})
  })
});



app.post('/api/handle', (req, res) => {

  var list = getDirectories(directorystr)

  var result = list.map(x => x.replace(directorystr,''))
  console.log('project',req.body)

  if(!result.includes(req.body.project.value)) {
    fs.mkdirSync(directorystr+req.body.project.value);
  }
  var str = ''
  switch(req.body.node) {
    case "trim":
      str = 'trim_galore -q 20 --stringency 5 --paired --length 20 -o /home/eric_liu/pipeline/trim /home/eric_liu/pipeline/uploads/test1.fastq /home/eric_liu/pipeline/uploads/test2.fastq'
      break;
    case 'bismark_alignment':
      str = 'bismark /datadrive -o /home/eric_liu/pipeline/bismarkResult/test.bam -2 /home/eric_liu/pipeline/trim/test1_val_1.fq -1 /home/eric_liu/pipeline/trim/test2_val_2.fq --parallel 4 -p 4 --score_min L,0,-0.6 --non_directional'
      break;
    case 'bwa_alignment':
      str = 'bwameth.py --threads 16 --reference /datadrive/hg38.fa /home/eric_liu/pipeline/trim/test1_val_1.fq /home/eric_liu/pipeline/trim/test2_val_2.fq > /home/eric_liu/pipeline/bwaResult/test.sam'
      break;
    case 'bsseek2_alignment':
      str = 'bs_seeker2-align.py -1 /home/eric_liu/pipeline/trim/test1_val_1.fq -2 /home/eric_liu/pipeline/trim/test2_val_2.fq --aligner=bowtie2 --bt2-p 19 --bt2--mm -o /home/eric_liu/pipeline/BSresult/test.bam -f bam -g /datadrive/hg38_bs2/grch38_core_and_bs_controls.fa -d /datadrive/hg38_bs2 --temp_dir=/home/eric_liu/pipeline/temp'
      break;
    case 'bitmapperBS_alignment':
      str = 'bitmapperBS --search /datadrive/hg38_bitmapper/grch38_core_and_bs_controls.fa --sensitive -e 0.1 --seq1 /home/eric_liu/pipeline/trim/test1_val_1.fq --seq2 /home/eric_liu/pipeline/trim/test2_val_2.fq --pe --bam -o /home/eric_liu/pipeline/bitmapperResult/test.bam'
      break;
    case 'gemBS_alignment':
      str = 'gemBS prepare -c /home/eric_liu/pipeline/gembsprepare/example.conf -t /home/eric_liu/pipeline/gembsprepare/example.csv'
      str += ' && '+'gemBS map';
      str += ' && '+'gemBS call';
      break;
    case 'Bismark_extract':
      str = 'samtools view -@ 4 -b -h -F 0x04 -F 0x400 -F 512 -q 1 -f 0x02 /home/eric_liu/pipeline/bismarkResult/test2_val_2_bismark_bt2_pe.bam > /home/eric_liu/pipeline/bismarkResult/test.filter.bam';
      str += ' && '+'bismark_methylation_extractor --bedGraph --gzip --CX /home/eric_liu/pipeline/bismarkResult/test.filter.bam -o /home/eric_liu/pipeline/bismarkResult/bismark_methylation_extractor/';
      break;
    case 'bwa_extract':
      str = 'samtools view -@ 4 -b -h -F 0x04 -F 0x400 -F 512 -q 1 -f 0x02 /home/eric_liu/pipeline/bwaResult/test.sam > /home/eric_liu/pipeline/bwaResult/test.filter.bam';
      str += ' && '+'picard -Xmx32G SortSam INPUT= /home/eric_liu/pipeline/bwaResult/test.filter.bam OUTPUT=/home/eric_liu/pipeline/bwaResult/test.sort.bam SORT_ORDER=coordinate';
      str += ' && '+'samtools index /home/eric_liu/pipeline/bwaResult/test.sort.bam';
      str += ' && '+'MethylDackel extract /datadrive/hg38.fa --CHH --CHG /home/eric_liu/pipeline/bwaResult/test.sort.bam';
      break;
    case 'bsseek2_extract':
      str = 'samtools view -@ 4 -b -h -F 0x04 -F 0x400 -F 512 -q 1 -f 0x02 /home/eric_liu/pipeline/BSresult/test.bam > /home/eric_liu/pipeline/BSresult/test.filter.bam';
      str += ' && '+'picard -Xmx32G SortSam INPUT= /home/eric_liu/pipeline/BSresult/test.filter.bam OUTPUT=/home/eric_liu/pipeline/BSresult/test.sort.bam SORT_ORDER=coordinate';
      str += ' && '+'samtools index /home/eric_liu/pipeline/BSresult/test.sort.bam';
      str += ' && '+'MethylDackel extract /datadrive//hg38_bs2/grch38_core_and_bs_controls.fa --CHH --CHG /home/eric_liu/pipeline/BSresult/test.sort.bam';
      break;
    case 'bitmapperBS_extract':
      str = 'samtools view -@ 4 -b -h -F 0x04 -F 0x400 -F 512 -q 1 -f 0x02 /home/eric_liu/pipeline/bitmapperResult/test.bam > /home/eric_liu/pipeline/bitmapperResult/test.filter.bam';
      str += ' && '+'picard -Xmx32G SortSam INPUT= /home/eric_liu/pipeline/bitmapperResult/test.filter.bam OUTPUT=/home/eric_liu/pipeline/bitmapperResult/test.sort.bam SORT_ORDER=coordinate';
      str += ' && '+'samtools index /home/eric_liu/pipeline/bitmapperResult/test.sort.bam';
      str += ' && '+'MethylDackel extract /datadrive/hg38_bitmapper/grch38_core_and_bs_controls.fa --CHH --CHG /home/eric_liu/pipeline/bitmapperResult/test.sort.bam';
      break;
    case 'gemBS_extract':
      str = 'gemBS call';
      str += ' && '+'gemBS extract';
      break;
    case 'gemBS_extract':
      str = 'gemBS call';
      str += ' && '+'gemBS extract';
      break;
    case 'Bismark_goleft':
      str = 'goleft indexcov --d /home/eric_liu/pipeline/bwaResult/goleftoutput /home/eric_liu/pipeline/bismarkResult/test2_val_2_bismark_bt2_pe.filter.bam';
      //confirm
      break;
    case 'bwa_goleft':
      str = 'goleft indexcov --d /home/eric_liu/pipeline/bwaResult/test.sort.bam';
      break;
    case 'bsseek2_goleft':
      str = 'goleft indexcov --d /home/eric_liu/pipeline/BSresult/test.sort.bam';
      break;
    case 'bitmapperBS_goleft':
      str = 'goleft indexcov --d /home/eric_liu/pipeline/bitmapperResult/test.sort.bam';
      break;
    case 'gemBS_report':
      str = 'gemBS map-report';
      str += ' && '+'gemBS call-report';
      break;
    case 'Bismark_correlation_plot':
      str = 'gunzip /home/eric_liu/pipeline/bismarkResult/bismark_methylation_extractor/test2_val_2_bismark_bt2_pe.filter.bismark.cov.gz';

      str += ' ; ' + 'awk \'{print $1 "\\t" $2 "\\t" $3 "\\t" $4/100 "\\t" $5+$6}\' /home/eric_liu/pipeline/bismarkResult/bismark_methylation_extractor/test2_val_2_bismark_bt2_pe.filter.bismark.cov > /home/eric_liu/pipeline/bismarkResult/bismark_methylation_extractor/test.bismark.bed';
      //confirm
      break;
    case 'bwa_correlation_plot':
      str = 'awk \'{print $1 "\\t" $2 "\\t" $3 "\\t" $4/100 "\\t" $5+$6}\' /home/eric_liu/pipeline/bwaResult/bwa_test.sort_CpG.bedGraph > /home/eric_liu/pipeline/bwaResult/test.bed';
      break;
    case 'bsseek2_correlation_plot':
      str = 'awk \'{print $1 "\\t" $2 "\\t" $3 "\\t" $4/100 "\\t" $5+$6}\' /home/eric_liu/pipeline/BSresult/test.sort_CpG.bedGraph > /home/eric_liu/pipeline/BSresult/test.bed';
      break;
    case 'bitmapperBS_correlation_plot':
      str = 'awk \'{print $1 "\\t" $2 "\\t" $3 "\\t" $4/100 "\\t" $5+$6}\' /home/eric_liu/pipeline/bitmapperResult/test.sort_CpG.bedGraph > /home/eric_liu/pipeline/bitmapperResult/test.bed';
      break;
    case 'gemBS_correlation_plot':
      str = 'sed \'1d\' /home/eric_liu/pipeline/gembsresult/extract/HG001_LAB01_REP01/HG001_LAB01_REP01_cpg.bed | awk \'{print $1 "\t" $2 "\t" $3 "\t" $11/100 "\t" $14}\' > /home/eric_liu/pipeline/gembsresult/test.bed';
      break;
    case 'intersect':
      str = 'bedtools intersect -a /home/eric_liu/pipeline/bismarkResult/bismark_methylation_extractor/test.bismark.bed -b /home/eric_liu/pipeline/bwaResult/test.bed -wa -wb > /home/eric_liu/pipeline/intersect/1.bed'
      str += ' && ' +'bedtools intersect -a /home/eric_liu/pipeline/BSresult/test.bed -b /home/eric_liu/pipeline/intersect/1.bed -wa -wb > /home/eric_liu/pipeline/intersect/2.bed'
      str += ' && ' +'bedtools intersect -a /home/eric_liu/pipeline/bitmapperResult/test.bed -b /home/eric_liu/pipeline/intersect/2.bed -wa -wb > /home/eric_liu/pipeline/intersect/3.bed'
      str += ' && ' +'bedtools intersect -a /home/eric_liu/pipeline/gembsresult/test.bed -b /home/eric_liu/pipeline/intersect/3.bed -wa -wb > /home/eric_liu/pipeline/intersect/intersect.bed'

      str += ' && ' +'awk \'{print $1 "\\t" $2 "\\t" $3 "\\t" $4 "\\t" $9 "\\t" $14 "\\t" $19 "\\t" $24}\' /home/eric_liu/pipeline/intersect/intersect.bed > /home/eric_liu/pipeline/intersect/correlation.bed'
      str += ' && ' +'sed "1i Sample5 Sample4 Sample3 Sample2 Sample1" /home/eric_liu/pipeline/intersect/correlation.bed > /home/eric_liu/pipeline/intersect/correlation.txt'

      str += ' && ' +'python /home/eric_liu/pipeline/txt_to_npz.py /home/eric_liu/pipeline/intersect/correlation.txt'
      str += ' && ' +'plotCorrelation -in /home/eric_liu/pipeline/intersect/correlation.txt.npz -c spearman -p heatmap -o /home/eric_liu/pipeline/intersect/output.pdf --plotNumbers'

      break;
  }
  console.log(str)
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
