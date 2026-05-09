import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader

# LOAD DATASET

df = pd.read_csv(
    "../datasets/phishing_dataset.csv"
)

# SMALLER SAMPLE FOR TRAINING SPEED
df = df.sample(
    30000,
    random_state=42
)

urls = df["URL"].astype(str)
labels = df["Label"]

# LABEL ENCODING

label_encoder = LabelEncoder()
labels = label_encoder.fit_transform(
    labels
)

# CHARACTER VOCAB

all_text = "".join(urls)

chars = sorted(
    list(set(all_text))
)

char_to_idx = {
    ch: idx + 1
    for idx, ch in enumerate(chars)
}

idx_to_char = {
    idx: ch
    for ch, idx in char_to_idx.items()
}

vocab_size = len(char_to_idx) + 1

MAX_LEN = 200

# ENCODE URLS

def encode_url(url):
    encoded = [
        char_to_idx.get(ch, 0)
        for ch in url[:MAX_LEN]
    ]

    # PADDING
    if len(encoded) < MAX_LEN:
        encoded += [0] * (
            MAX_LEN - len(encoded)
        )

    return encoded

X = np.array([
    encode_url(url)
    for url in urls
])

y = np.array(labels)

# TRAIN TEST SPLIT

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# DATASET CLASS

class URLDataset(Dataset):
    def __init__(self, X, y):
        self.X = torch.tensor(
            X,
            dtype=torch.long
        )
        self.y = torch.tensor(
            y,
            dtype=torch.float32
        )

    def __len__(self):
        return len(self.X)

    def __getitem__(self, idx):
        return (
            self.X[idx],
            self.y[idx]
        )

train_dataset = URLDataset(
    X_train,
    y_train
)

test_dataset = URLDataset(
    X_test,
    y_test
)

train_loader = DataLoader(
    train_dataset,
    batch_size=64,
    shuffle=True
)

test_loader = DataLoader(
    test_dataset,
    batch_size=64
)

# MODEL

class PhishingBiLSTM(nn.Module):

    def __init__(self):
        super().__init__()
        self.embedding = nn.Embedding(
            vocab_size,
            64,
            padding_idx=0
        )
        self.lstm = nn.LSTM(
            input_size=64,
            hidden_size=128,
            batch_first=True,
            bidirectional=True
        )
        self.dropout = nn.Dropout(
            0.3
        )
        self.fc = nn.Linear(
            256,
            1
        )
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        x = self.embedding(x)
        _, (hidden, _) = self.lstm(x)
        hidden = torch.cat(
            (
                hidden[-2],
                hidden[-1]
            ),
            dim=1
        )
        hidden = self.dropout(hidden)
        x = self.fc(hidden)

        return self.sigmoid(x)

# DEVICE

device = torch.device(
    "cuda"
    if torch.cuda.is_available()
    else "cpu"
)

print(
    f"Using device: {device}"
)

model = PhishingBiLSTM().to(device)

# LOSS + OPTIMIZER

criterion = nn.BCELoss()

optimizer = torch.optim.Adam(
    model.parameters(),
    lr=0.001
)

# TRAINING LOOP

EPOCHS = 5

for epoch in range(EPOCHS):
    model.train()
    total_loss = 0

    for inputs, targets in train_loader:
        inputs = inputs.to(device)
        targets = targets.to(device)
        optimizer.zero_grad()

        outputs = model(
            inputs
        ).squeeze()

        loss = criterion(
            outputs,
            targets
        )

        loss.backward()
        optimizer.step()
        total_loss += loss.item()

    print(
        f"Epoch {epoch+1}/{EPOCHS} "
        f"Loss: {total_loss:.4f}"
    )

# SAVE MODEL

torch.save(
    model.state_dict(),
    "models/deep_model.pth"
)

joblib.dump(
    char_to_idx,
    "models/char_vocab.pkl"
)

joblib.dump(
    label_encoder,
    "models/label_encoder.pkl"
)

print(
    "Deep learning model saved."
)