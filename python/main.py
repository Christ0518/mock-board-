import pandas as pd
import numpy as np

# Read the Excel file
df = pd.read_excel('file.xlsx')

# Display basic info
print("Column names:")
print(df.columns.tolist())
print("\nDataFrame shape:", df.shape)
print("\nFirst few rows:")
print(df.head())

# Convert to numpy array
array = df.to_numpy()
print("\n--- Converted to Array ---")
print("Array shape:", array.shape)
print("Array:")
print(array)

# Convert to list (2D array)
list_array = df.values.tolist()
print("\n--- Converted to List ---")
print("List array:")
print(list_array)

# Get specific columns as array (example with first column)
if len(df.columns) > 0:
    first_col_array = df.iloc[:, 0].to_numpy()
    print(f"\n--- First column '{df.columns[0]}' as array ---")
    print(first_col_array)