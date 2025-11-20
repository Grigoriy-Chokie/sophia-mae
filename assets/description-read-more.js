document.addEventListener("DOMContentLoaded", function () {
  const idMore = document.querySelector("#button-more");
  const idText = document.querySelector("#more-text");

  if (idMore && idText) {
    insertButton(idMore);
  }

  function insertButton(htmlToInsert) {
    const button = document.createElement("button");
    button.textContent = "Read more...";
    button.addEventListener("click", openText);
    htmlToInsert.insertAdjacentElement("afterbegin", button);
  }

  function openText() {
    idText.style.display = "inline-block";
    idText.style.maxHeight = idText.scrollHeight + "px";
    idMore.style.display = "none";
  }
});