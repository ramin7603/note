interface Note {
  id: string;
  title: string;
  detail: string;
  category: string;
}

const $ = document;
const titleElem = $.querySelector("#note-title") as HTMLInputElement;
const detailElem = $.querySelector("#note-content") as HTMLTextAreaElement;
const selectElem = $.querySelector("#note-category") as HTMLSelectElement;
const optionElem = $.querySelectorAll("option");
const submitElem = $.querySelector(".submit-form") as HTMLButtonElement;
const divManiElem = $.querySelector("#note-list") as HTMLDivElement;
const categoryBtnElem = $.querySelectorAll(
  ".btn-categorys"
) as NodeListOf<HTMLButtonElement>;
const searchElem = $.querySelector("#search-input") as HTMLInputElement;

// let notes: Note[];
let notes: Note[] = [];

const clearInput = (): void => {
  titleElem.value = "";
  detailElem.value = "";
  selectElem.value = "";
};

const removeHandler = (id: string) => {
  notes = notes.filter((item) => item.id !== id);
  addLocal(notes);
  getNote();
};

const makeNote = (note: Note[]) => {
  divManiElem.innerHTML = "";
  note?.forEach((item) => {
    let divElem = $.createElement("div");
    let headingElem = $.createElement("h3");
    let detailElem = $.createElement("p");
    let categoryElem = $.createElement("span") as HTMLSpanElement;
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
  } else {
    divManiElem.innerHTML = `<h6>یادداشتی وجود ندارد ☹</h6>`;
    return (notes = []);
  }
};

const selectHandler = (): string => {
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

const addLocal = (note: Note[]) => {
  localStorage.setItem("notes", JSON.stringify(note));
};

const isNote = (note: Note[], newNote: string) => {
  return note.some(
    (item) => item.title.toLowerCase().trim() === newNote.toLowerCase().trim()
  );
};

const validationForm = () => {
  if (titleElem.value.trim() && detailElem.value.trim() && selectHandler()) {
    let inputValue = titleElem.value;
    let isExist: boolean = isNote(getNote(), inputValue);

    if (!isExist) {
      let newNote: Note = {
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
  } else {
    alert("form is empty ☹");
  }
};

const submitHandler = (event: Event) => {
  event.preventDefault();
  validationForm();
  console.log("list", notes);
};

const filterNote = (note: string) => {
  if (note === "all") {
    getNote();
  } else {
    getNote();
    notes = notes.filter((item) => item.category == note);
    console.log("note filter ", notes);
    makeNote(notes);
  }
};

const setActiveButton = (clickButton: HTMLButtonElement) => {
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
  const filtered = notes.filter(
    (item) =>
      item.title.trim().toLowerCase().includes(query) ||
      item.detail.trim().toLowerCase().includes(query)
  );
  makeNote(filtered);
};

selectElem.addEventListener("change", selectHandler);
submitElem.addEventListener("click", submitHandler);
searchElem.addEventListener("input", searchHandler);

window.addEventListener("load", getNote);
