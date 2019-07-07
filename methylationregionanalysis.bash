FILES= $0
for f in $FILES
do
	echo "Processing $f files..."
awk '{print $1 "\t" $2 "\t" $3 "\t" $4 "\t" $5}' $f > $f.txt
done
