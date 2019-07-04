import numpy as np
import sys

if len(sys.argv) < 2:
	exit

file = sys.argv[1]
matrix = np.loadtxt(file, skiprows=1)
 
with open(file) as f:
	first_line = f.readline()
	header = first_line.split()

np.savez(file + ".npz", labels=header, matrix=matrix)
