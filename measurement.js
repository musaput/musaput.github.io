document.addEventListener('DOMContentLoaded', function() {
    // Ambil data dari localStorage
    const tanggal = localStorage.getItem('tanggal');
    const user = localStorage.getItem('user');
    const merek = localStorage.getItem('merek');
    const type = localStorage.getItem('type');
    const serial = localStorage.getItem('serial');

    // Menampilkan data administrasi di halaman pengukuran
    const adminData = document.getElementById('adminData');
    adminData.innerHTML = `
        <p><strong>Date:</strong> ${tanggal}</p>
        <p><strong>User:</strong> ${user}</p>
        <p><strong>Merk:</strong> ${merek}</p>
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Serial Number:</strong> ${serial}</p>
    `;

    // Variabel untuk menyimpan ID interval
    let measurementIntervalId = null;
    let elapsedTime = 0; // Untuk melacak waktu pengukuran

    // Referensi elemen interval
    const intervalSelect = document.getElementById('intervalSelect');
    const applyIntervalButton = document.getElementById('applyIntervalButton');
    const startStopButton = document.getElementById('startStopButton');
    const resetButton = document.getElementById('resetButton');

    // Fungsi untuk memulai interval pengukuran
    function startMeasurement(intervalSeconds) {
        if (measurementIntervalId !== null) {
            clearInterval(measurementIntervalId);
        }
    
        elapsedTime = 0; // Reset waktu
        
        // Set interval untuk pengambilan data
        measurementIntervalId = setInterval(function () {
        const measurementData = getMeasurementData(); // Ambil data

        // Cek apakah semua nilai valid (tidak null/0/NaN)
        const allValid = Object.values(measurementData).every(value => value !== null && value !== 0 && !isNaN(value));

        if (allValid) {
            elapsedTime += intervalSeconds;
            addMeasurementRow(elapsedTime, measurementData);
            saveDataToLocalStorage();
        } else {
            console.warn("Data tidak valid, menunggu nilai berikutnya...");
        }
    }, intervalSeconds * 1000);
}

    // Fungsi untuk menghentikan interval pengukuran
    function stopMeasurement() {
        if (measurementIntervalId !== null) {
            clearInterval(measurementIntervalId);
            measurementIntervalId = null;
        }
    }

    // Fungsi untuk mengambil data pengukuran acak
    function getMeasurementData() {
        return {
            T1: sensorData.T1 !== null ? sensorData.T1 : 0,
            T2: sensorData.T2 !== null ? sensorData.T2 : 0,
            T3: sensorData.T3 !== null ? sensorData.T3 : 0,
            T4: sensorData.T4 !== null ? sensorData.T4 : 0,
            T5: sensorData.T5 !== null ? sensorData.T5 : 0,
            humidity: sensorData.humidity !== null ? sensorData.humidity : 0,
            noise: sensorData.noise !== null ? sensorData.noise : 0,
            airflow: sensorData.airflow !== null ? sensorData.airflow : 0,
            mattress: sensorData.mattress !== null ? sensorData.mattress : 0
        };
    }    

    // Fungsi untuk menambahkan baris baru pada tabel pengukuran
    function addMeasurementRow(timeInSeconds, measurementData) {
        const table = document.getElementById('measurementTable').querySelector('tbody');
        const newRow = document.createElement('tr');
    
        newRow.innerHTML = `
            <td>${timeInSeconds}</td>
            <td>${measurementData.T1}</td>
            <td>${measurementData.T2}</td>
            <td>${measurementData.T3}</td>
            <td>${measurementData.T4}</td>
            <td>${measurementData.T5}</td>
            <td>${measurementData.humidity}</td>
            <td>${measurementData.noise}</td>
            <td>${measurementData.airflow}</td>
            <td>${measurementData.mattress}</td>
        `;
    
        table.appendChild(newRow);
    }    

    // Fungsi untuk menyimpan data tabel ke localStorage
    function saveDataToLocalStorage() {
        const tableData = [];
        const rows = document.querySelectorAll('#measurementTable tbody tr');

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            tableData.push({
                time: cells[0].innerText,
                T1: cells[1].innerText,
                T2: cells[2].innerText,
                T3: cells[3].innerText,
                T4: cells[4].innerText,
                T5: cells[5].innerText,
                humidity: cells[6].innerText,
                noise: cells[7].innerText,
                airflow: cells[8].innerText,
                mattress: cells[9].innerText
            });
        });

        // Menyimpan data tabel ke localStorage
        localStorage.setItem('measurementData', JSON.stringify(tableData));
    }

    applyIntervalButton.addEventListener('click', function() {
        const intervalValue = parseInt(intervalSelect.value);
        if (isNaN(intervalValue)) {
            alert('Choose the valid interval.');
            return;
        }
        
        // Send the interval value to ESP32 via MQTT
        if (typeof sendIntervalToESP32 === 'function') {
            sendIntervalToESP32(intervalValue);
        }
        
        // If measurement is running, restart with new interval
        if (measurementIntervalId !== null) {
            startMeasurement(intervalValue);
        }
        alert(`Set Interval ${intervalValue} Second.`);
    });

    startStopButton.addEventListener('click', function() {
        const intervalValue = parseInt(intervalSelect.value);
        if (measurementIntervalId === null) {
            if (isNaN(intervalValue)) {
                alert('Choose the valid interval.');
                return;
            }
            
            // Send "start" command to ESP32
            if (typeof sendStartStopCommand === 'function') {
                sendStartStopCommand("start");
            }
            
            startMeasurement(intervalValue);
            startStopButton.textContent = 'Stop';
            startStopButton.classList.add('active');
        } else {
            // Send "stop" command to ESP32
            if (typeof sendStartStopCommand === 'function') {
                sendStartStopCommand("stop");
            }
            
            stopMeasurement();
            startStopButton.textContent = 'Start';
            startStopButton.classList.remove('active');
        }
    });

    // Event listener untuk tombol Reset
    resetButton.addEventListener('click', function() {
        const tableBody = document.querySelector('#measurementTable tbody');
        tableBody.innerHTML = ''; 
        stopMeasurement(); 
        elapsedTime = 0; 
        startStopButton.textContent = 'Start';
        startStopButton.classList.remove('active');
    });

    // Fungsi utilitas untuk mendapatkan angka acak
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Ambil tombol Back
    const backButton = document.getElementById('backButton');

    // Event listener untuk tombol Back
    backButton.addEventListener('click', function() {
        // Mengarahkan pengguna kembali ke halaman dashboard.html
        window.location.href = 'dashboard.html';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const graphButton = document.getElementById('graphButton');
    const cancelModalButton = document.getElementById('cancelModalButton');

    // Membuka modal ketika tombol "Graph" diklik
    graphButton.addEventListener('click', function() {
        graphModal.style.display = 'flex';
    });

    // Menutup modal ketika tombol "Cancel" diklik
    cancelModalButton.addEventListener('click', function() {
        graphModal.style.display = 'none';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Ambil tombol ALL
    const allButton = document.getElementById('all');

    // Event listener untuk tombol ALL
// Update untuk memastikan data sudah ada di localStorage sebelum membuka halaman baru
allButton.addEventListener('click', function() {
    const measurementData = JSON.parse(localStorage.getItem('measurementData'));

    if (measurementData && measurementData.length > 0) {
        // Menunggu data tersedia sebelum membuka halaman
        setTimeout(function() {
            const url = 'allgraph.html';
            const newWindow = window.open(url, '_blank');
            
            newWindow.onload = function() {
                // Mengirim data ke halaman baru menggunakan localStorage
                newWindow.localStorage.setItem('measurementData', JSON.stringify(measurementData));
            };
        }, 100); // Delay 100ms untuk memastikan data sudah tersedia
    } else {
        alert('Data pengukuran belum tersedia.');
    }
});
});

document.addEventListener('DOMContentLoaded', function() {
    // Ambil tombol T1-T5
    const t1_t5Button = document.getElementById('t1_t5');

    // Event listener untuk tombol t1_t5
// Update untuk memastikan data sudah ada di localStorage sebelum membuka halaman baru
t1_t5Button.addEventListener('click', function() {
    const measurementData = JSON.parse(localStorage.getItem('measurementData'));

    if (measurementData && measurementData.length > 0) {
        // Menunggu data tersedia sebelum membuka halaman
        setTimeout(function() {
            const url = 't1-t5graph.html';
            const newWindow = window.open(url, '_blank');
            
            newWindow.onload = function() {
                // Mengirim data ke halaman baru menggunakan localStorage
                newWindow.localStorage.setItem('measurementData', JSON.stringify(measurementData));
            };
        }, 100); // Delay 100ms untuk memastikan data sudah tersedia
    } else {
        alert('Data pengukuran belum tersedia.');
    }
});
});

document.addEventListener('DOMContentLoaded', function() {
    // Ambil tombol humidity
    const humidityButton = document.getElementById('humidity');

    // Event listener untuk tombol humidity
// Update untuk memastikan data sudah ada di localStorage sebelum membuka halaman baru
humidityButton.addEventListener('click', function() {
    const measurementData = JSON.parse(localStorage.getItem('measurementData'));

    if (measurementData && measurementData.length > 0) {
        // Menunggu data tersedia sebelum membuka halaman
        setTimeout(function() {
            const url = 'humiditygraph.html';
            const newWindow = window.open(url, '_blank');
            
            newWindow.onload = function() {
                // Mengirim data ke halaman baru menggunakan localStorage
                newWindow.localStorage.setItem('measurementData', JSON.stringify(measurementData));
            };
        }, 100); // Delay 100ms untuk memastikan data sudah tersedia
    } else {
        alert('Data pengukuran belum tersedia.');
    }
});
});

document.addEventListener('DOMContentLoaded', function() {
    // Ambil tombol noise
    const noiseButton = document.getElementById('noise');

    // Event listener untuk tombol noise
// Update untuk memastikan data sudah ada di localStorage sebelum membuka halaman baru
noiseButton.addEventListener('click', function() {
    const measurementData = JSON.parse(localStorage.getItem('measurementData'));

    if (measurementData && measurementData.length > 0) {
        // Menunggu data tersedia sebelum membuka halaman
        setTimeout(function() {
            const url = 'noisegraph.html';
            const newWindow = window.open(url, '_blank');
            
            newWindow.onload = function() {
                // Mengirim data ke halaman baru menggunakan localStorage
                newWindow.localStorage.setItem('measurementData', JSON.stringify(measurementData));
            };
        }, 100); // Delay 100ms untuk memastikan data sudah tersedia
    } else {
        alert('Data pengukuran belum tersedia.');
    }
});
});

document.addEventListener('DOMContentLoaded', function() {
    // Ambil tombol airflow
    const airflowButton = document.getElementById('airflow');

    // Event listener untuk tombol airflow
// Update untuk memastikan data sudah ada di localStorage sebelum membuka halaman baru
airflowButton.addEventListener('click', function() {
    const measurementData = JSON.parse(localStorage.getItem('measurementData'));

    if (measurementData && measurementData.length > 0) {
        // Menunggu data tersedia sebelum membuka halaman
        setTimeout(function() {
            const url = 'airflowgraph.html';
            const newWindow = window.open(url, '_blank');
            
            newWindow.onload = function() {
                // Mengirim data ke halaman baru menggunakan localStorage
                newWindow.localStorage.setItem('measurementData', JSON.stringify(measurementData));
            };
        }, 100); // Delay 100ms untuk memastikan data sudah tersedia
    } else {
        alert('Data pengukuran belum tersedia.');
    }
});
});

document.addEventListener('DOMContentLoaded', function() {
    // Ambil tombol mattress
    const mattressButton = document.getElementById('mattress');

    // Event listener untuk tombol mattress
// Update untuk memastikan data sudah ada di localStorage sebelum membuka halaman baru
mattressButton.addEventListener('click', function() {
    const measurementData = JSON.parse(localStorage.getItem('measurementData'));

    if (measurementData && measurementData.length > 0) {
        // Menunggu data tersedia sebelum membuka halaman
        setTimeout(function() {
            const url = 'mattressgraph.html';
            const newWindow = window.open(url, '_blank');
            
            newWindow.onload = function() {
                // Mengirim data ke halaman baru menggunakan localStorage
                newWindow.localStorage.setItem('measurementData', JSON.stringify(measurementData));
            };
        }, 100); // Delay 100ms untuk memastikan data sudah tersedia
    } else {
        alert('Data pengukuran belum tersedia.');
    }
});
});

document.addEventListener('DOMContentLoaded', function() {
    const saveButton = document.getElementById('saveButton');

    saveButton.addEventListener('click', function() {
        const adminData = {
            Date: localStorage.getItem('tanggal'),
            User: localStorage.getItem('user'),
            Merk: localStorage.getItem('merek'),
            Type: localStorage.getItem('type'),
            SerialNumber: localStorage.getItem('serial')
        };

        const tableData = JSON.parse(localStorage.getItem('measurementData'));

        if (!tableData || tableData.length === 0) {
            alert('Data pengukuran belum tersedia.');
            return;
        }

        // Buat array untuk worksheet
        const worksheetData = [];

        // Tambahkan data administrasi di awal file
        worksheetData.push(['Date', adminData.Date]);
        worksheetData.push(['User', adminData.User]);
        worksheetData.push(['Merk', adminData.Merk]);
        worksheetData.push(['Type', adminData.Type]);
        worksheetData.push(['Serial Number', adminData.SerialNumber]);

        // Tambahkan baris kosong sebagai pemisah
        worksheetData.push([]);

        // Tambahkan header untuk data pengukuran
        worksheetData.push(['Time', 'T1', 'T2', 'T3', 'T4', 'T5', 'Humidity', 'Noise', 'Airflow', 'Mattress']);

        // Tambahkan data pengukuran
        tableData.forEach(row => {
            worksheetData.push([
                row.time,
                row.T1,
                row.T2,
                row.T3,
                row.T4,
                row.T5,
                row.humidity,
                row.noise,
                row.airflow,
                row.mattress
            ]);
        });

        // Konversi data menjadi worksheet
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        // Membuat workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'MeasurementData');

        // Dapatkan tanggal saat ini untuk nama file
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD

        // Simpan workbook sebagai file Excel
        XLSX.writeFile(workbook, `${formattedDate}.xlsx`);
    });
});
