const express = require('express');
const router = express.Router();
const { getConnection } = require('../db/connection');


router.get('/users', async (req, res) => {
    try {
        const con1nection = await getConnection();
        const [rows] = await connection.query('SELECT * FROM Create_Users');
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/addusers', async (req, res) => {
    const { user_id, user_name, employ_id, designation, department, email, password, phone_number } = req.body;

    try {
        const connection = await getConnection();
        if (!user_id || !user_name || !employ_id || !designation || !department || !email || !password || !phone_number) {
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


// router.get('/forms',async (req,res)=>{
//     try {
//         const connection = await getConnection();
//         const [Form_rows] = await connection.query('SELECT * FROM Form_Types');
//         connection.release();
//         res.json(Form_rows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });


// router.post('/addforms', async (req, res) => {
//     const { Form_Type } = req.body;
//     console.log(req.body)

//     try {
//         const connection = await getConnection();
//         if (!Form_Type) {
//             return res.status(400).json({ message: 'Invalid request' });
//         }
//         const result = await connection.query(
//             'INSERT INTO  Form_Types(Form_Types) VALUES (?)',
//             [Form_Type]
//         );
//         connection.release();
//         res.json({ message: 'Form added successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });

router.get("/tables",async (req,res)=>{
    const tablelist=["pwd_auto","pwd_sanit","table_1"];
    res.json(tablelist);
});

// router.post('/pwd_auto/columns', async (req, res) => {
//     try {
//         const table=req.body.table;
//         if(table==="" && table===null){
//            res.status(400).json({message:"Invalid table"})
//         }
//         const connection = await getConnection();
//         const [rows] = await connection.query(`DESCRIBE ${table}`);
//         connection.release();
//         const columns = rows.map(row => row.Field);
//         res.json(columns);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });

router.post('/attributelist', async (req, res) => {
    try {
        const table = req.body.table;
        if(table==="-"){
            res.json([]);
        }
        if (!table) {
            res.status(400).json({ message: "Invalid table" });
        }
        console.log(table)
        const connection = await getConnection();
        const [rows] = await connection.query(`DESCRIBE ${table}`);
        connection.release();
        const columns = rows.map(row => row.Field);
        res.json(columns);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


router.post('/add_audit_report_prototype', async (req, res) => {
    const { Head1, Head2, Unit, AttributeType } = req.body;
    console.log(req.body)
    try {
        const connection = await getConnection();
        const result = await connection.query(
            'INSERT INTO audit_report_prototype (Head1, Head2, Unit, AttributeType) VALUES (?, ?, ?, ?)',
            [Head1, Head2, Unit, AttributeType]
        );
        connection.release();
        res.json({ message: 'Audit report prototype added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/addclient', async (req, res) => {
    const { Client_Id, Client_Name, Client_logo } = req.body;

    try {
        const connection = await getConnection();
        if (!Client_Id || !Client_Name) {
            return res.status(400).json({ message: 'Client ID and Client Name are required fields' });
        }

        // Add the new client to the database
        const result = await connection.query(
            'INSERT INTO Client_table (Client_Id, Client_Name, Client_logo) VALUES (?, ?, ?)',
            [Client_Id, Client_Name, Client_logo]
        );
        connection.release();
        res.json({ message: 'Client added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


router.get('/clients', async (req, res) => {
    try {
        const connection = await getConnection();
        const [rows] = await connection.query('SELECT * FROM Client_table');
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/addsystems', async (req, res) => {
    const { client_id, system_name, manufacturer, manufacturer_logo } = req.body;

    try {
        const connection = await getConnection();
        if (!client_id || !system_name || !manufacturer) {
            return res.status(400).json({ message: 'Invalid request' });
        }
        const result = await connection.query(
            'INSERT INTO Systems_table (Client_Id, System_Name, Manufacturer, Manufacturer_Logo) VALUES (?, ?, ?, ?)',
            [client_id, system_name, manufacturer, manufacturer_logo]
        );
        connection.release();
        res.json({ message: 'System added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.get('/systems', async (req, res) => {
    try {
        const connection = await getConnection();
        const [rows] = await connection.query('SELECT * FROM Systems_table');
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/addsensorlist', async (req, res) => {
    const sensorList = req.body;
    console.log(req.body);
    const numRows = await getNumRows('Sensor_List');

    try {
        const connection = await getConnection();
        if (!Array.isArray(sensorList)) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        const promises = sensorList.map(async (sensor, index) => {
            const sensorname = `S${numRows + index + 1}`;
            const { head1, head2, unit, attributetype, reporttype } = sensor;
            const result = await connection.query(
                'INSERT INTO Sensor_List (sensorname, head1, head2, unit, attributetype,reporttype) VALUES (?, ?, ?, ?, ?, ?)',
                [sensorname, head1, head2, unit, attributetype, reporttype]
            );
        });

        await Promise.all(promises);
        connection.release();
        res.json({ message: 'Sensor list added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
async function getNumRows(tableName) {
    try {
        const connection = await getConnection();
        const [rows] = await connection.query(`SELECT COUNT(*) as numRows FROM ${tableName}`);
        connection.release();
        return rows[0].numRows;
    } catch (error) {
        console.error(error);
        return 0;
    }
}

router.get('/sensorlist', async (req, res) => {
    try {
        const connection = await getConnection();
        const [rows] = await connection.query('SELECT * FROM Sensor_List');
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/description', async (req, res) => {
    const {
        userid,
        clientid,
        reporttype,
        systems,
        manufacturer,
        datebegin,
        timebegin,
        dateend,
        timeend,
        status,
        timetype,
    } = req.body;

    try {
        const connection = await getConnection();
        if (
            !userid ||
            !clientid ||
            !reporttype ||
            !systems ||
            !manufacturer ||
            !datebegin ||
            !timebegin ||
            !dateend ||
            !timeend ||
            !status ||
            !timetype
        ) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            return res.status(400).json({ message: 'Invalid request' });
        }
        // Generate the codegeneratedVianumberrep
        const [countResult] = await connection.query(
            'SELECT COUNT(*) AS count FROM descriptiontable WHERE datebegin = ?',
            [datebegin]
        );
        const count = countResult[0].count + 1;
        const codegeneratedVianumberrep = count.toString().padStart(6, '0');
        // Generate the report ID
        const newdate=datebegin.slice(0,-16);
        const reportid = `${newdate}${codegeneratedVianumberrep}V_1`;

        // Generate the codegeneratedVianumberrep
        // const [countResult] = await connection.query(
        //     'SELECT COUNT(*) AS count FROM descriptiontable WHERE datebegin = ?',
        //     [datebegin]
        // );
        // const count = countResult[0].count + 1;
        // const codegeneratedVianumberrep = count.toString().padStart(6, '0');
        // Get current date
        // const date = new Date();
        // // Extract year, month, and day from the date
        // const year = date.getFullYear().toString().substr(-2);
        // const month = ('0' + (date.getMonth() + 1)).slice(-2);
        // const day = ('0' + date.getDate()).slice(-2);
        // // Generate a 4-digit random number
        // const randomNumber = Math.floor(1000 + Math.random() * 9000);
        // // Concatenate date and random number to form the ID
        // const id = year + month + day + randomNumber.toString();

        // const idstring=id.toString();
         
        // const reportid=idstring+"V_1";
        // Generate the report ID
        // const reportid = id;

        const result = await connection.query(
            'INSERT INTO descriptiontable (userid, clientid, reporttype, systems, manufacturer, datebegin, timebegin, dateend, timeend, status, timetype, reportid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                userid,
                clientid,
                reporttype,
                systems,
                manufacturer,
                datebegin,
                timebegin,
                dateend,
                timeend,
                status,
                timetype,
                reportid,
            ]
        );
        connection.release();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({ message: 'New row added successfully', reportid });
    } catch (error) {
        console.error(error);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/sensors/reportid', async (req, res) => {
    const reportId = req.body.reportid;

    try {
        const connection = await getConnection();

        // Get form type corresponding to report id
        const [reportTypeRows] = await connection.query(
            'SELECT reporttype FROM descriptiontable WHERE reportid = ?',
            [reportId]
        );

        // Extract form type from result set
        const reportType = reportTypeRows[0].reporttype;

        // Get rows from Sensor_List table having form type
        const [sensorListRows] = await connection.query(
            'SELECT * FROM Sensor_List WHERE reporttype = ?',
            [reportType]
        );

        connection.release();
        res.json(sensorListRows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


router.post('/sensors/reporttype', async (req, res) => {
    const reporttype = req.body.reporttype;
    try {
        const connection = await getConnection();
        const [sensorListRows] = await connection.query(
            'SELECT * FROM Sensor_List WHERE reporttype = ?',
            [reporttype]
        );

        connection.release();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(sensorListRows);
    } catch (error) {
        console.error(error);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/setpoints', async (req, res) => {
    const data = req.body;
    const connection = await getConnection();
    try {
        for (let i = 0; i < data.length; i++) {
            const reportid = data[i].reportid;
            const sensorname = data[i].sensorname;
            const [rows] = await connection.query('SELECT * FROM Set_Points WHERE reportid = ? AND sensorname = ?', [reportid, sensorname]);
            if (rows.length === 0) {
                await connection.query('INSERT INTO Set_Points (reportid, sensorname) VALUES (?, ?)', [reportid, sensorname]);
            }
        }
        connection.release();
        res.json({ message: 'Data inserted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


router.post('/normalpoints', async (req, res) => {
    const data = req.body;
    const connection = await getConnection();
    try {
        for (let i = 0; i < data.length; i++) {
            const reportid = data[i].reportid;
            const sensorname = data[i].sensorname;
            const [rows] = await connection.query('SELECT * FROM Normal_Points WHERE reportid = ? AND sensorname = ?', [reportid, sensorname]);
            if (rows.length === 0) {
                await connection.query('INSERT INTO Normal_Points (reportid, sensorname) VALUES (?, ?)', [reportid, sensorname]);
            }
        }
        connection.release();
        res.json({ message: 'Data inserted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


router.get('/pwd_auto/search', async (req, res) => {
    const datebegin = req.body.datebegin;
    const dateend = req.body.dateend;
    const reporttype = req.body.reporttype;
    const reportid =req.body.reportid;

    try {
        const connection = await getConnection();

        // Get attribute types from Sensor_List table where reporttype=Aut
        const [sensorListRows] = await connection.query(
            'SELECT attributetype FROM Sensor_List WHERE reporttype = ?',
            [reporttype]
        );
        const attributeTypes = sensorListRows.map(row => row.attributetype);

        // Get rows from pwd_auto table where CurDT is between datebegin and dateend
        const [pwdAutoRows] = await connection.query(
            'SELECT * FROM pwd_auto WHERE CurDT BETWEEN ? AND ? ORDER BY CurDT ASC',
            [datebegin, dateend]
        );

        // Remove any keys from each row that are not in the attributeTypes list
        const filteredRows = pwdAutoRows.map(row => {
            const filteredRow = {};
            Object.keys(row).forEach(key => {
                if (attributeTypes.includes(key) || key.endsWith('CurDT')) {
                    filteredRow[key] = row[key];
                }
            });
            return filteredRow;
        });

        connection.release();

        res.json(filteredRows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});


router.post('/advancesearch', async (req, res) => {
    const data = req.body;
    const connection = await getConnection();
    try {
        // console.log(3)
        res.setHeader('Access-Control-Allow-Origin', '*');

        const reportid = req.body.reportid;

        if(reportid===undefined){
            connection.release();
            res.json({ message: 'reportid is undefinedg' });
        }
        // console.log(reportid)
        const TABLE_TO_USE = req.body.table;
        // Get datebegin, dateend, and reporttype from Description table
        const [descriptionRows] = await connection.query(
            'SELECT datebegin, dateend, reporttype FROM descriptiontable WHERE reportid = ?',
            [reportid]
        );
        const [{ datebegin, dateend, reporttype }] = descriptionRows;

        // Get SetPointList and NormalPointList from Set_Points and Normal_Points tables
        const [setPointRows] = await connection.query(
            'SELECT sensorname FROM Set_Points WHERE reportid = ? ORDER BY sensorname ASC',
            [reportid]
        );
        // console.log("setPointRows", [setPointRows],typeof(setPointRows))
        // const setPointList = setPointRows.map(row => row.sensorname);
        // console.log(4)
        const [normalPointRows] = await connection.query(
            'SELECT sensorname FROM Normal_Points WHERE reportid = ? ORDER BY sensorname ASC',
            [reportid]
        );
        // console.log("normalPointRows", [normalPointRows])
        // const normalPointList = normalPointRows.map(row => row.sensorname);

        // Get SetList and NormalList from Sensor_List table
        // const [setListRows] = await connection.query(
        //     `SELECT * FROM Sensor_List WHERE reporttype = ? AND sensorname IN (${setPointList.map(() => '?').join(',')})`,
        //     [reporttype, ...setPointList]
        // );




        const setPointList = setPointRows.map(row => row.sensorname);
        const setPointListValues = setPointList.map(() => '?').join(',');
        const [setListRows] = await connection.query(
            `SELECT * FROM Sensor_List WHERE reporttype = ? AND sensorname IN (${setPointListValues})`,
            [reporttype, ...setPointList]
        );
        const setList = setPointList.map(sensorname => setListRows.find(row => row.sensorname === sensorname));
        console.log("setlist", setList);
        // const [normalListRows] = await connection.query(
        //     `SELECT * FROM Sensor_List WHERE reporttype = ? AND sensorname IN (${normalPointList.map(() => '?').join(',')})`,
        //     [reporttype, ...normalPointList]
        // );
        const normalPointList = normalPointRows.map(row => row.sensorname);
        const normalPointListValues = normalPointList.map(() => '?').join(',');
        const [normalListRows] = await connection.query(
            `SELECT * FROM Sensor_List WHERE reporttype = ? AND sensorname IN (${normalPointListValues})`,
            [reporttype, ...normalPointList]
        );

        const normalList = normalPointList.map(sensorname => normalListRows.find(row => row.sensorname === sensorname));
        // console.log(5)
        // console.log("Normallist", normalList)
        // Get attribute types from NormalList
        const attributes = normalList.map(row => row.attributetype);

        const [rows] = await connection.query(`DESCRIBE ${TABLE_TO_USE}`);
        connection.release();
        const columns = rows.map(row => row.Field);
        // console.log("columns",columns)
        // Get rows from TABLE_TO_USE table where first column value is between datebegin and dateend
        const [tableRows] = await connection.query(
            `SELECT * FROM ${TABLE_TO_USE} WHERE ${columns[0]} BETWEEN ? AND ? `,
            [datebegin, dateend]
        );


        const array1 = columns;
        const array2 = tableRows[0];
        console.log()
        const result = [tableRows[0]];

        for (let i = 0; i < array1.length; i++) {
            const obj = {};
            obj[array1[i]] = array2[i];
            result.push(obj);
        }

        console.log(result);
// Output: [{"a":"x"}, {"b":2}, {"c":"y"}]

        // console.log(6)
        // Filter rows to include only attributes from Normallist
        const finalArray = tableRows.map(row => {
            const filteredRow = {};
            Object.keys(row).forEach(key => {
                if (key === `${columns[0]}` || attributes.includes(key)) {
                    filteredRow[key] = row[key];
                }
            });
            // console.log(7)
            // res.setHeader('Access-Control-Allow-Origin', '*');
            return filteredRow;
        });
        connection.release();
        // console.log(8)
        const response = { firstheader: setList, secondheader: normalList, body: finalArray, attributelist: result };
        res.setHeader('Access-Control-Allow-Origin', '*');
        // console.log(9)
        res.json(response);
        // console.log(10)

    }

    
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});



// router.post('/advancesearch', async (req, res) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     //sfsdf
//         const connection = await getConnection();
//     try {
//         // console.log(3)o
//         res.setHeader('Access-Control-Allow-Origin', '*');

//     const reportid = req.body.reportid;
//     // console.log(reportid)
//     const TABLE_TO_USE=req.body.table;
//         // Get datebegin, dateend, and reporttype from Description table
//         const [descriptionRows] = await connection.query(
//             'SELECT datebegin, dateend, reporttype FROM descriptiontable WHERE reportid = ?',
//             [reportid]
//         );
//         const [{ datebegin, dateend, reporttype }] = descriptionRows;

//         // Get SetPointList and NormalPointList from Set_Points and Normal_Points tables
//         const [setPointRows] = await connection.query(
//             'SELECT sensorname FROM Set_Points WHERE reportid = ? ORDER BY sensorname ASC',
//             [reportid]
//         );
//         // console.log("setPointRows", [setPointRows],typeof(setPointRows))
//         // const setPointList = setPointRows.map(row => row.sensorname);
//         // console.log(4)
//         const [normalPointRows] = await connection.query(
//             'SELECT sensorname FROM Normal_Points WHERE reportid = ? ORDER BY sensorname ASC',
//             [reportid]
//         );
//         // console.log("normalPointRows", [normalPointRows])
//         // const normalPointList = normalPointRows.map(row => row.sensorname);

//         // Get SetList and NormalList from Sensor_List table
//         // const [setListRows] = await connection.query(
//         //     `SELECT * FROM Sensor_List WHERE reporttype = ? AND sensorname IN (${setPointList.map(() => '?').join(',')})`,
//         //     [reporttype, ...setPointList]
//         // );

        


//         const setPointList = setPointRows.map(row => row.sensorname);
//         const setPointListValues = setPointList.map(() => '?').join(',');
//         const [setListRows] = await connection.query(
//             `SELECT * FROM Sensor_List WHERE reporttype = ? AND sensorname IN (${setPointListValues})`,
//             [reporttype, ...setPointList]
//         );
//         const setList = setPointList.map(sensorname => setListRows.find(row => row.sensorname === sensorname));
//         console.log("setlist", setList);
//         // const [normalListRows] = await connection.query(
//         //     `SELECT * FROM Sensor_List WHERE reporttype = ? AND sensorname IN (${normalPointList.map(() => '?').join(',')})`,
//         //     [reporttype, ...normalPointList]
//         // );
//         const normalPointList = normalPointRows.map(row => row.sensorname);
//         const normalPointListValues = normalPointList.map(() => '?').join(',');
//         const [normalListRows] = await connection.query(
//             `SELECT * FROM Sensor_List WHERE reporttype = ? AND sensorname IN (${normalPointListValues})`,
//             [reporttype, ...normalPointList]
//         );
        
//         const normalList = normalPointList.map(sensorname => normalListRows.find(row => row.sensorname === sensorname));
//         // console.log(5)
//         // console.log("Normallist", normalList)
//         // Get attribute types from NormalList
//         const attributes = normalList.map(row => row.attributetype);

//         const [rows] = await connection.query(`DESCRIBE ${TABLE_TO_USE}`);
//         connection.release();
//         const columns = rows.map(row => row.Field);
//         // console.log("columns",columns)
//         // Get rows from TABLE_TO_USE table where first column value is between datebegin and dateend
//         const [tableRows] = await connection.query(
//             `SELECT * FROM ${TABLE_TO_USE} WHERE ${columns[0]} BETWEEN ? AND ? `,
//             [datebegin, dateend]
//         );
//         // console.log(6)
//         // Filter rows to include only attributes from Normallist
//         const finalArray = tableRows.map(row => {
//             const filteredRow = {};
//             Object.keys(row).forEach(key => {
//                 if (key === `${columns[0]}` || key === `${columns[1]}` || attributes.includes(key)) {
//                     filteredRow[key] = row[key];
//                 }
//             });
//             // console.log(7)
//             // res.setHeader('Access-Control-Allow-Origin', '*');
//             return filteredRow;
//         });
//         connection.release();
//         // console.log(8)
//         const response = { firstheader: setList, secondheader: normalList, body: finalArray ,attributelist:columns};
//         res.setHeader('Access-Control-Allow-Origin', '*');
//         // console.log(9)
//         res.json(response);
//         // console.log(10)
    
//     } 
    
    
    
//     catch (error) {
//         res.setHeader('Access-Control-Allow-Origin', '*');
//         console.error(error);
//         // console.log(11)
//         res.status(500).json({ message: 'Server Error' ,err:error});
//         // console.log(12)
//     }
// });

















// router.get('/pwd_auto/search', async (req, res) => {
//     const reportid = req.body.reportid;
//     const TABLE_TO_USE = req.body.table;
//     try {
//         const connection = await getConnection();
//     // Get datebegin, dateend, and reporttype from Description table based on reportid
//         const [descriptionRows] = await connection.query(
//             'SELECT datebegin, dateend, reporttype FROM Description WHERE reportid = ?',
//             [reportid]
//         );
//         const [{ datebegin, dateend, reporttype }] = descriptionRows;

//     // Get Setpointlist and Normalpointlist based on reportid from Set_Points table
//         const [setPointRows] = await connection.query(
//             'SELECT sensorname FROM Set_Points WHERE reportid = ? ORDER BY sensorname ASC',
//             [reportid]
//         );
//         const setPointList = setPointRows.map(({ sensorname }) => sensorname);

//         const [normalPointRows] = await connection.query(
//             'SELECT sensorname FROM Normal_Points WHERE reportid = ? ORDER BY sensorname ASC',
//             [reportid]
//         );
//         const normalPointList = normalPointRows.map(({ sensorname }) => sensorname);

//     // Get SetList and NormalList from Sensor_List table
//         const [setListRows] = await connection.query(
//             `SELECT * FROM Sensor_List WHERE reporttype = ? AND sensorname IN (${setPointList.map(() => '?').join(',')})`,
//             [reporttype, ...setPointList]
//         );
//         const setList = setListRows.sort((a, b) =>
//             setPointList.indexOf(a.sensorname) - setPointList.indexOf(b.sensorname)
//         );

//         const [normalListRows] = await connection.query(
//             `SELECT * FROM Sensor_List WHERE reporttype = ? AND sensorname IN (${normalPointList.map(() => '?').join(',')})`,
//             [reporttype, ...normalPointList]
//         );
//         const normalList = normalListRows.sort((a, b) =>
//             normalPointList.indexOf(a.sensorname) - normalPointList.indexOf(b.sensorname)
//         );

//     // Get attributes from Normallist
//         const attributes = normalList.map(({ attributetype }) => attributetype);

//     // Get rows from TABLE_TO_USE between datebegin and dateend
//         const [tableRows] = await connection.query(
//             `SELECT * FROM ${TABLE_TO_USE} WHERE firstcolumn BETWEEN ? AND ?`,
//             [datebegin, dateend]
//         );

//     // Filter rows to include only attributes from Normallist
//         const finalArray = tableRows.map(row => {
//             const filteredRow = {};
//             Object.keys(row).forEach(key => {
//                 if (key === 'firstcolumn' || key === 'secondcolumn' || attributes.includes(key)) {
//                     filteredRow[key] = row[key];
//                 }
//             });
//             return filteredRow;
//         });

//         connection.release();

//         const response = { firstheader: setList, secondheader: normalList, body: finalArray };
//         res.json(response);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });


module.exports = router;



// const sql = `INSERT INTO audit_report_prototype (Head1, Head2, Unit, AttributeType) VALUES (?, ?, ?, ?)`;

// // Execute query
// connection.query(sql, [Head1, Head2, Unit, AttributeType], (error, results, fields) => {
//     if (error) {
//         console.error(error);
//         res.status(500).send('Internal server error');
//     } else {
//         res.status(200).send('Values added successfully');
//     }
// });
// });



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

// const express = require('express');
// const cors = require('cors');
// const mysql = require('mysql2/promise');

// const app = express();
// app.use(cors());
// app.use(express.json());

// const port = 3000;

// // Create a connection pool to reuse connections
// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     password: 'password',
//     database: 'mydatabase',
//     connectionLimit: 10,
// });

// // Helper function to get a connection from the pool
// const getConnection = async () => {
//     try {
//         const connection = await pool.getConnection();
//         return connection;
//     } catch (error) {
//         console.error(error);
//         throw new Error('Error getting connection from pool');
//     }
// };

// // Endpoint to handle advance search
// app.post('/advancesearch', async (req, res) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');

//     // Get report id and table name from request body
//     const { reportid, table } = req.body;

//     try {
//         // Get datebegin, dateend, and reporttype from Description table
//         const connection = await getConnection();
//         const [descriptionRows] = await connection.query(
//             'SELECT datebegin, dateend, reporttype FROM descriptiontable WHERE reportid = ?',
//             [reportid]
//         );
//         const [{ datebegin, dateend, reporttype }] = descriptionRows;

//         // Get SetPointList and NormalPointList from Set_Points and Normal_Points tables
//         const [setPointRows] = await connection.query(
//             'SELECT sensorname FROM Set_Points WHERE reportid = ? ORDER BY sensorname ASC',
//             [reportid]
//         );
//         const setPointList = setPointRows.map(row => row.sensorname);

//         const [normalPointRows] = await connection.query(
//             'SELECT sensorname FROM Normal_Points WHERE reportid = ? ORDER BY sensorname ASC',
//             [reportid]
//         );
//         const normalPointList = normalPointRows.map(row => row.sensorname);

//         // Get SetList and NormalList from Sensor_List table
//         const setListValues = setPointList.map(() => '?').join(',');
//         const [setListRows] = await connection.query(
//             `SELECT * FROM Sensor_List WHERE reporttype = ? AND sensorname IN (${setListValues})`,
//             [reporttype, ...setPointList]
//         );
//         const setList = setPointList.map(sensorname => setListRows.find(row => row.sensorname === sensorname));

//         const normalListValues = normalPointList.map(() => '?').join(',');
//         const [normalListRows] = await connection.query(
//             `SELECT * FROM Sensor_List WHERE reporttype = ? AND sensorname IN (${normalListValues})`,
//             [reporttype, ...normalPointList]
//         );
//         const normalList = normalPointList.map(sensorname => normalListRows.find(row => row.sensorname === sensorname));

//         // Get attribute types from NormalList
//         const attributes = normalList.map(row => row.attributetype);

//         // Get column names from table
//         const [rows] = await connection.query(`DESCRIBE ${table}`);
//         const columns = rows.map(row => row.Field);

//         // Get rows from table where first column value is between datebegin and dateend
//         const [tableRows] = await connection.query(
//             `SELECT * FROM ${table} WHERE ${columns[0]} BETWEEN ? AND ? `,
//             [datebegin, dateend]
//         );

//         // Filter rows to include only attributes from NormalList
//         const finalArray = tableRows.map(row => {
//             const filteredRow =
