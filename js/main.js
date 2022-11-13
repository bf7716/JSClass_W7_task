const dataUrl = "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json";
let data;
const list = document.querySelector("#resultBlock");
const filter = document.querySelector("#select");
const filterResult = document.querySelector("#filterResult");
const addbtn = document.querySelector(".addbtn");
const addName = document.querySelector("#name");
const addImgUrl = document.querySelector("#picUrl");
const addArea = document.querySelector("#area");
const addPrice = document.querySelector("#price");
const addGroup = document.querySelector("#number");
const addRate = document.querySelector("#star");
const addDescip = document.querySelector("#descip");

axios.get(dataUrl)
  .then(function (response) {
    data = response.data.data;

    renderData(data);
    addDate();
    filterArea();
    getChart();
  })
  .catch(function (error) {
    console.log(error);
  })

// 選擇地區篩選資料
function filterArea() {
  filter.addEventListener('change', e => {
    let filterArea = e.target.value;
    if (filterArea === "全部") {
      renderData(data);
      filterResult.textContent = `共有 ${data.length} 筆資料，歡迎使用地區搜尋`;
    } else {
      newData = data.filter(i => i.area === filterArea);
      renderData(newData);
      filterResult.textContent = `本次搜尋共 ${newData.length} 筆資料`;
    }
  });
};

// 新增資料
function addDate() {
  addbtn.addEventListener('click', e => {
    let obj = {};

    if (
      addName.value.trim() === "" ||
      addImgUrl.value.trim() === "" ||
      addArea.value.trim() === "" ||
      addDescip.value.trim() === "" ||
      addGroup.value.trim() === "" ||
      addPrice.value.trim() === "" ||
      addRate.value.trim() === "") {
      alert(`欄位不得為空，請填入資訊`);
    } else if (addGroup.value < 0) {
      alert("套票組數不能小於 0")
    } else if (addPrice.value < 0) {
      alert("套票金額不能小於 0")
    } else if (addRate.value < 0 || addRate.value > 10) {
      alert("套票星級須在 1~10 之間")
    } else {
      obj.id = data.length;
      obj.name = addName.value;
      obj.imgUrl = addImgUrl.value;
      obj.area = addArea.value;
      obj.description = addDescip.value;
      obj.group = + addGroup.value;
      obj.price = + addPrice.value;
      obj.rate = + addRate.value;
      data.push(obj);

      getChart();
      renderData(data);
      document.forms["addForm"].reset();
    }

  })
}

// 渲染資料
function renderData(data) {
  let content = "";

  data.forEach(i => {
    content += `
    <a class="col-4 mb-5" href="#">
      <div class="card">
        <div class="cardHeader">
          <span class="aeraTag">${i.area}</span>
          <span class="scoreTag">${i.rate}</span>
          <div class="cardImg"><img src="${i.imgUrl}" alt="${i.name}"></div>
        </div>
        <div class="cardBody">
          <div class="cardContent">
            <h3 class="cardTitle">${i.name}</h3>
            <p class="cardText">${i.description}</p>
          </div>
        </div>
        <div class="cardFooter">
          <div class="numberBlock">
            <i class="fa-sharp fa-solid fa-circle-exclamation"></i>
            <p>剩下最後 ${i.group} 組</p>
          </div>
          <div class="priceBlock">
            <span>TWD</span>
            <p class="price">$${i.price}</p>
          </div>
        </div>
        </div>
      </div>
    </a>`;
  })

  list.innerHTML = content;
  filterResult.textContent = `共有 ${data.length} 筆資料，歡迎使用地區搜尋`;
};

// 抓取地區資料繪製圖表
function getChart() {
  let areaObj = {};
  let chartAry = [];

  // {高雄: 1, 台北: 1, 台中: 1}
  data.forEach(i => {
    if (areaObj[i.area] === undefined) {
      areaObj[i.area] = 1;
    } else {
      areaObj[i.area] += 1;
    }
  });

  // [["高雄", 1], ["台北",1], ["台中", 1]]
  for (const [key, value] of Object.entries(areaObj)) {
    chartAry.push([key, value]);
  }

  // 將 newData 丟入 c3 產生器
  const chart = c3.generate({
    bindto: "#chart",
    data: {
      columns: chartAry,
      type: 'donut',
      colors: {
        "台北": '#26BFC7',
        "台中": '#5151D3',
        "高雄": '#E68619',
      }

    },
    donut: {
      title: "套票地區比重",
      width: 15
    },

  });
}



