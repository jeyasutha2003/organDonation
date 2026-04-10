const MIN_GAS = 1000000;

function loadLocalStorage(key) {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
}

function saveLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function storageKey(user) {
    if (user === "Pledge") return "pledges";
    if (user === "Donors" || user === "Donor") return "donors";
    if (user === "Patient") return "patients";
    return null;
}

function getList(user) {
    const key = storageKey(user);
    return key ? loadLocalStorage(key) : [];
}

function hasMedicalID(user, medical_id) {
    return getList(user).some(item => item.medical_id === medical_id);
}

function getRecord(user, medical_id) {
    return getList(user).find(item => item.medical_id === medical_id);
}

function saveRecord(user, record) {
    const list = getList(user);
    list.push(record);
    saveLocalStorage(storageKey(user), list);
}

function deleteRecord(user, medical_id) {
    const list = getList(user).filter(item => item.medical_id !== medical_id);
    saveLocalStorage(storageKey(user), list);
}

function clearTable(table) {
    if (!table) return;
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
}

function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}

function generateTable(table, data) {
    for (let element of data) {
        let row = table.insertRow();
        for (const key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }
    }
}

function selectRow() {
    var table = document.getElementById('pending-table');
    var cells = table.getElementsByTagName('td');

    for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        cell.onclick = function () {
            var rowId = this.parentNode.rowIndex;
            var rowsNotSelected = table.getElementsByTagName('tr');
            for (var row = 0; row < rowsNotSelected.length; row++) {
                rowsNotSelected[row].style.backgroundColor = "";
                rowsNotSelected[row].style.fontWeight = "";
                rowsNotSelected[row].classList.remove('selected');
            }
            var rowSelected = table.getElementsByTagName('tr')[rowId];
            rowSelected.style.backgroundColor = "#aad7ec";
            rowSelected.style.fontWeight = 800;
            rowSelected.className += " selected";

            var row_value = [];
            for (var j = 0; j < rowSelected.cells.length; j++) {
                row_value[j] = rowSelected.cells[j].innerHTML;
            }
            console.log("Selected row: " + row_value);
            document.getElementById("getPledgeFullName").innerHTML = row_value[1];
            document.getElementById("getPledgeAge").innerHTML = row_value[2];
            document.getElementById("getPledgeGender").innerHTML = row_value[3];
            document.getElementById("getPledgeMedicalID").innerHTML = row_value[4];
            document.getElementById("getPledgeBloodType").innerHTML = row_value[5];
            document.getElementById("getPledgeOrgan").innerHTML = row_value[6];
            document.getElementById("getPledgeWeight").innerHTML = row_value[7];
            document.getElementById("getPledgeHeight").innerHTML = row_value[8];
            document.getElementById("PledgeMessage").innerHTML = null;

            var textcontainer = document.getElementById("text-hidden");
            if (textcontainer) {
                textcontainer.className = 'verification';
            }
        }
    }
}

function showWarning(user, message, color) {
    let userid = user + "InputCheck";
    var warning = document.querySelector(".alert.warning");
    if (!warning) return;
    warning.style.background = color;
    var target = document.getElementById(userid);
    if (target) target.innerHTML = message;
    warning.style.opacity = "100";
    warning.style.display = "block";
}

function checkInputValues(user, fullname, age, gender, medical_id, organ, weight, height) {
    var color = "#ff9800";
    if (fullname == "")
        showWarning(user, "Enter your name", color);
    else if (age.length == 0)
        showWarning(user, "Enter your age", color);
    else if (user == "Pledge" && age < 18)
        showWarning(user, "You must be over 18 to pledge", color);
    else if (gender == null)
        showWarning(user, "Enter your gender", color);
    else if (medical_id.length == 0)
        showWarning(user, "Enter your Medical ID", color);
    else if (organ.length == 0)
        showWarning(user, "Enter organ(s)", color);
    else if (weight.length == 0)
        showWarning(user, "Enter your weight", color);
    else if (weight < 20 || weight > 200)
        showWarning(user, "Enter proper weight", color);
    else if (height.length == 0)
        showWarning(user, "Enter your height", color);
    else if (height < 54 || height > 272)
        showWarning(user, "Enter proper height", color);
    else {
        return true;
    }
}

function assignSearchValues(result, user) {
    document.getElementById("get" + user + "FullName").innerHTML = "Full Name: " + result[0];
    document.getElementById("get" + user + "Age").innerHTML = "Age: " + result[1];
    document.getElementById("get" + user + "Gender").innerHTML = "Gender: " + result[2];
    document.getElementById("get" + user + "BloodType").innerHTML = "Blood Type: " + result[3];
    document.getElementById("get" + user + "Organ").innerHTML = "Organ: " + result[4];
    document.getElementById("get" + user + "Weight").innerHTML = "Weight: " + result[5];
    document.getElementById("get" + user + "Height").innerHTML = "Height: " + result[6];
}

function clearSearchValues(user) {
    document.getElementById("get" + user + "FullName").innerHTML = null;
    document.getElementById("get" + user + "Age").innerHTML = null;
    document.getElementById("get" + user + "Gender").innerHTML = null;
    document.getElementById("get" + user + "BloodType").innerHTML = null;
    document.getElementById("get" + user + "Organ").innerHTML = null;
    document.getElementById("get" + user + "Weight").innerHTML = null;
    document.getElementById("get" + user + "Height").innerHTML = null;
}

function clearFormFields(user) {
    // Clear text inputs
    document.getElementById(user + 'FullName').value = '';
    document.getElementById(user + 'Age').value = '';
    document.getElementById(user + 'MedicalID').value = '';
    document.getElementById(user + 'BloodType').value = 'A-';
    document.getElementById(user + 'Weight').value = '';
    document.getElementById(user + 'Height').value = '';
    
    // Clear radio buttons
    const genderRadios = document.querySelectorAll("input[name='gender']");
    genderRadios.forEach(radio => radio.checked = false);
    
    // Clear checkboxes
    const organCheckboxes = document.querySelectorAll("input[name='Organ']");
    organCheckboxes.forEach(checkbox => checkbox.checked = false);
}

const App = {
    closeAlert: async function() {
        var alert = document.querySelector(".alert.warning");
        if (!alert) return;
        alert.style.opacity = "0";
        setTimeout(function() { alert.style.display = "none"; }, 600);
    },

    register: async function(user) {
        console.log(user);
        const fullname = document.getElementById(user + 'FullName').value;
        const age = document.getElementById(user + 'Age').value;
        const selectedGender = document.querySelector("input[name='gender']:checked");
        const gender = (selectedGender) ? selectedGender.value : null;
        const medical_id = document.getElementById(user + 'MedicalID').value;
        const blood_type = document.getElementById(user + 'BloodType').value;
        let checkboxes = document.querySelectorAll("input[name='Organ']:checked");
        let organ = [];
        checkboxes.forEach((checkbox) => {
            organ.push(checkbox.value);
        });
        const weight = document.getElementById(user + 'Weight').value;
        const height = document.getElementById(user + 'Height').value;

        let checkedValues = checkInputValues(user, fullname, age, gender, medical_id, organ, weight, height);
        var warning = document.querySelector(".alert.warning");
        if (checkedValues) {
            if (!hasMedicalID(user, medical_id)) {
                const record = {
                    fullname,
                    age,
                    gender,
                    medical_id,
                    blood_type,
                    organ,
                    weight,
                    height
                };

                saveRecord(user, record);
                clearFormFields(user);
                showWarning(user, "Registration Successful!", "#04AA6D");
                setTimeout(function() {
                    if (warning) {
                        warning.style.opacity = "0";
                        setTimeout(function() { 
                            warning.style.display = "none";
                            window.location.href = "index.html";
                        }, 600);
                    }
                }, 1000);
            } else {
                showWarning(user, "Medical ID already exists!", "#f44336");
            }
        }
    },

    forwardPledge: async function() {
        const medical_id = document.getElementById('getPledgeMedicalID').innerHTML;
        const pledge = getRecord('Pledge', medical_id);
        if (!pledge) {
            document.getElementById("PledgeMessage").innerHTML = "Pledge record not found.";
            return;
        }
        if (hasMedicalID('Donor', medical_id)) {
            document.getElementById("PledgeMessage").innerHTML = "This donor already exists.";
            return;
        }
        saveRecord('Donor', pledge);
        deleteRecord('Pledge', medical_id);
        document.getElementById("PledgeMessage").innerHTML = "Donor successfully registered from pledge.";
    },

    search: async function(user) {
        console.log(user);
        const medical_id = document.getElementById("input" + user + "MedicalID").value;
        if (medical_id.length == 0) {
            document.getElementById("search" + user + "Check").innerHTML = "Enter Medical ID";
            clearSearchValues(user);
            return;
        }

        const record = getRecord(user, medical_id);
        if (record) {
            document.getElementById("search" + user + "Check").innerHTML = null;
            assignSearchValues([record.fullname, record.age, record.gender, record.blood_type, record.organ, record.weight, record.height], user);
        } else {
            document.getElementById("search" + user + "Check").innerHTML = "Medical ID does not exist!";
            clearSearchValues(user);
        }
    },

    verifyPledges: async function() {
        const pledges = getList('Pledge');
        const table = document.querySelector("#pending-table table");
        if (!table) return;

        clearTable(table);
        let initialTableGeneration = true;
        let tableCreated = false;

        for (let i = 0; i < pledges.length; i++) {
            const pledge = pledges[i];
            if (!hasMedicalID('Donor', pledge.medical_id)) {
                tableCreated = true;
                const row = [{
                    Index: i + 1,
                    "Full Name": pledge.fullname,
                    Age: pledge.age,
                    Gender: pledge.gender,
                    "Medical ID": pledge.medical_id,
                    "Blood-Type": pledge.blood_type,
                    Organ: pledge.organ,
                    Weight: pledge.weight,
                    Height: pledge.height
                }];
                const data = Object.keys(row[0]);
                if (initialTableGeneration) {
                    generateTableHead(table, data);
                    initialTableGeneration = false;
                }
                generateTable(table, row);
            }
        }

        if (tableCreated) {
            selectRow();
        } else {
            document.getElementById("pending-table-message").innerHTML = "No pending pledges found!";
        }
        const spinner = document.querySelector(".spinner");
        if (spinner) spinner.style.display = "none";
    },

    viewPledges: async function() {
        const pledges = getList('Pledge');
        const table = document.querySelector("table");
        if (!table) return;
        clearTable(table);

        for (let i = 0; i < pledges.length; i++) {
            const pledge = pledges[i];
            const row = [{
                Index: i + 1,
                "Full Name": pledge.fullname,
                Age: pledge.age,
                Gender: pledge.gender,
                "Medical ID": pledge.medical_id,
                "Blood-Type": pledge.blood_type,
                Organ: pledge.organ,
                Weight: pledge.weight,
                Height: pledge.height
            }];
            const data = Object.keys(row[0]);
            if (i == 0) generateTableHead(table, data);
            generateTable(table, row);
        }
        const spinner = document.querySelector(".spinner");
        if (spinner) spinner.style.display = "none";
    },

    viewDonors: async function() {
        const donors = getList('Donor');
        const table = document.querySelector("table");
        if (!table) return;
        clearTable(table);

        for (let i = 0; i < donors.length; i++) {
            const donor = donors[i];
            const row = [{
                Index: i + 1,
                "Full Name": donor.fullname,
                Age: donor.age,
                Gender: donor.gender,
                "Medical ID": donor.medical_id,
                "Blood Type": donor.blood_type,
                "Organ(s)": donor.organ,
                "Weight(kg)": donor.weight,
                "Height(cm)": donor.height
            }];
            const data = Object.keys(row[0]);
            if (i == 0) generateTableHead(table, data);
            generateTable(table, row);
        }
        const spinner = document.querySelector(".spinner");
        if (spinner) spinner.style.display = "none";
    },

    viewPatients: async function() {
        const patients = getList('Patient');
        const table = document.querySelector("table");
        if (!table) return;
        clearTable(table);

        for (let i = 0; i < patients.length; i++) {
            const patient = patients[i];
            const row = [{
                Index: i + 1,
                "Full Name": patient.fullname,
                Age: patient.age,
                Gender: patient.gender,
                "Medical ID": patient.medical_id,
                "Blood Type": patient.blood_type,
                "Organ(s)": patient.organ,
                "Weight(kg)": patient.weight,
                "Height(cm)": patient.height
            }];
            const data = Object.keys(row[0]);
            if (i == 0) generateTableHead(table, data);
            generateTable(table, row);
        }
        const spinner = document.querySelector(".spinner");
        if (spinner) spinner.style.display = "none";
    },

    transplantMatch: async function() {
        const table = document.getElementById("transplantTable");
        if (!table) return;
        clearTable(table);

        const patients = getList('Patient').map(p => ({ ...p, organs: Array.isArray(p.organ) ? p.organ.slice() : [] }));
        const donors = getList('Donor').map(d => ({ ...d, organs: Array.isArray(d.organ) ? d.organ.slice() : [], organcount: Array.isArray(d.organ) ? d.organ.length : 0 }));

        let initialTableGeneration = true;

        for (let i = 0; i < patients.length; i++) {
            const patient = patients[i];
            for (let poi = 0; poi < patient.organs.length; poi++) {
                const requiredOrgan = patient.organs[poi];
                for (let j = 0; j < donors.length; j++) {
                    const donor = donors[j];
                    if (donor.organcount === 0) continue;
                    const doi = donor.organs.indexOf(requiredOrgan);
                    if (doi >= 0 && donor.blood_type === patient.blood_type) {
                        const match = [{
                            "Patient Name": patient.fullname,
                            "Patient Organ": requiredOrgan,
                            "Patient Medical ID": patient.medical_id,
                            "": "↔️",
                            "Donor Medical ID": donor.medical_id,
                            "Donor Organ": requiredOrgan,
                            "Donor Name": donor.fullname
                        }];
                        const data = Object.keys(match[0]);
                        if (initialTableGeneration) {
                            generateTableHead(table, data);
                            initialTableGeneration = false;
                        }
                        generateTable(table, match);
                        donor.organs.splice(doi, 1);
                        donor.organcount = donor.organs.length;
                        break;
                    }
                }
            }
        }
        const spinner = document.querySelector(".spinner");
        if (spinner) spinner.style.display = "none";
    }
};

window.App = App;
