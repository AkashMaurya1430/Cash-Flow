async function getUserData() {
  let userData;
  await axios
    .get("/transactions")
    .then((response) => {
      userData = response.data;
    })
    .catch((e) => {
      console.log(e);
    });

  return userData;
}

window.onload = () => {
  setupGraph();
};

function setupGraph() {
  let labels = [];
  let cashInData = [0];
  let cashOutData = [0];
  let balanceData = [];
  let balance = 0;
  getUserData().then((userData) => {
    console.log(userData);
    balance = userData.initialValue;
    balanceData.push(balance);

    // Add SignUp Date
    let today = new Date(userData.createdAt);
    today = today.getFullYear() + "-01-" + today.getDate();
    labels.push(today);
    userData.transactions.forEach((transaction) => {
      labels.push(transaction.date.slice(0, 10));
      if (transaction.flow === "in") {
        cashInData.push(transaction.amount);
        balance += transaction.amount;


        cashOutData.push(0);
      } else {
        balance -= transaction.amount;
        cashOutData.push(transaction.amount);


        cashInData.push(0);
      }
      balanceData.push(balance);
    });
    

    //////////////////// Setup ////////////
    const data = {
      labels: labels,
      datasets: [
        {
          label: "Cash In",
          data: cashInData,
          borderColor: "#62a800",
          backgroundColor: "#62a800",
          // stack: "combined",
          type: "bar",
          order: 1,
        },
        {
          label: "Cash Out",
          data: cashOutData,
          borderColor: "#ff8c00",
          backgroundColor: "#ff8c00",
          // stack: "combined",
          type: "bar",
          order: 1,
        },
        {
          label: "Balance",
          data: balanceData,
          borderColor: "#00b7ff",
          backgroundColor: "#00b7ff",
          stack: "combined",
          order: 0,
        },
      ],
    };
    const config = {
      type: "line",
      data: data,
      options: {
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Transactions",
          },
        },
        scales: {
          y: {
            stacked: false,
          },
        },
      },
    };

    const myChart = new Chart(document.getElementById("myChart"), config);
  });

  // let userData = <%= userData %>

  // const data = {
  //   labels: labels,
  //   datasets: [
  //     {
  //       label: "Balance",
  //       backgroundColor: "rgb(255, 99, 132)",
  //       borderColor: "rgb(255, 99, 132)",
  //       data: [0, 10, 5, 2, 20, 30, 45],
  //     },
  //     {
  //       label: "Cash In",
  //       backgroundColor: "rgb(255, 99, 132)",
  //       borderColor: "rgb(255, 99, 132)",
  //       data: [0, 10, 5, 2, 20, 30, 45],
  //     },
  //     {
  //       label: "Cash Out",
  //       backgroundColor: "rgb(255, 99, 132)",
  //       borderColor: "rgb(255, 99, 132)",
  //       data: [0, 10, 5, 2, 20, 30, 45],
  //     },
  //   ],
  // };
}

function deleteTransaction(id) {
  // alert(id)
  axios.post("/delete-transaction", { id }).then((result) => {
    window.location.reload();
  });
}

function handleDateChange(){
  document.getElementById("filter").submit();
}


// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();
