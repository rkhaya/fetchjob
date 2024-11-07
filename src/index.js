const express = require("express");

const app = express();
app.use(express.json());
const receipts = {};

// Helper function to generate unique ID
const generateId = () => {
  return crypto.randomUUID();
};

// POST /receipts/process - Submits a receipt for processing
app.post("/receipts/process", (req, res) => {
  try {
    const { retailer, purchaseDate, purchaseTime, items, total } = req.body;

    // Validate required fields
    if (
      !retailer ||
      !purchaseDate ||
      !purchaseTime ||
      !items ||
      !total ||
      items.length === 0
    ) {
      return res.status(400).json({ error: "Invalid receipt data." });
    }

    // Generate a unique ID for the receipt
    const id = generateId();
    receipts[id] = {
      retailer,
      purchaseDate,
      purchaseTime,
      items,
      total,
      points: calculatePoints({
        retailer,
        purchaseDate,
        purchaseTime,
        items,
        total,
      }),
    };

    // Return the generated receipt ID
    res.status(200).json({ id });
  } catch (error) {
    res.status(400).json({ error: "Invalid receipt data." });
    console.log(error);
  }
});

// GET /receipts/:id/points - Returns the points awarded for the receipt
app.get("/receipts/:id/points", (req, res) => {
  try {
    const receiptId = req.params.id;

    // Find the receipt by ID
    const receipt = receipts[receiptId];
    if (!receipt) {
      return res.status(404).json({ error: "Receipt not found." });
    }

    // Return the points awarded
    res.status(200).json({ points: receipt.points });
  } catch (error) {
    console.log(error);
  }
});

// Function to calculate points based on the receipt
const calculatePoints = (receipt) => {
  try {
    let points = 0;

    // Rule 1: One point for every alphanumeric character in the retailer name
    points += (receipt.retailer.match(/[a-zA-Z0-9]/g) || []).length;

    // Rule 2: 50 points if the total is a round dollar amount with no cents
    if (receipt.total.endsWith(".00")) {
      points += 50;
    }

    // Rule 3: 25 points if the total is a multiple of 0.25
    const total = parseFloat(receipt.total);
    if (total % 0.25 === 0) {
      points += 25;
    }

    // Rule 4: 5 points for every two items on the receipt
    points += Math.floor(receipt.items.length / 2) * 5;

    // Rule 5: If the trimmed length of the item description is a multiple of 3,
    // multiply the price by 0.2 and round up to the nearest integer.
    receipt.items.forEach((item) => {
      const trimmedDescLength = item.shortDescription.trim().length;
      if (trimmedDescLength % 3 === 0) {
        const price = parseFloat(item.price);
        points += Math.ceil(price * 0.2);
      }
    });

    // Rule 6: 6 points if the day in the purchase date is odd
    const purchaseDay = parseInt(receipt.purchaseDate.split("-")[2], 10);
    if (purchaseDay % 2 !== 0) {
      points += 6;
    }

    // Rule 7: 10 points if the time of purchase is after 2:00pm and before 4:00pm
    const [hour, minute] = receipt.purchaseTime.split(":").map(Number);
    if ((hour === 14 && minute >= 0) || (hour === 15 && minute < 60)) {
      points += 10;
    }
    return points;
  } catch (error) {
    console.log(error);
  }
};

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
