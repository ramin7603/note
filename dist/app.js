"use strict";
const $ = document;
const titleElem = $.querySelector("#note-title");
const detailElem = $.querySelector("#note-content");
const selectElem = $.querySelector("#note-category");
const optionElem = $.querySelectorAll("option");
const submitElem = $.querySelector(".submit-form");
const divManiElem = $.querySelector("#note-list");
const categoryBtnElem = $.querySelectorAll(".btn-categorys");
const searchElem = $.querySelector("#search-input");
// let notes: Note[];
let notes = [];
const clearInput = () => {
    titleElem.value = "";
    detailElem.value = "";
    selectElem.value = "";
};
const removeHandler = (id) => {
    notes = notes.filter((item) => item.id !== id);
    addLocal(notes);
    getNote();
};
const makeNote = (note) => {
    divManiElem.innerHTML = "";
    note === null || note === void 0 ? void 0 : note.forEach((item) => {
        let divElem = $.createElement("div");
        let headingElem = $.createElement("h3");
        let detailElem = $.createElement("p");
        let categoryElem = $.createElement("span");
        let actionDivElem = $.createElement("div");
        let btnEditElem = $.createElement("button");
        let btnRemoveElem = $.createElement("button");
        headingElem.textContent = item.title;
        detailElem.textContent = item.detail;
        categoryElem.textContent = item.category;
        btnEditElem.textContent = "ویرایش";
        btnRemoveElem.textContent = "حذف";
        divElem.className = "note-item";
        actionDivElem.className = "actions";
        btnEditElem.className = "edit-btn";
        btnRemoveElem.className = "delete-btn";
        categoryElem.className = "category";
        actionDivElem.append(btnEditElem, btnRemoveElem);
        divElem.append(headingElem, detailElem, categoryElem, actionDivElem);
        btnRemoveElem.addEventListener("click", () => removeHandler(item.id));
        divManiElem.appendChild(divElem);
    });
};
const getNote = () => {
    let allNote = localStorage.getItem("notes");
    if (allNote) {
        notes = JSON.parse(allNote);
        makeNote(notes);
        return notes;
    }
    else {
        divManiElem.innerHTML = `<h6>یادداشتی وجود ندارد ☹</h6>`;
        return (notes = []);
    }
};
const selectHandler = () => {
    switch (selectElem.value) {
        case "work":
            return "کار";
        case "personal":
            return "شخصی";
        case "other":
            return "سایر";
        default:
            return "سایر";
    }
};
const addLocal = (note) => {
    localStorage.setItem("notes", JSON.stringify(note));
};
const isNote = (note, newNote) => {
    return note.some((item) => item.title.toLowerCase().trim() === newNote.toLowerCase().trim());
};
const validationForm = () => {
    if (titleElem.value.trim() && detailElem.value.trim() && selectHandler()) {
        let inputValue = titleElem.value;
        let isExist = isNote(getNote(), inputValue);
        if (!isExist) {
            let newNote = {
                id: crypto.randomUUID(),
                title: titleElem.value,
                detail: detailElem.value,
                category: selectHandler(),
            };
            notes.push(newNote);
            clearInput();
            addLocal(notes);
            getNote();
            return;
        }
        alert("note is exist in list notes");
        clearInput();
    }
    else {
        alert("form is empty ☹");
    }
};
const submitHandler = (event) => {
    event.preventDefault();
    validationForm();
    console.log("list", notes);
};
const filterNote = (note) => {
    if (note === "all") {
        getNote();
    }
    else {
        getNote();
        notes = notes.filter((item) => item.category == note);
        console.log("note filter ", notes);
        makeNote(notes);
    }
};
const setActiveButton = (clickButton) => {
    categoryBtnElem.forEach((item) => item.classList.remove("active"));
    clickButton.classList.add("active");
};
categoryBtnElem.forEach((item) => {
    item.addEventListener("click", () => {
        setActiveButton(item);
        const category = item.id.replace("filter-", "");
        filterNote(category);
    });
});
const searchHandler = () => {
    const query = searchElem.value.trim().toLowerCase();
    const filtered = notes.filter((item) => item.title.trim().toLowerCase().includes(query) ||
        item.detail.trim().toLowerCase().includes(query));
    makeNote(filtered);
};
selectElem.addEventListener("change", selectHandler);
submitElem.addEventListener("click", submitHandler);
searchElem.addEventListener("input", searchHandler);
window.addEventListener("load", getNote);
