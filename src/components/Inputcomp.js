import React, { useState, useEffect } from 'react';
import cssThemeObject from '../cssThemeObject';

const Inputcomp = () => {
  // Input içerisindeki değeri tut
  const [data, setData] = useState("");

  // Todo'ları tutacak dizi
  const [todoArr, setTodoArr] = useState( JSON.parse(localStorage.getItem('todoArr') || '[]') );

  // todoArr clone
  const [cloneTodoArr, setCloneTodoArr] = useState([]);

  // Sekmeler için status değerini tut
  const [status, setStatus] = useState("active");

  // Tema belirleyici toggle'ın durumunu tut
  const [checked, setChecked] = useState(false);

  //Todo'ların id'si için counter state'i
  const [counter, setCounter] = useState(0);

  // Input içerisindeki değeri al
  const getValue = (val) => {
    setData(val.target.value);
  }

  // todoArr'ı local storage'a set et
  useEffect(() => {
    localStorage.setItem('todoArr', JSON.stringify(todoArr));
  }, [todoArr]);

  useEffect(() => {
    const sorted = [...todoArr.filter(x => status === "all" ? true : x.status === status)].sort((a,b) => (a.status > b.status) ? 1 : ((b.status > a.status) ? -1 : 0));
    setCloneTodoArr(sorted);
  }, [status, todoArr]);

  // Checkbox ile tema durumunu güncelle
  const handleChange = () => {
    if(!checked){
      setChecked(true);

      // CSS değişkenleri temanın durumuna göre güncellemek için obje döndür
      for(const [key, value] of Object.entries(cssThemeObject)){
        document.documentElement.style.setProperty(key, value.dark);
      }

    } else{
      setChecked(false);

      // CSS değişkenleri temanın durumuna göre güncellemek için obje döndür
      for(const [key, value] of Object.entries(cssThemeObject)){
        document.documentElement.style.setProperty(key, value.light);
      }

    } 
  }





  // todoArr'a(Listeye) yeni eleman ekle
  const handleClick = () => {
    // data boş ise ekleme yapma
    if(data.trim() === ""){
      return;
    }
    
    // todoArr'a eklenecek olan eleman(object) ve değerleri
    const item = {
      id: counter,
      text: data,
      status: "active"
    }

    // Eklenen eleman ile birlikte todoArr'ı güncelle
    const arr = [...todoArr, item]; 
    setTodoArr(arr);
    setData("");
    setCounter(counter + 1);
  }

  // Listedeki görevi tamamla -> (seçilen dizi elemanını diziden kaldır)
  const deleteClick = (id) => {
    const list = [...todoArr];
    list.splice(list.findIndex(x => x.id === id), 1);
    setTodoArr(list);
  }

  // Listedeki görevi tamamla -> (seçilen dizi elemanının status property'sini güncelle)
  const checkClick = (id) => {
    const list = [...todoArr];
    list[list.findIndex(x => x.id === id)] = {...list[list.findIndex(x => x.id === id)], status: "completed"};
    setTodoArr(list);
  } 

  // Sekme için status'u güncelle
  const clickSetStatus = (stt) => {
    setStatus(stt);
  }


  return(
    <div className="mainBoard">
      {/* Input Component'ı Temsili */}
      <div className="board">
        <div className="inputBG">
          <input type="text" value={data} className="inputClass" placeholder="What needs to be done?" onChange={getValue} 
            onKeyPress={(ev) => {
              if (ev.key === "Enter") { handleClick(); } }}>
          </input>
        </div>
        <div className="btn disable-select sameBtn" onClick={() => handleClick()}>+</div>
      </div>

      {/* Tema değişikliği için checkbox toggle */}
      <div className="checkBox">
        <label className="switch">
          <input type="checkbox" name="themeSelector" onChange={() => handleChange()}/>
          <span className="slider round"></span>
        </label>
      </div>
      
      
        {/* todoArr'ın durumuna göre bulunan sekmeye bilgilendirme yazısı yazdır. */}
        <div className={`infoClass ${todoArr.filter(x => status === "all" ? true : x.status === status).length !== 0 ? 'empty' : ''}`}>
          <p>
              {status === "completed" ? "There are no completed task!" : "No task to do :)"}
          </p>
        </div>

      <div className="listClass">
        {/* status ile belirlenen sekmeyi todoArr dizisini filtreleyerek .map ile döndür */}
        {cloneTodoArr.map((x, i) => {
          return(
            <div key={i} className={`listItem`}>
              <div className={`textArea ${x.status}Status`}>{x.text}</div>
              <div className={`${x.status}ListButtonBox`}>
                {/* Listedeki görevi(itemi) tamamlama ve silme butonları(img) */}
                <img src={process.env.PUBLIC_URL + '/images/check.svg'} className={`sameBtn disable-select imgButton checkBtn ${x.status !== "active" ? "checkActive" : ""}`} onClick={() => checkClick(x.id)} alt=''/>
                <img src={process.env.PUBLIC_URL + '/images/delete.svg'} className="sameBtn disable-select imgButton deleteBtn" onClick={() => deleteClick(x.id)} alt=''/>
              </div>
            </div>
          );
        }) }
      </div>
      

      {/* Tamamlanma durumuna göre kategorize etme işlemi */}
      <div className="footer">
        <div className="footerButtonBox">
          {/* Filtrelenen sekmedeki eleman sayısı */}
          <div className="itemLeft disable-select">{todoArr.filter(x => status === "all" ? true : x.status === status).length} Items Left</div>
          <div className="footerInnerButtonBox">
            {/* Liste sekme menüsü */}
            <div className={`sameBtn disable-select footerBtn allBtn ${status === "all" ? "allActive" : ""}`} onClick={() => clickSetStatus("all")}>All</div>
            <div className={`sameBtn disable-select footerBtn activeBtn ${status === "active" ? "activeActive" : ""}`} onClick={() => clickSetStatus("active")}>Active</div>
            <div className={`sameBtn disable-select footerBtn completedBtn ${status === "completed" ? "completedActive" : ""}`} onClick={() => clickSetStatus("completed")}>Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inputcomp;