import torch
import torch.nn as nn
import numpy as np
import joblib

MAX_LEN = 200

# =========================
# LOAD VOCAB
# =========================

char_to_idx = joblib.load(
    "models/char_vocab.pkl"
)

# =========================
# LOAD LABEL ENCODER
# =========================

label_encoder = joblib.load(
    "models/label_encoder.pkl"
)

vocab_size = len(char_to_idx) + 1

# =========================
# MODEL
# =========================

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

# =========================
# DEVICE
# =========================

device = torch.device(
    "cuda"
    if torch.cuda.is_available()
    else "cpu"
)

# =========================
# LOAD MODEL
# =========================

model = PhishingBiLSTM().to(device)

model.load_state_dict(
    torch.load(
        "models/deep_model.pth",
        map_location=device
    )
)

model.eval()

# =========================
# ENCODING FUNCTION
# =========================

def encode_url(url):

    encoded = [
        char_to_idx.get(ch, 0)
        for ch in url[:MAX_LEN]
    ]

    if len(encoded) < MAX_LEN:

        encoded += [0] * (
            MAX_LEN - len(encoded)
        )

    return encoded

# =========================
# PREDICT FUNCTION
# =========================

def predict_deep(url):

    encoded = encode_url(url)

    x = torch.tensor(
        [encoded],
        dtype=torch.long
    ).to(device)

    with torch.no_grad():

        output = model(x)

        confidence = (
            output.item()
        )

    prediction = (
        "phishing"
        if confidence >= 0.5
        else "safe"
    )

    confidence_percent = round(
        confidence * 100,
        2
    )

    return {
        "prediction": prediction,
        "confidence": confidence_percent
    }