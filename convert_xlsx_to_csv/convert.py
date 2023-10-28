import pandas as pd

# Read the XLSX file
xlsx_file_path = '../App/data/data.xlsx'
df = pd.read_excel(xlsx_file_path)

# Convert DataFrame to CSV
csv_file_path = '../App/data/data.csv'
df.to_csv(csv_file_path, index=False)

print(f'XLSX file "{xlsx_file_path}" has been converted to CSV file "{csv_file_path}"')
