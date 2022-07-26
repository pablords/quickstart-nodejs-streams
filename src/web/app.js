const API_URL = "http://localhost:3001"
const ON_UPLOAD_EVENT = "file-uploaded"
let bytesAmount = 0;




window.onload = function () {
    var toastElList = [].slice.call(document.querySelectorAll('.toast'))
    var toastList = toastElList.map(function (toastEl) {
        return new bootstrap.Toast(toastEl)
    })

    const ioClient = io.connect(API_URL, { withCredentials: false });
    ioClient.on("connect", (msg) => {
        console.log("connected!", ioClient.id)
        const targetUrl = API_URL + `/upload?socketId=${ioClient.id}`
        configureForm(targetUrl)
        console.log(targetUrl)
    });

    ioClient.on(ON_UPLOAD_EVENT, (bytesReceived) => {
        bytesAmount = bytesAmount - bytesReceived;
        if (bytesAmount == 0) {
            toastList[0].show()
        }
        updateSizeBytes(bytesAmount)
        //updateProgress(bytesReceived)
        // setTimeout(() => {
        //     updateProgress(bytesReceived)
        // }, bytesReceived * 500)
    });
    updateSizeBytes(0)

};

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return (
        parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
    );
}

const updateSizeBytes = (size) => {
    const text = `Pending Bytes to upload: <strong>${formatBytes(size)}</strong>`;
    document.getElementById("size").innerHTML = text;
}

const updateProgress = (bytesReceived) => {
    const calc = bytesReceived / bytesAmount * 100
    console.log({ bytes: bytesReceived, amount: bytesAmount })
    const div = document.querySelector(".progress-bar")
    div.style.width = `${calc}%`
    div.innerHTML = `${calc}%`
}

const configureForm = (targetUrl) => {
    const form = document.getElementById('form-file')
    form.addEventListener("submit", (e) => {
        e.preventDefault()
        const formData = new FormData(form);
        const file = formData.get("filefield")
        const alert = document.querySelector(".alert-danger")
        alert.style.display = "none"


        axios
            .post(targetUrl, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    })
}


const handleFileSize = () => {
    const button = document.querySelector("button")
    button.classList.remove("disabled")
    const alert = document.querySelector(".alert-danger")
    alert.style.display = "none"
    const { files: fileElements } = document.getElementById("file");
    if (!fileElements.length) return;
    const files = Array.from(fileElements)
    const { size } = files.reduce((prev, next) => ({ size: prev.size + next.size }), { size: 0 });



    const filesValidated = files.filter(file => file.type !== "text/csv")
    if (filesValidated.length > 0) {
        button.classList.add("disabled")
        alert.innerHTML = "Por favor insira um arquivo CSV"
        alert.style.display = "block"
        return
    }

    bytesAmount = size
    updateSizeBytes(size)
}
