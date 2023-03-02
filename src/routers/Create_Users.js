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

// router.post('/description', async (req, res) => {
//     const {
//         userid,
//         clientid,
//         reporttype,
//         systems,
//         manufacturer,
//         datebegin,
//         timebegin,
//         dateend,
//         timeend,
//         status,
//         timetype,
//         reportid,
//     } = req.body;

//     try {
//         const connection = await getConnection();
//         if (
//             !userid ||
//             !clientid ||
//             !reporttype ||
//             !systems ||
//             !manufacturer ||
//             !datebegin ||
//             !timebegin ||
//             !dateend ||
//             !timeend ||
//             !status ||
//             !timetype ||
//             !reportid
//         ) {
//             return res.status(400).json({ message: 'Invalid request' });
//         }

//         // Get the current number of rows in the table
//         const [row] = await connection.query('SELECT COUNT(*) AS count FROM descriptiontable');

//         // Generate the Sensor_Name for the new row based on the current number of rows
//         const sensorName = `S${row[0].count + 1}`;

//         const result = await connection.query(
//             'INSERT INTO descriptiontable (userid, clientid, reporttype, systems, manufacturer, datebegin, timebegin, dateend, timeend, status, timetype, reportid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
//             [
//                 userid,
//                 clientid,
//                 reporttype,
//                 systems,
//                 manufacturer,
//                 datebegin,
//                 timebegin,
//                 dateend,
//                 timeend,
//                 status,
//                 timetype,
//                 reportid,
//             ]
//         );
//         connection.release();
//         res.json({ message: 'New row added successfully', sensorName });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });

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
        const reportid = `${datebegin}${timebegin}${clientid}${userid}${codegeneratedVianumberrep}V_1`;

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


// router.post('/normalpoints', async (req, res) => {
//     const data = req.body;

//     try {
//         const connection = await getConnection();

//         if (!Array.isArray(data)) {
//             return res.status(400).json({ message: 'Invalid request' });
//         }

//         const values = data.map((item) => [item.reportid, item.sensorname]);

//         const result = await connection.query(
//             'INSERT INTO `Normal_Points` (reportid, sensorname) VALUES ?',
//             [values]
//         );

//         connection.release();
//         res.json({ message: 'New rows added successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });


// router.get('/setpoints', async (req, res) => {
//     const { reportid } = req.body;
//     try {
//         const connection = await getConnection();
//         const [result] = await connection.query(
//             'SELECT data FROM Set_Points WHERE reportid = ?',
//             [reportid]
//         );
//         connection.release();
//         if (!result.length) {
//             return res.status(404).json({ message: 'No data found for this reportid' });
//         }
//         res.json(result[0].data) ;
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });

router.post('/setpoints', async (req, res) => {
    try {
        const connection = await getConnection();

        const sensorData = req.body; // Expect an array of JSON objects in the request body
        const insertPromises = sensorData.map(async (data) => {
            // Check if this report ID and sensor name already exist in the Set_Points table
            const [rows] = await connection.query('SELECT * FROM Set_Points WHERE reportid = ? AND sensorname = ?', [data.reportid, data.sensorname]);
            if (rows.length === 0) {
                // Insert a new row into the Set_Points table
                await connection.query('INSERT INTO Set_Points (reportid, sensorname) VALUES (?, ?)', [data.reportid, data.sensorname]);
            }
        });

        connection.release();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({ message: 'New data added successfully' });
    } catch (error) {
        console.error(error);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/normalpoints', async (req, res) => {
    try {
        const connection = await getConnection();

        const sensorData = req.body; // Expect an array of JSON objects in the request body
        const insertPromises = sensorData.map(async (data) => {
            // Check if this report ID and sensor name already exist in the Set_Points table
            const [rows] = await connection.query('SELECT * FROM Normal_Points WHERE reportid = ? AND sensorname = ?', [data.reportid, data.sensorname]);
            if (rows.length === 0) {
                // Insert a new row into the Set_Points table
                await connection.query('INSERT INTO Normal_Points (reportid, sensorname) VALUES (?, ?)', [data.reportid, data.sensorname]);
            }
        });

        connection.release();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json({ message: 'New data added successfully' });
    } catch (error) {
        console.error(error);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(500).json({ message: 'Server Error' });
    }
});

// router.get('/pwd_auto/search', async (req, res) => {
    
//         const datebegin= "2023-01-06 10:27:11.000000";
//         const dateend   ="2023-01-06 10:40:11.000000";
//         const reporttype="Aut"


//     try {
//         const connection = await getConnection();
//         const [rows] = await connection.query(
//             'SELECT * FROM pwd_auto WHERE CurDT BETWEEN ? AND ? ORDER BY CurDT ASC',
//             [datebegin, dateend]
//         );
//         connection.release();

//         res.json(rows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });


// router.get('/pwd_auto/search', async (req, res) => {
//     const datebegin = "2023-01-06 10:27:11.000000";
//     const dateend = "2023-01-06 10:40:11.000000";
//     const reporttype = "Aut";

//     try {
//         const connection = await getConnection();
//         // Get list of sensors matching reporttype from Sensor_List table
//         const [sensorListRows] = await connection.query(
//             'SELECT sensorname, attributetype FROM Sensor_List WHERE reporttype = ?',
//             [reporttype]
//         );
//         const sensorList = sensorListRows.map(row => row.attributetype);
//         connection.release();

//         // Get data from pwd_auto table for selected sensors and time range
//         const [pwdAutoRows] = await connection.query(
//             'SELECT * FROM pwd_auto WHERE CurDT BETWEEN ? AND ? AND sensorname IN (?) ORDER BY CurDT ASC',
//             [datebegin, dateend, sensorList]
//         );
//         connection.release();

//         // Remove unwanted fields from rows
//         const rows = pwdAutoRows.map(row => {
//             const filteredRow = {};
//             sensorList.forEach(sensor => {
//                 filteredRow[sensor] = row[sensor];
//             });
//             return filteredRow;
//         });

//         // Add attributetype to each sensor in response
//         const sensorsWithAttributes = sensorListRows.map(row => ({
//             sensorname: row.sensorname,
//             attributetype: row.attributetype
//         }));

//         // Combine filtered rows and sensor attributes into response object
//         const response = {
//             sensors: sensorsWithAttributes,
//             data: rows
//         };

//         res.json(response);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });

// router.get('/pwd_auto/search', async (req, res) => {
//     const datebegin = "2023-01-06 10:27:11.000000";
//     const dateend = "2023-01-06 10:40:11.000000";
//     const reporttype = "Aut"

//     try {
//         const connection = await getConnection();

//         // Get attribute types from Sensor_List table where reporttype=Aut
//         const [sensorListRows] = await connection.query(
//             'SELECT attributetype FROM Sensor_List WHERE reporttype = ?',
//             [reporttype]
//         );
//         const attributeTypes = sensorListRows.map(row => row.attributetype);

//         // Get rows from pwd_auto table where CurDT is between datebegin and dateend
//         const [pwdAutoRows] = await connection.query(
//             'SELECT * FROM pwd_auto WHERE CurDT BETWEEN ? AND ? ORDER BY CurDT ASC',
//             [datebegin, dateend]
//         );

//         // Remove any keys from each row that are not in the attributeTypes list
//         const filteredRows = pwdAutoRows.map(row => {
//             const filteredRow = {};
//             Object.keys(row).forEach(key => {
//                 if (attributeTypes.includes(key)) {
//                     filteredRow[key] = row[key];
//                 }
//             });
//             return filteredRow;
//         });

//         connection.release();

//         res.json(filteredRows);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });

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
    res.setHeader('Access-Control-Allow-Origin', '*');
    const reportid = req.body.reportid;
    const TABLE_TO_USE=req.body.table;
    try {
        res.setHeader('Access-Control-Allow-Origin', '*');
        const connection = await getConnection();

        // Get datebegin, dateend, and reporttype from Description table
        const [descriptionRows] = await connection.query(
            'SELECT datebegin, dateend, reporttype FROM Description WHERE reportid = ?',
            [reportid]
        );
        const [{ datebegin, dateend, reporttype }] = descriptionRows;

        // Get SetPointList and NormalPointList from Set_Points and Normal_Points tables
        const [setPointRows] = await connection.query(
            'SELECT sensorname FROM Set_Points WHERE reportid = ? ORDER BY sensorname ASC',
            [reportid]
        );
        const setPointList = setPointRows.map(row => row.sensorname);

        const [normalPointRows] = await connection.query(
            'SELECT sensorname FROM Normal_Points WHERE reportid = ? ORDER BY sensorname ASC',
            [reportid]
        );
        const normalPointList = normalPointRows.map(row => row.sensorname);

        // Get SetList and NormalList from Sensor_List table
        const [setListRows] = await connection.query(
            `SELECT * FROM Sensor_List WHERE reporttype = ? AND sensorname IN (${setPointList.map(() => '?').join(',')})`,
            [reporttype, ...setPointList]
        );

        const setList = setPointList.map(sensorname => setListRows.find(row => row.sensorname === sensorname));

        const [normalListRows] = await connection.query(
            `SELECT * FROM Sensor_List WHERE reporttype = ? AND sensorname IN (${normalPointList.map(() => '?').join(',')})`,
            [reporttype, ...normalPointList]
        );
        const normalList = normalPointList.map(sensorname => normalListRows.find(row => row.sensorname === sensorname));

        // Get attribute types from NormalList
        const attributes = normalList.map(row => row.attributetype);

        const [rows] = await connection.query('DESCRIBE pwd_auto');
        connection.release();
        const columns = rows.map(row => row.Field);
        // Get rows from TABLE_TO_USE table where first column value is between datebegin and dateend
        const [tempRows] = await connection.query(
            `SELECT * FROM ${TABLE_TO_USE} WHERE ${columns[0]} BETWEEN ? AND ? `,
            [datebegin, dateend]
        );



        // Filter rows to include only attributes from Normallist
        const finalArray = tableRows.map(row => {
            const filteredRow = {};
            Object.keys(row).forEach(key => {
                if (key === `${columns[0]}` || key === `${columns[1]}` || attributes.includes(key)) {
                    filteredRow[key] = row[key];
                }
            });
            res.setHeader('Access-Control-Allow-Origin', '*');
            return filteredRow;
        });

        connection.release();

        const response = { firstheader: setList, secondheader: normalList, body: finalArray ,attributelist:columns};
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(response);
    } catch (error) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

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

