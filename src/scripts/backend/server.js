import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = 3000;

// allow all origins
app.use(cors());

app.get("/app/depthra", async (req, res) => {
    try {
        const stateName = req.query.stateName
        const districtName = req.query.districtName
        const agencyName = req.query.agencyName
        const startdate = req.query.startdate
        const enddate = req.query.enddate
        const download = req.query.download
        const page = req.query.page
        const size = req.query.size
        const response = await fetch(`https://indiawris.gov.in/Dataset/Ground Water Level?stateName=${stateName}&districtName=${districtName}&agencyName=${agencyName}&startdate=${startdate}&enddate=${enddate}&download=${download}&page=${page}&size=${size}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    res.json(data);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: "Failed to fetch groundwater data" });
    }
});

app.listen(PORT, () => {
  console.log(`node server running at http://localhost:${PORT}`);
});