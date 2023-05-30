# Puppeteer Booking Script

This markdown file provides instructions on how to set up and run the Puppeteer Booking Script. The script automates the booking process on the Trafikverket website using Puppeteer and Node.js.

## Please watch this clip to get a better understanding

<video controls>
  <source src="Video\WebscraperProjekt (2).mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

## Prerequisites

Before running the script, ensure that you have the following prerequisites installed on your machine:

- [Node.js](https://nodejs.org/en/download/): Make sure you have Node.js installed, as the script requires it to run.

## Installation

Follow these steps to install and set up the Puppeteer Booking Script:

1. Clone the repository:
   git clone <repository-url>

2. Navigate to the project directory:

```sh
cd my-project-folder
```

Install dependencies:

```sh
npm i
```

## Configuration

To customize the booking parameters, update the variables in the `index.js` file. Here's how you can modify the variables:

1. Open the `index.js` file in a text editor.

2. Locate the section where the variables are defined.

3. Modify the following variables according to your preferences:

- `myPersonalNumber`: Your personal identification number.
- `category`: The category of the test you want to book.
- `testType`: The type of test (e.g., "Körprov").
- `testLocation`: The location where you want to take the test.
- `chosenLanguage`: The language preference for the test.
- `typeOfBarrowedVehicle`: The type of borrowed vehicle.
- `testDateYear`: The year of the test date.
- `testDateMonth`: The month of the test date.
- `testDay`: The day of the test date.
- `iAmDesperate`: Set to `true` if you want to book any available date in the specified month and year.
- `shouldOnlyScrape`: Set to `true` if you only want to scrape and save the available test dates without booking.

4. Save the `index.js` file after making the necessary changes.

## Usage

To run the Puppeteer Booking Script and automate the booking process, follow these steps:

```sh
node index.js
```

4. The script will launch a headless Chrome browser and perform the booking process based on the provided parameters.

# Test Data Analysis

This markdown file provides instructions on what needs to be done to get the "Test Data Analysis" code to work. The code reads data from a text file, processes it, and generates a bar chart using matplotlib.

## Prerequisites

Before running the code, ensure that you have the following prerequisites installed on your machine:

- Python 3: Make sure you have Python 3 installed, as the code requires it to run.
- Libraries:
  - `json`: This library is usually included with Python by default.
  - `matplotlib`: Install the Matplotlib library to generate the bar chart. You can install it using the following command:
    ```
    pip install matplotlib
    ```

## Data Preparation

Before running the code, make sure you have the necessary data file prepared:

1. Create a text file named `output.txt`.
2. Enter the required data in JSON format. The data should have the following structure:

## License

This project is licensed under the [MIT License](LICENSE).
