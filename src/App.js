import "./App.css";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import List from "./componence/List";

function App() {

  // function ที่นำค่าจาก local storage มาแสดงผลหน้าเว็บ
  const localData = () => {
    const getLocal = localStorage.getItem("list"); // get ค่าจาก local stotage 
    if(getLocal) { // เช็คเงื่อนไขว่ามีข้อมูลถูกเก็บอยู่
      return JSON.parse(getLocal); // แปลง string เป็น object
    } else { // ถ้าไม่มีข้อมูลอยู่ใน local storage ให้แสดงค่าว่าง 
      return [];
    }
  }

  const [data, setData] = useState(""); //สร้าง state data เพื่อเก็บค่าที่ใส่มาในช่อง input
  const [list, setList] = useState(localData()); //สร้าง state list ไว้เก็บข้อมูลรายการเมื่อกด submit
  const [checkEdit, setCheckEdit] = useState(false); //สร้าง state checkEdit               ไว้เก็บสถานะการแก้ไขข้อมูลและทำการเปลี่ยนปุ่มบันทึกข้อมูล
  const [editId, setEditId] = useState(null); // สร้าง state editId เพื่อเก็บค่า id สำหรับการแก้ไขข้อมูล
  
  //เมื่อ componence render ให้บันทึกข้อมูลลง local storage
  useEffect(() => { 
    localStorage.setItem("list", JSON.stringify(list)) //แปลง javascript object เป็น string
  }, [list]);

  const submitData = (e) => {
    e.preventDefault();
    //เช็คเงื่อนไข ว่าเป็นการเพิ่มข้อมูลใหม่ หรือแก้ไขข้อมูลเก่า
    if (checkEdit) { //ค่าเป็นจริงคือการแก้ไขข้อมูลเก่า
      const editResult = list.map((arrData) => { //ดึงค่ารายการใน state list มาใช้งาน
        if (arrData.id === editId) { //เช็คเงื่อนไขว่าสมาชิก id ตัวใดที่มีค่าตรงกับข้อมูล id ที่กดปุ่มแก้ไข
          return {...arrData, title: data }; //เปลี่ยนข้อมูลที่แก้ไขเข้ามาใหม่แทนข้อมูลเก่า
        }
        return arrData; // return ข้อมูลที่มีการแก้ไขออกไปใช้งาน
      });
      setList(editResult); //กำหนดค่าที่แก้ไขลงใน state list เพื่อแสดงผลที่หน้าเว็บ
      setData(""); //กำหนด input เป็นค่าว่างเมื่อแก้ไขเสร็จ
      setCheckEdit(false); //กำหนดให้ปุ่มแก้ไขข้อมูลเป็นปุ่มบันทึกข้อมูล 
    } else { //ค่าเป็นเท็จคือการเพิ่มรายการข้อมูลใหม่
      //สร้างกลุ่มข้อมูล นำไปเก็บใน state list
      const newList = {
        id: uuidv4(), // เก็บId อ้างอิงตอนลบข้อมูลและแก้ไขข้อมูล
        title: data, //ข้อมูลที่ป้อนใน input
        checked: false,// ค่าสถานะเมื่อกดปุ่ม check
      };
      setList([...list, newList]); //เก็บข้อมูลเป็นarrayนำข้อมูลตัวใหม่ต่อกับข้อมูลตัวเก่า
      setData(""); //กำหนด input เป็นค่าว่างเมื่อ submit
    }
  };

  //function ลบข้อมูล โดย รับ id parameter มาจากการกดปุ่มลบ
  const removeData = (id) => {
    const removeResult = list.filter((arrdata) => arrdata.id !== id); //กรองข้อมูลของ list state ให้แสดงข้อมูลของ id ที่ไม่ได้กรองออกไป
    setList(removeResult);
    // console.log(removeResult);
  };

  //function แก้ไขข้อมูล โดย รับ id parameter มาจากการกดปุ่มแก้ไข
  const editData = (id) => {
    setCheckEdit(true); 
    const editResult = list.find((arrData) => arrData.id === id); //ทำการค้นหาข้อมูลที่มี id ตรงกันกับ id ตอนกดปุ่มแก้ไขข้อมูล
    setData(editResult.title); //นำค่าข้อมูลที่กดแก้ไขไปแสดงที่ช่อง input
    setEditId(id); //เก็บค่า id เพื่อนำไปอ้างอิงการแก้ไขข้อมูลเก่า
  };

  //function check complete โดย รับ id parameter มาจากการกดปุ่ม complete 
  const completeData = (id) => {
     const completeResult = list.map((arrData)=>{ //ดึงค่ารายการใน state list มาใช้งาน
        if(arrData.id === id){ //เช็คเงื่อนไขว่าสมาชิก id ตัวใดที่มีค่าตรงกับข้อมูล id ที่กดปุ่ม check
          return {...arrData, checked: !arrData.checked}; //เปลี่ยนข้อมูล checked เป็น true
        }
        return arrData; // return ข้อมูลที่ checked เป็น true ออกไปใช้งาน
      });
      setList(completeResult); //กำหนดข้อมูล checked ลงใน state list เพื่อแสดงผลที่หน้าเว็บ
  };
  return (
    <main className="container backG">
      <h1>Todo List 📝</h1>
      {/* เมื่อกด submit เรียกใช้งาน funtion submitData เพื่อเก็บรายการ */}
      <form className="formContainer" onSubmit={submitData}>
        <div className="form-input">
          <input
            type="text"
            className="text-input"
            placeholder="do..."
            onChange={(e) => setData(e.target.value)} //เมื่อ input มีการเปลี่ยนแปลง จะนำข้อมูลเก็บใน state data
            value={data}
            required
          />
          <button type="submit" className="button-submit">
            {checkEdit ? "✏️" : "➕"}
          </button>
        </div>
      </form>
      <section>
        {/* loop ข้อมูลใน array list */}
        {list.map((arrData, index) => {
          return (
            //List componence ที่ใช้แสดงรายการ  
            <List
              key={index}
              {...arrData}
              removeData={removeData}
              editData={editData}
              completeData={completeData}
            />
          );
        })}
      </section>
    </main>
  );
}

export default App;
