import { db, auth } from "./firebase.js";

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


const table = document.getElementById("dailyTable");


const today = new Date().toLocaleDateString("ar");





onAuthStateChanged(auth,(user)=>{


    if(!user){

        window.location.href="../login.html";

        return;

    }


    loadDaily(user.uid);


});







function loadDaily(uid){


    onValue(ref(db,"maintenance"),(snapshot)=>{


        let repair = 0;

        let install = 0;

        let transfer = 0;

        let money = 0;



        table.innerHTML = "";



        // جلب الصلاحية
        let role = localStorage.getItem("role");



        console.log("UID الحالي:", uid);

        console.log("الصلاحية:", role);





        snapshot.forEach((item)=>{


            let row = item.val();



            console.log(
                "الطلب:",
                row.name,
                row.uid
            );





            // الموظف يرى طلباته فقط
            if(role !== "admin"){


                if(row.uid !== uid){

                    return;

                }


            }






            // عمليات اليوم فقط

            if(row.date !== today){

                return;

            }






            if(row.type === "صيانة"){


                repair++;


            }
            else if(row.type === "تركيبة"){


                install++;


            }
            else if(row.type === "قلبة"){


                transfer++;


            }




            money += Number(row.price || 0);






            table.innerHTML += `

            <tr>


            <td>
            ${row.employee || "غير معروف"}
            </td>


            <td>
            ${row.type || ""}
            </td>


            <td>
            ${row.name || ""}
            </td>


            <td>
            ${row.tower || ""}
            </td>


            <td>
            ${row.price || 0}
            </td>


            <td>
            ${row.date || ""}
            </td>


            </tr>

            `;



        });







        if(table.innerHTML === ""){


            table.innerHTML = `

            <tr>

            <td colspan="6">
            لا توجد عمليات اليوم
            </td>

            </tr>

            `;


        }






        document.getElementById("dailyRepair").innerHTML =
        repair;



        document.getElementById("dailyInstall").innerHTML =
        install;



        document.getElementById("dailyTransfer").innerHTML =
        transfer;



        document.getElementById("dailyMoney").innerHTML =
        money;




    });


}
