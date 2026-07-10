import express from "express";
import db from "./mysql.js"; 

const app = express();

app.use(express.json());

// Enable CORS middleware headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Bootstrap tables and seed data
db.query(`
  CREATE TABLE IF NOT EXISTS packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    features TEXT
  )
`, (err) => {
  if (err) {
    console.error("Error creating packages table:", err);
  } else {
    // Seed default packages if empty
    db.query("SELECT COUNT(*) as count FROM packages", (err, result) => {
      if (!err && result[0] && result[0].count === 0) {
        const defaultPackages = [
          ["Basic Website", 1500.00, "A simple online presence for your business.", "Responsive Design, Contact Form, 5 Pages, SEO Basics"],
          ["AI & Chatbot Support", 2500.00, "A website enhanced with interactive AI assistants.", "Interactive AI Chatbot, Custom Knowledge Base, Dashboard Panel"],
          ["Full E-commerce Suite", 3500.00, "Sell products online with secure payment integrations.", "Product Management, Shopping Cart, Stripe/PayPal Payments, Order Tracking"],
          ["Custom Mobile App", 5000.00, "A custom iOS and Android app built from scratch.", "Cross-platform (React Native), Push Notifications, App Store Submission, API Integration"]
        ];
        defaultPackages.forEach(pkg => {
          db.query("INSERT INTO packages (name, price, description, features) VALUES (?, ?, ?, ?)", pkg);
        });
        console.log("Seeded default packages table successfully.");
      }
    });
  }
});

db.query(`
  CREATE TABLE IF NOT EXISTS quotations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100),
    customer_phone VARCHAR(30),
    service_type VARCHAR(50),
    work_description TEXT,
    business_profile VARCHAR(100),
    main_goal VARCHAR(100),
    items TEXT,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'Draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error("Error creating quotations table:", err);
  }
});


// CUSTOMER ENDPOINTS (mapping to new_table)
app.get("/User", (req, res) => {
  db.query("SELECT * FROM new_table", (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM new_table", (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

app.post("/api/users", (req, res) => {
  const { Cusid, Cusname, Cusemail, business_profile, main_goal, features, design_level } = req.body;
  const finalId = Cusid || Math.floor(Math.random() * 1000000) + 1;
  const featuresStr = typeof features === 'string' ? features : JSON.stringify(features || []);

  db.query(
    "INSERT INTO new_table (Cusid, Cusname, Cusemail, business_profile, main_goal, features, design_level) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [finalId, Cusname, Cusemail, business_profile || '', main_goal || '', featuresStr, design_level || ''],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.json({
        message: "User added successfully!",
        CusID: finalId
      });
    }
  );
});

app.put("/api/users/:id", (req, res) => {
  const { Cusname, Cusemail, business_profile, main_goal, features, design_level } = req.body;
  const featuresStr = typeof features === 'string' ? features : JSON.stringify(features || []);
  db.query(
    "UPDATE new_table SET CusName = ?, CusEmail = ?, business_profile = ?, main_goal = ?, features = ?, design_level = ? WHERE CusID = ?",
    [Cusname, Cusemail, business_profile || '', main_goal || '', featuresStr, design_level || '', req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.json({ message: "Customer updated successfully!" });
    }
  );
});

app.delete("/api/users/:id", (req, res) => {
  db.query(
    "DELETE FROM new_table WHERE CusID = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.json({ message: "Customer deleted successfully!" });
    }
  );
});


// PACKAGES ENDPOINTS
app.get("/api/packages", (req, res) => {
  db.query("SELECT * FROM packages", (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(result);
  });
});

app.post("/api/packages", (req, res) => {
  const { name, price, description, features } = req.body;
  db.query(
    "INSERT INTO packages (name, price, description, features) VALUES (?, ?, ?, ?)",
    [name, price, description, features],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.json({ message: "Package added successfully!", id: result.insertId });
    }
  );
});

app.put("/api/packages/:id", (req, res) => {
  const { name, price, description, features } = req.body;
  db.query(
    "UPDATE packages SET name = ?, price = ?, description = ?, features = ? WHERE id = ?",
    [name, price, description, features, req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.json({ message: "Package updated successfully!" });
    }
  );
});

app.delete("/api/packages/:id", (req, res) => {
  db.query(
    "DELETE FROM packages WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.json({ message: "Package deleted successfully!" });
    }
  );
});


// QUOTATIONS ENDPOINTS
app.get("/api/quotations", (req, res) => {
  db.query("SELECT * FROM quotations ORDER BY created_at DESC", (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }
    const parsed = result.map(q => {
      let itemsArray = [];
      try {
        itemsArray = typeof q.items === 'string' ? JSON.parse(q.items) : (q.items || []);
      } catch (e) {
        itemsArray = [];
      }
      return {
        ...q,
        items: itemsArray
      };
    });
    res.json(parsed);
  });
});

app.post("/api/quotations", (req, res) => {
  const {
    customer_name,
    customer_email,
    customer_phone,
    service_type,
    work_description,
    business_profile,
    main_goal,
    features,
    design_level,
    items,
    total,
    status
  } = req.body;

  const itemsStr = typeof items === 'string' ? items : JSON.stringify(items || []);
  const featuresStr = typeof features === 'string' ? features : JSON.stringify(features || []);

  db.query(
    `INSERT INTO quotations 
     (customer_name, customer_email, customer_phone, service_type, work_description, business_profile, main_goal, features, design_level, items, total, status) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [customer_name, customer_email, customer_phone, service_type, work_description, business_profile, main_goal, featuresStr, design_level, itemsStr, total, status || 'Draft'],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.json({ message: "Quotation saved successfully!", id: result.insertId });
    }
  );
});

app.put("/api/quotations/:id/status", (req, res) => {
  const { status } = req.body;
  db.query(
    "UPDATE quotations SET status = ? WHERE id = ?",
    [status, req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.json({ message: "Quotation status updated successfully!" });
    }
  );
});

app.delete("/api/quotations/:id", (req, res) => {
  db.query(
    "DELETE FROM quotations WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.json({ message: "Quotation deleted successfully!" });
    }
  );
});


app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});