const pageHeader = document.querySelector(".header");
const hamburger = document.querySelector(".hamburger");
const menu = document.querySelector(".hamburger-menu");
const links = document.querySelectorAll('a[href^="#"]');
const toTop = document.querySelector(".to-top");
const menuLinks = document.querySelectorAll(".hamburger-menu a");

// スムーススクロール
links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const href = link.getAttribute("href");
    if (href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;

    const position =
      target.getBoundingClientRect().top +
      window.scrollY -
      pageHeader.offsetHeight;

    window.scrollTo({
      top: position,
      behavior: "smooth",
    });
  });
});

// スクロールしたらヘッダーを表示
window.addEventListener("scroll", () => {
  const scrollValue = window.scrollY;

  if (hamburger.classList.contains("active")) {
    pageHeader.classList.add("is-show");
    return;
  }

  if (window.scrollY > 100) {
    pageHeader.classList.add("is-show");
  } else {
    pageHeader.classList.remove("is-show");
  }

  // Topに戻るbtn
  if (scrollValue > 100) {
    toTop.classList.add("show");
  } else {
    toTop.classList.remove("show");
  }
});

// ハンバーガーメニュー
const toggleMenu = () => {
  hamburger.classList.toggle("active");
  menu.classList.toggle("active");
  pageHeader.classList.add("is-show");
};

hamburger.addEventListener("click", toggleMenu);

// メニュー外側クリックで閉じる
menu.addEventListener("click", (e) => {
  if (e.target === menu) toggleMenu();
});

// メニュー内リンクをクリックしたら閉じる
menuLinks.forEach((link) => {
  link.addEventListener("click", toggleMenu);
});
