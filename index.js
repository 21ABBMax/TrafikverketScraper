// Import necessary packages
const puppeteer = require("puppeteer");
const fs = require("fs");

// Set the name of the output file
const fileName = "output.txt";

(async () => {
	// Launch Puppeteer and create a new page
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();

	// Navigate to the booking page
	await page.goto("https://fp.trafikverket.se/boka/#/", {
		waitUntil: "domcontentloaded",
	});

	// Set the parameters for booking
	// (You can modify these variables according to your needs)
	let myPersonalNumber = "198804016916";
	let category = "AM - Moped";
	let testType = "Körprov";
	let testLocation = "Västerås";
	let chosenLanguage = "Svenska";
	let typeOfBarrowedVehicle = "Manuell";
	let testDateYear = "2023";
	let testDateMonth = "10";
	let testDay = "2";
	let iAmDesperate = false;
	let shouldOnlyScrape = false;

	// Set the path to the sound file
	const soundPath = "C:/Users/21maxwig/Downloads/swing-6045.mp3";
	// Set the desired volume level (0 to 100)
	const volume = 50;
	// Set the desired duration in milliseconds
	const duration = 5000; // 5 seconds

	// Set sleep time between actions (in milliseconds)
	let sleepTime = 4000;
	let errorTester = 0;
	let noMatchFound = true;

	// Array of disallowed categories
	const disallowedCategories = [
		// List of disallowed categories
		"APV - Arbete på väg",
		"BE - Personbil med tungt släp",
		"C - Tung lastbil",
		"C1 - Medeltung lastbil",
		"C1E - Medeltung lastbil med släp",
		"CE - Tung lastbil med släp",
		"D - Buss",
		"D1 - Buss (Begränsad)",
		"D1E - Buss med tungt släp (Begränsad)",
		"DE - Buss med tungt släp",
		"Taxi - Taxiförarlegitimation",
		"VVH - Vinterväghållning",
	];

	// Check if the selected category is allowed
	const isCategoryAllowed = !disallowedCategories.some(
		(disallowedCategory) => category === disallowedCategory
	);

	if (!isCategoryAllowed) {
		// Category is not allowed, display error message and exit
		console.log(
			`Ledsen, men du har inte behörighet att boka ${category} genom detta program. Vänligen logga in på sidan vanligt för att boka`
		);
		await browser.close();
		return;
	} else {
		// Wait for a specific duration
		await page.waitForTimeout(sleepTime);

		// Navigate to the booking page
		const navigateToBooking = await page.evaluate(() => {
			const grabLink = document.querySelector(".col-sm-3");
			grabLink.click();
		});

		// Wait for a specific duration
		await page.waitForTimeout(sleepTime);

		// Select the login type without ID
		const loginWithoutID = await page.evaluate(() => {
			const loginType = document.querySelectorAll(".list-group-item");
			loginType[3].click();
			const continueButn = document.querySelector(
				"#login-dialog-continue-button"
			);
			continueButn.click();
		});

		// Wait for navigation to complete
		await page.waitForNavigation({ waitUntil: "domcontentloaded" });

		// Wait for a specific duration
		await page.waitForTimeout(sleepTime);

		// Enter personal number
		await page.type(".form-control", myPersonalNumber);

		// Press Enter key
		await page.keyboard.press("Enter");

		// Wait for a specific duration
		await page.waitForTimeout(sleepTime);

		// Click on the first available time slot
		await page.click(".col-xs-10");

		// Wait for a specific duration
		await page.waitForTimeout(sleepTime);

		// Select the desired category
		do {
			const selectCategory = await page.evaluate((category) => {
				const selectorSelect = document.querySelector("#licence-select");
				const options = selectorSelect.querySelectorAll("option");
				for (let i = 0; i < options.length; i++) {
					if (options[i].textContent.trim() === category) {
						selectorSelect.selectedIndex = i;
						selectorSelect.dispatchEvent(
							new Event("change", { bubbles: true })
						);
						break;
					}
				}
			}, category);

			await page.waitForTimeout(sleepTime);

			// Select the desired test type
			const evaluateTest = await page.evaluate((testType) => {
				const typeOfTest = document.querySelector("#examination-type-select");
				if (typeOfTest === null) {
					errorTester = 1;
					return;
				}
				const selectType = typeOfTest.querySelectorAll("option");
				for (let i = 0; i < selectType.length; i++) {
					if (selectType[i].textContent.includes(testType)) {
						typeOfTest.selectedIndex = i;
						typeOfTest.dispatchEvent(new Event("change", { bubbles: true }));
						break;
					}
				}
			}, testType);

			await page.waitForTimeout(sleepTime);

			// Fill in the desired test location
			const locationField = await page.$(".dropdown .form-control");
			if (locationField !== null) {
				await locationField.click({ clickCount: 3 }); // Select the current value in the field
				await locationField.type(testLocation); // Type the new value
			}

			await page.waitForTimeout(sleepTime);

			// Select the desired language
			const languageSelect = await page.$("#language-select");
			if (languageSelect !== null) {
				await page.evaluate(
					(selectElement, chosenLanguage) => {
						const options = selectElement.options;
						for (let option of options) {
							if (option.text === chosenLanguage) {
								option.selected = true;
								break;
							}
						}
					},
					languageSelect,
					chosenLanguage
				);
			} else {
				console.log("Element with ID 'language-select' not found on the page.");
			}

			await page.waitForTimeout(sleepTime);
			await page.keyboard.press("Enter");

			// Select the desired type of borrowed vehicle
			const evaluateCar = await page.evaluate((typeOfBarrowedVehicle) => {
				const dropdownSelect = document.querySelector("#vehicle-select");
				if (dropdownSelect === null) {
					return;
				}

				const selectCar = dropdownSelect.querySelectorAll("option");
				for (let i = 0; i < selectCar.length; i++) {
					if (selectCar[i].textContent.includes(typeOfBarrowedVehicle)) {
						selectCar[i].selected = true;
						dropdownSelect.dispatchEvent(
							new Event("change", { bubbles: true })
						);
						break;
					}
				}
			}, typeOfBarrowedVehicle);

			await page.waitForTimeout(sleepTime);
			await page.keyboard.press("Enter");
			await page.waitForSelector(".panel");

			let loadMoreButton;
			let isButtonVisible = true;

			// Load more available test dates if button is visible
			while (isButtonVisible) {
				try {
					loadMoreButton = await page.waitForXPath(
						"//button[contains(text(), 'Hämta fler tider')]",
						{
							visible: true,
							timeout: 5000,
						}
					);
					await loadMoreButton.click();
					await page.waitForTimeout(sleepTime);
				} catch (error) {
					isButtonVisible = false;
				}
			}

			// Extract the test date, time, location, name, and cost information from the panels
			const evaluatePanels = await page.evaluate((testDateMonth) => {
				const selectPanels = document.querySelectorAll(".panel");
				if (selectPanels === null || selectPanels.length === 0) {
					errorTester = 1;
					return [];
				}

				const jsonObjs = [];

				for (let i = 0; i < selectPanels.length; i++) {
					const strongText =
						selectPanels[i].querySelector("strong").textContent;
					const [date, time] = strongText.trim().split(" ");

					const panelMonth = new Date(date).getMonth() + 1;
					if (panelMonth !== parseInt(testDateMonth)) {
						continue; // Skip panels with different month
					}

					const locationNameElement =
						selectPanels[i].querySelector(".col-xs-6");
					const locationName = locationNameElement.innerText
						.split("\n")[1]
						.trim();

					const nameElement = selectPanels[i].querySelector(
						".col-xs-6.text-right-xs"
					);
					const name = nameElement.childNodes[2].textContent.trim();

					const cost = nameElement
						.querySelector(".text-muted")
						.textContent.trim();

					const dataObj = {
						date: date,
						time: time,
						locationName: locationName,
						name: name,
						cost: cost,
					};

					jsonObjs.push(dataObj);
				}

				return jsonObjs;
			}, testDateMonth);

			await page.waitForTimeout(sleepTime);
			await page.keyboard.press("Enter");

			// Convert the extracted panel information to JSON format
			const jsonData = JSON.stringify(evaluatePanels, null, 2);

			// Write the JSON data to the output file
			fs.writeFileSync(fileName, jsonData);

			console.log(`JSON data has been written to ${fileName}`);

			// ... Existing code ...

			if (!shouldOnlyScrape) {
				// Loop over the panels and press the button for the matching date
				const pressButtonForMatchingDate = await page.evaluate(
					(testDateYear, testDateMonth, testDay, iAmDesperate) => {
						const panels = document.querySelectorAll(".panel");

						if (iAmDesperate) {
							for (let i = 0; i < panels.length; i++) {
								const strongText =
									panels[i].querySelector("strong").textContent;
								const [date, _] = strongText.trim().split(" ");

								const panelDate = new Date(date);
								const panelYear = panelDate.getFullYear();
								const panelMonth = panelDate.getMonth() + 1;
								if (
									panelYear === parseInt(testDateYear) &&
									panelMonth === parseInt(testDateMonth)
								) {
									const button = panels[i].querySelector(
										"button[data-bind='click:$parent.select']"
									);
									button.click();
									return true;
								}
							}

							return false;
						} else {
							for (let i = 0; i < panels.length; i++) {
								const strongText =
									panels[i].querySelector("strong").textContent;
								const [date, _] = strongText.trim().split(" ");

								const panelDate = new Date(date);
								const panelYear = panelDate.getFullYear();
								const panelMonth = panelDate.getMonth() + 1;
								const panelDay = panelDate.getDate();

								if (
									panelYear === parseInt(testDateYear) &&
									panelMonth === parseInt(testDateMonth) &&
									panelDay === parseInt(testDay)
								) {
									const button = panels[i].querySelector(
										"button[data-bind='click:$parent.select']"
									);
									button.click();
									return true;
								}
							}
							return false;
						}
					},
					testDateYear,
					testDateMonth,
					testDay,
					iAmDesperate
				);

				if (pressButtonForMatchingDate) {
					console.log(
						`Button pressed for the panel with the specified date: ${testDateYear}-${testDateMonth}-${testDay}`
					);
				} else {
					console.log(
						`No panel found with the specified date: ${testDateYear}-${testDateMonth}-${testDay}`
					);
				}

				noMatchFound = !pressButtonForMatchingDate;

				if (noMatchFound) {
					await page.reload({ waitUntil: "domcontentloaded" });
					await page.waitForTimeout(sleepTime);
				} else {
					await page.waitForTimeout(sleepTime);
					await page.waitForTimeout(sleepTime);

					await page.waitForSelector(".btn.btn-lg.btn-primary.col-xs-12");
					await page.evaluate(() => {
						const button = document.querySelector(
							".btn.btn-lg.btn-primary.col-xs-12"
						);
						button.click();
					});

					await page.waitForTimeout(sleepTime);
					await page.evaluate(() => {
						const button = document.querySelector(".text-left");
						button.click();
					});
					await page.waitForTimeout(sleepTime);
					await page.evaluate(() => {
						const button = document.querySelector(
							".btn.btn-primary.btn-lg.btn-block"
						);
						button.click();
					});

					await page.waitForSelector("#swish-container label");
					await page.$eval("#swish-container label", (label) => {
						label.click();
					});
				}
			}
			await browser.close();
		} while (noMatchFound && !shouldOnlyScrape);
	}
})();
