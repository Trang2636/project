document.addEventListener("DOMContentLoaded", function () {
    let addBtn = document.getElementById("addBtn");
    let modal = document.getElementById("modal");
    let deleteBtn = document.getElementById("deleteBtn");
    let logOutBtn = document.getElementById("logOut");
    let confirmDeleteBox = document.getElementById("confirmDeleteBox");
    let user = JSON.parse(localStorage.getItem("user"));
    let currentIdProject = JSON.parse(localStorage.getItem("currentIdProject"));
    let projects = JSON.parse(localStorage.getItem("projects")) || [];
    let addMemberBtn = document.getElementById("add");
    let deleteTask = document.getElementById("delete");
    let findProjectName = document.getElementById("find-project");
    let cancel = document.getElementById("cancel");
    let myProject = document.getElementById("myProject");
    let myTask = document.getElementById("myTask");
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    let editingIndex = -1;
    let searchValue = "";

        myProject.onclick = function () {
            window.location.href = "category-manager.html";
        }

        myTask.onclick = function () {
            window.location.href = "dashboard.html";
        }

        logOutBtn.onclick = function () {
            window.location.href = "login.html";
        };

        cancel.onclick = function () {
            let addMemberBox = document.getElementById("memberModal");
            if (addMemberBox) {
                addMemberBox.style.display = "none";
            }
        };

        deleteBtn.onclick = function () {
            if (modal) {
                modal.style.display = "none";
                document.getElementById("task-name").value = "";
                document.getElementById("assignee").value = "";
                document.getElementById("start-date").value = "";
                document.getElementById("due-date").value = "";
                document.getElementById("priority").value = "";
                document.getElementById("progress").value = "";
                document.getElementById("status").value = "";
                editingIndex = -1;
                let saveBtn = document.getElementById("save-btn");
                if (saveBtn) {
                    saveBtn.classList.remove("save-edit", "save-add");
                }
            }
        };

    let detailIndex = projects.findIndex(i => i.id === currentIdProject);
    let nameProject = document.getElementById("nameProject");
    let inforProject = document.getElementById("infor-project");
    if (detailIndex !== -1) {
        if (inforProject) {
            inforProject.innerHTML = projects[detailIndex].description || "";
        }
        if (nameProject) {
            nameProject.innerHTML = projects[detailIndex].projectName || "";
        }
    }

    function displayProject() {
        let priorityCss, progressCss;
        let toDo = document.querySelector(".toDo");
        let inProgress = document.querySelector(".inProgress");
        let pending = document.querySelector(".pending");
        let done = document.querySelector(".done");

        if (toDo) toDo.innerHTML = "";
        if (inProgress) inProgress.innerHTML = "";
        if (pending) pending.innerHTML = "";
        if (done) done.innerHTML = "";

        let filteredTask = tasks.filter(task => task.projectId === currentIdProject);
        if (searchValue) {
            filteredTask = filteredTask.filter(task => {
                const taskNameMatch = task.taskName && task.taskName.toLowerCase().includes(searchValue.toLowerCase());
                const assigneeMatch = task.assignee && task.assignee.toLowerCase().includes(searchValue.toLowerCase());
                return taskNameMatch || assigneeMatch;
            });
        }

        filteredTask.forEach((task, index) => {
            if (task.priority === "Cao") priorityCss = "high";
            if (task.priority === "Thấp") priorityCss = "low";
            if (task.priority === "Trung bình") priorityCss = "medium";
            if (task.progress === "Trễ hạn") progressCss = "behind";
            if (task.progress === "Đúng tiến độ") progressCss = "noRisk";
            if (task.progress === "Có rủi ro") progressCss = "risk";

            let realIndex = tasks.indexOf(task);
            let taskHtml = `
                <tr>
                    <td class="col1">${task.taskName}</td>
                    <td class="col2">${task.assignee}</td>
                    <td class="col3"><span class="${priorityCss}">${task.priority}</span></td>
                    <td class="col4">${task.asignDate}</td>
                    <td class="col5">${task.deadline}</td>
                    <td class="col6"><span class="${progressCss}">${task.progress}</span></td>
                    <td class="col7">
                        <button class="fix" data-index="${realIndex}">Sửa</button>
                        <button class="del" data-index="${realIndex}">Xoá</button>
                    </td>
                </tr>`;

            if (task.status === "toDo" && toDo) {
                toDo.innerHTML += taskHtml;
            } else if (task.status === "inProgress" && inProgress) {
                inProgress.innerHTML += taskHtml;
            } else if (task.status === "pending" && pending) {
                pending.innerHTML += taskHtml;
            } else if (done) {
                done.innerHTML += taskHtml;
            }
        });

        attachEditEvents();
        attachDeleteEvents();
    }

    function attachEditEvents() {
        document.querySelectorAll(".fix").forEach(btn => {
            btn.onclick = function () {
                let index = parseInt(btn.getAttribute("data-index"));
                let task = tasks[index];
                if (task) {
                    document.getElementById("task-name").value = task.taskName;
                    document.getElementById("assignee").value = task.assignee;
                    document.getElementById("start-date").value = task.asignDate;
                    document.getElementById("due-date").value = task.deadline;
                    document.getElementById("priority").value = task.priority;
                    document.getElementById("progress").value = task.progress;
                    document.getElementById("status").value = task.status;
                    editingIndex = index;
                    if (modal) {
                        modal.style.display = "block";
                    }
                    assigneeName();
                    document.getElementById("assignee").value = task.assignee;
                    let saveBtn = document.getElementById("save-btn");
                    if (saveBtn) {
                        saveBtn.classList.remove("save-add");
                        saveBtn.classList.add("save-edit");
                    }
                }
            };
        });
    }

    function attachDeleteEvents() {
        document.querySelectorAll(".del").forEach(btn => {
            btn.onclick = function () {
                let index = parseInt(btn.getAttribute("data-index"));
                deleteProject(index);
            };
        });
    }

    function deleteProject(index) {
        if (index >= 0 && index < tasks.length) {
            if (confirmDeleteBox) {
                confirmDeleteBox.style.display = "block";
            }
            if (deleteTask) {
                deleteTask.onclick = function () {
                    tasks.splice(index, 1);
                    localStorage.setItem("tasks", JSON.stringify(tasks));
                    if (confirmDeleteBox) {
                        confirmDeleteBox.style.display = "none";
                    }
                    displayProject();
                };
            }

            let cancelBtn = document.getElementById("cancel-one");
            if (cancelBtn) {
                cancelBtn.onclick = function () {
                    if (confirmDeleteBox) {
                        confirmDeleteBox.style.display = "none";
                    }
                };
            }
        }
    }

    function addProject() {
        let saveBtn = document.getElementById("save-btn");
        let assignee = document.getElementById("assignee");
        let asignDate = document.getElementById("start-date");
        let deadline = document.getElementById("due-date");
        let priority = document.getElementById("priority");
        let progress = document.getElementById("progress");
        let status = document.getElementById("status");
        let errorMessage = document.getElementById("error-message");
        let errorAssignee = document.getElementById("error-assignee");
        let errorStatus = document.getElementById("error-status");
        let errorDate = document.getElementById("error-date");
        let errorDeadline = document.getElementById("error-deadline");
        let errorPriority = document.getElementById("error-priority");
        let errorProgress = document.getElementById("error-progress");

        let currentDay = new Date().toISOString().split("T")[0];

        if (addBtn) {
            addBtn.onclick = function () {
                editingIndex = -1;
                if (modal) {
                    modal.style.display = "block";
                }
                document.getElementById("task-name").value = "";
                if (assignee) assignee.value = "";
                if (asignDate) asignDate.value = "";
                if (deadline) deadline.value = "";
                if (priority) priority.value = "";
                if (progress) progress.value = "";
                if (status) status.value = "";
                assigneeName();
                if (saveBtn) {
                    saveBtn.classList.remove("save-edit");
                    saveBtn.classList.add("save-add");
                }
            };
        }

        if (saveBtn) {
            saveBtn.onclick = function () {
                let taskName = document.getElementById("task-name");

                if (taskName.value.trim() === "") {
                    if (errorMessage) {
                        errorMessage.style.display = "block";
                        errorMessage.textContent = "Tên nhiệm vụ không được để trống";
                        errorMessage.style.color = "red";
                    }
                    return;
                } else if (errorMessage) {
                    errorMessage.style.display = "none";
                }

                if (assignee && assignee.value === "") {
                    if (errorAssignee) {
                        errorAssignee.style.display = "block";
                        errorAssignee.textContent = "Tên người phụ trách không được để trống";
                        errorAssignee.style.color = "red";
                    }
                    return;
                } else if (errorAssignee) {
                    errorAssignee.style.display = "none";
                }

                if (asignDate && asignDate.value === "") {
                    if (errorDate) {
                        errorDate.style.display = "block";
                        errorDate.textContent = "Ngày làm nhiệm vụ không được để trống";
                        errorDate.style.color = "red";
                    }
                    return;
                } else if (errorDate) {
                    errorDate.style.display = "none";
                }

                if (asignDate && new Date(currentDay) > new Date(asignDate.value)) {
                    if (errorDate) {
                        errorDate.style.display = "block";
                        errorDate.textContent = "Ngày làm nhiệm vụ phải lớn hơn ngày hiện tại";
                        errorDate.style.color = "red";
                    }
                    return;
                } else if (errorDate) {
                    errorDate.style.display = "none";
                }

                if (deadline && asignDate && new Date(deadline.value) < new Date(asignDate.value)) {
                    if (errorDeadline) {
                        errorDeadline.style.display = "block";
                        errorDeadline.textContent = "Hạn cho nhiệm vụ phải sau ngày bắt đầu";
                        errorDeadline.style.color = "red";
                    }
                    return;
                } else if (errorDeadline) {
                    errorDeadline.style.display = "none";
                }

                if (deadline && deadline.value === "") {
                    if (errorDeadline) {
                        errorDeadline.style.display = "block";
                        errorDeadline.textContent = "Hạn cho nhiệm vụ không được để trống";
                        errorDeadline.style.color = "red";
                    }
                    return;
                } else if (errorDeadline) {
                    errorDeadline.style.display = "none";
                }

                if (priority && priority.value === "") {
                    if (errorPriority) {
                        errorPriority.style.display = "block";
                        errorPriority.textContent = "Không được để trống";
                        errorPriority.style.color = "red";
                    }
                    return;
                } else if (errorPriority) {
                    errorPriority.style.display = "none";
                }

                if (progress && progress.value === "") {
                    if (errorProgress) {
                        errorProgress.style.display = "block";
                        errorProgress.textContent = "Không được để trống";
                        errorProgress.style.color = "red";
                    }
                    return;
                } else if (errorProgress) {
                    errorProgress.style.display = "none";
                }

                const validStatuses = ["toDo", "inProgress", "pending", "done"];
                if (status && status.value === "") {
                    if (errorStatus) {
                        errorStatus.style.display = "block";
                        errorStatus.textContent = "Không được để trống";
                        errorStatus.style.color = "red";
                    }
                    return;
                } else if (status && !validStatuses.includes(status.value)) {
                    if (errorStatus) {
                        errorStatus.style.display = "block";
                        errorStatus.textContent = "Trạng thái không hợp lệ";
                        errorStatus.style.color = "red";
                    }
                    return;
                } else if (errorStatus) {
                    errorStatus.style.display = "none";
                }

                if (saveBtn.classList.contains("save-add")) {
                    let isDuplicate = tasks.some(task => task.taskName === taskName.value.trim() && task.projectId === currentIdProject);
                    if (isDuplicate) {
                        if (errorMessage) {
                            errorMessage.style.display = "block";
                            errorMessage.textContent = "Nhiệm vụ đã tồn tại";
                            errorMessage.style.color = "red";
                        }
                        return;
                    } else {
                        tasks.push({
                            id: Date.now(),
                            taskName: taskName.value.trim(),
                            assignee: assignee.value.trim(),
                            projectId: currentIdProject,
                            asignDate: asignDate.value,
                            deadline: deadline.value,
                            priority: priority.value,
                            progress: progress.value,
                            status: status.value
                        });
                        localStorage.setItem("tasks", JSON.stringify(tasks));
                        if (modal) {
                            modal.style.display = "none";
                        }
                        displayProject();
                    }
                } else if (saveBtn.classList.contains("save-edit")) {
                    let isDuplicate = tasks.some(task => task.taskName === taskName.value.trim() && task.projectId === currentIdProject);
                    if (isDuplicate) {
                        if (errorMessage) {
                            errorMessage.style.display = "block";
                            errorMessage.textContent = "Nhiệm vụ đã tồn tại";
                            errorMessage.style.color = "red";
                        }
                        return;
                    }
                    tasks[editingIndex].taskName = taskName.value.trim();
                    tasks[editingIndex].assignee = assignee.value.trim();
                    tasks[editingIndex].asignDate = asignDate.value;
                    tasks[editingIndex].deadline = deadline.value;
                    tasks[editingIndex].priority = priority.value;
                    tasks[editingIndex].progress = progress.value;
                    tasks[editingIndex].status = status.value;
                    localStorage.setItem("tasks", JSON.stringify(tasks));
                    if (modal) {
                        modal.style.display = "none";
                    }
                    displayProject();
                    editingIndex = -1;
                }
            };
        }
    }

    function findProjectByName() {
        if (findProjectName) {
            findProjectName.addEventListener("keypress", function (event) {
                if (event.key === "Enter") {
                    searchValue = findProjectName.value.trim();
                    displayProject();
                }
            });
        }
    }

    let find = document.getElementById("select");
    function sort() {
        if (find) {
            find.addEventListener("change", function () {
                if (find.value.trim() === "Ưu tiên") {
                    let priorityLevel = {
                        "Thấp": 1,
                        "Trung bình": 2,
                        "Cao": 3
                    };
                    tasks.sort((a, b) => {
                        return priorityLevel[b.priority] - priorityLevel[a.priority];
                    });
                } else {
                    let progressLevel = {
                        "Đúng tiến độ": 1,
                        "Có rủi ro": 2,
                        "Trễ hạn": 3
                    };
                    tasks.sort((a, b) => {
                        return progressLevel[b.progress] - progressLevel[a.progress];
                    });
                }
                displayProject();
            });
        }
    }

    function assigneeName() {
        let assigneeValue = document.getElementById("assignee");
        if (!assigneeValue) {
            return;
        }
        assigneeValue.innerHTML = '<option value="">Chọn người phụ trách</option>';

        let project = projects.find(p => p.id === currentIdProject);
        if (!project || !project.members) {
            return;
        }

        let memberUserIds = project.members.map(member => member.userId);
        let projectMembers = users.filter(user => memberUserIds.includes(user.id));

        projectMembers.forEach(user => {
            assigneeValue.innerHTML += `
                <option value="${user.fullName}">${user.fullName}</option>
            `;
        });
    }

    function getInitials(name) {
        if (!name) return "";
        const parts = name.trim().split(" ");
        if (parts.length === 1) return parts[0][0].toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    function renderMember() {
        let memberList = document.getElementById("memberList");
        if (!memberList) {
            return;
        }
        memberList.innerHTML = "";
        
        let project = projects.find(p => p.id === currentIdProject);
        if (!project || !project.members) {
            return;
        }

        project.members.forEach((member, index) => {
            let user = users.find(u => u.id === member.userId);
            if (user) {
                let li = document.createElement("li");
                let initials = getInitials(user.fullName);
                
                li.innerHTML = `
                    <div class="member-item">
                        <button class="avt avt-color-${index % 3}">${initials}</button>
                        <div class="infor-avt">
                            <p class="name">${user.fullName}</p>
                            <p class="position">${member.role}</p>
                        </div>
                    </div>
                `;
                memberList.appendChild(li);
            }
        });
    }

    function addMember() {
        let emailInput = document.getElementById("email");
        let userPosition = document.getElementById("userPosition");
        let saveMember = document.querySelector("#modal-content-1 .save");
        let errorCheck = document.querySelector(".error-check");

        if (addMemberBtn) {
            addMemberBtn.addEventListener("click", function () {
                let memberModal = document.getElementById("memberModal");
                if (memberModal) {
                    memberModal.style.display = "block";
                    if (emailInput) emailInput.value = "";
                    if (userPosition) userPosition.value = "";
                    if (errorCheck) {
                        errorCheck.innerHTML = "";
                        errorCheck.style.display = "none";
                    }
                }
            });
        }

        if (saveMember) {
            saveMember.onclick = function () {
                if (errorCheck) {
                    errorCheck.innerHTML = "";
                    errorCheck.style.display = "none";
                }

                if (emailInput && emailInput.value.trim() === "") {
                        errorCheck.innerHTML = "Email không được để trống";
                        errorCheck.style.display = "block";
                    return;
                }

                // const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailInput &&emailInput.value.trim().endsWith("@gmail.comcom")) {  
                        errorCheck.innerHTML = "Email không hợp lệ";
                        errorCheck.style.display = "block";
                    
                    return;
                }

                let user = users.find(u => u.email === emailInput.value.trim());
                if (!user) {
                        errorCheck.innerHTML = "Email không tồn tại trong hệ thống";
                        errorCheck.style.display = "block";
                    return;
                }

                let projectIndex = projects.findIndex(p => p.id === currentIdProject);
                if (projectIndex === -1) {
                        errorCheck.innerHTML = "Dự án không tồn tại";
                        errorCheck.style.display = "block";
                    return;
                }

                if (!projects[projectIndex].members) {
                    projects[projectIndex].members = [];
                }

                let isDuplicate = projects[projectIndex].members.some(m => m.userId === user.id);
                if (isDuplicate) {
                        errorCheck.innerHTML = "Thành viên đã tồn tại trong dự án";
                        errorCheck.style.display = "block";
                    return;
                }

                projects[projectIndex].members.push({
                    userId: user.id,
                    role: userPosition.value.trim() || "Thành viên"
                });

                localStorage.setItem("projects", JSON.stringify(projects));
 emailInput.value = "";
  userPosition.value = "";
                let memberModal = document.getElementById("memberModal");
                    memberModal.style.display = "none";
                renderMember();
                assigneeName();
            };
        }
    }

    function showAllMembers() {
        let allMembersList = document.getElementById("allMembersList");
        if (!allMembersList) {
            return;
        }
        allMembersList.innerHTML = "";
        
        let project = projects.find(p => p.id === currentIdProject);
        if (!project) {
            return;
        }
        if (!project.members || project.members.length === 0) {
            allMembersList.innerHTML = "<li>Chưa có thành viên nào.</li>";
            return;
        }

        project.members.forEach((member, index) => {
            let user = users.find(u => u.id === member.userId);
            if (user) {
                let li = document.createElement("li");
                let initials = getInitials(user.fullName);
                
                li.innerHTML = `
                    <div class="member-row">
                        <div class="member-info">
                            <button class="avt avt-color-${index % 3}">${initials}</button>
                            <div class="member-details">
                                <p class="name">${user.fullName}</p>
                                <p class="email">${user.email}</p>
                            </div>
                        </div>
                        <p class="role">${member.role}</p>
                        <div class="actions">
                            <button class="edit-member" data-index="${index}">Sửa</button>
                            <button class="delete-member" data-index="${index}">Xóa</button>
                        </div>
                    </div>
                `;
                allMembersList.appendChild(li);
            }
        });

        let modal = document.getElementById("allMembersModal");
        if (!modal) {
            return;
        }
        modal.style.display = "block";
        attachMemberActions();
    }

    function attachMemberActions() {
        document.querySelectorAll(".edit-member").forEach(btn => {
            btn.onclick = function () {
                let index = parseInt(btn.getAttribute("data-index"));
                let project = projects.find(p => p.id === currentIdProject);
                let member = project.members[index];
                let user = users.find(u => u.id === member.userId);

                let addMemberModal = document.getElementById("memberModal");
                if (!addMemberModal) {
                    return;
                }
                addMemberModal.style.display = "block";
                document.getElementById("email").value = user.email;
                let userPositionInput = document.getElementById("userPosition");
                userPositionInput.value = member.role;

                if (member.role === "Project owner") {
                    userPositionInput.disabled = true;
                    let errorCheck = document.querySelector(".error-check");
                    if (errorCheck) {
                        errorCheck.innerHTML = "Không thể thay đổi vai trò của Project owner";
                        errorCheck.style.display = "block";
                    }
                } else {
                    userPositionInput.disabled = false;
                    let errorCheck = document.querySelector(".error-check");
                    if (errorCheck) {
                        errorCheck.innerHTML = "";
                        errorCheck.style.display = "none";
                    }
                }

                let saveMemberBtn = document.querySelector("#modal-content-1 .save");
                let errorCheck = document.querySelector(".error-check");
                let emailInput = document.getElementById("email");

                if (saveMemberBtn) {
                    saveMemberBtn.onclick = function () {
                        if (errorCheck) {
                            errorCheck.innerHTML = "";
                            errorCheck.style.display = "none";
                        }

                        if (emailInput && emailInput.value.trim() === "") {
                            if (errorCheck) {
                                errorCheck.innerHTML = "Email không được để trống";
                                errorCheck.style.display = "block";
                            }
                            return;
                        }
                        if (!emailInput.value.endsWith("@gmail.com")) {
                            if (errorCheck) {
                                errorCheck.innerHTML = "Email không hợp lệ";
                                errorCheck.style.display = "block";
                            }
                            return;
                        }
                        let newRole = userPositionInput.value.trim();
                        if (!newRole) {
                            if (errorCheck) {
                                errorCheck.innerHTML = "Vai trò không được để trống";
                                errorCheck.style.display = "block";
                            }
                            return;
                        }

                        if (member.role !== "Project owner") {
                            project.members[index].role = newRole;
                            localStorage.setItem("projects", JSON.stringify(projects));
                        }
                        addMemberModal.style.display = "none";
                        showAllMembers();
                        renderMember();
                        assigneeName();
                    };
                }
            };
        });

        document.querySelectorAll(".delete-member").forEach(btn => {
            btn.onclick = function () {
                let index = parseInt(btn.getAttribute("data-index"));
                let project = projects.find(p => p.id === currentIdProject);
                if (project.members[index].role === "Project owner") {
                    alert("Không thể xóa Project owner!");
                    return;
                }
                project.members.splice(index, 1);
                localStorage.setItem("projects", JSON.stringify(projects));
                showAllMembers();
                renderMember();
                assigneeName();
            };
        });
    }

    let showAllMembersBtn = document.getElementById("showAllMembers");
    if (showAllMembersBtn) {
        showAllMembersBtn.onclick = function () {
            showAllMembers();
        };
    }

    let closeAllMembersBtn = document.getElementById("closeAllMembers");
    if (closeAllMembersBtn) {
        closeAllMembersBtn.onclick = function () {
            let allMembersModal = document.getElementById("allMembersModal");
            if (allMembersModal) {
                allMembersModal.style.display = "none";
            }
        };
    }

    let saveAllMembersBtn = document.getElementById("saveAllMembers");
    if (saveAllMembersBtn) {
        saveAllMembersBtn.onclick = function () {
            let allMembersModal = document.getElementById("allMembersModal");
            if (allMembersModal) {
                allMembersModal.style.display = "none";
            }
        };
    }

    displayProject();
    addProject();
    findProjectByName();
    sort();
    addMember();
    renderMember();
    assigneeName();
});
