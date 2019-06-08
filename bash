
goleft indexcov --d /home/eric_liu/pipeline/BWA/output /home/eric_liu/pipeline/BWA/bwa_test.sort.bam
##OUTPUT

samtools index /home/eric_liu/pipeline/BWA/bwa_test.sort.bam

picard -Xmx32G SortSam INPUT= /home/eric_liu/pipeline/BWA/bwa_test.filter.bam OUTPUT=/home/eric_liu/pipeline/BWA/bwa_test.sort.bam SORT_ORDER=coordinate

samtools view -@ 4 -b -h -F 0x04 -F 0x400 -F 512 -q 1 -f 0x02 /home/eric_liu/pipeline/BWA/bwa_test.sam > /home/eric_liu/pipeline/BWA/bwa_test.filter.bam

bismark_methylation_extractor --bedGraph --gzip --CX /home/eric_liu/pipeline/test_direction_result/test2_val_2_bismark_bt2_pe.filter.bam -o /home/eric_liu/pipeline/test_direction_result/bismark_methylation_extractor/

samtools view -@ 4 -b -h -F 0x04 -F 0x400 -F 512 -q 1 -f 0x02 /home/eric_liu/pipeline/test_direction_result/test2_val_2_bismark_bt2_pe.bam > /home/eric_liu/pipeline/test_direction_result/test2_val_2_bismark_bt2_pe.filter.bam

gemBS ##?

bitmapperBS --search /datadrive/hg38_bitmapper/grch38_core_and_bs_controls.fa --sensitive -e 0.1 --seq1 /home/eric_liu/pipeline/trim/test1_val_1.fq --seq2 /home/eric_liu/pipeline/trim/test2_val_2.fq --pe --bam -o /home/eric_liu/pipeline/bitmapperResult/test_bitmapper.bam

bs_seeker2-align.py -1 /home/eric_liu/pipeline/trim/test1_val_1.fq -2 /home/eric_liu/pipeline/trim/test2_val_2.fq --aligner=bowtie2 --bt2-p 19 --bt2--mm -o /home/eric_liu/pipeline/BSresult/test_bs2.bam -f bam -g /datadrive/hg38_bs2/grch38_core_and_bs_controls.fa -d /datadrive/hg38_bs2 --temp_dir=/home/eric_liu/pipeline/temp

bwameth.py --threads 16 --reference /datadrive/hg38.fa /home/eric_liu/pipeline/trim/test1_val_1.fq /home/eric_liu/pipeline/trim/test2_val_2.fq > /home/eric_liu/pipeline/BWA/bwa_test.sam


bismark /datadrive -o /home/eric_liu/pipeline/test_direction_result -2 /home/eric_liu/pipeline/trim/test1_val_1.fq -1 /home/eric_liu/pipeline/trim/test2_val_2.fq --parallel 4 -p 4 --score_min L,0,-0.6 --non_directional


trim_galore -q 20 --stringency 5 --paired --length 20 -o /home/eric_liu/pipeline/trim /home/eric_liu/pipeline/uploads/test1.fastq /home/eric_liu/pipeline/uploads/test2.fastq



/datadrive
/home/eric_liu/pipeline/'''


bwameth.py index /datadrive/hg38.fa


gemBS prepare -c /home/eric_liu/pipeline/gembsprepare/example.conf -t /home/eric_liu/pipeline/gembsprepare/example.csv
## where is the fucking input
