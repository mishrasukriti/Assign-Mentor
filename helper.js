let url = "http://localhost:3000"
fillMentorInSelectBox();
fillStudentInSelectBox();
/**
 * Function to fill student names in all select options
 */
function fillStudentInSelectBox(){
    document.getElementById('studentSelectForChange').innerHTML = '';
    document.getElementById('studentsSelect').innerHTML = ''; 

    fetch(url+`/get-students`)
            .then((resp) => {
                return resp.json()
            })
            .then((data) => {
                console.log(data);
                data.result.forEach(student => {
                    createStudentOption(student);
                    console.log("inside fillStudentInSelectBox")
                });
            })
}

/**
 * Function to fill Student name in all select options
 */
function createStudentOption(student){
    let studentSelectForMentorChange = document.getElementById('studentSelectForChange');
    let studentSelectForAssign = document.getElementById('studentsSelect');
    
    let studentOptionForMentorChange = document.createElement('option');
    studentOptionForMentorChange.innerHTML = student.name;
    studentSelectForMentorChange.appendChild(studentOptionForMentorChange);

    if(student.mentorAssigned=== "false"){
        let studentOptionForMentorAssign = document.createElement('option');
        studentOptionForMentorAssign.innerHTML = student.name;
        studentSelectForAssign.appendChild(studentOptionForMentorAssign);
    }
            
}


/**
 * Function to fill mentor name in all select options
 */
function fillMentorInSelectBox(){
    document.getElementById('mentorSelectForChange').innerHTML = '';
    document.getElementById('mentorSelect').innerHTML = ''; 
    document.getElementById('mentorSelectForGettingStudents').innerHTML= '';

    fetch(url+`/get-mentors`)
            .then((resp) => {
                return resp.json()
            })
            .then((data) => {
                console.log(data);
                data.result.forEach(element => {
                    createMentorOption( element.name);
                    console.log("inside fillMentorInSelectBox")
                });
            })
}

/**
 * Function to create options in select box for Mentor
 */
function createMentorOption(mentorName){
    let mentorSelectForMentorChange = document.getElementById('mentorSelectForChange');
    let mentorSelectForAssign = document.getElementById('mentorSelect'); 
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
    console.log("inside createMentorOption");
}

/**
 * Function to create student
 */
function createStudent(){
    let studentName = document.getElementById('studentName').value;
    let email = document.getElementById('studentEmail').value;
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
            console.log("got select as: " + studentSelectForMentorChange.value);
            let studentSelectForMentorChange = document.getElementById('studentSelectForChange');
            let studentSelectForAssign = document.getElementById('studentsSelect');
            
            let studentOptionForMentorChange = document.createElement('option');
            let studentOptionForMentorAssign = document.createElement('option');
            
            studentOptionForMentorChange.innerHTML = studentName;
            studentOptionForMentorAssign.innerHTML = studentName;
           
            studentSelectForMentorChange.appendChild(studentOptionForMentorChange);
            studentSelectForAssign.appendChild(studentOptionForMentorAssign);
            
        })
        return false;
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
            createMentorOption( mentorName);
        })
        return false;
}

/**
 * Function to change/Assign Mentor
 */
function changeMentor(){
    let studentName = document.getElementById('studentSelectForChange').value;
    let mentorName = document.getElementById('mentorSelectForChange').value;
    let email = '';
    fetch(url+`/get-student/${studentName}`)
            .then((resp) => {
                return resp.json()
            })
            .then((data) => {
                console.log("value of data inside get-student by student name is: "+data);
                email = data.result.email;
                console.log("Email of student who is changing mentor is: "+ email);
            })


    fetch(url + `/change-mentor/${studentName}`, {
        method: "PUT",
        body: JSON.stringify({
            name: studentName,
            email, 
            mentorAssigned: mentorName
        }),
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then((resp) => resp.json())
        .then((data) => {
            console.log("Inside Change Mentor. Changed for student: " + studentName + " and changing to mentor:" + mentorName);
        })
        return false;
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

