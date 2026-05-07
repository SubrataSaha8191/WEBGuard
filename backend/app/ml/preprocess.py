import pandas as pd

from app.utils.features import extract_features

df = pd.read_csv("data/urls.csv")

df = df.sample(20000, random_state=42)

processed_rows = []

for index, row in df.iterrows():

    url = row["URL"]
    label = row["Label"]

    try:
        features = extract_features(url)

        # Convert labels to binary
        features["label"] = 1 if label == "bad" else 0

        processed_rows.append(features)

    except Exception as e:
        print(f"Error processing URL: {url}")
        print(e)

# Create processed dataframe
processed_df = pd.DataFrame(processed_rows)

# Save processed features
processed_df.to_csv("data/processed_urls.csv", index=False)

print("\nPreprocessing Complete")
print(processed_df.head())
print(f"\nTotal processed rows: {len(processed_df)}")