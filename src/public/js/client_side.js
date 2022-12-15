let home_myForm = document.getElementById("home_random_cat_buttom");
let home_random_cat = document.getElementById("home_random_cat_img");

if (home_myForm) {
    home_myForm.addEventListener('submit', (event) => {
      console.log('Form submission fired');
      event.preventDefault();
      console.log('Has a form');

      let randCat = homeGetRandomCat();

      home_random_cat.setAttribute("src", randCat)
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