let allStudents = [];
let allSubjects = [];
let allSessions = [];
let currentSessionAttendance = [];


/* =====================================================
   PAGE NAVIGATION
===================================================== */

function showPage(pageId, button) {

    const pages =
        document.querySelectorAll(".page");


    pages.forEach(function (page) {
        page.classList.remove("active");
    });


    const selectedPage =
        document.getElementById(pageId);


    if (selectedPage) {
        selectedPage.classList.add("active");
    }


    const buttons =
        document.querySelectorAll(".menu-button");


    buttons.forEach(function (menuButton) {
        menuButton.classList.remove("active");
    });


    if (button) {
        button.classList.add("active");
    }


    const titles = {

        dashboard: "Dashboard",
        students: "Students",
        subjects: "Subjects",
        sessions: "Sessions",
        attendance: "Attendance",
        shortage: "Shortage"

    };


    document.getElementById("pageTitle").textContent =
        titles[pageId] || "AttendEase";


    if (pageId === "dashboard") {
        loadDashboard();
    }


    if (pageId === "students") {
        loadStudents();
    }


    if (pageId === "subjects") {
        loadSubjects();
    }


    if (pageId === "sessions") {
        loadSessions();
    }


    if (pageId === "attendance") {
        prepareAttendancePage();
    }


    if (pageId === "shortage") {
        prepareShortagePage();
    }

}


/* =====================================================
   STUDENTS
===================================================== */

async function loadStudents() {

    try {

        const response =
            await fetch("/api/students");


        if (!response.ok) {
            throw new Error("Failed to load students");
        }


        allStudents =
            await response.json();


        displayStudents(allStudents);


        document.getElementById("studentCount").textContent =
            allStudents.length;

    }

    catch (error) {

        console.error(error);

        document.getElementById("studentTableBody").innerHTML = `
            <tr>
                <td colspan="5">
                    Failed to load students.
                </td>
            </tr>
        `;

    }

}


function displayStudents(students) {

    const tableBody =
        document.getElementById("studentTableBody");


    tableBody.innerHTML = "";


    if (students.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    No students found.
                </td>
            </tr>
        `;

        return;
    }


    students.forEach(function (student) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${student.id}</td>

            <td>${student.name}</td>

            <td>${student.rollNumber}</td>

            <td>${student.email || ""}</td>

            <td>

                <button
                    class="edit-button"
                    onclick="editStudent(${student.id})">
                    Edit
                </button>

                <button
                    class="delete-button"
                    onclick="deleteStudent(${student.id})">
                    Delete
                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


function searchStudents() {

    const searchText =
        document
            .getElementById("studentSearch")
            .value
            .toLowerCase();


    const filteredStudents =
        allStudents.filter(function (student) {

            return (

                student.name
                    .toLowerCase()
                    .includes(searchText)

                ||

                student.rollNumber
                    .toLowerCase()
                    .includes(searchText)

            );

        });


    displayStudents(filteredStudents);

}


function openStudentForm() {

    document
        .getElementById("studentForm")
        .classList.remove("hidden");


    document.getElementById("studentFormTitle")
        .textContent = "Add Student";


    document.getElementById("studentId")
        .value = "";


    document.getElementById("studentName")
        .value = "";


    document.getElementById("studentRollNumber")
        .value = "";


    document.getElementById("studentEmail")
        .value = "";


    document.getElementById("studentError")
        .textContent = "";

}


function closeStudentForm() {

    document
        .getElementById("studentForm")
        .classList.add("hidden");

}


async function saveStudent() {

    const id =
        document.getElementById("studentId").value;


    const name =
        document
            .getElementById("studentName")
            .value
            .trim();


    const rollNumber =
        document
            .getElementById("studentRollNumber")
            .value
            .trim();


    const email =
        document
            .getElementById("studentEmail")
            .value
            .trim();


    const errorElement =
        document.getElementById("studentError");


    errorElement.textContent = "";


    if (!name || !rollNumber) {

        errorElement.textContent =
            "Name and roll number are required.";

        return;
    }


    const student = {
        name: name,
        rollNumber: rollNumber,
        email: email
    };


    try {

        let response;


        if (id) {

            response =
                await fetch(`/api/students/${id}`, {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(student)

                });

        }

        else {

            response =
                await fetch("/api/students", {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(student)

                });

        }


        const data =
            await response.json();


        if (!response.ok) {

            if (data.message) {
                throw new Error(data.message);
            }


            const firstError =
                Object.values(data)[0];


            throw new Error(
                firstError ||
                "Unable to save student."
            );

        }


        closeStudentForm();

        await loadStudents();

        alert(
            id
                ? "Student updated successfully."
                : "Student added successfully."
        );

    }

    catch (error) {

        errorElement.textContent =
            error.message;

    }

}


function editStudent(id) {

    const student =
        allStudents.find(function (item) {
            return item.id === id;
        });


    if (!student) {
        return;
    }


    document
        .getElementById("studentForm")
        .classList.remove("hidden");


    document.getElementById("studentFormTitle")
        .textContent = "Edit Student";


    document.getElementById("studentId")
        .value = student.id;


    document.getElementById("studentName")
        .value = student.name;


    document.getElementById("studentRollNumber")
        .value = student.rollNumber;


    document.getElementById("studentEmail")
        .value = student.email || "";


    document.getElementById("studentError")
        .textContent = "";

}


async function deleteStudent(id) {

    if (!confirm(
        "Are you sure you want to delete this student?"
    )) {
        return;
    }


    try {

        const response =
            await fetch(`/api/students/${id}`, {
                method: "DELETE"
            });


        const data =
            await response.text();


        if (!response.ok) {
            throw new Error(
                data || "Failed to delete student."
            );
        }


        await loadStudents();

        alert(
            "Student deleted successfully."
        );

    }

    catch (error) {

        alert(error.message);

    }

}


/* =====================================================
   SUBJECTS
===================================================== */

async function loadSubjects() {

    try {

        const response =
            await fetch("/api/subjects");


        if (!response.ok) {
            throw new Error("Failed to load subjects");
        }


        allSubjects =
            await response.json();


        displaySubjects(allSubjects);


        document.getElementById("subjectCount").textContent =
            allSubjects.length;

    }

    catch (error) {

        console.error(error);

        document.getElementById("subjectTableBody").innerHTML = `
            <tr>
                <td colspan="4">
                    Failed to load subjects.
                </td>
            </tr>
        `;

    }

}


function displaySubjects(subjects) {

    const tableBody =
        document.getElementById("subjectTableBody");


    tableBody.innerHTML = "";


    if (subjects.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="4">
                    No subjects found.
                </td>
            </tr>
        `;

        return;
    }


    subjects.forEach(function (subject) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${subject.id}</td>

            <td>${subject.name}</td>

            <td>${subject.code}</td>

            <td>

                <button
                    class="edit-button"
                    onclick="editSubject(${subject.id})">
                    Edit
                </button>

                <button
                    class="delete-button"
                    onclick="deleteSubject(${subject.id})">
                    Delete
                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


function searchSubjects() {

    const searchText =
        document
            .getElementById("subjectSearch")
            .value
            .toLowerCase();


    const filteredSubjects =
        allSubjects.filter(function (subject) {

            return (

                subject.name
                    .toLowerCase()
                    .includes(searchText)

                ||

                subject.code
                    .toLowerCase()
                    .includes(searchText)

            );

        });


    displaySubjects(filteredSubjects);

}


function openSubjectForm() {

    document
        .getElementById("subjectForm")
        .classList.remove("hidden");


    document.getElementById("subjectFormTitle")
        .textContent = "Add Subject";


    document.getElementById("subjectId")
        .value = "";


    document.getElementById("subjectName")
        .value = "";


    document.getElementById("subjectCode")
        .value = "";


    document.getElementById("subjectError")
        .textContent = "";

}


function closeSubjectForm() {

    document
        .getElementById("subjectForm")
        .classList.add("hidden");

}


async function saveSubject() {

    const id =
        document.getElementById("subjectId").value;


    const name =
        document
            .getElementById("subjectName")
            .value
            .trim();


    const code =
        document
            .getElementById("subjectCode")
            .value
            .trim();


    const errorElement =
        document.getElementById("subjectError");


    errorElement.textContent = "";


    if (!name || !code) {

        errorElement.textContent =
            "Subject name and code are required.";

        return;
    }


    const subject = {
        name: name,
        code: code
    };


    try {

        let response;


        if (id) {

            response =
                await fetch(`/api/subjects/${id}`, {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(subject)

                });

        }

        else {

            response =
                await fetch("/api/subjects", {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(subject)

                });

        }


        const data =
            await response.json();


        if (!response.ok) {

            if (data.message) {
                throw new Error(data.message);
            }


            const firstError =
                Object.values(data)[0];


            throw new Error(
                firstError ||
                "Unable to save subject."
            );

        }


        closeSubjectForm();

        await loadSubjects();

        alert(
            id
                ? "Subject updated successfully."
                : "Subject added successfully."
        );

    }

    catch (error) {

        errorElement.textContent =
            error.message;

    }

}


function editSubject(id) {

    const subject =
        allSubjects.find(function (item) {
            return item.id === id;
        });


    if (!subject) {
        return;
    }


    document
        .getElementById("subjectForm")
        .classList.remove("hidden");


    document.getElementById("subjectFormTitle")
        .textContent = "Edit Subject";


    document.getElementById("subjectId")
        .value = subject.id;


    document.getElementById("subjectName")
        .value = subject.name;


    document.getElementById("subjectCode")
        .value = subject.code;


    document.getElementById("subjectError")
        .textContent = "";

}


async function deleteSubject(id) {

    if (!confirm(
        "Are you sure you want to delete this subject?"
    )) {
        return;
    }


    try {

        const response =
            await fetch(`/api/subjects/${id}`, {
                method: "DELETE"
            });


        const data =
            await response.text();


        if (!response.ok) {
            throw new Error(
                data || "Failed to delete subject."
            );
        }


        await loadSubjects();

        alert(
            "Subject deleted successfully."
        );

    }

    catch (error) {

        alert(error.message);

    }

}


/* =====================================================
   SESSIONS
===================================================== */

async function loadSessions() {

    try {

        const response =
            await fetch("/api/sessions");


        if (!response.ok) {
            throw new Error("Failed to load sessions");
        }


        allSessions =
            await response.json();


        displaySessions(allSessions);


        document.getElementById("sessionCount").textContent =
            allSessions.length;

    }

    catch (error) {

        console.error(error);

        document.getElementById("sessionTableBody").innerHTML = `
            <tr>
                <td colspan="5">
                    Failed to load sessions.
                </td>
            </tr>
        `;

    }

}


function displaySessions(sessions) {

    const tableBody =
        document.getElementById("sessionTableBody");


    tableBody.innerHTML = "";


    if (sessions.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    No sessions found.
                </td>
            </tr>
        `;

        return;
    }


    sessions.forEach(function (session) {

        const subjectName =
            session.subject
                ? session.subject.name
                : "Unknown";


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${session.id}</td>

            <td>${subjectName}</td>

            <td>${session.sessionDate}</td>

            <td>${session.sessionTime}</td>

            <td>

                <button
                    class="delete-button"
                    onclick="deleteSession(${session.id})">

                    Delete

                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


async function openSessionForm() {

    await loadSubjects();


    const select =
        document.getElementById(
            "sessionSubject"
        );


    select.innerHTML =
        `<option value="">Select Subject</option>`;


    allSubjects.forEach(function (subject) {

        const option =
            document.createElement("option");


        option.value =
            subject.id;


        option.textContent =
            `${subject.name} (${subject.code})`;


        select.appendChild(option);

    });


    document
        .getElementById("sessionForm")
        .classList.remove("hidden");


    document.getElementById("sessionDate")
        .value = "";


    document.getElementById("sessionTime")
        .value = "";


    document.getElementById("sessionError")
        .textContent = "";

}


function closeSessionForm() {

    document
        .getElementById("sessionForm")
        .classList.add("hidden");

}


async function saveSession() {

    const subjectId =
        document
            .getElementById("sessionSubject")
            .value;


    const sessionDate =
        document
            .getElementById("sessionDate")
            .value;


    const sessionTime =
        document
            .getElementById("sessionTime")
            .value;


    const errorElement =
        document.getElementById(
            "sessionError"
        );


    errorElement.textContent = "";


    if (!subjectId ||
        !sessionDate ||
        !sessionTime) {

        errorElement.textContent =
            "Subject, date and time are required.";

        return;
    }


    const session = {

        sessionDate: sessionDate,

        sessionTime: sessionTime,

        subject: {
            id: Number(subjectId)
        }

    };


    try {

        const response =
            await fetch("/api/sessions", {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(session)

            });


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to create session."
            );

        }


        closeSessionForm();

        await loadSessions();

        alert(
            "Session created successfully."
        );

    }

    catch (error) {

        errorElement.textContent =
            error.message;

    }

}


async function deleteSession(id) {

    if (!confirm(
        "Are you sure you want to delete this session?"
    )) {
        return;
    }


    try {

        const response =
            await fetch(`/api/sessions/${id}`, {

                method: "DELETE"

            });


        const data =
            await response.text();


        if (!response.ok) {

            throw new Error(
                data ||
                "Failed to delete session."
            );

        }


        await loadSessions();

        alert(
            "Session deleted successfully."
        );

    }

    catch (error) {

        alert(error.message);

    }

}


/* =====================================================
   ATTENDANCE
===================================================== */

async function prepareAttendancePage() {

    await loadStudents();

    await loadSessions();


    const select =
        document.getElementById(
            "attendanceSession"
        );


    select.innerHTML =
        `<option value="">Select Session</option>`;


    allSessions.forEach(function (session) {

        const option =
            document.createElement("option");


        option.value =
            session.id;


        const subjectName =
            session.subject
                ? session.subject.name
                : "Unknown";


        option.textContent =
            `${subjectName} - ${session.sessionDate} ${session.sessionTime}`;


        select.appendChild(option);

    });


    document.getElementById(
        "attendanceTableBody"
    ).innerHTML = `
        <tr>
            <td colspan="5">
                Select a session to mark attendance.
            </td>
        </tr>
    `;

}


async function loadSessionAttendance() {

    const sessionId =
        document
            .getElementById("attendanceSession")
            .value;


    if (!sessionId) {

        return;

    }


    try {

        const response =
            await fetch(
                `/api/attendance/session/${sessionId}`
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load attendance."
            );

        }


        currentSessionAttendance =
            await response.json();


        displayAttendance();

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}


function displayAttendance() {

    const tableBody =
        document.getElementById(
            "attendanceTableBody"
        );


    tableBody.innerHTML = "";


    allStudents.forEach(function (student) {

        const record =
            currentSessionAttendance.find(
                function (item) {

                    return item.student.id === student.id;

                }
            );


        const row =
            document.createElement("tr");


        let statusText = "Not Marked";


        let statusClass = "";


        if (record) {

            statusText =
                record.status;


            statusClass =
                record.status === "PRESENT"
                    ? "status-present"
                    : "status-absent";

        }


        row.innerHTML = `

            <td>
                ${student.id}
            </td>

            <td>
                ${student.name}
            </td>

            <td>
                ${student.rollNumber}
            </td>

            <td class="${statusClass}">
                ${statusText}
            </td>

            <td>

                ${record

                ?

                `
                    <button
                        class="edit-button"
                        onclick="correctAttendance(
                            ${record.id},
                            'PRESENT'
                        )">

                        Present

                    </button>

                    <button
                        class="delete-button"
                        onclick="correctAttendance(
                            ${record.id},
                            'ABSENT'
                        )">

                        Absent

                    </button>
                    `

                :

                `
                    <button
                        class="attendance-button"
                        onclick="markAttendance(
                            ${student.id},
                            ${document.getElementById("attendanceSession").value},
                            'PRESENT'
                        )">

                        Present

                    </button>

                    <button
                        class="delete-button"
                        onclick="markAttendance(
                            ${student.id},
                            ${document.getElementById("attendanceSession").value},
                            'ABSENT'
                        )">

                        Absent

                    </button>
                    `

            }

            </td>

        `;


        tableBody.appendChild(row);

    });

}


async function markAttendance(
    studentId,
    sessionId,
    status
) {

    try {

        const response =
            await fetch(
                `/api/attendance?studentId=${studentId}&sessionId=${sessionId}&status=${status}`,
                {
                    method: "POST"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to mark attendance."
            );

        }


        await loadSessionAttendance();


        alert(
            `Attendance marked ${status}.`
        );

    }

    catch (error) {

        alert(error.message);

    }

}


async function correctAttendance(
    attendanceId,
    status
) {

    try {

        const response =
            await fetch(
                `/api/attendance/${attendanceId}?status=${status}`,
                {
                    method: "PUT"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to correct attendance."
            );

        }


        await loadSessionAttendance();


        alert(
            `Attendance corrected to ${status}.`
        );

    }

    catch (error) {

        alert(error.message);

    }

}


/* =====================================================
   SHORTAGE
===================================================== */

async function prepareShortagePage() {

    await loadSubjects();


    const select =
        document.getElementById(
            "shortageSubject"
        );


    select.innerHTML =
        `<option value="">Select Subject</option>`;


    allSubjects.forEach(function (subject) {

        const option =
            document.createElement("option");


        option.value =
            subject.id;


        option.textContent =
            `${subject.name} (${subject.code})`;


        select.appendChild(option);

    });


    document.getElementById(
        "shortageTableBody"
    ).innerHTML = `
        <tr>
            <td colspan="3">
                Select a subject to view shortage students.
            </td>
        </tr>
    `;

}


async function loadShortage() {

    const subjectId =
        document
            .getElementById("shortageSubject")
            .value;


    if (!subjectId) {

        return;

    }


    try {

        const response =
            await fetch(
                `/api/attendance/shortage/subject/${subjectId}`
            );


        const records =
            await response.json();


        if (!response.ok) {

            throw new Error(
                records.message ||
                "Failed to load shortage data."
            );

        }


        displayShortage(records);

    }

    catch (error) {

        alert(error.message);

    }

}


function displayShortage(records) {

    const tableBody =
        document.getElementById(
            "shortageTableBody"
        );


    tableBody.innerHTML = "";


    if (records.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="3">
                    No students are currently below 75%.
                </td>
            </tr>
        `;

        return;

    }


    const students =
        new Map();


    records.forEach(function (record) {

        if (!students.has(record.student.id)) {

            students.set(
                record.student.id,
                {
                    student: record.student,
                    count: 0
                }
            );

        }


        students.get(
            record.student.id
        ).count++;

    });


    students.forEach(function (item) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${item.student.name}
            </td>

            <td>
                ${item.student.rollNumber}
            </td>

            <td class="status-shortage">
                Shortage
            </td>

        `;


        tableBody.appendChild(row);

    });

}


/* =====================================================
   DASHBOARD
===================================================== */

async function loadDashboard() {

    try {

        const studentsResponse =
            await fetch("/api/students");


        const students =
            await studentsResponse.json();


        document.getElementById(
            "studentCount"
        ).textContent =
            students.length;


        const subjectsResponse =
            await fetch("/api/subjects");


        const subjects =
            await subjectsResponse.json();


        document.getElementById(
            "subjectCount"
        ).textContent =
            subjects.length;


        const sessionsResponse =
            await fetch("/api/sessions");


        const sessions =
            await sessionsResponse.json();


        document.getElementById(
            "sessionCount"
        ).textContent =
            sessions.length;


        let attendanceCount = 0;


        for (const session of sessions) {

            try {

                const response =
                    await fetch(
                        `/api/attendance/session/${session.id}`
                    );


                if (response.ok) {

                    const records =
                        await response.json();


                    attendanceCount +=
                        records.length;

                }

            }

            catch (error) {

                console.error(error);

            }

        }


        document.getElementById(
            "attendanceCount"
        ).textContent =
            attendanceCount;

    }

    catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

    }

}


/* =====================================================
   INITIAL LOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDashboard();

        loadStudents();

        loadSubjects();

    }
);