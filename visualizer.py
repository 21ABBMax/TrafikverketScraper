import json
from datetime import datetime
import calendar
import matplotlib.pyplot as plt

# Read the data from the text file
with open('output.txt', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Process the data
test_counts = {}
name = data[0]['name']  # Extract the name from the first entry in the data
for entry in data:
    date = entry['date']
    if date not in test_counts:
        test_counts[date] = 0
    test_counts[date] += 1

# Extract the year, month, and city from the first entry in the data
year, month, _ = data[0]['date'].split('-')
city = data[0]['locationName']

# Generate all the dates in the month
_, num_days = calendar.monthrange(int(year), int(month))
dates = [f"{year}-{month}-{day:02}" for day in range(1, num_days+1)]

# Sort the dates in ascending order
sorted_dates = sorted(dates, key=lambda x: datetime.strptime(x, '%Y-%m-%d'))

# Extract the number of tests for each date
test_numbers = [test_counts.get(date, 0) for date in sorted_dates]

# Extract the day number for the x-axis labels
day_numbers = [datetime.strptime(date, '%Y-%m-%d').day for date in sorted_dates]

# Plot the data as a bar chart
plt.bar(range(len(sorted_dates)), test_numbers)
plt.xlabel('Day')
plt.ylabel(f'Number of Available Tests - {name}')
plt.title(f'Number of Available Tests in {city} per Day: {month} - {year}')
plt.xticks(range(len(sorted_dates)), day_numbers, rotation=45, ha='right')
plt.tight_layout()
plt.show()
