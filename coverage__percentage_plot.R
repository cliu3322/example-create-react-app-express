library(ggfortify)
library(gplots)
library(dplyr)
library(tidyr)

files = list.files(pattern="*.txt")
data = read.delim(files[1], row.names = NULL)

for (i in 2:length(files)) {data = merge(data, read.delim(files[i],row.names = NULL), by="coverage", all = T)}
data[is.na(data)] = 0


sample_names = sapply(files, function(x) { 
  sample = strsplit(x, '\\.cov')[[1]][1]
  } )

sample_names = rev(sample_names)
colnames(data) = c("coverage", sample_names)
vector=c(30)
c=colSums(data[30:nrow(data),2:length(data)])
vector=append(vector, c, after = length(vector))
data=rbind(data[c(1:29),], vector)

mtlong = gather(data, key = "var", value = "value", -coverage) %>%
  group_by(var) 
names(mtlong)[2]="Sample"
mtlong$Library=mtlong$Sample
TruSeq= mtlong[grep("Tru", mtlong$Library),]
TruSeq$Library="TruSeq"
MethylSeq= mtlong[grep("Methyl", mtlong$Library),]
MethylSeq$Library="MethylSeq"
SplAT= mtlong[grep("SplAT", mtlong$Library),]
SplAT$Library="SplAT"
mtlong=rbind(MethylSeq, TruSeq, SplAT)
remove(MethylSeq, TruSeq, SplAT)
mtlong$Pipeline=sapply(mtlong$Sample, function(x) {
  strsplit(x, "\\.", perl = TRUE)[[1]][2]
})
mtlong$Sample=sapply(mtlong$Sample, function(x) {
  regmatches(x, regexpr("HG00.", x, perl=T))
})
mtlong = mtlong[mtlong$coverage <= 20,]

save(mtlong, file="data.RData")

## line plot
p = ggplot(mtlong, aes(x = coverage, y = value, colour = Library)) + 
  geom_smooth(span = 0.3, size = 1.5, se = FALSE) + scale_color_manual(values = c("dodgerblue", "red4", "darkorange1")) +
  scale_x_continuous(name = "Coverge", limits = c(0,20)) + scale_y_continuous(name = "Percentage %", limits = c(0,20)) 
p + facet_grid(Pipeline ~ Sample, scales = "free")
ggsave("coverage.pdf", width = 50, height = 50, units = "cm")


