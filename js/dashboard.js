let btn = document.getElementById("btn-addProject");
let addBox = document.getElementById("addBox");
let cancelBtn = document.getElementById("cancel");
let logOut = document.getElementById("logOut");
let projectName = document.getElementById("projectName");
let descrip = document.getElementById("description");
let findProjectName = document.getElementById("findProjectName");
let existMessage = document.getElementById("exist");
let confirmDeleteBox = document.getElementById("confirmDeleteBox");
let deleteBtn = document.getElementById("delete");
let cancelDeleteBtn = document.getElementById("cancel-one");
let btnPageElement = document.getElementById("btnPage");
let btnPre = document.getElementById("btnPre");
let btnNext = document.getElementById("btnNext");

let myProject = document.getElementById("myProject");
myProject.onclick = function () {
    window.location.href = "dashboard.html";
};

let myTask = document.getElementById("myTask");
myTask.onclick = function () {
    window.location.href = "detail-project.html";
};

let users = JSON.parse(localStorage.getItem("user"));
let projects = JSON.parse(localStorage.getItem("projects")) || [];
let editingIndex = -1;
let totalPerPage = 4;
let currentPage = parseInt(localStorage.getItem("currentPage")) || 1;
let searchValue = ""; 

btn.onclick = function () {
    addBox.style.display = "flex";
    projectName.value = "";
    descrip.value = "";
    existMessage.innerHTML = "";
    editingIndex = -1;
};

cancelBtn.onclick = function () {
    addBox.style.display = "none";
};


logOut.onclick = function () {
    window.location.href = "login.html";
};

let errorName = document.getElementById("error-name");
let errorDescrip = document.getElementById("error-descrip");

document.getElementById("save").onclick = function () {
    let name = projectName.value.trim();
    let desc = descrip.value.trim();

    if (!validateForm(name, desc)) {
        return;
    }
    if (editingIndex === -1) {
        projects.push({
            id: Date.now(),
            name: name,
            description: desc,
            members: [
                {
                    userId: users.id,
                    role: "Project owner",
                },
            ],
        });
    } else {
        projects[editingIndex].name = name;
        projects[editingIndex].description = desc;
    }

    localStorage.setItem("projects", JSON.stringify(projects));
    addBox.style.display = "none";
    displayProject();
};

function validateForm(name, desc) {
    
    if (name === "" && desc === "") {
        errorName.innerHTML = "Tên không được để trống!";
        errorName.style.color = "red";
        errorDescrip.innerHTML = "Mô tả không được để trống!";
        errorDescrip.style.color = "red";
        return false;
    } else if (name === "") {
        errorName.innerHTML = "Tên không được để trống!";
        errorName.style.color = "red";
        return false;
    }else {
        
        projectName.addEventListener("keypress" , function(){
            errorName.style.display = "none";
            errorDescrip.style.display = "none";
        })
    }

    let number = [1,2,3,4,5,6,7,8,9,0];
    let hasNumber = false;
    
    number.forEach((num) => {
        if (name.includes(num.toString())) {
            hasNumber = true;
        }
    });
    
    if (hasNumber) {
        errorName.innerHTML = "Tên không được có số";
        errorName.style.color = "red";
        return false;
    }
    
    if (desc === "") {
        errorDescrip.innerHTML = "Mô tả không được để trống!";
        errorDescrip.style.color = "red";
        return false;
    }
    if (name.length < 3 || name.length > 50) {
        errorName.innerHTML = "Tên dự án phải từ 3 đến 50 ký tự!";
        errorName.style.color = "red";
        return false;
    }
    if (desc.length < 10 || desc.length > 200) {
        errorDescrip.innerHTML = "Mô tả phải từ 10 đến 200 ký tự!";
        errorDescrip.style.color = "red";
        return false;
    }

    let isDuplicate = false;
    for (let i = 0; i < projects.length; i++) {
        if (i !== editingIndex && projects[i].name === name) {
            isDuplicate = true;
            break;
        }
    }

    if (isDuplicate) {
        existMessage.innerHTML = "Tên dự án đã tồn tại!";
        existMessage.style.color = "red";
        return false;
    }

    existMessage.innerHTML = "";
    return true;
}

findProjectName.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        searchValue = findProjectName.value.trim().toLowerCase();
        currentPage = 1;
        displayProject();
    }
});

function addEventListeners() {
    let editBtns = document.querySelectorAll(".edit-btn");
    for (let i = 0; i < editBtns.length; i++) {
        editBtns[i].onclick = function () {
            let index = editBtns[i].dataset.index;
            editingIndex = index;
            addBox.style.display = "flex";
            projectName.value = projects[index].name;
            descrip.value = projects[index].description;
            existMessage.innerHTML = "";
        };
    }

    let deleteBtns = document.querySelectorAll(".delete-btn");
    for (let i = 0; i < deleteBtns.length; i++) {
        deleteBtns[i].onclick = function () {
            confirmDelete(deleteBtns[i].dataset.index);
        };
    }

    document.querySelectorAll(".detail-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
            const projectId = Number(this.getAttribute("data-project-id"));
            localStorage.setItem("currentIdProject", JSON.stringify(projectId));
            window.location.href = "../pages/detail-project.html";
        });
    });
}

function confirmDelete(index) {
    confirmDeleteBox.style.display = "flex";

    deleteBtn.onclick = function () {
        projects.splice(index, 1);
        localStorage.setItem("projects", JSON.stringify(projects));
        confirmDeleteBox.style.display = "none";
        displayProject();
    };

    cancelDeleteBtn.onclick = function () {
        confirmDeleteBox.style.display = "none";
    };
}

function displayProject() {
    let tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    // Lọc danh sách dự án theo user và giá trị tìm kiếm
    let visibleProjects = projects.filter((project) => {
        return (
            project.members &&
            project.members.some((member) => member.userId === users.id) &&
            project.name.toLowerCase().includes(searchValue)
        );
    });

    let totalPage = Math.ceil(visibleProjects.length / totalPerPage);
    if (currentPage > totalPage) {
        currentPage = totalPage > 0 ? totalPage : 1;
    }

    let start = (currentPage - 1) * totalPerPage;
    let end = start + totalPerPage;
    let paginatedProjects = visibleProjects.slice(start, end);

    for (let i = 0; i < paginatedProjects.length; i++) {
        let project = paginatedProjects[i];
        tbody.innerHTML += `
            <tr>
                <td>${start + i + 1}</td>
                <td>${project.name}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit-btn" data-index="${
                        projects.findIndex((p) => p.id === project.id)
                    }">Sửa</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-index="${
                        projects.findIndex((p) => p.id === project.id)
                    }">Xóa</button>
                    <button class="btn btn-primary btn-sm detail-btn" data-project-id="${
                        project.id
                    }">Chi tiết</button>
                </td>
            </tr>`;
    }

    localStorage.setItem("currentPage", currentPage);
    updatePagination(visibleProjects.length);
    addEventListeners();
}

function updatePagination(totalVisible) {
    btnPageElement.innerHTML = "";
    let totalPage = Math.ceil(totalVisible / totalPerPage);

    for (let i = 1; i <= totalPage; i++) {
        let btnElement = document.createElement("button");
        btnElement.textContent = i;
        btnElement.className = "btn btn-light mx-1";

        if (i === currentPage) {
            btnElement.classList.add("btn-primary");
        }

        btnElement.addEventListener("click", function () {
            currentPage = i;
            displayProject();
        });

        btnPageElement.appendChild(btnElement);
    }

    if (currentPage > 1) {
        btnPre.classList.remove("disabled");
        btnPre.style.pointerEvents = "auto";
    } else {
        btnPre.classList.add("disabled");
        btnPre.style.pointerEvents = "none";
    }
    if (currentPage < totalPage) {
        btnNext.classList.remove("disabled");
        btnNext.style.pointerEvents = "auto";
    } else {
        btnNext.classList.add("disabled");
        btnNext.style.pointerEvents = "none";
    }
}

btnNext.addEventListener("click", function () {
    let totalPage = Math.ceil(
        projects.filter((project) =>
            project.members.some((member) => member.userId === users.id) &&
            project.name.toLowerCase().includes(searchValue)
        ).length / totalPerPage
    );
    if (currentPage < totalPage) {
        currentPage++;
        displayProject();
    }
});

btnPre.addEventListener("click", function () {
    if (currentPage > 1) {
        currentPage--;
        displayProject();
    }
});

displayProject();