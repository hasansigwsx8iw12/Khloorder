<!DOCTYPE html>
<html lang="ar" dir="rtl">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>KHLLO NET | الطلبات</title>


    <!-- Font Awesome -->

    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
    >


    <!-- Cairo -->

    <link
        href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
    >


    <style>

        *{
            box-sizing:border-box;
            margin:0;
            padding:0;
        }


        :root{

            --bg:#04100b;

            --card:#0b2118;

            --card2:#071910;

            --green:#28ed91;

            --dark:#0a9c62;

            --text:#f4fff9;

            --muted:#91afa1;

            --orange:#ffb84d;

            --blue:#67a4ff;

            --red:#ff6877;

            --border:#28ed9125;

        }


        body{

            min-height:100vh;

            font-family:
                'Cairo',
                Arial,
                sans-serif;

            background:

                radial-gradient(
                    circle at 15% 10%,
                    #164d3480,
                    transparent 30%
                ),

                radial-gradient(
                    circle at 90% 90%,
                    #0b714c55,
                    transparent 30%
                ),

                var(--bg);

            color:var(--text);

        }


        /* ================= SIDEBAR ================= */

        .sidebar{

            width:260px;

            height:100vh;

            position:fixed;

            top:0;

            right:0;

            background:#0b2118;

            border-left:
                1px solid
                rgba(40,237,145,.15);

            box-shadow:
                0 0 25px #0008;

            z-index:1000;

        }


        .side-logo{

            height:90px;

            display:flex;

            align-items:center;

            justify-content:center;

            color:#fff;

            font-size:22px;

            font-weight:800;

            border-bottom:
                1px solid
                #ffffff18;

        }


        .sidebar ul{

            list-style:none;

            padding:15px 10px;

        }


        .sidebar li{

            margin:8px 0;

        }


        .sidebar a{

            color:#fff;

            text-decoration:none;

            display:flex;

            align-items:center;

            gap:15px;

            padding:14px 16px;

            border-radius:12px;

            transition:.3s;

            font-size:15px;

            cursor:pointer;

        }


        .sidebar a:hover{

            background:#28ed9125;

        }


        .sidebar li.active a{

            background:var(--green);

            color:#04100b;

            box-shadow:
                0 5px 20px
                #28ed9135;

        }


        .sidebar i{

            width:22px;

            text-align:center;

            font-size:18px;

        }


        /* ================= PAGE ================= */

        .page{

            width:calc(100% - 260px);

            margin-right:260px;

            padding:30px;

        }


        .brand{

            display:flex;

            align-items:center;

            gap:12px;

            margin-bottom:25px;

        }


        .logo{

            width:55px;

            height:55px;

            border-radius:17px;

            display:grid;

            place-items:center;

            background:
                linear-gradient(
                    135deg,
                    var(--green),
                    var(--dark)
                );

            color:#03140d;

            font-size:29px;

            font-weight:900;

        }


        .brand h2{

            font-size:22px;

        }


        .brand p{

            font-size:12px;

            color:var(--muted);

            margin-top:3px;

        }


        /* ================= STATS ================= */

        .stats{

            display:grid;

            grid-template-columns:
                repeat(4,1fr);

            gap:15px;

            margin-bottom:22px;

        }


        .stat{

            background:#0b2118ee;

            border:
                1px solid
                var(--border);

            border-radius:20px;

            padding:20px;

        }


        .stat i{

            color:var(--green);

            font-size:22px;

            margin-bottom:8px;

        }


        .stat span{

            display:block;

            color:var(--muted);

            font-size:13px;

        }


        .stat strong{

            display:block;

            font-size:28px;

            color:var(--green);

            margin-top:3px;

        }


        /* ================= REQUESTS ================= */

        .requests{

            background:#0b2118ee;

            border:
                1px solid
                var(--border);

            border-radius:23px;

            padding:25px;

        }


        .title{

            margin-bottom:22px;

        }


        .title h1{

            font-size:24px;

        }


        .title p{

            color:var(--muted);

            font-size:12px;

            margin-top:5px;

        }


        /* ================= FILTER ================= */

        .filters{

            display:flex;

            gap:10px;

            flex-wrap:wrap;

            margin-bottom:22px;

        }


        .filter-btn{

            border:
                1px solid
                var(--border);

            background:#071910;

            color:#fff;

            border-radius:12px;

            padding:10px 15px;

            font-family:inherit;

            cursor:pointer;

            transition:.3s;

        }


        .filter-btn:hover{

            border-color:var(--green);

        }


        .filter-btn.active{

            background:var(--green);

            color:#04100b;

            font-weight:bold;

        }


        /* ================= GRID ================= */

        .requests-grid{

            display:grid;

            grid-template-columns:
                repeat(
                    auto-fill,
                    minmax(330px,1fr)
                );

            gap:18px;

        }


        /* ================= REQUEST BOX ================= */

        .request-box{

            background:#071910;

            border:
                1px solid
                var(--border);

            border-radius:20px;

            padding:20px;

            transition:.3s;

        }


        .request-box:hover{

            transform:translateY(-3px);

            border-color:#28ed9155;

            box-shadow:
                0 15px 40px
                #0006;

        }


        .request-head{

            display:flex;

            align-items:center;

            justify-content:space-between;

            gap:10px;

            margin-bottom:15px;

        }


        .type{

            display:inline-flex;

            align-items:center;

            gap:7px;

            color:var(--green);

            font-weight:bold;

        }


        .status{

            padding:5px 10px;

            border-radius:20px;

            font-size:11px;

            background:#ffb84d18;

            color:var(--orange);

            white-space:nowrap;

        }


        .status.received{

            background:#28ed9118;

            color:var(--green);

        }


        .status.ready{

            background:#438cff18;

            color:var(--blue);

        }


        /* ================= INFO ================= */

        .info{

            display:grid;

            gap:9px;

            margin-bottom:18px;

        }


        .info div{

            display:flex;

            justify-content:space-between;

            gap:10px;

            font-size:13px;

            border-bottom:
                1px solid
                #ffffff08;

            padding-bottom:7px;

        }


        .info span{

            color:var(--muted);

        }


        .info strong{

            color:#fff;

            text-align:left;

            max-width:60%;

            overflow-wrap:anywhere;

        }


        /* ================= PROBLEM ================= */

        .problem{

            background:#ffffff05;

            border-radius:12px;

            padding:12px;

            margin-bottom:15px;

        }


        .problem span{

            display:block;

            color:var(--muted);

            font-size:11px;

            margin-bottom:4px;

        }


        .problem p{

            font-size:13px;

            line-height:1.8;

        }


        /* ================= BUTTONS ================= */

        .request-actions{

            display:flex;

            flex-direction:column;

            gap:8px;

        }


        .request-actions button{

            width:100%;

            border:0;

            border-radius:12px;

            padding:12px;

            font-family:inherit;

            font-weight:bold;

            cursor:pointer;

            transition:.3s;

        }


        .request-actions button:hover{

            transform:translateY(-2px);

        }


        .receive-btn{

            background:var(--green);

            color:#04100b;

        }


        .ready-btn{

            background:var(--blue);

            color:#07101f;

        }


        .details-btn{

            background:#162d24;

            color:#fff;

        }


        .request-actions button:disabled{

            opacity:.5;

            cursor:not-allowed;

            transform:none;

        }


        /* ================= EMPTY ================= */

        .empty{

            grid-column:1/-1;

            text-align:center;

            padding:60px 20px;

            color:var(--muted);

        }


        .empty i{

            font-size:50px;

            color:#28ed9140;

            margin-bottom:15px;

        }


        .empty p{

            font-size:14px;

        }


        /* ================= LOADING ================= */

        .loading{

            grid-column:1/-1;

            text-align:center;

            padding:50px;

            color:var(--muted);

        }


        .loading i{

            font-size:35px;

            color:var(--green);

            margin-bottom:12px;

        }


        /* ================= MODAL ================= */

        .modal{

            position:fixed;

            inset:0;

            background:#000b;

            display:flex;

            align-items:center;

            justify-content:center;

            padding:20px;

            z-index:2000;

        }


        .modal.hidden{

            display:none;

        }


        .modal-box{

            width:min(550px,100%);

            max-height:90vh;

            overflow:auto;

            background:#0b2118;

            border:
                1px solid
                #28ed9140;

            border-radius:23px;

            padding:25px;

            box-shadow:
                0 25px 80px
                #000;

        }


        .modal-box h2{

            margin-bottom:5px;

        }


        .modal-sub{

            color:var(--muted);

            font-size:12px;

            margin-bottom:20px;

        }


        .field{

            margin-bottom:13px;

        }


        .field label{

            display:block;

            color:var(--muted);

            font-size:12px;

            margin-bottom:6px;

        }


        .field input,

        .field textarea,

        .field select{

            width:100%;

            padding:12px;

            border:
                1px solid
                #28ed9130;

            border-radius:12px;

            background:#0005;

            color:#fff;

            outline:none;

            font-family:inherit;

        }


        .field textarea{

            min-height:90px;

            resize:vertical;

        }


        .field input:focus,

        .field textarea:focus,

        .field select:focus{

            border-color:var(--green);

        }


        .modal-actions{

            display:flex;

            gap:10px;

            margin-top:20px;

        }


        .modal-actions button{

            flex:1;

            border:0;

            border-radius:12px;

            padding:12px;

            font-family:inherit;

            font-weight:bold;

            cursor:pointer;

        }


        .cancel-btn{

            background:#162d24;

            color:#fff;

        }


        .save-btn{

            background:var(--green);

            color:#04100b;

        }


        /* ================= MOBILE ================= */

        @media(max-width:900px){

            .stats{

                grid-template-columns:
                    repeat(2,1fr);

            }

        }


        @media(max-width:700px){

            .sidebar{

                width:75px;

            }


            .side-logo{

                font-size:0;

                height:75px;

            }


            .side-logo::after{

                content:"K";

                font-size:26px;

            }


            .sidebar a{

                justify-content:center;

                padding:14px 8px;

            }


            .sidebar a span{

                display:none;

            }


            .sidebar i{

                font-size:20px;

            }


            .page{

                width:calc(100% - 75px);

                margin-right:75px;

                padding:15px;

            }


            .requests{

                padding:17px;

            }


            .requests-grid{

                grid-template-columns:1fr;

            }


            .request-head{

                align-items:flex-start;

            }

        }


        @media(max-width:500px){

            .stats{

                grid-template-columns:
                    1fr 1fr;

            }


            .stat{

                padding:15px;

            }


            .stat strong{

                font-size:23px;

            }


            .modal-box{

                padding:18px;

            }


            .modal-actions{

                flex-direction:column;

            }

        }

    </style>

</head>


<body>


    <!-- ================= SIDEBAR ================= -->

    <aside class="sidebar">

        <div class="side-logo">
            KHLLO NET
        </div>


        <ul>

            <li>

                <a href="index.html">

                    <i class="fa-solid fa-house"></i>

                    <span>الرئيسية</span>

                </a>

            </li>


            <li>

                <a href="add.html">

                    <i class="fa-solid fa-plus"></i>

                    <span>إضافة طلب</span>

                </a>

            </li>


            <li class="active">

                <a href="requests.html">

                    <i class="fa-solid fa-inbox"></i>

                    <span>الطلبات</span>

                </a>

            </li>


            <li>

                <a href="repairs.html">

                    <i class="fa-solid fa-screwdriver-wrench"></i>

                    <span>الصيانات</span>

                </a>

            </li>


            <li>

                <a href="daily.html">

                    <i class="fa-solid fa-calendar-days"></i>

                    <span>السجل اليومي</span>

                </a>

            </li>


            <li>

                <a href="accounts.html">

                    <i class="fa-solid fa-wallet"></i>

                    <span>الحسابات</span>

                </a>

            </li>


            <li>

                <a href="users.html">

                    <i class="fa-solid fa-users"></i>

                    <span>المستخدمون</span>

                </a>

            </li>


            <li>

                <a
                    href="javascript:void(0)"
                    onclick="logout()"
                >

                    <i class="fa-solid fa-right-from-bracket"></i>

                    <span>تسجيل الخروج</span>

                </a>

            </li>

        </ul>

    </aside>



    <!-- ================= PAGE ================= -->

    <main class="page">


        <!-- BRAND -->

        <header class="brand">

            <div class="logo">
                K
            </div>


            <div>

                <h2>
                    KHLLO NET
                </h2>

                <p>
                    إدارة الطلبات ومتابعة تنفيذها
                </p>

            </div>

        </header>



        <!-- ================= STATS ================= -->

        <section class="stats">


            <div class="stat">

                <i class="fa-solid fa-inbox"></i>

                <span>
                    كل الطلبات
                </span>

                <strong id="totalRequests">
                    0
                </strong>

            </div>


            <div class="stat">

                <i class="fa-solid fa-clock"></i>

                <span>
                    طلبات جديدة
                </span>

                <strong id="newRequests">
                    0
                </strong>

            </div>


            <div class="stat">

                <i class="fa-solid fa-hand"></i>

                <span>
                    تم الاستلام
                </span>

                <strong id="receivedRequests">
                    0
                </strong>

            </div>


            <div class="stat">

                <i class="fa-solid fa-check"></i>

                <span>
                    جاهزة
                </span>

                <strong id="readyRequests">
                    0
                </strong>

            </div>


        </section>



        <!-- ================= REQUESTS ================= -->

        <section class="requests">


            <div class="title">

                <h1>
                    الطلبات
                </h1>

                <p>
                    جميع الطلبات الواردة إلى KHLLO NET
                </p>

            </div>



            <!-- FILTERS -->

            <div class="filters">

                <button
                    class="filter-btn active"
                    data-filter="all"
                >
                    الكل
                </button>


                <button
                    class="filter-btn"
                    data-filter="new"
                >
                    🆕 جديدة
                </button>


                <button
                    class="filter-btn"
                    data-filter="received"
                >
                    📥 مستلمة
                </button>


                <button
                    class="filter-btn"
                    data-filter="ready"
                >
                    ✅ جاهزة
                </button>

            </div>



            <!-- REQUESTS GRID -->

            <div
                id="requestsGrid"
                class="requests-grid"
            >

                <div class="loading">

                    <i
                        class="fa-solid fa-spinner fa-spin"
                    ></i>

                    <p>
                        جاري تحميل الطلبات...
                    </p>

                </div>

            </div>


        </section>


    </main>



    <!-- ================= DETAILS MODAL ================= -->

    <div
        id="detailsModal"
        class="modal hidden"
    >

        <div class="modal-box">


            <h2 id="modalTitle">
                تفاصيل التنفيذ
            </h2>


            <p
                id="modalSub"
                class="modal-sub"
            >
                أدخل معلومات تنفيذ الطلب
            </p>


            <!-- مشكلة الصيانة -->

            <div
                class="field"
                id="problemField"
            >

                <label>
                    مشكلة الزبون
                </label>

                <textarea
                    id="problemInput"
                    placeholder="اكتب مشكلة الزبون..."
                ></textarea>

            </div>


            <!-- المبلغ -->

            <div class="field">

                <label>
                    المبلغ الذي تم أخذه من الزبون
                </label>

                <input
                    id="priceInput"
                    type="number"
                    min="0"
                    placeholder="مثلاً 50000"
                >

            </div>


            <!-- الإشارة -->

            <div class="field">

                <label>
                    الإشارة
                </label>

                <input
                    id="signalInput"
                    placeholder="مثلاً 80%"
                >

            </div>


            <!-- برج الربط -->

            <div class="field">

                <label>
                    برج الربط
                </label>

                <input
                    id="towerInput"
                    placeholder="اسم برج الربط"
                >

            </div>


            <!-- السكتور -->

            <div
                class="field"
                id="sectorField"
            >

                <label>
                    السكتور
                </label>

                <input
                    id="sectorInput"
                    placeholder="اسم السكتور"
                >

            </div>


            <!-- ACTIONS -->

            <div class="modal-actions">

                <button
                    id="cancelDetails"
                    class="cancel-btn"
                    type="button"
                >
                    إلغاء
                </button>


                <button
                    id="saveDetails"
                    class="save-btn"
                    type="button"
                >
                    حفظ وإنهاء الطلب
                </button>

            </div>


        </div>

    </div>



    <!-- ================= SCRIPTS ================= -->

    <script
        type="module"
        src="protect.js"
    ></script>


    <script
        type="module"
        src="requests.js"
    ></script>


</body>

</html>
