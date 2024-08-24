<script>
  const formTicket = document.getElementById("wfmticketing");
  const attachment = document.getElementById("form_attachment");
  const btnSubmit = document.getElementById("form_submit")
  const alertBox = document.getElementById("toast-box");
		// formTicket.addEventListener("submit", submitdata);
		// console.log(formTicket);

  function submitdata(e) {
      
			const formVar = {};
			e.preventDefault();
			formVar["subject"] = formTicket.form_subject.value;
			formVar["description"] = formTicket.form_subject.value;
			const file = attachment.files;
			console.log(file);
			const fileR = new FileReader();
			fileR.onload = function (e) {
				const vals = fileR.result.split(",");

				(formVar["fileName"] = file[0].name),
					(formVar["mimeType"] = file[0].type),
					(formVar["data"] = vals[1]);
				console.log(formVar);
        btnSubmit.disabled = true;
				google.script.run.withSuccessHandler(toastSuccess).withFailureHandler(toastError).uploadFile(formVar);
			};
			if (file.length != 0) {
				fileR.readAsDataURL(file[0]);
			} else {
        btnSubmit.disabled = true;
				google.script.run.withSuccessHandler(toastSuccess).withFailureHandler(toastError).addToSheets(formVar);
			}
		}
  function toastError(){
    // formTicket.reset()
    // btnSubmit.disabled = false;
			let toast = document.createElement("div");
			toast.classList.add("toast");
      toast.classList.add("error");
			toast.innerHTML = `<span class="material-symbols-outlined">error</span><p>Try Again Later</p>`;
			alertBox.appendChild(toast);		
			setTimeout(() =>{toast.remove()}, 10000);
  }
  function toastSuccess(){
    formTicket.reset()
    btnSubmit.disabled = false;
			let toast = document.createElement("div");
			toast.classList.add("toast");
      toast.classList.add("success");
			toast.innerHTML = `<span class="material-symbols-outlined">check_circle</span><p>Ticket Submitted</p>`;
			alertBox.appendChild(toast);		
			setTimeout(() =>{toast.remove()}, 10000);
  }
</script>