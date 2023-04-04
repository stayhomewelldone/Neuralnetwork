let nn;
let inputs;
let output;
let inputHouse;
let testData;

let save = document.getElementById("btn");

save.addEventListener("click", () => {
  nn.save(modelSaved());
});

function loadData() {
  Papa.parse("./data/utrecht-houseprices.csv", {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: (results) => checkData(results.data),
  });
}

// async function checkData(data) {
  console.log("Data loaded!");
  // data voorbereiden
  // await data.filter(
  //   (item) =>
  //     (item.Zipcode = !null && item.Buildyear != null && item.bathrooms != null)
  // );
  //   data.filter(
  //     (item) =>
  //       !isNaN(item.Zipcode) && !isNaN(item.Buildyear) && !isNaN(item.bathrooms)
  //   );
  // console.table(data);

  data.sort(() => Math.random() - 0.5);
  let trainData = data.slice(0, Math.floor(data.length * 0.8));
  testData = data.slice(Math.floor(data.length * 0.8) + 1);

  const options = {
    task: "regression",
    debug: true,
  };

  // neural network aanmaken
  nn = ml5.neuralNetwork(options);

  // data toevoegen aan neural network
  data.forEach((item) => {
    inputs = {
      zipcode: item.Zipcode,
      buildyear: item.Buildyear,
      bathrooms: item.bathrooms,
    };
    output = {
      retailvalue: item.retailvalue,
    };
    nn.addData(inputs, output);
  });

  nn.normalizeData();
  trainModel();
}

function trainModel() {
  const trainingOptions = {
    epochs: 30,
  };
  nn.train(trainingOptions, finishedTraining);
}
function finishedTraining() {
  console.log("Finished training!");
  makePrediction();
}

async function makePrediction() {
  inputHouse = {
    zipcode: testData[0].Zipcode,
    buildyear: testData[0].Buildyear,
    bathrooms: testData[0].bathrooms,
  };
  const pred = await nn.predict(inputHouse);
  console.log(parseInt(pred[0].retailvalue));
}
function modelSaved() {
  console.log("Model saved!");
}

loadData();
