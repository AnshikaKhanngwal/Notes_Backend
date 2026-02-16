import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Supabase connection
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);



// ===== ROUTES START HERE =====

// GET NOTES
app.get("/notes", async (req, res) => {
  const { data, error } = await supabase.from("notes").select("*");

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});


// ADD NOTE
app.post("/notes", async (req, res) => {
  const { title } = req.body;

  const { data, error } = await supabase
    .from("notes")
    .insert([{ text: title }]);

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});


// ⭐ ADD DELETE ROUTE HERE ⭐
app.delete("/notes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id);

    if (error) throw error;

    res.json({ message: "Note deleted", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ===== SERVER START =====
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
