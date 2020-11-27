let url = "http://localhost:3000"   
fillMentorInSelectBox();
fillStudentInSelectBox();
/**
 * Function to fill student names in all select options
 */
function fillStudentInSelectBox(){
    document.getElementById('studentSelectForChange').innerHTML = '';
    document.getElementById('studentsSelect').innerHTML = ''; 
    document.getElementById('studentSelectForChange').appendChild(createDefaultOption("---Select Student---"));
    document.getElementById('studentsSelect').appendChild(createDefaultOption("---Select Student---"));

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
    studentOptionForMentorChange.value = student.name;
    
    studentSelectForMentorChange.appendChild(studentOptionForMentorChange);

    if(student.mentorAssigned=== "false"){
        let studentOptionForMentorAssign = document.createElement('option');
        studentOptionForMentorAssign.innerHTML = student.name;
        studentSelectForAssign.appendChild(studentOptionForMentorAssign);
    }
            
}

/**
 * Function to create default option
 */
function createDefaultOption(text){
    let option = document.createElement('option');
    option.setAttribute("disabled","true");
    option.innerHTML = text;
    return option;
}

/**
 * Function to fill mentor name in all select options
 */
function fillMentorInSelectBox(){
    document.getElementById('mentorSelectForChange').innerHTML = '';
    document.getElementById('mentorSelect').innerHTML = ''; 
    document.getElementById('mentorSelectForGettingStudents').innerHTML= '';

    document.getElementById('mentorSelectForChange').appendChild(createDefaultOption("---Select Mentor---"));
    document.getElementById('mentorSelect').appendChild(createDefaultOption("---Select Mentor---"));
    document.getElementById('mentorSelectForGettingStudents').appendChild(createDefaultOption("---Select Mentor---"));

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
    mentorOptionForMentorChange.value = mentorName;
    mentorOptionForMentorAssign.innerHTML = mentorName;
    mentorOptionForMentorAssign.value = mentorName;
    mentorOptionToShowStudent.innerHTML = mentorName;
    mentorOptionToShowStudent.value = mentorName;
    
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
            
            let studentSelectForMentorChange = document.getElementById('studentSelectForChange');
            let studentSelectForAssign = document.getElementById('studentsSelect');
            
            let studentOptionForMentorChange = document.createElement('option');
            let studentOptionForMentorAssign = document.createElement('option');
            
            studentOptionForMentorChange.innerHTML = studentName;
            studentOptionForMentorAssign.innerHTML = studentName;
           
            studentSelectForMentorChange.appendChild(studentOptionForMentorChange);
            studentSelectForAssign.appendChild(studentOptionForMentorAssign);
            console.log("got select as: " + studentSelectForMentorChange.value);
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
function changeMentor() {
    let studentName = document.getElementById('studentSelectForChange').value;
    let mentorName = document.getElementById('mentorSelectForChange').value;
    console.log("changing mentor for studentName:" + studentName + " to mentorName:" + mentorName);

    let isStudentNeverAssigned = false;
    fetch(url+`/get-student/${studentName}`)
        .then((resp) => {
            return resp.json()
        })
        .then((data) => {
            isStudentNeverAssigned = (data.result.mentorAssigned === 'false');
            let mentorStudentList = [];
            if(!isStudentNeverAssigned) updateStudentListOfOldMentor(studentName);

            fetch(url+`/get-mentor/${mentorName}`)
                    .then((resp) => {
                        return resp.json()
                    })
                    .then((data) => {
                        mentorStudentList = data.result.studentList;
                        // Check to avoid assignment of same student to a mentor twice
                        if(!mentorStudentList.includes(studentName)) mentorStudentList.push(studentName);
                        // Assigning students to mentor in mongoDB
                        assignStudentsToMentor(mentorName, mentorStudentList);
                        // Removing student from mentor assignment select option
                        removeStudentFromMentorAssignSelect(studentName);
                        // Updating mongoDB student table with mentor name
                        setMentor(studentName, mentorName);
                    })
        })
    return false;
}


/**
 * Function to Update Student List of old Mentor
 * @param {*} mentorName 
 */
function updateStudentListOfOldMentor( studentName){
    fetch(url+`/get-student/${studentName}`)
            .then((resp) => {
                return resp.json()
            })
            .then((data) => {
                
                    console.log(" came inside updateStudentListOfOldMentor");
                    let mentorName = data.result.mentorAssigned;
                    
                    let studentNameArray = [];
                    fetch(url+`/get-mentor/${mentorName}`)
                            .then((resp) => {
                                return resp.json()
                            })
                            .then((data) => {
                                studentNameArray = data.result.studentList;
                                console.log("updating for mentor:" + mentorName + " before applying filter and inside fetch  with students:" + studentNameArray);
                                function checkName(name){
                                    return name!==studentName;
                                }
                                let updatedStudentList = studentNameArray.filter(checkName);
                                console.log("updating for mentor:" + mentorName + " with students:" + updatedStudentList);
                                assignStudentsToMentor(mentorName, updatedStudentList);
                            })
            })

    
}

/**
 * Function to remove name of student who has been already assigned a mentor from the select box containing names of students who doesn't have a mentor
 * @param {*} studentName 
 */
function removeStudentFromMentorAssignSelect(studentName){
    var selectobject = document.getElementById("studentsSelect");
    for (var i=0; i<selectobject.length; i++) {
        if (selectobject.options[i].innerText === studentName){
            selectobject.remove(i);
            break;
        }
           
    }
}
/**
 * Function to get Array containing names of all students of a mentor
 */
function getStudentsNameList(mentorName){
    let studentNameList = [];
    fetch(url+`/get-mentor/${mentorName}`)
            .then((resp) => {
                return resp.json()
            })
            .then((data) => {
                studentNameList = data.result.studentList;
            })
     return studentNameList;
}

/**
 * Function to update Mentor name for a Student
 * @param {*} studentName 
 */
function setMentor(studentName, mentorName){
    fetch(url + `/change-mentor/${studentName}`, {
        method: "PUT",
        body: JSON.stringify({
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
}

/**
 * Function to Assign Students to Mentor
 */
function assignStudentsToMentor(mentorName, studentList){
    fetch(url + `/assign-students/${mentorName}`, {
        method: "PUT",
        body: JSON.stringify({
            studentList
        }),
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then((resp) => resp.json())
        .then((data) => {
            console.log("Inside update-studentList. updating for mentor: " + mentorName + " and changing to :" + studentList);
        })

}

/**
 * Function to assign all the selected student to a selected mentor
 */
function assignSelectedStudentsToMentor(){
    let multipleStudentSelect = document.getElementById('studentsSelect');
    let mentorName = document.getElementById('mentorSelect').value;
    let studentNameList = getSelectValues(multipleStudentSelect);
    console.log(`number of selected students is: ${studentNameList.length}`)

    fetch(url+`/get-mentor/${mentorName}`)
        .then((resp) => {
            return resp.json()
        })
        .then((data) => {
            console.log("result of old studenLIst of selected mentor is: "+ data.result.studentList);
            for(let i=0; i<studentNameList.length; i++) setMentor(studentNameList[i], mentorName);
            let updatedStudentList = [];
            updatedStudentList = data.result.studentList.concat(studentNameList);
            console.log("result of updated studenLIst of selected mentor is: "+ updatedStudentList);
            assignStudentsToMentor(mentorName, updatedStudentList);
            fillStudentInSelectBox();
        })
    return false;
    
}

function getSelectValues(select) {
    var result = [];
    var options = select && select.options;
    var opt;
  
    for (var i=0, iLen=options.length; i<iLen; i++) {
      opt = options[i];
  
      if (opt.selected) {
        result.push(opt.value || opt.text);
        
      }
    }
    return result;
  }

/**
 * Function to show List of students for a particular mentor
 */
function  getStudentsForMentor() {
    let mentor = document.getElementById("mentorSelectForGettingStudents").value;
    fetch(url+`/get-mentor/${mentor}`)
        .then((resp) => {
            return resp.json()
        })
        .then((data) => {
            console.log("result of studenLIst of a mentor is: "+ data.result.studentList);
            let tbody = document.getElementById('tbody');
            tbody.innerHTML = '';
            data.result.studentList.forEach(name => {
                 createTrTd(name);
                console.log("name of student inside for loop is: "+ name);
            });
            document.getElementById('table').append(tbody);
        })

    return false;
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

