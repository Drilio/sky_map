import pandas as pd

def return_column_completness(dataframe):
    total_rows = len(dataframe)
    completeness = {}

    for col in dataframe.columns:
        non_empty = dataframe[col].notna() & (dataframe[col].astype(str).str.strip() != "")
        completeness[col] = float(round(non_empty.sum() / total_rows * 100, 2))

    return completeness

def remove_uncompleted_columns(dataframe, threshold): #threshold in percent
    completness = return_column_completness(dataframe)
    for col, comp in completness.items():
        if comp <= threshold:
            dataframe.drop(col, axis=1, inplace=True)

csv_path = "./hyg_v42.csv"
df = pd.read_csv(csv_path)
print("---------------------------completness--------------------------")
print(return_column_completness(df))
print("--------------------------clear column--------------------------")
remove_uncompleted_columns(df, 95)
print("---------------------------clear rows---------------------------")
df.dropna(inplace=True)
completeness=return_column_completness(df)
df.to_csv(csv_path, index=False)
