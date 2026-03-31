// ヘッダーずらしてスクロール
const pageHeader = document.querySelector(".header");
const links = document.querySelectorAll('a[href^="#"]');

links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const href = link.getAttribute("href");
    if (href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;
    const position =
      target.getBoundingClientRect().top +
      window.pageYOffset -
      pageHeader.offsetHeight;

    window.scrollTo({
      top: position,
      behavior: "smooth",
    });
  });
});

// スクロールしたらヘッダーを表示
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    pageHeader.classList.add("is-show");
  } else {
    pageHeader.classList.remove("is-show");
  }
});

// Topに戻るbtn
const toTop = document.querySelector(".to-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    toTop.classList.add("show");
  } else {
    toTop.classList.remove("show");
  }
});

// ハンバーガーメニュー
const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".hamburger-menu");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  menu.classList.toggle("active");
});

menu.addEventListener("click", (e) => {
  if (e.target === menu) {
    hamburger.classList.remove("active");
    menu.classList.remove("active");
  }
});

// メニュー内リンクをクリックしたら閉じる
const menuLinks = document.querySelectorAll(".hamburger-menu a");

menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    menu.classList.remove("active");
  });
});
