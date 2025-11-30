var home,creategr,access,edit,save,enter;
var takegroupno,takenoofperson,amount,splitting;
var ptakegroupno,ptakenoofperson,pgivegroupno;
var groupno,noofperson;
var inputnewform=[],entriesaccessedform=[];
var state=0;
var database,groupCount=0;
var saveDebug=0;

function setup() {

  const dw = displayWidth;
  const dh = displayHeight;

  createCanvas(dw,dh);

  database = firebase.database();
  
  database.ref("groupCount").on("value",(data)=> {
    groupCount = data.val();
  });

  home = createButton("Home");
  home.position(20,20);
  creategr = createButton("Create Group");
  creategr.position(dw/2-50,dh/2-50);
  access = createButton("Access A Group");
  access.position(dw/2-55,dh/2+50);
  edit = createButton("Edit");
  edit.position(dw/2-20,dh-200);
  save = createButton("Save");
  save.position(dw/2-20,dh-200);
  enter = createButton("Enter");
  enter.position(dw/2-20,dh-200);

  takegroupno = createInput(0,"number");
  takegroupno.position(dw/2-85,dh/2-10);
  takenoofperson = createInput(0,"number");
  takenoofperson.position(dw/2-85,dh/2-10);
  amount = createInput(0,"number");
  splitting = createInput("");

  ptakegroupno = createP("Enter Group No.");
  ptakegroupno.position(dw/2-200,dh/2-25);
  ptakenoofperson = createP("Enter No. Of Persons");
  ptakenoofperson.position(dw/2-230,dh/2-25);
}

function draw() {
  background(255);

  const dw = displayWidth;
  const dh = displayHeight;
  
  //console.log(state);

  home.mousePressed(()=>{
    homePressed();
  });

  if(state==1) {
   takenoofperson.show();
   ptakenoofperson.show();
  }else{
    takenoofperson.hide();
    ptakenoofperson.hide();
  }

  if(state==3) {
   takegroupno.show();
   ptakegroupno.show();
  }else{
    takegroupno.hide();
    ptakegroupno.hide();
  }

  if(state==4) {
   amount.show();
   splitting.show();
  }else{
    amount.hide();
    splitting.hide();
  }
  
  if(state==0){
   creategr.show();
   access.show();
   edit.hide();
   save.hide();
   enter.hide();
   creategr.mousePressed(()=>{
     state = 1;
   });
   access.mousePressed(()=>{
     state = 3;
   });
  }

  if(state==1) {
    creategr.hide();
    access.hide();
    edit.hide();
    save.hide();
    enter.show();
    enter.mousePressed(()=>{
     noofperson = takenoofperson.value();
     takenoofperson.value(0);
     createForm();
     state = 2;
    });
  }

  if(state==2) {
    creategr.hide();
    access.hide();
    edit.hide();
    if(saveDebug==0) {
      save.show();
    }else if(saveDebug==1) {
      save.hide();
    }
    enter.hide();

    save.mousePressed(()=>{
      saveIt();
    });
  }

  if(state==3) {
    creategr.hide();
    access.hide();
    edit.hide();
    save.hide();
    enter.show();
    enter.mousePressed(()=>{
      groupno = takegroupno.value();
      takegroupno.value(0);
      let k = "group"+groupno+"/No_Of_Persons"
      database.ref(k).on("value",(data)=> {
        noofperson = data.val();
        accessedList();
        state = 4;
      });
      
    });
  }

  if(state==4) {
    creategr.hide();
    access.hide();
    edit.hide();
    save.show();
    enter.hide();

    save.mousePressed(()=>{
      saveSplitting();
    });
  }
}

function createForm() {
  const dw = displayWidth;
  const dh = displayHeight;

  for(let i=1;i<=noofperson;i++) {
    let name = createInput();
    name.position(dw/2-85,100+i*50);
    inputnewform.push(name);
  }

  for(let i=1;i<=noofperson;i++) {
    let nameP = createP("Name Of Person "+i);
    nameP.position(dw/2-230,85+i*50);
    inputnewform.push(nameP);
  }

  save.position(dw/2-20,150+noofperson*50);
}

function saveIt() {
  const dw = displayWidth;
  const dh = displayHeight;

  for(let i=0;i<entriesaccessedform.length;i++) {
      entriesaccessedform[i].hide();
  }
  entriesaccessedform = [];

  let gc = groupCount+1;

  let l="group"+gc+"/";
  database.ref(l).set({
    No_Of_Persons:noofperson
  });
  for(let i=1;i<=inputnewform.length/2;i++) {
    let k="group"+gc+"/person"+i;
    database.ref(k).set({
      name:inputnewform[i-1].value(),
      expense:0,
      paid:0
    });
  }
  
  groupCount+=1;
  database.ref("/").update({
    groupCount:groupCount
  });
  for(let i=0;i<inputnewform.length;i++) {
    inputnewform[i].hide();
  }
  inputnewform=[];
  pgivegroupno = createP("Your Group No. Is:- "+groupCount);
  pgivegroupno.position(dw/2-80,dh/2-20);
  saveDebug=1;
}

function accessedList() {
  const dw = displayWidth;
  const dh = displayHeight;

  for(let i=1;i<=noofperson;i++) {
    let accessedname;
    let k="group"+groupno+"/person"+i+"/name";
    database.ref(k).on("value",(data)=> {
      accessedname = data.val();
      let name = createP(i+". "+accessedname);
      name.position(dw/2-125,100+i*50);
      entriesaccessedform.push(name);
    });
    
  }
  for(let i=1;i<=noofperson;i++) {
    let accessedexpense;
    let k="group"+groupno+"/person"+i+"/expense";
    database.ref(k).on("value",(data)=> {
      accessedexpense = data.val();
      let expense = createP("₹ "+accessedexpense);
      expense.position(dw/2+100,100+i*50);
      entriesaccessedform.push(expense);
    });
  }

  for(let i=1;i<=noofperson;i++) {
    let accessedpayment;
    let k="group"+groupno+"/person"+i+"/paid";
    database.ref(k).on("value",(data)=> {
      accessedpayment = data.val();
      let paid = createP("₹ "+accessedpayment);
      paid.position(dw/2+200,100+i*50);
      entriesaccessedform.push(paid);
    });
  }

  amount.position(dw/2-300,550+noofperson*50);
  splitting.position(dw/2+200,550+noofperson*50);
  save.position(dw/2-20,600+noofperson*50);
}

function saveSplitting() {
  let array = splitting.value().split(",").map(Number);
  let contory = amount.value()/(array.length);

  for(let i=0;i<array.length;i++) {
    let person = array[i];
    let k = "group"+groupno+"/person"+person+"/expense";
    let l = "group"+groupno+"/person"+person;
    database.ref(k).once("value",(data)=> {
      let initialexpense = data.val();
      let finalexpense = initialexpense+contory;
      database.ref(l).update({
        expense:finalexpense
      });
    });
  }

  let m = "group"+groupno+"/person"+array[0]+"/paid";
  let n = "group"+groupno+"/person"+array[0]; 
  database.ref(m).once("value",(data)=> {
    let initialpayment = data.val();
    let finalpayment = initialpayment+Number(amount.value());
    database.ref(n).update({
      paid:finalpayment
    });
  });

  homePressed();
}

function homePressed() {
  const dw = displayWidth;
  const dh = displayHeight;

  groupno = 0;
  noofperson = 0;
  state = 0;
  save.position(dw/2-20,dh-200);
  for(let i=0;i<inputnewform.length;i++) {
    inputnewform[i].hide();
  }
  inputnewform = [];
  for(let i=0;i<entriesaccessedform.length;i++) {
    entriesaccessedform[i].hide();
  }
  entriesaccessedform = [];
  saveDebug = 0;
  pgivegroupno.hide();
  amount.value(0);
  splitting.value(0);
}

/*
  database.ref("cutCount").on("value",(data)=> {
    cutCount = data.val();
  });

  database.ref("/").update({
    cutCount:cutCount
  });
*/