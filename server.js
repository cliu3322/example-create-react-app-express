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
//var directorystr = '/Users/chunyiliu/projects'

app.get('/api/projects', (req, res) => {

  var list = getDirectories(directorystr)

  var result = list.map(x => x.replace(directorystr,''))

  res.json({result})
});

app.post('/api/world', (req, res) => {
  let uploadFile = req.files.file;

  var list = getDirectories(directorystr)

  var result = list.map(x => x.replace(directorystr,''))

  if(!result.includes(req.body.project)) {
    fs.mkdirSync(directorystr+req.body.project);
  }

  if(!getDirectories(directorystr+req.body.project).map(x => x.replace(directorystr+req.body.project+'/','')).includes('pipeline')) {
    fs.mkdirSync(directorystr+req.body.project+'/pipeline');
  }
  //console.log(getDirectories(directorystr+req.body.project+'/pipeline').map(x => x.replace(directorystr+req.body.project+'/pipeline/','')))
  if(!getDirectories(directorystr+req.body.project+'/pipeline').map(x => x.replace(directorystr+req.body.project+'/pipeline/','')).includes('uploads')) {
    fs.mkdirSync(directorystr+req.body.project+'/pipeline/uploads');
  }

  //console.log(`${directorystr+req.body.project}/pipeline/uploads/${req.files.file.name}`)
  uploadFile.mv(`${directorystr+req.body.project}/pipeline/uploads/${req.files.file.name}`,function(err) {
    console.log('inside')
    if (err) {
      return res.send(err)
    }
    res.json({file:req.files.file.name})
  })
});



app.post('/api/handle', (req, res) => {

  var str = ''

  if(!getDirectories(directorystr).map(x => x.replace(directorystr,'')).includes(req.body.project)) {
    fs.mkdirSync(directorystr+req.body.project);
  }

  if(!getDirectories(directorystr+req.body.project).map(x => x.replace(directorystr+req.body.project+'/','')).includes('pipeline')) {
    fs.mkdirSync(directorystr+req.body.project+'/pipeline');
  }

  switch(req.body.node) {
    case "trim":
      if(!getDirectories(directorystr+req.body.project+'/pipeline').map(x => x.replace(directorystr+req.body.project+'/pipeline/','')).includes('trim')) {
        fs.mkdirSync(directorystr+req.body.project+'/pipeline/trim');
        console.log(directorystr+req.body.project+'/pipeline/trim')
      }
      str = 'trim_galore -q 20 --stringency 5 --paired --length 20 -o ' + directorystr+req.body.project+'/pipeline/trim ' + directorystr+req.body.project+'/pipeline/uploads/test1.fastq ' + directorystr+req.body.project+'/pipeline/uploads/test2.fastq'
      break;
    case 'bismark_alignment':
      if(!getDirectories(directorystr+req.body.project+'/pipeline').map(x => x.replace(directorystr+req.body.project+'/pipeline/','')).includes('bismarkResult')) {
        fs.mkdirSync(directorystr+req.body.project+'/pipeline/bismarkResult');
        console.log(directorystr+req.body.project+'/pipeline/bismarkResult')
      }
      str = 'bismark /datadrive -o ' + directorystr+req.body.project+'/pipeline/bismarkResult/test -2 ' + directorystr+req.body.project+'/pipeline/trim/test1_val_1.fq -1 ' + directorystr+req.body.project+'/pipeline/trim/test2_val_2.fq --parallel 4 -p 4 --score_min L,0,-0.6 --non_directional'
      break;
    case 'bwa_alignment':
      if(!getDirectories(directorystr+req.body.project+'/pipeline').map(x => x.replace(directorystr+req.body.project+'/pipeline/','')).includes('bwaResult')) {
        fs.mkdirSync(directorystr+req.body.project+'/pipeline/bwaResult');
        console.log(directorystr+req.body.project+'/pipeline/bwaResult')
      }
      str = 'bwameth.py --threads 16 --reference /datadrive/hg38.fa ' + directorystr+req.body.project+'/pipeline/trim/test1_val_1.fq ' + directorystr+req.body.project+'/pipeline/trim/test2_val_2.fq > ' + directorystr+req.body.project+'/pipeline/bwaResult/test.sam'
      break;
    case 'bsseek2_alignment':
      if(!getDirectories(directorystr+req.body.project+'/pipeline').map(x => x.replace(directorystr+req.body.project+'/pipeline/','')).includes('temp')) {
        fs.mkdirSync(directorystr+req.body.project+'/pipeline/temp');
        console.log(directorystr+req.body.project+'/pipeline/temp')
      }
      if(!getDirectories(directorystr+req.body.project+'/pipeline').map(x => x.replace(directorystr+req.body.project+'/pipeline/','')).includes('BSresult')) {
        fs.mkdirSync(directorystr+req.body.project+'/pipeline/BSresult');
        console.log(directorystr+req.body.project+'/pipeline/BSresult')
      }
      str = 'bs_seeker2-align.py -1 ' + directorystr+req.body.project+'/pipeline/trim/test1_val_1.fq -2 ' + directorystr+req.body.project+'/pipeline/trim/test2_val_2.fq --aligner=bowtie2 --bt2-p 19 --bt2--mm -o ' + directorystr+req.body.project+'/pipeline/BSresult/test.bam -f bam -g /datadrive/hg38_bs2/grch38_core_and_bs_controls.fa -d /datadrive/hg38_bs2 --temp_dir=' + directorystr+req.body.project+'/pipeline/temp'
      break;
    case 'bitmapperBS_alignment':
      if(!getDirectories(directorystr+req.body.project+'/pipeline').map(x => x.replace(directorystr+req.body.project+'/pipeline/','')).includes('bitmapperResult')) {
        fs.mkdirSync(directorystr+req.body.project+'/pipeline/bitmapperResult');
        console.log(directorystr+req.body.project+'/pipeline/bitmapperResult')
      }
      str = 'bitmapperBS --search /datadrive/hg38_bitmapper/grch38_core_and_bs_controls.fa --sensitive -e 0.1 --seq1 ' + directorystr+req.body.project+'/pipeline/trim/test1_val_1.fq --seq2 ' + directorystr+req.body.project+'/pipeline/trim/test2_val_2.fq --pe --bam -o ' + directorystr+req.body.project+'/pipeline/bitmapperResult/test.bam'
      break;
    case 'gemBS_alignment':
      str = 'gemBS prepare -c ' + directorystr+req.body.project+'/pipeline/gembsprepare/example.conf -t ' + directorystr+req.body.project+'/pipeline/gembsprepare/example.csv'
      str += ' && '+'gemBS map';
      str += ' && '+'gemBS call';
      break;
    case 'Bismark_extract':
      str = 'samtools view -@ 4 -b -h -F 0x04 -F 0x400 -F 512 -q 1 -f 0x02 ' + directorystr+req.body.project+'/pipeline/bismarkResult/test/test2_val_2_bismark_bt2_pe.bam > ' + directorystr+req.body.project+'/pipeline/bismarkResult/test.filter.bam';
      str += ' && '+'bismark_methylation_extractor --bedGraph --gzip --zero_based ' + directorystr+req.body.project+'/pipeline/bismarkResult/test.filter.bam -o ' + directorystr+req.body.project+'/pipeline/bismarkResult/bismark_methylation_extractor/';
      str += ' && '+'gunzip -rf ' + directorystr+req.body.project+'/pipeline/bismarkResult/bismark_methylation_extractor/test.filter.bedGraph.gz';
      str += ' && '+'gunzip -rf ' + directorystr+req.body.project+'/pipeline/bismarkResult/bismark_methylation_extractor/test.filter.bismark.cov.gz';
      str += ' && ' + ' awk \'{print $1 "\\t" $2 "\\t" $3 "\\t" $4/100 "\\t" $5+$6}\' ' + directorystr + req.body.project + '/pipeline/bismarkResult/bismark_methylation_extractor/test.filter.bedGraph.gz.bismark.zero.cov > '+ directorystr + req.body.project + '/pipeline/bismarkResult/bismarkreport.bed';
      break;
    case 'bwa_extract':
      str = 'samtools view -@ 4 -b -h -F 0x04 -F 0x400 -F 512 -q 1 -f 0x02 ' + directorystr+req.body.project+'/pipeline/bwaResult/test.sam > ' + directorystr+req.body.project+'/pipeline/bwaResult/test.filter.bam';
      str += ' && '+'picard -Xmx32G SortSam INPUT= ' + directorystr+req.body.project+'/pipeline/bwaResult/test.filter.bam OUTPUT=' + directorystr+req.body.project+'/pipeline/bwaResult/test.sort.bam SORT_ORDER=coordinate';
      str += ' && '+'samtools index ' + directorystr+req.body.project+'/pipeline/bwaResult/test.sort.bam';
      str += ' && '+'MethylDackel extract /datadrive/hg38.fa --CHH --CHG ' + directorystr+req.body.project+'/pipeline/bwaResult/test.sort.bam';
      str += ' && ' +'sed \'1d\' | awk \'{print $1 "\\t" $2 "\\t" $3 "\\t" $4/100 "\\t" $5+$6}\' ' + directorystr + req.body.project + '/pipeline/bwaResult/test.sort_CpG.bedGraph > '+ directorystr + req.body.project + '/pipeline/bwaResult/bwareport.bed';
      break;
    case 'bsseek2_extract':
      str = 'samtools view -@ 4 -b -h -F 0x04 -F 0x400 -F 512 -q 1 -f 0x02 ' + directorystr+req.body.project+'/pipeline/BSresult/test.bam > ' + directorystr+req.body.project+'/pipeline/BSresult/test.filter.bam';
      str += ' && '+'picard -Xmx32G SortSam INPUT= ' + directorystr+req.body.project+'/pipeline/BSresult/test.filter.bam OUTPUT=' + directorystr+req.body.project+'/pipeline/BSresult/test.sort.bam SORT_ORDER=coordinate';
      str += ' && '+'samtools index ' + directorystr+req.body.project+'/pipeline/BSresult/test.sort.bam';
      str += ' && '+'MethylDackel extract /datadrive//hg38_bs2/grch38_core_and_bs_controls.fa --CHH --CHG ' + directorystr+req.body.project+'/pipeline/BSresult/test.sort.bam';
      str += ' && ' +'sed \'1d\' | awk \'{print $1 "\\t" $2 "\\t" $3 "\\t" $4/100 "\\t" $5+$6}\' ' + directorystr + req.body.project + '/pipeline/BSresult/test.sort_CpG.bedGraph > '+ directorystr + req.body.project + '/pipeline/BSresult/bs2report.bed';
      break;
    case 'bitmapperBS_extract':
      str = 'samtools view -@ 4 -b -h -F 0x04 -F 0x400 -F 512 -q 1 -f 0x02 ' + directorystr+req.body.project+'/pipeline/bitmapperResult/test.bam > ' + directorystr+req.body.project+'/pipeline/bitmapperResult/test.filter.bam';
      str += ' && '+'picard -Xmx32G SortSam INPUT= ' + directorystr+req.body.project+'/pipeline/bitmapperResult/test.filter.bam OUTPUT=' + directorystr+req.body.project+'/pipeline/bitmapperResult/test.sort.bam SORT_ORDER=coordinate';
      str += ' && '+'samtools index ' + directorystr+req.body.project+'/pipeline/bitmapperResult/test.sort.bam';
      str += ' && '+'MethylDackel extract /datadrive/hg38_bitmapper/grch38_core_and_bs_controls.fa --CHH --CHG ' + directorystr+req.body.project+'/pipeline/bitmapperResult/test.sort.bam';
      str += ' && ' +'sed \'1d\' | awk \'{print $1 "\\t" $2 "\\t" $3 "\\t" $4/100 "\\t" $5+$6}\' ' + directorystr + req.body.project + '/pipeline/bitmapperResult/test.sort_CpG.bedGraph > '+ directorystr + req.body.project + '/pipeline/bitmapperResult/bitmapperBSreport.bed';
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
      str = 'goleft indexcov --d ' + directorystr+req.body.project+'/pipeline/bwaResult/goleftoutput ' + directorystr+req.body.project+'/pipeline/bismarkResult/test2_val_2_bismark_bt2_pe.filter.bam';
      //confirm
      break;
    case 'bwa_goleft':
      str = 'goleft indexcov --d ' + directorystr+req.body.project+'/pipeline/bwaResult/test.sort.bam';
      break;
    case 'bsseek2_goleft':
      str = 'goleft indexcov --d ' + directorystr+req.body.project+'/pipeline/BSresult/test.sort.bam';
      break;
    case 'bitmapperBS_goleft':
      str = 'goleft indexcov --d ' + directorystr+req.body.project+'/pipeline/bitmapperResult/test.sort.bam';
      break;
    case 'gemBS_report':
      str = 'gemBS map-report';
      str += ' && '+'gemBS call-report';
      break;
    case 'Bismark_correlation_plot':
      str = 'gunzip ' + directorystr+req.body.project+'/pipeline/bismarkResult/bismark_methylation_extractor/test2_val_2_bismark_bt2_pe.filter.bismark.cov.gz';

      str += ' ; ' + 'awk \'{print $1 "\\t" $2 "\\t" $3 "\\t" $4/100 "\\t" $5+$6}\' ' + directorystr+req.body.project+'/pipeline/bismarkResult/bismark_methylation_extractor/test2_val_2_bismark_bt2_pe.filter.bismark.cov > ' + directorystr+req.body.project+'/pipeline/bismarkResult/bismark_methylation_extractor/test.bismark.bed';
      //confirm
      break;
    case 'bwa_correlation_plot':
      str = 'awk \'{print $1 "\\t" $2 "\\t" $3 "\\t" $4/100 "\\t" $5+$6}\' ' + directorystr+req.body.project+'/pipeline/bwaResult/bwa_test.sort_CpG.bedGraph > ' + directorystr+req.body.project+'/pipeline/bwaResult/test.bed';
      break;
    case 'bsseek2_correlation_plot':
      str = 'awk \'{print $1 "\\t" $2 "\\t" $3 "\\t" $4/100 "\\t" $5+$6}\' ' + directorystr+req.body.project+'/pipeline/BSresult/test.sort_CpG.bedGraph > ' + directorystr+req.body.project+'/pipeline/BSresult/test.bed';
      break;
    case 'bitmapperBS_correlation_plot':
      str = 'awk \'{print $1 "\\t" $2 "\\t" $3 "\\t" $4/100 "\\t" $5+$6}\' ' + directorystr+req.body.project+'/pipeline/bitmapperResult/test.sort_CpG.bedGraph > ' + directorystr+req.body.project+'/pipeline/bitmapperResult/test.bed';
      break;
    case 'gemBS_correlation_plot':
      str = 'sed \'1d\' ' + directorystr+req.body.project+'/pipeline/gembsresult/extract/HG001_LAB01_REP01/HG001_LAB01_REP01_cpg.bed | awk \'{print $1 "\t" $2 "\t" $3 "\t" $11/100 "\t" $14}\' > ' + directorystr+req.body.project+'/pipeline/gembsresult/test.bed';
      break;
    case 'intersect':
      str = 'bedtools intersect -a ' + directorystr+req.body.project+'/pipeline/bismarkResult/bismark_methylation_extractor/test.bismark.bed -b ' + directorystr+req.body.project+'/pipeline/bwaResult/test.bed -wa -wb > ' + directorystr+req.body.project+'/pipeline/intersect/1.bed'
      str += ' && ' +'bedtools intersect -a ' + directorystr+req.body.project+'/pipeline/BSresult/test.bed -b ' + directorystr+req.body.project+'/pipeline/intersect/1.bed -wa -wb > ' + directorystr+req.body.project+'/pipeline/intersect/2.bed'
      str += ' && ' +'bedtools intersect -a ' + directorystr+req.body.project+'/pipeline/bitmapperResult/test.bed -b ' + directorystr+req.body.project+'/pipeline/intersect/2.bed -wa -wb > ' + directorystr+req.body.project+'/pipeline/intersect/3.bed'
      str += ' && ' +'bedtools intersect -a ' + directorystr+req.body.project+'/pipeline/gembsresult/test.bed -b ' + directorystr+req.body.project+'/pipeline/intersect/3.bed -wa -wb > ' + directorystr+req.body.project+'/pipeline/intersect/intersect.bed'

      str += ' && ' +'awk \'{print $1 "\\t" $2 "\\t" $3 "\\t" $4 "\\t" $9 "\\t" $14 "\\t" $19 "\\t" $24}\' ' + directorystr+req.body.project+'/pipeline/intersect/intersect.bed > ' + directorystr+req.body.project+'/pipeline/intersect/correlation.bed'
      str += ' && ' +'sed "1i Sample5 Sample4 Sample3 Sample2 Sample1" ' + directorystr+req.body.project+'/pipeline/intersect/correlation.bed > ' + directorystr+req.body.project+'/pipeline/intersect/correlation.txt'

      str += ' && ' +'python ' + directorystr+req.body.project+'/pipeline/txt_to_npz.py ' + directorystr+req.body.project+'/pipeline/intersect/correlation.txt'
      str += ' && ' +'plotCorrelation -in ' + directorystr+req.body.project+'/pipeline/intersect/correlation.txt.npz -c spearman -p heatmap -o ' + directorystr+req.body.project+'/pipeline/intersect/output.pdf --plotNumbers'

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


app.post('/api/report', (req, res) => {

  var str = ''

  if(!getDirectories(directorystr).map(x => x.replace(directorystr,'')).includes(req.body.project)) {
    fs.mkdirSync(directorystr+req.body.project);
  }

  if(!getDirectories(directorystr+req.body.project).map(x => x.replace(directorystr+req.body.project+'/','')).includes('pipeline')) {
    fs.mkdirSync(directorystr+req.body.project+'/pipeline');
  }

  switch(req.body.report) {
    case "goleft":
      console.log(getDirectories(directorystr+req.body.project+'/pipeline').map(x => x.replace(directorystr+req.body.project+'/pipeline/','')))
      if(!getDirectories(directorystr+req.body.project+'/pipeline').map(x => x.replace(directorystr+req.body.project+'/pipeline/','')).includes('goleft')) {
        fs.mkdirSync(directorystr+req.body.project+'/pipeline/goleft');
      }

      str = 'goleft indexcov --d '+ directorystr+req.body.project+'/pipeline/goleft'
      if (req.body.reportmethod.includes('bismarkreport')) {
        fs.copyFileSync(directorystr+req.body.project+'/pipeline/bismarkResult/test.filter.bam',  directorystr+req.body.project+'/pipeline/goleft/'+'bismark.bam');
        str += ' ' + directorystr+req.body.project+'/pipeline/goleft/'+'bismark.bam';
      }
      if (req.body.reportmethod.includes('bwareport')) {
        fs.copyFileSync(directorystr+req.body.project+'/pipeline/bwaResult/test.sort.bam',  directorystr+req.body.project+'/pipeline/goleft/'+'bwa.bam');
        fs.copyFileSync(directorystr+req.body.project+'/pipeline/bwaResult/test.sort.bam.bai',  directorystr+req.body.project+'/pipeline/goleft/'+'bwa.bam.bai');
        str += ' ' + directorystr+req.body.project+'/pipeline/goleft/'+'bwa.bam';
      }

      if (req.body.reportmethod.includes('bs2report')) {
        fs.copyFileSync(directorystr+req.body.project+'/pipeline/BSresult/test.sort.bam',  directorystr+req.body.project+'/pipeline/goleft/'+'bs2.bam');
        fs.copyFileSync(directorystr+req.body.project+'/pipeline/BSresult/test.sort.bam.bai',  directorystr+req.body.project+'/pipeline/goleft/'+'bs2.bam.bai');
        str += ' ' + directorystr+req.body.project+'/pipeline/goleft/'+'bs2.bam';
      }

      if (req.body.reportmethod.includes('bitmapperBSreport')) {
        fs.copyFileSync(directorystr+req.body.project+'/pipeline/bitmapperResult/test.sort.bam',  directorystr+req.body.project+'/pipeline/goleft/'+'bs2.bam');
        fs.copyFileSync(directorystr+req.body.project+'/pipeline/bitmapperResult/test.sort.bam.bai',  directorystr+req.body.project+'/pipeline/goleft/'+'bs2.bam.bai');
        str += ' ' + directorystr+req.body.project+'/pipeline/goleft/'+'bitmapper.bam';
      }

      break;
    case 'intersect':
      if(!getDirectories(directorystr+req.body.project+'/pipeline').map(x => x.replace(directorystr+req.body.project+'/pipeline/','')).includes('intersect')) {
        fs.mkdirSync(directorystr+req.body.project+'/pipeline/intersect');
      }

      req.body.reportmethod.forEach((method, index) => {
          switch (method) {
            case 'bismarkreport':
              fs.copyFileSync(directorystr+req.body.project+'/pipeline/bismarkResult/'+method+'.bed',  directorystr+req.body.project+'/pipeline/intersect/'+method+'.bed');
              break;
            case 'bwareport':
              fs.copyFileSync(directorystr+req.body.project+'/pipeline/bwaResult/'+method+'.bed',  directorystr+req.body.project+'/pipeline/intersect/'+method+'.bed');
              break;
            case 'bs2report':
              fs.copyFileSync(directorystr+req.body.project+'/pipeline/BSresult/'+method+'.bed',  directorystr+req.body.project+'/pipeline/intersect/'+method+'.bed');
              break;
            case 'bitmapperBSreport':
              fs.copyFileSync(directorystr+req.body.project+'/pipeline/bitmapperResult/'+method+'.bed',  directorystr+req.body.project+'/pipeline/intersect/'+method+'.bed');
              break;
          }
      });

      if (req.body.reportmethod.length == 2) {
        str = 'bedtools intersect -a '+directorystr+req.body.project+'/pipeline/intersect/'+req.body.reportmethod[0] + '.bed -b '+directorystr+req.body.project+'/pipeline/intersect/' + req.body.reportmethod[1] + '.bed -wa -wb > '+directorystr+req.body.project+'/pipeline/intersect/intersect.bed';
        str += ' && ' +'awk \'{print $4 "\\t" $9}\' '+directorystr+req.body.project+'/pipeline/intersect/intersect.bed'+' > '+directorystr+req.body.project+'/pipeline/intersect/correlation.bed'
        str += ' && ' +'sed "1i Sample2 Sample1" '+directorystr+req.body.project+'/pipeline/intersect/correlation.bed > ' +directorystr+req.body.project+'/pipeline/intersect/correlation.txt'
      } else if (req.body.reportmethod.length = 3) {
        str = 'bedtools intersect -a '+directorystr+req.body.project+'/pipeline/intersect/'+req.body.reportmethod[0] + '.bed -b '+directorystr+req.body.project+'/pipeline/intersect/' + req.body.reportmethod[1] + '.bed -wa -wb > 1.bed';
        str += ' && ' +'bedtools intersect -a '+directorystr+req.body.project+'/pipeline/intersect/'+req.body.reportmethod[2] + '.bed -b '+directorystr+req.body.project+'/pipeline/intersect/1.bed -wa -wb > intersect.bed';
        str += ' && ' +'awk \'{print $4 "\\t" $9 "\\t" $14}\' '+directorystr+req.body.project+'/pipeline/intersect/intersect.bed'+' > '+directorystr+req.body.project+'/pipeline/intersect/correlation.bed'
        str += ' && ' +'sed "1i Sample3 Sample2 Sample1" '+directorystr+req.body.project+'/pipeline/intersect/correlation.bed > ' +directorystr+req.body.project+'/pipeline/intersect/correlation.txt'
      } else if (req.body.reportmethod.length = 4) {
        str = 'bedtools intersect -a '+directorystr+req.body.project+'/pipeline/intersect/'+req.body.reportmethod[0] + '.bed -b '+directorystr+req.body.project+'/pipeline/intersect/' + req.body.reportmethod[1] + '.bed -wa -wb > 1.bed';
        str += ' && ' +'bedtools intersect -a '+directorystr+req.body.project+'/pipeline/intersect/'+req.body.reportmethod[2] + '.bed -b '+directorystr+req.body.project+'/pipeline/intersect/1.bed -wa -wb > 2.bed';
        str += ' && ' +'bedtools intersect -a '+directorystr+req.body.project+'/pipeline/intersect/'+req.body.reportmethod[3] + '.bed -b '+directorystr+req.body.project+'/pipeline/intersect/2.bed -wa -wb > intersect.bed';
        str += ' && ' +'awk \'{print $4 "\\t" $9 "\\t" $14  "\\t" $19}\' '+directorystr+req.body.project+'/pipeline/intersect/intersect.bed'+' > '+directorystr+req.body.project+'/pipeline/intersect/correlation.bed'
        str += ' && ' +'sed "1i Sample4 Sample3 Sample2 Sample1" '+directorystr+req.body.project+'/pipeline/intersect/correlation.bed > ' +directorystr+req.body.project+'/pipeline/intersect/correlation.txt'
      } else if (req.body.reportmethod.length = 5) {
        str = 'bedtools intersect -a '+directorystr+req.body.project+'/pipeline/intersect/'+req.body.reportmethod[0] + '.bed -b '+directorystr+req.body.project+'/pipeline/intersect/' + req.body.reportmethod[1] + '.bed -wa -wb > 1.bed';
        str += ' && ' +'bedtools intersect -a '+directorystr+req.body.project+'/pipeline/intersect/'+req.body.reportmethod[2] + '.bed -b '+directorystr+req.body.project+'/pipeline/intersect/1.bed -wa -wb > 2.bed';
        str += ' && ' +'bedtools intersect -a '+directorystr+req.body.project+'/pipeline/intersect/'+req.body.reportmethod[3] + '.bed -b '+directorystr+req.body.project+'/pipeline/intersect/2.bed -wa -wb > 3.bed';
        str += ' && ' +'bedtools intersect -a '+directorystr+req.body.project+'/pipeline/intersect/'+req.body.reportmethod[4] + '.bed -b '+directorystr+req.body.project+'/pipeline/intersect/3.bed -wa -wb > intersect.bed';
        str += ' && ' +'awk \'{print $4 "\\t" $9 "\\t" $14  "\\t" $19 "\\t" $24}\' '+directorystr+req.body.project+'/pipeline/intersect/intersect.bed'+' > '+directorystr+req.body.project+'/pipeline/intersect/correlation.bed'
        str += ' && ' +'sed "1i Sample5 Sample4 Sample3 Sample2 Sample1" '+directorystr+req.body.project+'/pipeline/intersect/correlation.bed > ' +directorystr+req.body.project+'/pipeline/intersect/correlation.txt'
      }
      str += ' && ' +'python txt_to_npz.py '+directorystr+req.body.project+'/pipeline/intersect/correlation.txt'
      str += ' && ' +'plotCorrelation -in '+directorystr+req.body.project+'/pipeline/intersect/correlation.txt.npz -c spearman -p heatmap -o '+directorystr+req.body.project+'/pipeline/intersect/correlation.pdf --plotNumbers'

      break;
    case 'coverageplot':
      if(!getDirectories(directorystr+req.body.project+'/pipeline').map(x => x.replace(directorystr+req.body.project+'/pipeline/','')).includes('coverageplot')) {
        fs.mkdirSync(directorystr+req.body.project+'/pipeline/coverageplot');
        fs.copyFileSync('coverage__percentage_plot.R',  directorystr+req.body.project+'/pipeline/'+req.body.report+'/coverage__percentage_plot.R');
      }

      req.body.reportmethod.forEach((method, index) => {
        switch (method) {
          case 'bismarkreport':
            fs.copyFileSync(directorystr+req.body.project+'/pipeline/bismarkResult/'+method+'.bed',  directorystr+req.body.project+'/pipeline/'+req.body.report+'/'+method+'.bed');
            break;
          case 'bwareport':
            fs.copyFileSync(directorystr+req.body.project+'/pipeline/bwaResult/'+method+'.bed',  directorystr+req.body.project+'/pipeline/'+req.body.report+'/'+method+'.bed');
            break;
          case 'bs2report':
            fs.copyFileSync(directorystr+req.body.project+'/pipeline/BSresult/'+method+'.bed',  directorystr+req.body.project+'/pipeline/'+req.body.report+'/'+method+'.bed');
            break;
          case 'bitmapperBSreport':
            fs.copyFileSync(directorystr+req.body.project+'/pipeline/bitmapperResult/'+method+'.bed',  directorystr+req.body.project+'/pipeline/'+req.body.report+'/'+method+'.bed');
            break;
        }
      });

      str = 'sh coverageplot.bash && Rscript '+directorystr+req.body.project+'/pipeline/'+req.body.report+'/coverage__percentage_plot.R'
      str += ' && cd '+directorystr+req.body.project+'/pipeline/'+req.body.report
      str += ' && Rscript ./coverage__percentage_plot.R && cd -'
      break;
    case 'annotationplot':
      if(!getDirectories(directorystr+req.body.project+'/pipeline').map(x => x.replace(directorystr+req.body.project+'/pipeline/','')).includes(req.body.report)) {
        fs.mkdirSync(directorystr+req.body.project+'/pipeline/'+req.body.report);
        fs.copyFileSync('tss.R',  directorystr+req.body.project+'/pipeline/'+req.body.report+'/tss.R');
        fs.copyFileSync('annotation.R',  directorystr+req.body.project+'/pipeline/'+req.body.report+'/annotation.R');
      }

      req.body.reportmethod.forEach((method, index) => {
        switch (method) {
          case 'bismarkreport':
            fs.copyFileSync(directorystr+req.body.project+'/pipeline/bismarkResult/'+method+'.bed',  directorystr+req.body.project+'/pipeline/'+req.body.report+'/'+method+'.bed');
            break;
          case 'bwareport':
            fs.copyFileSync(directorystr+req.body.project+'/pipeline/bwaResult/'+method+'.bed',  directorystr+req.body.project+'/pipeline/'+req.body.report+'/'+method+'.bed');
            break;
          case 'bs2report':
            fs.copyFileSync(directorystr+req.body.project+'/pipeline/BSresult/'+method+'.bed',  directorystr+req.body.project+'/pipeline/'+req.body.report+'/'+method+'.bed');
            break;
          case 'bitmapperBSreport':
            fs.copyFileSync(directorystr+req.body.project+'/pipeline/bitmapperResult/'+method+'.bed',  directorystr+req.body.project+'/pipeline/'+req.body.report+'/'+method+'.bed');
            break;
        }
      });
      str = 'FILES='+directorystr+req.body.project+'/pipeline/'+req.body.report+'/*.bed'
      str = 'sh annotationplot.bash && Rscript '+directorystr+req.body.project+'/pipeline/'+req.body.report+'/tss.R'
      str += ' && cd '+directorystr+req.body.project+'/pipeline/'+req.body.report
      str += ' && Rscript ./annotation.R && cd -'
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
