// const express = require("express");
// const db = require("../db/connection")
// const router = express.Router();
// const bodyParser = require("body-parser");
// router.use(bodyParser.json());
// router.get('/', function (req, res) {
//     res.send("response with a resource")
// })
// router.get('/hi', (req, res) => {
//     var sql = "SELECT * FROM Create_Users"
//     db.query(sql, function (err, rows, fields) {
//         if (err) {
//             res.status(500).send({ error: "failed" })
//         }
//         res.json(rows);
//     })
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const { getConnection } = require('../db/connection');

router.get('/users', async (req, res) => {
    try {
        const connection = await getConnection();
        const [rows] = await connection.query('SELECT * FROM Create_Users');
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/addusers', async (req, res) => {
    const { user_id, user_name, employ_id,designation, department, email, password, phone_number } = req.body;

    try {
        const connection = await getConnection();
        if (!user_id || !user_name || !employ_id ||!designation|| !department || !email || !password || !phone_number) {
            return res.status(400).json({ message: 'Invalid request' });
        }
        const result = await connection.query(
            'INSERT INTO Create_Users (User_Id, User_Name, Employ_Id, Designation, Department, Email, Password, Phone_Number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, user_name, employ_id, designation, department, email, password, phone_number]
        );
        connection.release();
        res.json({ message: 'User added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/forms',async (req,res)=>{
    try {
        const connection = await getConnection();
        const [Form_rows] = await connection.query('SELECT * FROM Form_Types');
        connection.release();
        res.json(Form_rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});



router.post('/addforms', async (req, res) => {
    const { Form_Type } = req.body;
    console.log(req.body)

    try {
        const connection = await getConnection();
        if (!Form_Type) {
            return res.status(400).json({ message: 'Invalid request' });
        }
        const result = await connection.query(
            'INSERT INTO  Form_Types(Form_Types) VALUES (?)',
            [Form_Type]
        );
        connection.release();
        res.json({ message: 'Form added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/pwd_auto/columns', async (req, res) => {
    try {
        const connection = await getConnection();
        const [rows] = await connection.query('DESCRIBE pwd_auto');
        connection.release();
        const columns = rows.map(row => row.Field);
        res.json(columns);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});




module.exports = router;


// const express = require('express');
// const router = express.Router();
// const db = require('../db/connection');

// router.post('/api/users', async (req, res) => {
//     const { user_id, user_name, employ_id, department, email, password, phone_number } = req.body;

//     if (!user_id || !user_name || !employ_id || !department || !email || !password || !phone_number) {
//         return res.status(400).json({ message: 'Invalid request' });
//     }

//     const conn = await db.getConnection();

//     try {
//         await conn.query('START TRANSACTION');

//         const [result] = await conn.query('INSERT INTO Create_Users (serial_number, user_id, user_name, employ_id, department, email, password, phone_number) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)', [user_id, user_name, employ_id, department, email, password, phone_number]);

//         await conn.query('COMMIT');

//         return res.status(200).json({ message: 'User added successfully' });
//     } catch (err) {
//         console.error(err);
//         await conn.query('ROLLBACK');
//         return res.status(500).json({ message: 'Internal server error' });
//     } finally {
//         conn.release();
//     }
// });