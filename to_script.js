var taskListArry = [];
function saveTask() {
  var taskName = document.getElementById("txtItem").value;
  var todoObject = {
    taskId: taskListArry.length + 1,
    taskName: taskName,
  };
  //nous mettons la function dans taskListArray
  taskListArry.push(todoObject);
}
