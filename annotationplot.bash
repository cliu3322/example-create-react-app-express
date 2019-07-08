FILES=$1/*.bed
for f in $FILES
do
echo "Processing $f files..."
awk '{print $1 "\t" $2 "\t" $3}' $f > $f.annotation.bed
done

## Second step: Annotation use Homer ($f.annotation.bed only represent the file name, generated from the first step, the following steps are not part of the loop in the first step)
annotatePeaks.pl $f.annotation.bed hg38 > $f.annotation.txt
## Count tss
awk -F '\t' '   {c[$10]++}
               END{
                   for (i in c) printf("%s\t%s\n",i,c[i])
               }' $f.annotation.txt > $f.annotation.txt.tss.txt
awk '{if($1 > -5001 && $1 <5001){print $2 "\t" $1}}' $f.annotation.txt.tss.txt | sort -g -k 2 | sed "1i counts pos"> $f.tss.sort.txt
rm $f.annotation.txt.tss.txt
