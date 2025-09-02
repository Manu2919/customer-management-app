const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const PORT = 5000

// Middleware
const app = express()
app.use(express.json())
app.use(cors())

//Connect to sqlite database 
const db = new sqlite3.Database('./database.db', (err) =>{
    if(err){
        console.error(err.message)
    }
    console.log('Connected to Sqlite Database...!')

    // Create Customers table...
    db.run(`CREATE TABLE IF NOT EXISTS customers(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL ,
        phone_number TEXT NOT NULL UNIQUE
        )`,(err) => {
            if(err){
                console.error('Error Creating table: ', err.message)
            } else{
                console.log('Customers table created Successfully...')
            }
        })
    
    // Create Addresses table...
    db.run(`CREATE TABLE IF NOT EXISTS addresses(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER REFERENCES customers(id),
        address_details TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        pin_code TEXT NOT NULL
        )`,(err) => {
            if(err){
                console.error('Error creating table: ',err.message)
            }else{
                console.log('Addresses table created successfully...')
            }
        })
})

//POST Method for api/customers - creating a customer
app.post('/api/customers', (req,res) => {
    const {first_name,last_name,phone_number} = req.body;
    if(!first_name || !last_name || !phone_number){
        return res.status(400).json({error: 'first name , last name and phone number are required!'})
    }
    const sql = `INSERT INTO customers(first_name,last_name,phone_number)
                VALUES(?,?,?)`;
    db.run(sql, [first_name, last_name, phone_number], (err) => {
        if(err) {
            if(err.message.includes('UNIQUE constraint failed')){
                return res.status(400).json({error: 'Phone number already exists'})
            }
            return res.status(500).json({error: 'Failed to save customer'})
        }
        res.status(201).json({
            message: 'Customer created successfully!',
            customerId: this.lastID,
            customer: {
                id: this.lastID,
                first_name,
                last_name,
                phone_number
            }
        })
    })
})

//GET Method fro api/customers - get all customers
app.get("/api/customers", (req,res) => {

    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const offset = (page - 1) * limit;

    let sql = `SELECT * FROM customers`;
    let params = []

    if(search){
        sql += ` WHERE first_name LIKE ? OR last_name LIKE ?`;
        params = [`%${search}%`, `%${search}%`]
    }

    sql += " LIMIT ? OFFSET ? ";
    params.push(limit,offset)

    db.all(sql, params, (err,rows) => {
        if(err){
            return res.status(500).json({error: err.message})
        }
        res.json({
            message: "Success",
            data: rows,
            page
        })
    })
})

// GET Method for api/customers/:id - get customer with specific id
app.get("/api/customers/:id", (req,res) => {
    const customerdId = req.params.id;
    const sql = 'SELECT * FROM customers WHERE id=?'
    db.get(sql,[customerdId], (err,row) => {
        if(err){
            return res.status(400).json({error: err.message})
        }
        if(!row){
            return res.status(400).json({error: 'Customer Not Found'})
        }
        res.json({
            message: "Success",
            data: row
        })
    })
})

// PUT Method for api/customers/:id - updating customer details
app.put("/api/customers/:id", (req,res) => {
    const {first_name,last_name,phone_number} = req.body
    const customerId = req.params.id;

    if(!first_name && !last_name && !phone_number){
        return res.status(400).json({error: 'Atleast one field is required to update.'})
    }
    const sql = 'UPDATE customers SET first_name = ?, last_name=?,phone_number=? WHERE id = ?';
    db.run(sql, [first_name,last_name,phone_number,customerId], function(err) {
        if(err){
            if(err.message.includes('UNIQUE constraint failed')){
                return res.status(400).json({error: 'Phone number already Exists'})
            }
            return res.status(500).json({error: 'Failed to update customer'})
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Customer not found!" });
        }
        res.json({
            message: 'Customer details Updated Successfully',
            updated: true
        })
    })
})

// DELETE Method for api/customers/:id - deleteing a specific customer
app.delete("/api/customers/:id", (req,res) => {
    const customerId = req.params.id 
    const sql = `DELETE FROM customers WHERE id = ?`;
    db.run(sql,[customerId],function(err) {
        if(err){
            return res.status(500).json({error: 'Failed to delete customer'})
        }
        if(this.changes === 0){
            return res.status(404).json({error: 'Customer not found'})
        }
        res.json({
            message: 'Customer deleted successfully',
            deleted: true
        })
    })
})


/************************************************************************************************************* */

// POST Method for api/customers/:id/addresses Create new address for specific customer
app.post("/api/customers/:id/addresses", (req,res) => {
    const customerId = req.params.id;
    const {address_details,city,state,pin_code} = req.body;

    if(!address_details || !city || !state || !pin_code){
        return res.status(400).json({error: 'All Fields are required...'})
    }

    const sql = `INSERT INTO addresses(customer_id,address_details,city,state,pin_code)
                VALUES(?,?,?,?,?)`;
    db.run(sql, [customerId,address_details,city,state,pin_code], function(err){
        if(err){
            return res.status(500).json({error: 'Failed to add address'})
        }
        res.status(201).json({
            message: 'Address added successfully',
            addressId: this.lastID,
            address: {
                id:this.lastID,
                customer_id:customerId,
                address_details,
                city,
                state,
                pin_code
            }
        })
    })
})

// GET Method for api/customers/:id/addressess get all addresses for specific customer
app.get("/api/customers/:id/addresses", (req,res) => {
    const customerId = req.params.id 
    const sql = `SELECT * FROM addresses WHERE customer_id = ?`;
    db.all(sql, [customerId], function(err,rows){
        if(err){
            return res.status(500).json({error: 'Failed to get addresses'})
        }
        res.json({
            message: 'Success',
            customer_id: customerId,
            addresses: rows,
            count: rows.length
        })
    })
})

// PUT Method for api/addressess/:addressId   updating a specific address
app.put('/api/addresses/:addressId', (req,res) =>{
    const addressId = req.params.addressId;
    const {address_details,city,state,pin_code} = req.body;
    if(!address_details && !city && !state && !pin_code){
        return res.status(400).json({error: 'Atleast one field is required to update'})
    }

    const sql = `UPDATE addresses SET address_details=?,city=?,state=?,pin_code=? WHERE id = ?`;
    db.run(sql, [address_details,city,state,pin_code,addressId], function(err){
        if(err){
            return res.status(500).json({error: 'Failed to update address'})
        }
        if(this.changes === 0){
            return res.status(404).json({ error: "Address not found" });
        }
        res.json({
            message: 'Address updated Successfully',
            success: true
        })
    })
})

// DELETE Method for api/addressess/:addressId
app.delete("/api/addresses/:addressId", (req,res) => {
    const addressId = req.params.addressId;
    const sql = `DELETE FROM addresses WHERE id=?`;
    db.run(sql,[addressId], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete address' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Address not found!" });
        }
        res.json({
            message: 'Address deleted successfully',
            deleted: true
        });
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})