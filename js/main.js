// Header Section
let header = document.querySelector("header");
let headerIcon = document.querySelector("header .container nav .icon");
let headerUl = document.querySelector("header .container nav ul");

// When I Scroll Window
window.addEventListener("scroll", () => {
  // Add Class Scrolling On Header
  window.scrollY > 200
    ? header.classList.add("scrolling")
    : header.classList.remove("scrolling");
});
// When I Clicked On headerIcon
headerIcon.onclick = function () {
  // Add Class Show On Ul
  headerUl.classList.toggle("show");
};

// Scroll Into Section
let allLis = document.querySelectorAll("header ul li");

allLis.forEach((li) => {
  li.addEventListener("click", (e) => {
    document.querySelector(e.target.dataset.section).scrollIntoView({
      behavior: "smooth",
    });

    // Remove Class Active From All Lis
    allLis.forEach((li) => {
      li.classList.remove("active");
    });

    // Add Class Active On Current li
    e.target.classList.add("active");
  });
});

// Hadith Section
// Set Vars
let hadithText = document.querySelector(".hadith .hadith-text");
let prevHadith = document.querySelector(".buttons .prev");
let nextHadith = document.querySelector(".buttons .next");
let numberHadithBtn = document.querySelector(".buttons .number-hadith");
let hadithNumber = 0;

// Fetch Hadiths From Api
async function getData() {
  try {
    let myData = await fetch(
      "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-abudawud.json"
    );

    let AllHadiths = await myData.json();

    AllHadiths["hadiths"].length = 500;

    // Trigger Change Hadith Function
    changeHadith(AllHadiths);

    // When I Clicked On next Hadith , Trigger Next Function
    nextHadith.addEventListener("click", () => next(AllHadiths));

    // When I Clicked On next Hadith , Trigger Next Function
    prevHadith.addEventListener("click", () => prev(AllHadiths));
  } catch (reason) {
    console.log(`Reason: ${reason}`);
  }
}

getData();

// Function To Change Hadith
function changeHadith(allData) {
  // Set Current Hadith
  numberHadithBtn.innerHTML = `500 / ${hadithNumber + 1}`;

  hadithText.innerHTML = allData["hadiths"][hadithNumber]["text"];
}

// Next Hadith Function
function next(allData) {
  hadithNumber < allData["hadiths"].length - 1
    ? hadithNumber++
    : (hadithNumber = 0);

  // Trigger Change Hadith Function
  changeHadith(allData);
}

// Prev Hadith Function
function prev(allData) {
  hadithNumber > 0
    ? hadithNumber--
    : (hadithNumber = allData["hadiths"].length - 1);

  // Trigger Change Hadith Function
  changeHadith(allData);
}

// Lectures Section
let allLectures = document.querySelectorAll(".lectures .right .right-content");
let iframe = document.querySelector(".left iframe");

allLectures.forEach((lecture) => {
  lecture.addEventListener("click", () => {
    iframe.src = lecture.dataset.lecture;
  });
});

// Quran Section
// Set Vars
let popUpAyat = document.querySelector(".pop-up");
let quranContainer = document.querySelector(".quran-content");
let popUpAyatContainer = document.querySelector(".pop-up .ayat-container");
let popUpAudio = document.querySelector(".surah-audio");

let popUpAyatClose = document.querySelector(".pop-up .close");

// When I Clicked On Close
popUpAyatClose.onclick = function () {
  // Remove Class Show From popUpAyat
  popUpAyat.classList.remove("show");

  // Pause Audio
  popUpAudio.pause();
};
// Fetch Quran From Api
fetch("https://api.alquran.cloud/v1/meta")
  .then((result) => result.json())

  .then((allData) => {
    // Collect All Surahs In Variable
    let allSurahsFromApi = allData.data.surahs.references;

    // Loop On Every Surah To Create Divs In quranContainer
    for (let i = 0; i < allSurahsFromApi.length; i++) {
      quranContainer.innerHTML += `
        <div class="surah">
          <h4> ${allSurahsFromApi[i].name} </h4>
          <p> ${allSurahsFromApi[i].englishName}</p>
        </div>
      `;
    }

    // Select All Surah Div
    let allSurahsInDom = document.querySelectorAll(".surah");

    allSurahsInDom.forEach((surah, index) => {
      surah.addEventListener("click", () => {
        popUpAyatContainer.innerHTML = "";

        // Add Class Show On popUpAyat
        popUpAyat.classList.add("show");

        // Add Name Of Suarh
        document.querySelector(".surah-name").innerHTML = surah.innerHTML;

        // Play Audio
        popUpAudio.src = `Audios/Nasser_Al_Qatammi/${index + 1}.mp3`;

        // Fetch To Get Ayat Of Surah
        fetch(`https://api.alquran.cloud/v1/surah/${index + 1}`).then((data) =>
          data.json().then((ayat) => {
            // Collect All Ayat In Variable
            let allAyat = ayat.data.ayahs;

            // Add Ayat Form Api To popUpAyat In Dom
            for (let i = 0; i < allAyat.length; i++) {
              popUpAyatContainer.innerHTML += `
              
              <span>${allAyat[i].text} (${i + 1})</span>

              `;
            }
          })
        );
      });
    });
  });

// Tasbeh Section
let counter = 0;
let fingerPrintCount = document.querySelector(".fingerPrint p");
fingerPrintCount.innerHTML = counter++;
document.querySelector(".fingerPrint").onclick = function () {
  document.querySelector(".fingerPrint p").innerHTML = counter++;
};

document.querySelector(".tasbeh .delete").onclick = function () {
  counter = 0;
  fingerPrintCount.innerHTML = counter++;
};

// Prayer Time Section
let prayerTime = document.querySelectorAll(".card .circle .time");
let islamicDate = document.querySelector(".islamic-date");

// Tigger PrayerApi Function
prayerApi(
  "https://api.aladhan.com/v1/timingsByCity?city=cairo&country=egypt&method=8"
);
function prayerApi(apiLink) {
  // Fetch Data And Convert It To JavaScript Object
  fetch(apiLink)
    .then((data) => data.json())
    .then((allPrayers) => {
      // Set islamicDate
      islamicDate.innerHTML = `
      ${allPrayers.data.date.hijri.weekday.ar} 
      ${allPrayers.data.date.hijri.day} 
      ${allPrayers.data.date.hijri.month.ar} 
      ${allPrayers.data.date.hijri.year}`;
      // Set Fajr
      prayerTime[0].innerHTML = allPrayers.data.timings.Fajr;
      // Set Dhuhr
      prayerTime[1].innerHTML = allPrayers.data.timings.Dhuhr;
      // Set Asr
      prayerTime[2].innerHTML = allPrayers.data.timings.Asr;
      // Set Maghrib
      prayerTime[3].innerHTML = allPrayers.data.timings.Maghrib;
      // Set Isha
      prayerTime[4].innerHTML = allPrayers.data.timings.Isha;
      // Set Midnight
      prayerTime[5].innerHTML = allPrayers.data.timings.Midnight;
    });
}
