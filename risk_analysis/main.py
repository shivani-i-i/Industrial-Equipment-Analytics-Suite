import pandas as pd

# Read CSV file
df = pd.read_csv("sample_equipment_data.csv")

print("FULL DATA:")
print(df)

print("\nSUMMARY")
print("Total equipment:", len(df))
print("Average Flowrate:", df["Flowrate"].mean())
print("Average Pressure:", df["Pressure"].mean())
print("Average Temperature:", df["Temperature"].mean())

print("\nType Distribution:")
print(df["Type"].value_counts())


print("\nHIGH RISK EQUIPMENT:")

high_risk = df[
    (df["Pressure"] > 8) | 
    (df["Temperature"] > 130)
]

if high_risk.empty:
    print("No high risk equipment found")
else:
    print(high_risk)

high_risk.to_csv("high_risk_equipment.csv", index=False)
print("\nHigh risk equipment saved to high_risk_equipment.csv")
