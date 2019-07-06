library(ggfortify)
library(gplots)
library(dplyr)
library(tidyr)

data = data.frame(sample=character(), library=character(), pipeline=character(), 
                  annotation=character(), counts=double(), proportion=double())
files = list.files(pattern=".*\\.txt")

for (i in 1:length(files)) {
  file = files[i]
  anno = read.delim(file, stringsAsFactors = F)
  anno$Annotation[is.na(anno$Annotation)] = "Unannotable"
  anno$clean_annotation = sapply(anno$Annotation, function(x) {
    first = strsplit(x, ' ')[[1]][1]
    
    if (first == "exon") {
      return("Exon")
    } else if (first == "intron") {
      return("Intron")
    } else if (first == "Intergenic") {
      return("Intergenic")
    } else if (first == "non-coding") {
      return("Non-coding")
    } else if (first == "promoter-TSS") {
      return("Promoter-TSS")
    } else if (first == "TTS") {
      return("TTS")
    } else if (first == "3'") {
      return("3' UTR")
    } else if (first == "5'") {
      return("5' UTR")
    } else if (first == "Unannotable") {
      return("Unannotable")
    } else {
      return(x)
    }
  })
  
  anno_counts = anno %>% group_by(clean_annotation) %>% tally()
  colnames(anno_counts) = c("annotation", "count")
  anno_counts$proportion = anno_counts$count / sum(anno_counts$count)
  sample = regmatches(file, regexpr("HG00.", file, perl=T))
  library = strsplit(file, "_", perl = TRUE)[[1]][1]
  pipeline = strsplit(file, "\\.", perl = TRUE)[[1]][2]
  anno_counts = cbind(pipeline, anno_counts)
  anno_counts = cbind(library, anno_counts)
  anno_counts = cbind(sample, anno_counts)
  data = rbind(data, anno_counts)
}

save(data, file="data.RData")

data$library = as.factor(data$library)
bp = ggplot(data, aes(x=pipeline, y=proportion)) + geom_boxplot(aes(fill=pipeline))
b = bp + facet_grid(library ~ annotation) + theme(strip.text.x=element_text(size=8), axis.text=element_text(8), axis.text.x = element_text(angle = 45, hjust = 1))
ggsave("annotation_libarary.pdf", width = 50, height = 50, units = "cm")
p = bp + facet_grid(sample ~ annotation) + theme(strip.text.x=element_text(size=8), axis.text=element_text(8), axis.text.x = element_text(angle = 45, hjust = 1))
ggsave("annotation_sample.pdf", width = 50, height = 50, units = "cm")