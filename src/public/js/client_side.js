let home_myForm = document.getElementById("home_random_cat_buttom");
let home_random_cat = document.getElementById("home_random_cat_img");

let profile_myForm = document.getElementById("profile_button");
let profile_image = document.getElementById("profile_img");

if (home_myForm) {
    home_myForm.addEventListener('submit', (event) => {
      console.log('Form submission fired');
      event.preventDefault();
      console.log('Has a form');

      let randCat = homeGetRandomCat();

      home_random_cat.setAttribute("src", randCat)
    });
}

if (profile_myForm) {
    profile_myForm.addEventListener('submit', (event) => {
      console.log('Form submission fired');
      event.preventDefault();
      console.log('Has a form');

      let randCat = profileGetRandomCat();

      profile_image.setAttribute("src", randCat)
    });
}

const homeGetRandomCat = () => {

    const cats = [
        "https://uploads.dailydot.com/2018/10/olli-the-polite-cat.jpg?q=65&w=1135&ar=2:1&fit=crop",
        "https://www.cnet.com/a/img/resize/5eb6d5e0c0dbff265f36109152cde81958eb68cf/hub/2020/09/22/ad4bd31b-cf8c-46f5-aa70-231df9acc041/longcat.jpg?auto=webp&fit=crop&height=675&width=1200",
        "https://external-preview.redd.it/UpoNaV9BKB9eJCPKOsPyr40M1AE19rFkN5UJqhcPGLg.png?width=960&crop=smart&format=pjpg&auto=webp&v=enabled&s=e1e226e9471251266245f611aa9b16ff62320b45",
        "https://i.kym-cdn.com/entries/icons/original/000/026/489/crying.jpg",
        "https://www.webbox.co.uk/wp-content/webp-express/webp-images/uploads/2022/04/shutterstock_1661727271.jpg.webp",
        "https://i.ytimg.com/vi/8BVYaL6OQ9Q/maxresdefault.jpg",
        "https://i.pinimg.com/564x/5d/49/83/5d498372870466ba95d776faf5b8f8fd.jpg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhjRh8TEh2_DrIMeHNiGNc1JcDJfezoNVbDhJAjagsw5ITZD9cuH9xmVGDTmSV-Wp8Bio&usqp=CAU"
    ]

    let random_number = Math.floor(Math.random() * cats.length)

    return cats[random_number]
}


const profileGetRandomCat = () => {

    const cats = [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNbLnA6SQcWWByv0MSfFCymj5jVYXS22kSoQ&usqp=CAU",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThEA_aOX2FGBM_Asl6Lv8DxSdUIANIQhgPKA&usqp=CAU",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1__nUveMs5K4VA2cdLheJMT6C-tqFQveppg&usqp=CAU",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkC6PYRkOB-OL2EIrbULQEfTcfgK-JwLCJqQ&usqp=CAU",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5j1Ue-8_mj1gEkXuj-ZPdn4N1YhvKs7GLKQ&usqp=CAU",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGxpH9rrL6hQS5BgHSKX6g0YngU2QMu2m1npi9IQsXJZbt9tyufe7QLgcb58yPCC8mxdQ&usqp=CAU",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_asFPdQWx97Qf7glm-1ssbcZFJv86lukeC63beKymq3EfkQA4cV4mfK0wSpFJcQ3xuDM&usqp=CAU",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQxoClMa-fxkcbjlOinkQ1ZCVas70dSuanJWx243VJM9ut_Xzmr6ONtC2gmMJB_yxnP7c&usqp=CAU",
        "https://divedigital.id/wp-content/uploads/2022/07/2-Aesthetic-Cat-with-Sleepy-Mask.jpg"
    ]

    let random_number = Math.floor(Math.random() * cats.length)

    return cats[random_number]
}