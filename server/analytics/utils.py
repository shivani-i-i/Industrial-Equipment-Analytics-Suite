import pandas as pd

def analyze_csv(file_path):
    df = pd.read_csv(file_path)

    summary = {
        "total_equipment": len(df),
        "average_flowrate": df["Flowrate"].mean(),
        "average_pressure": df["Pressure"].mean(),
        "average_temperature": df["Temperature"].mean(),
        "type_distribution": df["Type"].value_counts().to_dict()
    }

    high_risk = df[
        (df["Pressure"] > 7) | (df["Temperature"] > 130)
    ]

    return summary, high_risk
