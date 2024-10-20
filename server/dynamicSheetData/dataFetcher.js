import { google } from "googleapis"
import AnalyticsData from "../model/analyticsData.model.js";
import dotenv from "dotenv"
dotenv.config()

/*
 import csv from "csv-parser"

import fs from "fs"
import cron from "node-cron"

const fetchSheetData = async () => {
    const csvUrl = `https://docs.google.com/spreadsheets/d/1l7GstWHc69HPV0irSdvoMIyHgtufUPKsbtCiNw7IKR0/export?format=csv&gid=485741054&timestamp=${Date.now()}`;
    
    const response = await fetch(csvUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  
    const data = await response.text();
    console.log(data);
  };
  
  // Schedule to run every minute (example)
  cron.schedule('* * * * *', fetchSheetData);
  
  // Initial fetch
  fetchSheetData(); 
  */


const clientEmail = "chethankumar@after-all-319412.iam.gserviceaccount.com" 
const privateKey = process.env.private_key.replace(/\\n/g, '\n')
export const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey, 
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  
 export const fetchSheetData = async () => {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const spreadsheetId = '1l7GstWHc69HPV0irSdvoMIyHgtufUPKsbtCiNw7IKR0';
  const range = 'Sheet3!A:Z'; 

  
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
      auth: client,
      headers: {
        'Cache-Control': 'no-store'
      }
    });

    const data = res.data.values;

    if (data && data.length > 1) {  
      const headers = data[0];      
      const rows = data.slice(1);   
      
      const documents = rows.map((row) => {
        let doc = {};
        // Ensure you map the fields to match your schema
        headers.forEach((header, index) => {
          const key = header.trim();
          if (key === "Day") doc.day = row[index] || null; 
          else if (key == "Age") doc.age = row[index] || null;
          else if (key == "Gender") doc.gender = row[index] || null;
          else if (key == "A") doc.a = Number(row[index]) || 0; 
          else if (key == "B") doc.b = Number(row[index]) || 0;
          else if (key == "C") doc.c = Number(row[index]) || 0;
          else if (key == "D") doc.d = Number(row[index]) || 0;
          else if (key == "E") doc.e = Number(row[index]) || 0;
          else if (key == "F") doc.f = Number(row[index]) || 0;
        });
        return doc;
      });
      await storeDataInDB(documents);
    }  else {
      console.log('No valid data found in the Google Sheet');
    }
  } catch (error) {
    console.error('Error fetching sheet data:', error);
  }
};
  
const storeDataInDB = async (documents) => {
  try {
    await AnalyticsData.deleteMany({});  
    await AnalyticsData.insertMany(documents);
    console.log('Data successfully stored in MongoDB');
  } catch (error) {
    console.error('Error storing data in MongoDB:', error);
  }
};

