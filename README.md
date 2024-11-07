# Receipt Processor API

A RESTful API built to process receipts and calculate points based on specific business rules. This solution demonstrates the ability to build a web service using Node.js and Express, with a focus on handling complex data processing logic.

## Table of Contents

- [Overview](#overview)
- [Requirements](#requirements)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Points Calculation Rules](#points-calculation-rules)
- [Examples](#examples)
- [Testing](#testing)

## Overview

This API provides two main functionalities:

1. **Process Receipts**: Accepts receipt data and generates a unique ID for tracking.
2. **Get Points**: Returns the points awarded to a specific receipt based on defined rules.

The application uses in-memory storage, so data does not persist across application restarts.

## Requirements

This project can be run using Docker, making it compatible with any system that has Docker installed. Ensure that Docker is set up on your system to run the application easily.

## Installation

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   # or
   cd <repository-folder>
   ```

2. **Build the Docker Image**
   `bash docker build -t receipt-processor .`

3. **Run the Docker Container**
   `bash docker run -p 3000:3000 receipt-processor`

The server should now be running at http://localhost:3000. You can make API requests to this address.
