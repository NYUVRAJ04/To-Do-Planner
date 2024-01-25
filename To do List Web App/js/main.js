import ToDoItem from "/js/todoitem.js";
import ToDoList from "/js/todolist.js";

const toDoList = new ToDoList();

//launch the app

document.addEventListener("readystatechange" ,(event)=>{
    if (event.target.readyState === "complete"){
        initApp();
    }
});

//initApp() is called when the app loads,it specifies what occur when app loads

const initApp = () =>{
    //Add listeners

    const ItemEntryForm = document.getElementById("itemEntryForm");
    ItemEntryForm.addEventListener("submit",(event) => {
        event.preventDefault();
        processSubmission();
    });
 

    const clearItems = document.getElementById("ClearItem");
    clearItems.addEventListener("submit",(event)=>{
        const list = toDoList.getList();
        if(list.length){
            const confirmed = confirm("Are you sure you want to delete the entire list");
            if(confirmed){
                toDoList.clearList();
                updatePersistenData(toDoList.getList());
                refreshThePage();
            }
        }
    });
    //procedural things to when app loads
    loadListobject();
    //2. refresh the page

    refreshThePage();
};

const loadListobject = () =>{
    const storedList = localStorage.getItem("myToDoList");
    if(typeof storedList != "string")return;
    const parsedList = JSON.parse(storedList);
    parsedList.forEach(itemObj =>{
        const newToDoItem = createNewItem(itemObj._id,itemObj._item)
        toDoList.addItemToList(newToDoItem);
    });
};
const refreshThePage = () =>{
    clearlistDisplay();
    renderList();
    clearItemEntryField();
    setfocusOnItemEntry();
};

const clearlistDisplay = () => {
    const parentElement = document.getElementById("listItem"); // Use getElementById instead of getElementsByClassName
    deleteContents(parentElement);
};

const deleteContents = (parentElement) => {
    let child = parentElement.lastElementChild;
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
};

const renderList = () =>{
    const list = toDoList.getList();
    list.forEach(item =>{
        buildListItem(item);
    });
};

// to build a list item 
const buildListItem = (item) =>{
    const div= document.createElement("div");
    div.className = "item";
    const check = document.createElement("input");
    check.type = "checkbox";
    check.id = item.getId();
    check.tabindex = 0;
    addClickListenerToCheckbox (check);
    const label = document.createElement("label");
    label.htmlFor = item.getId();
    label.textContent = item.getItem();
    div.appendChild(check);
    div.appendChild(label);
    const container = document.getElementById("listItem");
    container.appendChild(div);

};

const addClickListenerToCheckbox =(checkbox) =>
{
    checkbox.addEventListener("click",(event)=>{
        toDoList.removeItemFromList(checkbox.id);
        updatePersistenData(toDoList.getList());
        setTimeout( ()=> {
            refreshThePage();
            
        }, 1000);
    });
};

const updatePersistenData = (listArray) =>{
    localStorage.setItem("myToDoList",JSON.stringify(listArray));
};

const clearItemEntryField =() =>{
    document.getElementById("newItem").value = "";

};

const setfocusOnItemEntry = () =>{
    document.getElementById("newItem").focus();
};

const processSubmission = ()=>
{
    const newEntryText = getnewEntry();
    if(!newEntryText.length) return;
    const nextItemId = calcNextItemId();
    const toDoItem = createNewItem(nextItemId,newEntryText);
    toDoList.addItemToList(toDoItem);

    updatePersistenData(toDoList.getList());
    refreshThePage();
};

const getnewEntry = () =>{
    return document.getElementById("newItem").value.trim();
};

const calcNextItemId = () =>{
    let nextItemId = 1;
    const list = toDoList.getList();
    if(list.length>0){
        nextItemId = list[list.length - 1].getId() +1;
    }
    return nextItemId;
};

const createNewItem = (itemId,itemText) =>{
    const todo = new ToDoItem();
    todo.setId(itemId);
    todo.setItem(itemText);
    return todo;
};