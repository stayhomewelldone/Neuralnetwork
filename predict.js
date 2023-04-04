let options;
let nn;
let input;
let result = document.getElementById("result");
let predictButton = document.getElementById("btn");
let euroValue;

predictButton.addEventListener("click", (event) => {
  // event.preventDefault();
  const isValid = event.target.checkValidity();
  console.log(isValid);
  const zipcodeValue = parseInt(document.getElementById("zipcode").value);
  const buildyearValue = parseInt(document.getElementById("buildyear").value);
  const bathroomsValue = parseInt(document.getElementById("bathrooms").value);

  makePrediction(zipcodeValue, buildyearValue, bathroomsValue);
});

options = {
  task: "regression",
  debug: true,
};
nn = ml5.neuralNetwork(options);
nn.load("./model/model.json", modelLoaded);

function modelLoaded() {
  console.log("Model loaded!");
}

async function makePrediction(zipcode, buildyear, bathrooms) {
  result.innerHTML = "";

  input = {
    zipcode: zipcode,
    buildyear: buildyear,
    bathrooms: bathrooms,
  };

  const pred = await nn.predict(input);
  const fmt = new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  });
  euroValue = fmt.format(pred[0].retailvalue);
  //   //   console.log(fmt.format(pred));
  //   console.log(pred);
  console.log(euroValue);
  result.innerHTML += euroValue;
}
