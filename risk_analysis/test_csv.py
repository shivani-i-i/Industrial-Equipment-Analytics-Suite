import pandas as pd

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
