// getting all required elements
const inputBox = document.querySelector(".inputField input");
const addBtn = document.querySelector(".inputField button");
const todoList = document.querySelector(".listofpatients");
const deleteAllBtn = document.querySelector(".footer button");
const pendingTasksNumb = document.querySelector(".pendingTasks");
const baseUrl = "https://api.fake.rest/fb1ab861-9821-4af5-a436-3f1f6f1c61d5";
let listofpatients = [];


document.addEventListener("DOMContentLoaded", async () => {
  let response = await fetch(`${baseUrl}/getpatients`, {
    method: "GET",
  });
  response = await response.json();
  if (response.success) {
    listofpatients = response.data;
    console.log(listofpatients);
    showpatients(listofpatients);
}
});


inputBox.onkeyup = () => {
  let userEnteredValue = inputBox.value; //getting user entered value
  if (userEnteredValue.trim() != 0) {
    //if the user value isn't only spaces
    addBtn.classList.add("active"); //active the add button
  } else {
    addBtn.classList.remove("active"); //unactive the add button
  }
};

function addpatient(item) {
  listofpatients.push({ title: item, id: Math.random().toString() });
//  inputBox.value = " ";
  showpatients(listofpatients);
}

addBtn.onclick = async() => {
  addpatient(inputBox.value);
  await fetch(`${baseUrl}/AddPatients`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: 
  `{ 
    "title": "${inputBox.value}", 
    "id" :  "${Math.random().toString()}"
   }`,
  })
   .then(resp => resp.json())
   .then( json  => console.log(json))

   inputBox.value ="";
  };

function showpatients(data = []) {
  let newList = "";
  data.forEach((item, index) => {
    newList += `<li class="bordered">${item.title}<span class="icon" id=${item.id}>D</span> <button onclick = editbutton(id)   class="icon1" id=${item.id}>E</button></li>`;
  });
  todoList.innerHTML = newList;
  listofpatients.textContent = data.length;
  data.length > 0
    ? deleteAllBtn.classList.add("active")
    : deleteAllBtn.classList.remove("active");
}
//  this is to delete particular data;
function deleteItem(index) 
{
  fetch(`${baseUrl}/deleteitem`, {
    method: 'DELETE',
    body:
    `{
      "id" : ${JSON.stringify(index)}
    }`
    })
     .then(resp => resp.json())
     .then( json  => console.log(json))

  listofpatients.splice(index, 1);
  showpatients(listofpatients);
}
//  this function is for edit the particular patients 
function edititem(id) 
{   
   index = listofpatients.findIndex(u=> u.id === id);
  inputBox.value = listofpatients[index]["title"];
  
    addBtn.onclick  = async() =>
    {
      listofpatients[index]["title"] = inputBox.value;
      let a = listofpatients[index]["title"];
       let b = listofpatients[index]["id"];
      console.log(a);
      console.log(b);
      // const data = 
      // {
      //   "id" : "${id}",
      //   "title" :
      // }
      let response = await fetch(`${baseUrl}/updatepatient/${id}`, {
        method: 'PUT',
        body : `
        {
          "title" : "${a}"
        }`
        
        })
        response = await response.json()
        console.log(response.data);
        // response.json().then(data => {
        //   console.log(data);}
        //  .then(resp => resp.json())
        //  .then( json  => console.log(json))
      
      showpatients(listofpatients);
      inputBox.value = "";
    }
   
};
//here editing is working
editbutton = (id) => {

    edititem(id);
  
};

todoList.onclick = (e) => {
  if (e.target.classList.contains("icon")) {
    deleteItem(e.target.id);
  }
};


// this function for deleting all the patients
deleteAllBtn.onclick = async() => 
{
    const response = await fetch(`${baseUrl}/deleteallitem`, {
        method: 'DELETE', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: null
    });
 
   const data = await response.json( );

  listofpatients = [];
  showpatients();
};
