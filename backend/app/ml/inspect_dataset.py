import pandas as pd

df = pd.read_csv("data/urls.csv")

print(df.head())

print("\nColumns:")
print(df.columns)

print("\nDataset Shape:")
print(df.shape)

print("\nLabel Distribution:")
print(df["Label"].value_counts())