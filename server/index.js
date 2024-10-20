import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import Router from "./routes/route.js"
import connectDb from "./db/db.js"
import cookieParser from "cookie-parser";
import { fetchSheetData } from "./dynamicSheetData/dataFetcher.js"

dotenv.config();

const allowedOrigins = ["http://localhost:5173", "https://data-visualization-dashboard-psi.vercel.app/", "https://vercel.com/checodezzs-projects/data-visualization-dashboard/BA5UpaHHdfu8GSiqHR8N8pMsPTG6"];

const app = express();

const corsOptions = {
    origin: function (origin, callback) {
        console.log("Origin:", origin); // Log the origin for debugging
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions))
app.options('*', cors(corsOptions)); // Include this line

app.use(express.json());
app.use(cookieParser())

connectDb()
fetchSheetData()


app.get('/', (req, res) => {
    res.send('Hello, welcome to dataWiz dashboard !');
});

app.use("/", Router)

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

