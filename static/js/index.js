let musics, nameFilterList, category, cart;

function displayData() {
    let content = "";

    musics.forEach(
        function (music) {
            let display = true;

            if (nameFilterList) {
                let nameFilter = nameFilterList.split(" ");
                display = false;
                nameFilter.forEach(function (filter) {
                    if (music.MusicName.includes(filter)) {
                        display = true;
                    }
                });
            } else {
                if (category) {
                    display = music.Category === category;
                }
            }


            if (display) {
                content += "<div class='card' id='music-" + music.MusicId + "'><div class='music-image' style='background: url(/materials/img_" + music.MusicId
                content += ".jpg) no-repeat 50%/contain'></div><div class='description'>"


                content += "<a href='/musics/" + music.MusicId + "/'>"
                content += "<h3>" + music.MusicName + "</h3></a>";
                if (music.NewArrival) {
                    content += "<span class='new-arrival'>NEW ARRIVAL!</span><br>";
                }
                content += "<b>Composer:</b> " + music.Composer + "<br>";
                content += "<b>Price: $</b> " + music.Price + "<br>";
                content += "</div></div>";
            }
        }
    )
    document.getElementById("musics").innerHTML = content;
    // document.getElementById("status").innerHTML = "Ordered By: " + sort_by + " &nbsp; Showed Region: " + (region_filter ? region_filter : "All");
}

function getCategories() {
    let categories = [],
        content = "";
    musics.forEach(function (music) {
        if (!categories.includes(music.Category)) {
            categories.push(music.Category);
        }
    });
    categories.forEach(function (category) {
        content += "<button onclick='filterCategory(\"" + category + "\")'>" + category + "</button>"
    });
    document.getElementById("categories").innerHTML = content;
}

window.onload = function () {
    fetch("/musics/")
        .then(response => response.json())
        .then(
            data => {
                musics = data;
                getCategories();
                displayData();
            }
        );
    getCart();
}

function search(keywords) {
    nameFilterList = keywords;
    displayData();
    document.getElementById("status").textContent = keywords ? "Searching Results" : "All Music";
}

function searchEnter(key) {
    if (event.key === "Enter") {
        search(key.value);
    }
}

function searchButton() {
    search(document.getElementById("search").value);
}

function filterCategory(type) {
    category = type;
    document.getElementById("status").textContent = "All " + type;
    document.getElementById("location").innerHTML = "<a href=\"/\">Home</a> > <a href=\"/\">" + type + "</a>";
    displayData();
}

function updateLocalCart(data) {
    cart = data;
    let sum = 0;
    cart.cart.forEach((e) => sum += e.Quantity);
    document.getElementById("cart-count").textContent = sum;
}

async function getCart() {
    fetch("/cart/")
        .then(response => response.json())
        .then(
            data => {
                updateLocalCart(data);
            }
        );
}

//
// function clearSearch() {
//     document.getElementsByTagName("input")[0].value = "";
//     nameFilterList = "";
//     displayData();
//     if (nameFilterList) {
//         document.getElementById("dropdown-con").classList.remove("show");
//     } else {
//         document.getElementById("dropdown-con").classList.add("show");
//     }
// }
//
// function sortByMenu() {
//     document.getElementById("sortByMenu").classList.toggle("show");
// }
//
//
// function byRegionMenu() {
//     document.getElementById("byRegionMenu").classList.toggle("show");
// }
//
// function selectRegion(option = "") {
//     region_filter = option;
//     displayData();
// }
//
// window.onclick = function(event) {
//     if (!event.target.matches('.dropbtn')) {
//         let dropdowns = document.getElementsByClassName("dropdown-content");
//         for (let i of dropdowns) {
//             if (i.classList.contains('show')) {
//                 i.classList.remove('show');
//             }
//         }
//     }
// }
