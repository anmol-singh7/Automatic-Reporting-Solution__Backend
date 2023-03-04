const x = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const arr = [['apple', 2, 7, 'banana', 5], 
       [8, 'cherry', 'date', 4, 9], 
       [1, 'elderberry', 3, 6, 'banana']]
    const tt=JSON.stringify(arr);
    var raw = JSON.stringify({
        "setreportid": "2023-01-06 10:26:11.00000009:43123ABCABS-896645467000004V_1",
        "arraydata": tt
    });
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    const x = await fetch("https://create-users.onrender.com/api/addsetvalues", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));



}
x();