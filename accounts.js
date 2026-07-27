import { db } from "./firebase.js";

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const table = document.getElementById("employeesTable");

onValue(ref(db, "maintenance"), (snapshot) => {

    let employees = {};

    snapshot.forEach((item) => {

        const data = item.val();

        const name = data.employee || "غير معروف";

        if (!employees[name]) {

            employees[name] = {

                repairs: 0,
                installs: 0,
                transfers: 0,
                money: 0

            };

        }

        if (data.type === "صيانة") {

            employees[name].repairs++;

        } else if (data.type === "تركيبة") {

            employees[name].installs++;

        } else if (data.type === "قلبة") {

            employees[name].transfers++;

        }

        employees[name].money += Number(data.price || 0);

    });

    table.innerHTML = "";

    Object.keys(employees).forEach((name) => {

        const e = employees[name];

        table.innerHTML += `

        <tr>

            <td>${name}</td>

            <td>${e.repairs}</td>

            <td>${e.installs}</td>

            <td>${e.transfers}</td>

            <td>${e.money}</td>

        </tr>

        `;

    });



    // أكثر الموظفين

    let bestRepair = { name: "-", count: 0 };
    let bestInstall = { name: "-", count: 0 };
    let bestTransfer = { name: "-", count: 0 };

    Object.keys(employees).forEach((name) => {

        let e = employees[name];

        if (e.repairs > bestRepair.count) {

            bestRepair = {
                name: name,
                count: e.repairs
            };

        }

        if (e.installs > bestInstall.count) {

            bestInstall = {
                name: name,
                count: e.installs
            };

        }

        if (e.transfers > bestTransfer.count) {

            bestTransfer = {
                name: name,
                count: e.transfers
            };

        }

    });



    document.getElementById("bestRepairName").innerHTML =
        bestRepair.name;

    document.getElementById("bestRepairCount").innerHTML =
        bestRepair.count + " صيانة";



    document.getElementById("bestInstallName").innerHTML =
        bestInstall.name;

    document.getElementById("bestInstallCount").innerHTML =
        bestInstall.count + " تركيبة";



    document.getElementById("bestTransferName").innerHTML =
        bestTransfer.name;

    document.getElementById("bestTransferCount").innerHTML =
        bestTransfer.count + " قلبة";

});
