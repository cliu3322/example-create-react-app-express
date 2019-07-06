library(ggfortify)
library(gplots)
library(ComplexHeatmap)

files = list.files(pattern="*HG002.*sort.txt")
data = read.delim(files[1], row.names = NULL)

for (i in 2:length(files)) {data = merge(data, read.delim(files[i],row.names = NULL), by="pos", all = T)}
data[is.na(data)] = 0

# for (i in 2:length(files)) {data = full_join(data, read.delim(files[i],row.names = NULL), by="pos", all = T)}

rownames(data) = data$pos

sample_names = sapply(files, function(x) { 
  sample = strsplit(x, '\\.annotation')[[1]][1]
  } )

sample_names = rev(sample_names)
colnames(data) = c("pos", sample_names)

length.matrix = as.matrix(data[, -1])
length.matrix = sweep(length.matrix, 2, colSums(length.matrix), `/`)
max_length = 5000
rowlabels = c(rep("", max_length*2 + 1))
increments = seq(-max_length, max_length, by=1000)
rowlabels[increments + max_length + 1] = increments

annotation.table = data.frame(sample=sample_names)
annotation.table$library = sapply(sample_names, function(x) {
  strsplit(x, "_")[[1]][1]
})
annotation.table$pipeline = sapply(sample_names, function(x) {
  strsplit(x, "\\.", perl = TRUE)[[1]][2]
})
annotation.table = annotation.table[,-1]

anno = HeatmapAnnotation(df = annotation.table, 
                       col = list(library = c("MethylSeq" = "black", "SplAT" = "orange", "TruSeq" = "olivedrab", "Microarray" = "grey"),
                                  pipeline = c("bismark" = "dodgerblue", "bwa" = "red4", "bitmapper" = "darkorange1", "gembs" = "grey64", "bs2" = "olivedrab3", "microarray" = "mediumorchid2")))


length.matrix = length.matrix[1:(max_length*2+1),]
colnames(length.matrix) = sample_names
rownames(length.matrix) = rowlabels

Heatmap(length.matrix, name = "Counts", cluster_rows=F, show_row_dend=F, top_annotation = anno, show_column_names=F)
