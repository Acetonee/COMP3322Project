let musics, nameFilterList, category, cart, once = 1;

function displayCart() {
    let content = "", sum = 0;

    cart.cart.forEach((item) => {
        let musicInfo = musics.find((e) => e.MusicId === item.MusicId);
        content += "<div class='card' id='cart-music-" + item.MusicId + "'><div class='music-image' style='background: url(/materials/img_" + item.MusicId;
        content += ".jpg) no-repeat 50%/contain'></div><div class='description'>";


        content += "<a href='/musics/" + item.MusicId + "/'>";
        content += "<h3>" + musicInfo.MusicName + "</h3></a>";


        content += "<b>Quantity:</b> " + item.Quantity + "<br>";
        content += "<b>Unit Price: $</b> " + musicInfo.Price + "<br>";
        content += "</div></div>";

        sum += item.Quantity * musicInfo.Price;
    });

    document.getElementById("cart").innerHTML = content;
    document.getElementById("total-price").innerHTML = "Total Price: $" + sum;
}

function deleteCartItem(id) {
    cart.cart = cart.cart.filter((e) => {
        return e.MusicId !== id;
    });
    pushCartToOrigin();
}


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
                if (display) {
                    content += "<div class='card' id='music-" + music.MusicId + "'><div class='music-image' style='background: url(/materials/img_" + music.MusicId
                    content += ".jpg) no-repeat 50%/contain'></div><div class='description'>"


                    content += "<a href='/musics/" + music.MusicId + "/'>"
                    content += "<h3>" + music.MusicName + "</h3></a>";
                    if (music.NewArrival) {
                        content += "<span class='new-arrival'>New Arrival!</span><br>";
                    }
                    content += "<b>Composer:</b> " + music.Composer + "<br>";
                    content += "<b>Price: $</b> " + music.Price + "<br>";
                    content += "</div></div>";
                }
            }
        }
    )
    document.getElementById("musics").innerHTML = content;
}

window.onload = function () {
    fetch("/musics")
        .then(response => response.json())
        .then(
            data => {
                musics = data;
                displayData();
                getCart();
            }
        );
}

function search(keywords) {
    nameFilterList = keywords;
    displayData();
}

function searchEnter(key) {
    if (event.key === "Enter") {
        search(key.value);
    }
}

function searchButton() {
    search(document.getElementById("search").value);
}

function updateLocalCart(data) {
    cart = data;
    let sum = 0;
    cart.cart.forEach((e) => sum += e.Quantity);
    document.getElementById("cart-count").textContent = sum;
    displayCart();
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

function pushCartToOrigin() {
    fetch("/cart/", {
        method: "post",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cart)
    }).then(res => res.json())
        .then(data => {
            updateLocalCart(data);
        });
}

function addToCart(MusicId) {
    let quantity = parseInt(document.getElementById("quantity").value);
    if (isNaN(quantity) || quantity <= 0) {
        return;
    }
    cart.cart.forEach((item) => {
        if (item.MusicId === MusicId) {
            item.Quantity += quantity;
            quantity = 0;
        }
    });
    if (quantity) {
        cart.cart.push({"MusicId": MusicId, "Quantity": parseInt(document.getElementById("quantity").value)});
    }
    pushCartToOrigin();
}

function orderEnter(key) {
    if (event.key === "Enter") {
        document.getElementById("order").click();
    }
}

function checkUsername(data) {
    if (data.value) {
        fetch("/checkout/", {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({testUserName: data.value})
        }).then(response => response.text()).then(data => {
            document.getElementById("warning").textContent = data;
        })
    }
}

function prompt() {
    if (once) {
        alert('Please do not leave the fields empty');
        once = 0;
        setTimeout(() => once = 1, 1000);
    }
    return null;
}

function checkForm (obj) {
    console.log(document.getElementById('warning').textContent);
    if (document.getElementById('warning').textContent) {
        document.getElementById('mainForm').submit();
    } else {
        alert("Duplicated username");
    }
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
