bedtools intersect -a /datadrive/projects/project2/pipeline/intersect/bwareport.bed -b /datadrive/projects/project2/pipeline/intersect/bs2report.bed -wa -wb > 1.bed && bedtools intersect -a /datadrive/projects/project2/pipeline/intersect/bitmapperBSreport.bed -b /datadrive/projects/project2/pipeline/intersect/1.bed -wa -wb > intersect.bed && awk '{print $4 "\t" $9 "\t" $14}' /datadrive/projects/project2/pipeline/intersect/intersect.bed > /datadrive/projects/project2/pipeline/intersect/correlation.bed && sed "1i Sample3 Sample2 Sample1" /datadrive/projects/project2/pipeline/intersect/correlation.bed > /datadrive/projects/project2/pipeline/intersect/correlation.txt && python txt_to_npz.py /datadrive/projects/project2/pipeline/intersect/correlation.txt && plotCorrelation -in /datadrive/projects/project2/pipeline/intersect/correlation.txt.npz -c spearman -p heatmap -o /datadrive/projects/project2/pipeline/intersect/correlation.pdf --plotNumbers



sed '1d' /datadrive/projects/project2/pipeline/bwaResult/test.sort_CpG.bedGraph

	defiant -c 1 -p 0.01 -L bitmapperBSreport,bs2report,bwareport -i /datadrive/projects/project2/pipeline/methylationregionanalysis/bitmapperBSreport.bed.txt /datadrive/projects/project2/pipeline/methylationregionanalysis/bs2report.bed.txt /datadrive/projects/project2/pipeline/methylationregionanalysis/bwareport.bed.txt


FILES=/datadrive/projects/project2/pipeline/annotationplot/*.bed && cd /datadrive/projects/project2/pipeline/annotationplot && Rscript ./tss.R && cd /datadrive/projects/project2/pipeline/annotationplot && Rscript ./annotation.R && cd -

bedtools intersect -a /home/eric_liu/pipeline/test_direction_result/bismark_methylation_extractor/test.bismark.bed -b /home/eric_liu/pipeline/BWA/test.bed -wa -wb > /home/eric_liu/pipeline/intersect/1.bed
bedtools intersect -a /home/eric_liu/pipeline/BSresult/test.bed -b /home/eric_liu/pipeline/intersect/1.bed -wa -wb > /home/eric_liu/pipeline/intersect/2.bed
bedtools intersect -a /home/eric_liu/pipeline/bitmapperResult/test.bed -b /home/eric_liu/pipeline/intersect/2.bed -wa -wb > /home/eric_liu/pipeline/intersect/3.bed
bedtools intersect -a /home/eric_liu/pipeline/gembsresult/test.bed -b /home/eric_liu/pipeline/intersect/3.bed -wa -wb > /home/eric_liu/pipeline/intersect/intersect.bed

awk '{print $1 "\t" $2 "\t" $3 "\t" $4 "\t" $9 "\t" $14 "\t" $19 "\t" $24}' /home/eric_liu/pipeline/intersect/intersect.bed > /home/eric_liu/pipeline/intersect/correlation.bed
sed "1i Sample5 Sample4 Sample3 Sample2 Sample1" /home/eric_liu/pipeline/intersect/correlation.bed > /home/eric_liu/pipeline/intersect/correlation.txt

python /home/eric_liu/pipeline/txt_to_npz.py /home/eric_liu/pipeline/intersect/correlation.txt
# Error message
# Traceback (most recent call last):
#   File "/home/eric_liu/pipeline/txt_to_npz.py", line 8, in <module>
#     matrix = np.loadtxt(file, skiprows=1)
#   File "/home/eric_liu/.local/lib/python3.6/site-packages/numpy/lib/npyio.py", line 1086, in loadtxt
#     next(fh)
# StopIteration

plotCorrelation -in /home/eric_liu/pipeline/intersect/correlation.txt.npz -c spearman -p heatmap -o /home/eric_liu/pipeline/intersect/output.pdf --plotNumbers


sed '1d' /home/eric_liu/pipeline/gembsresult/extract/HG001_LAB01_REP01/HG001_LAB01_REP01_cpg.bed | awk '{print $1 "\t" $2 "\t" $3 "\t" $11/100 "\t" $14}' > /home/eric_liu/pipeline/gembsresult/test.bed

gunzip -f /home/eric_liu/pipeline/gembsresult/extract/HG001_LAB01_REP01/HG001_LAB01_REP01_cpg.bed.gz


awk '{print $1 "\t" $2 "\t" $3 "\t" $4/100 "\t" $5+$6}' /home/eric_liu/pipeline/bitmapperResult/test.sort_CpG.bedGraph > /home/eric_liu/pipeline/bitmapperResult/test.bed

sed '1d' | awk '{print $1 "\t" $2 "\t" $3 "\t" $4/100 "\t" $5+$6}' /home/eric_liu/pipeline/BSresult/test.sort_CpG.bedGraph > /home/eric_liu/pipeline/BSresult/test.bed

sed '1d' | awk '{print $1 "\t" $2 "\t" $3 "\t" $4/100 "\t" $5+$6}' /home/eric_liu/pipeline/BWA/bwa_test.sort_CpG.bedGraph > /home/eric_liu/pipeline/BWA/test.bed
##sed will stuck the system |

awk '{print $1 "\t" $2 "\t" $3 "\t" $4/100 "\t" $5+$6}' /home/eric_liu/pipeline/test_direction_result/bismark_methylation_extractor/test2_val_2_bismark_bt2_pe.filter.bismark.cov > /home/eric_liu/pipeline/test_direction_result/bismark_methylation_extractor/test.bismark.bed
## no zero
gunzip -f /home/eric_liu/pipeline/test_direction_result/bismark_methylation_extractor/test2_val_2_bismark_bt2_pe.filter.bismark.cov.gz

MethylDackel extract /datadrive/hg38.fa --CHH --CHG /home/eric_liu/pipeline/BSresult/test.sort.bam

goleft indexcov --d /home/eric_liu/pipeline/BWA/goleftoutput /home/eric_liu/pipeline/BWA/bwa_test.sort.bam

MethylDackel extract /datadrive/hg38.fa --CHH --CHG /home/eric_liu/pipeline/BWA/bwa_test.sort.bam

samtools index /home/eric_liu/pipeline/BWA/bwa_test.sort.bam

picard -Xmx32G SortSam INPUT= /home/eric_liu/pipeline/BWA/bwa_test.filter.bam OUTPUT=/home/eric_liu/pipeline/BWA/bwa_test.sort.bam SORT_ORDER=coordinate

samtools view -@ 4 -b -h -F 0x04 -F 0x400 -F 512 -q 1 -f 0x02 /home/eric_liu/pipeline/BWA/bwa_test.sam > /home/eric_liu/pipeline/BWA/bwa_test.filter.bam

gunzip /home/eric_liu/pipeline/test_direction_result/bismark_methylation_extractor/test2_val_2_bismark_bt2_pe.filter.bismark.cov.gz  ; awk '{print $1 "\t" $2 "\t" $3 "\t" $4/100 "\t" $5+$6}' /home/eric_liu/pipeline/test_direction_result/bismark_methylation_extractor/test2_val_2_bismark_bt2_pe.filter.bismark.cov > /home/eric_liu/pipeline/test_direction_result/bismark_methylation_extractor/test.bismark.bed



bismark_methylation_extractor --bedGraph --gzip --CX /home/eric_liu/pipeline/test_direction_result/test2_val_2_bismark_bt2_pe.filter.bam -o /home/eric_liu/pipeline/test_direction_result/bismark_methylation_extractor/

samtools view -@ 4 -b -h -F 0x04 -F 0x400 -F 512 -q 1 -f 0x02 /home/eric_liu/pipeline/test_direction_result/test2_val_2_bismark_bt2_pe.bam > /home/eric_liu/pipeline/test_direction_result/test2_val_2_bismark_bt2_pe.filter.bam

gemBS prepare -c /home/eric_liu/pipeline/gembsprepare/example.conf -t /home/eric_liu/pipeline/gembsprepare/example.csv
gemBS map
gemBS call
gemBS extract
gemBS map-report
gemBS call-report

##biology meaning


bitmapperBS --search /datadrive/hg38_bitmapper/grch38_core_and_bs_controls.fa --sensitive -e 0.1 --seq1 /home/eric_liu/pipeline/trim/test1_val_1.fq --seq2 /home/eric_liu/pipeline/trim/test2_val_2.fq --pe --bam -o /home/eric_liu/pipeline/bitmapperResult/test_bitmapper.bam

bs_seeker2-align.py -1 /home/eric_liu/pipeline/trim/test1_val_1.fq -2 /home/eric_liu/pipeline/trim/test2_val_2.fq --aligner=bowtie2 --bt2-p 19 --bt2--mm -o /home/eric_liu/pipeline/BSresult/test_bs2.bam -f bam -g /datadrive/hg38_bs2/grch38_core_and_bs_controls.fa -d /datadrive/hg38_bs2 --temp_dir=/home/eric_liu/pipeline/temp

bwameth.py --threads 16 --reference /datadrive/hg38.fa /home/eric_liu/pipeline/trim/test1_val_1.fq /home/eric_liu/pipeline/trim/test2_val_2.fq > /home/eric_liu/pipeline/BWA/bwa_test.sam


bismark /datadrive -o /home/eric_liu/pipeline/test_direction_result -2 /home/eric_liu/pipeline/trim/test1_val_1.fq -1 /home/eric_liu/pipeline/trim/test2_val_2.fq --parallel 4 -p 4 --score_min L,0,-0.6 --non_directional


trim_galore -q 20 --stringency 5 --paired --length 20 -o /home/eric_liu/pipeline/trim /home/eric_liu/pipeline/uploads/test1.fastq /home/eric_liu/pipeline/uploads/test2.fastq



/datadrive
/home/eric_liu/pipeline/'''


bwameth.py index /datadrive/hg38.fa


gemBS prepare -c /home/eric_liu/pipeline/gembsprepare/example.conf -t /home/eric_liu/pipeline/gembsprepare/example.csv


          /home/eric_liu/pipeline/test_direction_result/bismark_methylation_extractor/test2_val_2_bismark_bt2_pe.filter.bismark.cov.gz

gunzip -f /home/eric_liu/pipeline/test_direction_result/bismark_methylation_extractor/test2_val_2_bismark_bt2_pe.filter.bismark.cov.gz  && awk '{print $1 "	" $2 "	" $3 "	" $4/100 "	" $5+$6}' /home/eric_liu/pipeline/test_direction_result/bismark_methylation_extractor/test2_val_2_bismark_bt2_pe.filter.bismark.cov > /home/eric_liu/pipeline/test_direction_result/bismark_methylation_extractor/test.bismark.bed


awk '{print $4 "\t" $9}' /home/eric_liu/pipeline/intersect/1.bed > /home/eric_liu/pipeline/intersect/correlation.bed


sed "1i Sample5 Sample4" /home/eric_liu/pipeline/intersect/correlation.bed > /home/eric_liu/pipeline/intersect/correlation.txt
