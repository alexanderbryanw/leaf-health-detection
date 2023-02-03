let imgElement = document.getElementById("imageSrc")
let inputElement = document.getElementById("fileInput");
inputElement.addEventListener("change", (e) => {
  imgElement.src = URL.createObjectURL(e.target.files[0]);
}, false);

// defines a TF model load function
async function loadModel() {

  // loads the model
  model = await tf.loadLayersModel('../aleng-ml/model.json');

  // warm start the model. speeds up the first inference
  // model.predict(tf.zeros([1, 28, 28, 1]))
  let offset = tf.scalar(255);
  let tensorImg = tf.browser.fromPixels(imgElement).resizeNearestNeighbor([300, 200]).toFloat().expandDims();
  let tensorImg_scaled = tensorImg.div(offset);
  y = model.predict(tensorImg_scaled);
  yVal = y.arraySync();

  if (yVal < 0.7) {
    // replaces the text in the result tag by the model prediction for diseased
    document.getElementById('result1').innerHTML = "Tanaman Anda tidak sehat";
    document.getElementById('result2').innerHTML = "Segera lakukan perawatan";
  } else if (yVal > 0.7) {
    // replaces the text in the result tag by the model prediction for healthy
    document.getElementById('result1').innerHTML = "Tanaman Anda sehat";
    document.getElementById('result2').innerHTML = "Pertahankan kondisinya ya!";
  } else {
    document.getElementById('result1').innerHTML = "Tanaman Anda tidak terdeteksi" + y + yVal;
    document.getElementById('result2').innerHTML = "Coba lagi";
  }
}