## Coverage plot
	## First step: prepare plot files
FILES=/datadrive/projects/project2/pipeline/coverageplot/*.bed
for f in $FILES
do
	echo "Processing $f files..."
awk -F '\t' '   {c[$5]++}
                 END{
                     for (i in c) printf("%s\t%s\n",i,c[i])
                 }' $f > $f.count.txt
sort -g -k 1 $f.count.txt > $f.count.sort.txt
awk '{array[NR]=$2;sum+=$2} END {for(x=1; x<=NR; x++) printf "%2.2f\n", (100*array[x])/sum}' $f.count.sort.txt > $f.percentage.txt
paste $f.count.sort.txt $f.percentage.txt | awk '{print $1 "\t" $3}' | sed '1i coverage\tpercentage' > $f.percent.txt
rm $f.count.txt $f.count.sort.txt $f.percentage.txt
done
