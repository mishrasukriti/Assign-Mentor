let url = "http://localhost:3000"

/**
 * Function to create student
 */
function createStudent(){
    let studentName = document.getElementById('studentName1').value;
    let email = document.getElementById('studentEmail').value;
    console.log("inserting student:" + studentName);
    fetch(url + `/add-student`, {
        method: "POST",
        body: JSON.stringify({
            name: studentName, email, mentorAssigned: "false"
        }),
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then((resp) => resp.json())
        .then((data) => {
            console.log("hello test console#1");
            let studentSelectForMentorChange = document.getElementById('studentSelectForChange');
            let studentSelectForAssign = document.getElementById('studentsSelect');
            
            let studentOptionForMentorChange = document.createElement('option');
            let studentOptionForMentorAssign = document.createElement('option');
            
            studentOptionForMentorChange.value = studentName;
            studentOptionForMentorAssign.value = studentName;
            
            studentSelectForMentorChange.appendChild(studentOptionForMentorChange);
            studentSelectForAssign.appendChild(studentOptionForMentorAssign);
            // document.body.appendChild(studentSelectForMentorChange);
        })

}

/**
 * Function to create Mentor
 */
function createMentor(){
    let mentorName = document.getElementById('mentorName').value;
    let email = document.getElementById('mentorEmail').value;
    fetch(url + `/add-mentor`, {
        method: "POST",
        body: JSON.stringify({
            name: mentorName, email, studentList: []
        }),
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then((resp) => resp.json())
        .then((data) => {
            let mentorSelectForMentorChange = document.getElementById('mentorSelectForChange');
            let mentorSelectForAssign = document.getElementById('mentorSelect'); mentorSelectForGettingStudents
            let mentorSelectToShowStudent = document.getElementById('mentorSelectForGettingStudents');
            
            let mentorOptionForMentorChange = document.createElement('option');
            let mentorOptionForMentorAssign = document.createElement('option');
            let mentorOptionToShowStudent = document.createElement('option');
            
            mentorOptionForMentorChange.innerHTML = mentorName;
            mentorOptionForMentorAssign.innerHTML = mentorName;
            mentorOptionToShowStudent.innerHTML = mentorName;
            
            mentorSelectForMentorChange.appendChild(mentorOptionForMentorChange);
            mentorSelectForAssign.appendChild(mentorOptionForMentorAssign);
            mentorSelectToShowStudent.appendChild(mentorOptionToShowStudent);
        })

}

/**
 * Function to change/Assign Mentor
 */
function changeMentor(){

}

/**
 * Function to Assign Students to Mentor
 */
function assignStudentsToMentor(){

}

/**
 * Function to show List of students for a particular mentor
 */
function getStudents() {
    let mentor = document.getElementById("mentorSelectForGettingStudents").value;
    fetch(url+`/get-student/${mentor}`)
        .then((resp) => {
            return resp.json()
        })
        .then((data) => {
            console.log(data);
            data.result.studentList.forEach(name => {
                createTrTd(name)
            });
        })
}


/**
 * Function to create Table Rows
 * @param {*}studentName  
 * @param {*} email 
 */

 
function createTrTd(studentName) {
    var tr = document.createElement('tr');
    var td1 = document.createElement('td');
    td1.innerHTML = studentName;
    tr.append(td1);
    document.getElementById('tbody').append(tr);
}

