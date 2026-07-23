import { db } from "./firebase.js";

import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";



const table = document.getElementById("dailyTable");


// تاريخ اليوم
const today = new Date().toLocaleDateString("ar");



function loadDaily(){


    onValue(ref(db,"maintenance"),(snapshot)=>{


        let repair = 0;
        let install = 0;
        let transfer = 0;
        let money = 0;


        table.innerHTML = "";



        snapshot.forEach((item)=>{


            const row = item.val();



            // إذا كان التاريخ غير موجود لا نتجاهله
            let rowDate = row.date || "";


            if(rowDate === today){


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


            }



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




        document.getElementById("dailyRepair").innerHTML = repair;

        document.getElementById("dailyInstall").innerHTML = install;

        document.getElementById("dailyTransfer").innerHTML = transfer;

        document.getElementById("dailyMoney").innerHTML = money;



    });


}



loadDaily();
